import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-alert-banner',
    template: `<div [class]="'alert alert-' + type()"><ng-content /></div>`,
    styles: `
        .alert {
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: 8px;
            margin-bottom: var(--spacing-md);
            font-size: 0.875rem;
            display: flex;
            align-items: flex-start;
            gap: var(--spacing-sm);
        }
        .alert-info    { background-color: #ebf8ff; border: 1px solid #bee3f8; color: #2c5282; }
        .alert-success { background-color: #f0fff4; border: 1px solid #c6f6d5; color: #22543d; }
        .alert-warning { background-color: #fffaf0; border: 1px solid #fbd38d; color: #7b341e; }
        .alert-error   { background-color: #fff5f5; border: 1px solid #fed7d7; color: #742a2a; }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertBanner {
    readonly type = input.required<'info' | 'error' | 'warning' | 'success'>();
}
