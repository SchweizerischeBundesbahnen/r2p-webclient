import { Injectable, signal } from '@angular/core';

export interface ErrorMessage {
    id: string;
    message: string;
    type: 'error' | 'success';
}

/**
 * Global error notification service – renders errors as dismissible toast messages.
 * The toast is intentionally global so every page gets error feedback without
 * wiring up its own error state whenever a HTTP error occurs.
 *
 * Pages can additionally display errors inline (e.g. when unable to load trains)
 * if appropriate (e.g. instead of displaying an empty table). Things like
 * input validation or other business-logic checks should also be handled inline
 * on the respective page.
 */
@Injectable({ providedIn: 'root' })
export class ErrorNotificationService {
    readonly errors = signal<ErrorMessage[]>([]);

    showError(message: string): void {
        this.addToast(message, 'error', 8000);
    }

    showSuccess(message: string): void {
        this.addToast(message, 'success', 4000);
    }

    dismiss(id: string): void {
        this.errors.update((list) => list.filter((e) => e.id !== id));
    }

    private addToast(message: string, type: 'error' | 'success', duration: number): void {
        const id = crypto.randomUUID();
        this.errors.update((list) => [...list, { id, message, type }]);
        setTimeout(() => this.dismiss(id), duration);
    }
}

