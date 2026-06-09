import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-detail-item',
    host: { class: 'detail-item' },
    template: `
        <div class="detail-label">{{ label() }}</div>
        <div class="detail-value" [attr.id]="valueId() || null"><ng-content /></div>
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailGrid {}
