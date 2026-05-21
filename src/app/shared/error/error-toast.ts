import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorNotificationService } from './error-notification.service';

@Component({
    selector: 'app-error-toast',
    standalone: true,
    template: `
        <div class="error-toast-container" aria-live="assertive" aria-atomic="false">
            @for (error of errorService.errors(); track error.id) {
                <div class="error-toast" role="alert">
                    <span class="error-toast-icon">⚠</span>
                    <span class="error-toast-message">{{ error.message }}</span>
                    <button
                        class="error-toast-close"
                        (click)="errorService.dismiss(error.id)"
                        aria-label="Dismiss"
                        i18n-aria-label="@@error.toast.dismissLabel"
                    >✕</button>
                </div>
            }
        </div>
    `,
    styles: `
        .error-toast-container {
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            max-width: 420px;
            width: calc(100vw - 3rem);
        }

        .error-toast {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 0.875rem 1rem;
            border-radius: 8px;
            background: #b91c1c;
            color: #fff;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
            animation: slideIn 0.2s ease-out;
        }

        @keyframes slideIn {
            from { transform: translateX(110%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
        }

        .error-toast-icon {
            flex-shrink: 0;
            font-size: 1.1rem;
            line-height: 1.4;
        }

        .error-toast-message {
            flex: 1;
            font-size: 0.9rem;
            line-height: 1.4;
        }

        .error-toast-close {
            flex-shrink: 0;
            background: transparent;
            border: none;
            color: #fff;
            cursor: pointer;
            font-size: 1rem;
            line-height: 1;
            opacity: 0.8;
            padding: 0;
        }

        .error-toast-close:hover {
            opacity: 1;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorToastComponent {
    protected errorService = inject(ErrorNotificationService);
}

