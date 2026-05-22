import { Injectable, signal } from '@angular/core';

export interface ErrorMessage {
    id: string;
    message: string;
}

/**
 * Global error notification service – renders errors as dismissible toast messages.
 * The toast is intentionally global so every page gets error feedback without
 * wiring up its own error state whenever a HTTP error occurs.
 *
 * Pages can do additionally display errors inline (e.g. unable to load trains)
 * if appropriate (e.g instead of displaying an empty table. Also things like
 * input validation or other business-logic checks should be done inline directly
 * on the respective page
 */
@Injectable({ providedIn: 'root' })
export class ErrorNotificationService {
    readonly errors = signal<ErrorMessage[]>([]);

    show(message: string): void {
        const id = crypto.randomUUID();
        this.errors.update((list) => [...list, { id, message }]);
        setTimeout(() => this.dismiss(id), 8000);
    }

    dismiss(id: string): void {
        this.errors.update((list) => list.filter((e) => e.id !== id));
    }
}

