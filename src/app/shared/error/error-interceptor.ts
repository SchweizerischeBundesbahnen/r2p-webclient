import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorNotificationService } from './error-notification.service';

/**
 * Catches all HTTP errors and forwards them to {@link ErrorNotificationService} as toasts.
 * Business-logic / validation errors that belong inline on a page must be handled
 * separately at the call-site and should NOT go through this interceptor.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const errorService = inject(ErrorNotificationService);
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let message: string;
            if (error.status === 0) {
                message = $localize`:@@error.network:Network error – please check your connection.`;
            } else if (error.status === 401) {
                message = $localize`:@@error.unauthorized:Unauthorised – please log in again.`;
            } else if (error.status === 403) {
                message = $localize`:@@error.forbidden:Access denied.`;
            } else if (error.status === 404) {
                message = $localize`:@@error.notFound:Resource not found (404).`;
            } else if (error.status >= 500) {
                message = $localize`:@@error.server:Server error (${error.status}) – please try again later.`;
            } else {
                message = $localize`:@@error.unexpected:Unexpected error (${error.status}).`;
            }
            errorService.show(message);
            return throwError(() => error);
        }),
    );
};

