import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
    authInterceptor,
    provideAuth,
    withAppInitializerAuthCheck,
} from 'angular-auth-oidc-client';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideAuth(environment.authConfig, withAppInitializerAuthCheck()),
        provideHttpClient(withInterceptorsFromDi(), withInterceptors([authInterceptor()])),
    ],
};
