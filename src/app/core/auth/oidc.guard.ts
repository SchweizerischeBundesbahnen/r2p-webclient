import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { SettingsModal } from '../settings/settings-modal';
import { SettingsService } from '../settings/settings.service';
import { from, of, switchMap, take, catchError } from 'rxjs';

/**
 * Replacement for `autoLoginPartialRoutesGuard` that additionally catches
 * OIDC errors (e.g. wrong authority / unreachable discovery endpoint, wrong
 * client ID) and opens the settings modal instead of leaving the page blank.
 *
 * Flow:
 * 1. If settings are incomplete → open settings modal immediately.
 * 2. If the URL contains an OIDC error param (e.g. unauthorized_client returned
 *    by the IdP after a failed redirect) → open settings modal with the error.
 * 3. Probe the OIDC discovery endpoint via fetch. If unreachable → open settings modal.
 * 4. Only if the discovery endpoint responds, delegate to checkAuth / authorize.
 */
export const oidcGuard: CanActivateFn = () => {
    const oidc = inject(OidcSecurityService);
    const dialog = inject(MatDialog);
    const settings = inject(SettingsService);

    if (!settings.hasConfiguredSettings()) {
        openSettingsOnOidcError(dialog);
        return of(false);
    }

    // Detect errors returned by the IdP in the redirect callback
    // (e.g. error=unauthorized_client when the client_id is wrong).
    const urlParams = new URLSearchParams(window.location.search || window.location.hash.replace(/^#/, ''));
    const oidcError = urlParams.get('error');
    if (oidcError) {
        const description = urlParams.get('error_description') ?? oidcError;
        // Clean up the URL so the error params don't persist on reload.
        window.history.replaceState({}, '', window.location.pathname);
        openSettingsOnOidcError(dialog, undefined, `${oidcError}: ${description}`);
        return of(false);
    }

    // Detect a broken redirect: if an auth flow was started (state stored by the
    // OIDC library) but neither a code nor an error came back, the IdP likely
    // rejected the redirect_uri or the client does not exist.
    // The library stores auth state as JSON under the configId key ("r2p-webclient") in sessionStorage.
    const hasCodeInUrl = urlParams.has('code') || window.location.hash.includes('code=');
    const pendingState = getOidcStoredState('r2p-webclient');
    if (pendingState && !hasCodeInUrl) {
        clearOidcStoredState('r2p-webclient');
        openSettingsOnOidcError(dialog, undefined, undefined, window.location.origin);
        return of(false);
    }

    const authority = settings.settings().authority.replace(/\/$/, '');
    const discoveryUrl = `${authority}/.well-known/openid-configuration`;

    return from(
        fetch(discoveryUrl, { method: 'GET', signal: AbortSignal.timeout(5000) })
            .then(async (res) => {
                if (!res.ok) return false;
                // Validate that the response is an actual OIDC discovery document.
                const contentType = res.headers.get('content-type') ?? '';
                if (!contentType.includes('application/json')) return false;
                try {
                    const json = await res.json() as Record<string, unknown>;
                    return typeof json['issuer'] === 'string';
                } catch {
                    return false;
                }
            })
            .catch(() => false),
    ).pipe(
        take(1),
        switchMap((reachable) => {
            if (!reachable) {
                openSettingsOnOidcError(dialog, discoveryUrl);
                return of(false);
            }
            return oidc.checkAuth().pipe(
                take(1),
                switchMap(({ isAuthenticated }) => {
                    if (isAuthenticated) {
                        return of(true);
                    }
                    try {
                        oidc.authorize();
                    } catch {
                        openSettingsOnOidcError(dialog);
                    }
                    return of(false);
                }),
                catchError(() => {
                    openSettingsOnOidcError(dialog);
                    return of(false);
                }),
            );
        }),
    );
};

function openSettingsOnOidcError(dialog: MatDialog, unreachableUrl?: string, oidcError?: string, failedRedirectUri?: string): void {
    if (dialog.openDialogs.length === 0) {
        dialog.open(SettingsModal, { disableClose: true, data: { unreachableUrl, oidcError, failedRedirectUri } });
    }
}

/** Returns true when the OIDC library has an in-progress auth flow stored (authStateControl set). */
function getOidcStoredState(configId: string): boolean {
    try {
        const raw = sessionStorage.getItem(configId);
        if (!raw) return false;
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        return !!parsed['authStateControl'];
    } catch {
        return false;
    }
}

/** Clears the OIDC library's stored state so a fresh auth attempt can be made. */
function clearOidcStoredState(configId: string): void {
    try {
        const raw = sessionStorage.getItem(configId);
        if (!raw) return;
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        delete parsed['authStateControl'];
        delete parsed['authnResult'];
        sessionStorage.setItem(configId, JSON.stringify(parsed));
    } catch {
        sessionStorage.removeItem(configId);
    }
}













