import { Injectable, signal } from '@angular/core';

export interface ErrorMessage {
    id: string;
    message: string;
}

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

