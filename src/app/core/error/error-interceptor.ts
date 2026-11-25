import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorNotificationService } from './error-notification.service';
import { AuthSessionService } from '../auth/auth-session.service';

/** Shape of the RFC 7807 / Problem Details response the backend returns. */
interface ApiErrorDetail {
    detail?: string;
    title?: string;
    status?: number;
    instance?: string;
}

/**
 * Extracts the `detail` field from the API error response body if present.
 * Handles both parsed objects and raw JSON strings (depends on Content-Type header).
 */
function extractApiDetail(error: HttpErrorResponse): string | undefined {
    try {
        let body: unknown = error.error;
        // Angular delivers the body as a string when Content-Type is not application/json
        if (typeof body === 'string' && body.trim().startsWith('{')) {
            body = JSON.parse(body);
        }
        if (body !== null && typeof body === 'object') {
            const b = body as ApiErrorDetail;
            return b.detail || b.title || undefined;
        }
    } catch {
        // ignore
    }
    return undefined;
}

/**
 * Catches all HTTP errors and forwards them to {@link ErrorNotificationService} as toasts.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const errorService = inject(ErrorNotificationService);
    const authSession = inject(AuthSessionService);
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // A silent re-authentication redirect is in progress; the page is
            // navigating away. Don't flash misleading error toasts (e.g. the
            // CORS/Status-0 noise from a dead-token request).
            if (authSession.redirectInProgress()) {
                return throwError(() => error);
            }
            const apiDetail = extractApiDetail(error);
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
            if (apiDetail) {
                message = `${message} — ${apiDetail}`;
            }
            errorService.showError(message);
            return throwError(() => error);
        }),
    );
};
