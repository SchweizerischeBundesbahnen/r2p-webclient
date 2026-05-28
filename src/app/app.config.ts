import { ApplicationConfig, ErrorHandler, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor, provideAuth } from 'angular-auth-oidc-client';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { resolveInitialLocale } from './locale/locale.service';
import { errorInterceptor } from './shared/error/error-interceptor';
import { loadSettingsRaw, isSettingsComplete } from './settings/settings.service';
import { AppErrorHandler } from './shared/error/app-error-handler';

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
            scope: s.scope,
            responseType: 'code',
            customParamsAuthRequest: { response_mode: s.responseMode },
            silentRenew: true,
            useRefreshToken: true,
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
        { provide: LOCALE_ID, useValue: resolveInitialLocale() },
    ],
};
