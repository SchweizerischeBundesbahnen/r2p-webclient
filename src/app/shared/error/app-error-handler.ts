import { ErrorHandler, inject, Injectable } from '@angular/core';
import { ErrorNotificationService } from './error-notification.service';

/**
 * Custom ErrorHandler that:
 * - Suppresses Angular's `ResourceValueError` (HTTP errors already shown as toast via errorInterceptor).
 * - Shows a toast for OIDC configuration errors (e.g. unreachable authority).
 */
@Injectable()
export class AppErrorHandler extends ErrorHandler {
    private readonly notifications = inject(ErrorNotificationService);

    override handleError(error: unknown): void {
        if (isResourceValueError(error)) {
            return;
        }
        if (isOidcError(error)) {
            this.notifications.showError(
                $localize`:@@error.oidc:OIDC configuration error – please check your Authority URL in the settings.`,
            );
            return;
        }
        super.handleError(error);
    }
}

function isResourceValueError(error: unknown): boolean {
    return error instanceof Error && error.constructor.name === 'ResourceValueError';
}

function isOidcError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;
    const msg = error.message ?? '';
    // angular-auth-oidc-client throws errors with '[object Object]' when the
    // OIDC discovery endpoint is unreachable or returns an unexpected response.
    return (
        error.stack?.includes('angular-auth-oidc-client') === true ||
        msg.includes('[object Object]')
    );
}
