import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-partner-badge',
    template: `<span [class]="'partner-badge partner-badge-' + partner()">{{ partner() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerBadge {
    readonly partner = input.required<string>();
}
