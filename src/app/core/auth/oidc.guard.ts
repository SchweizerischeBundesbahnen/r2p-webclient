import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { SettingsService } from '../settings/settings.service';
import { openSettingsOnOidcError } from '../settings/open-settings-on-oidc-error';
import { AuthSessionService } from './auth-session.service';
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
 * 3. Clear any stale auth state left behind by a failed silent renew so a fresh
 *    flow can start — but do NOT treat that on its own as a broken redirect.
 * 4. Probe the OIDC discovery endpoint via fetch. If unreachable → open settings modal.
 * 5. If not authenticated, re-authenticate silently via {@link AuthSessionService}.
 *    The settings modal is only shown after repeated failed redirects (real misconfig).
 */
export const oidcGuard: CanActivateFn = () => {
    const oidc = inject(OidcSecurityService);
    const dialog = inject(MatDialog);
    const settings = inject(SettingsService);
    const authSession = inject(AuthSessionService);

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

    // A failed silent renew can leave a stale auth state (authStateControl) in
    // sessionStorage. Clear it so a fresh auth flow can start cleanly — but do
    // NOT surface a dialog for it: an expired session must re-authenticate
    // silently. The library stores the state as JSON under the configId key.
    const hasCodeInUrl = urlParams.has('code') || window.location.hash.includes('code=');
    if (!hasCodeInUrl && getOidcStoredState('r2p-webclient')) {
        clearOidcStoredState('r2p-webclient');
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
                        authSession.markAuthenticated();
                        return of(true);
                    }
                    // Session expired / not authenticated. Re-authenticate
                    // silently via a full redirect. Only after repeated failed
                    // redirects do we surface the settings dialog (real misconfig:
                    // wrong client id or unregistered redirect uri).
                    if (authSession.hasExceededRedirectBudget()) {
                        authSession.resetRedirectBudget();
                        openSettingsOnOidcError(dialog, undefined, undefined, window.location.origin);
                        return of(false);
                    }
                    try {
                        authSession.beginReauth();
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













