import { ApplicationConfig, ErrorHandler, inject, LOCALE_ID, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { routes } from './app.routes';
import { authInterceptor, provideAuth } from 'angular-auth-oidc-client';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { resolveInitialLocale } from './core/locale/locale.service';
import { errorInterceptor } from './core/error/error-interceptor';
import { loadSettingsRaw, isSettingsComplete } from './core/settings/settings.service';
import { openSettingsOnOidcError } from './core/settings/open-settings-on-oidc-error';
import { AppErrorHandler } from './core/error/app-error-handler';
import { AuthSessionService } from './core/auth/auth-session.service';

/**
 * Ensures `offline_access` is requested so the IdP issues a refresh token —
 * without it `useRefreshToken` silent renew cannot work. Idempotent and
 * case-insensitive; only appended for the auth request, never persisted.
 */
function withOfflineAccess(scope: string): string {
    const parts = scope.split(/\s+/).filter(Boolean);
    return parts.some((p) => p.toLowerCase() === 'offline_access') ? scope : [...parts, 'offline_access'].join(' ');
}

function provideAppAuth() {
    const s = loadSettingsRaw();

    if (!isSettingsComplete(s)) {
        // Minimal placeholder – auth will never be triggered because
        // the settings guard redirects to the settings modal first.
        return provideAuth({
            config: [{ configId: 'r2p-webclient', authority: 'https://placeholder.invalid', redirectUrl: window.location.origin, clientId: 'placeholder', scope: 'openid' }],
        });
    }

    return provideAuth({
        config: [{
            configId: 'r2p-webclient',
            authority: s.authority,
            redirectUrl: window.location.origin,
            clientId: s.clientId,
            scope: withOfflineAccess(s.scope),
            responseType: 'code',
            customParamsAuthRequest: { response_mode: 'query' },
            silentRenew: true,
            useRefreshToken: true,
            renewTimeBeforeTokenExpiresInSeconds: 30,
            autoUserInfo: false,
            maxIdTokenIatOffsetAllowedInSeconds: 600,
            secureRoutes: [s.serverUrl],
        }],
    });
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        { provide: ErrorHandler, useClass: AppErrorHandler },
        provideRouter(routes, withComponentInputBinding()),
        provideAppAuth(),
        provideHttpClient(withInterceptors([authInterceptor(), errorInterceptor])),
        provideAppInitializer(() => {
            const dialog = inject(MatDialog);
            inject(AuthSessionService).initialize(() => openSettingsOnOidcError(dialog));
        }),
        { provide: LOCALE_ID, useValue: resolveInitialLocale() },
    ],
};
