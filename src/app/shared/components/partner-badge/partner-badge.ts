import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-partner-badge',
    template: `<span [class]="'partner-badge' + (partner() ? ' partner-badge-' + partner() : '')">{{ partner() || '–' }}</span>`,
    styles: `
        .partner-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 700;
            color: white;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-right: 2px;
            background-color: var(--partner-default);
        }
        .partner-badge-SBB { background-color: var(--partner-sbb); }
        .partner-badge-BLS { background-color: var(--partner-bls); }
        .partner-badge-SOB { background-color: var(--partner-sob); }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerBadge {
    readonly partner = input('');
}
