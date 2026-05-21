import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import {
    authInterceptor,
    provideAuth,
    withAppInitializerAuthCheck,
} from 'angular-auth-oidc-client';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { environment } from '../environments/environment';
import { resolveInitialLocale } from './locale/locale.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes, withComponentInputBinding()),
        provideAuth(environment.authConfig, withAppInitializerAuthCheck()),
        provideHttpClient(withInterceptors([authInterceptor()])),
        { provide: LOCALE_ID, useValue: resolveInitialLocale() },
    ],
};
