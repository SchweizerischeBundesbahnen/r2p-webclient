import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-detail-item',
    host: { class: 'detail-item' },
    template: `
        <div class="detail-label">{{ label() }}</div>
        <div class="detail-value" [attr.id]="valueId() || null"><ng-content /></div>
    `,
    styles: `
        :host {
            padding: var(--spacing-sm) var(--spacing-md);
            background-color: var(--background-color);
            border-radius: 6px;
            min-width: 160px;
            display: block;
        }
        .detail-label {
            font-size: 0.7rem;
            color: var(--text-muted);
            font-weight: 600;
            margin-bottom: 2px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .detail-value {
            font-size: 0.9rem;
            color: var(--text-primary);
            font-weight: 500;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailItem {
    readonly label = input.required<string>();
    readonly valueId = input<string>();
}

@Component({
    selector: 'app-detail-grid',
    host: { class: 'detail-grid' },
    template: `<ng-content />`,
    styles: `
        :host {
            display: flex;
            flex-wrap: wrap;
            gap: var(--spacing-md);
            margin-bottom: var(--spacing-md);
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailGrid {}
