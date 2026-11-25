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
            color: var(--text-on-dark);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-right: 2px;
            background-color: var(--partner-default);
        }
        .partner-badge-SBB { background-color: var(--partner-sbb); }
        .partner-badge-BLS { background-color: var(--partner-bls); }
        .partner-badge-SOB { background-color: var(--partner-sob); }
        .partner-badge-TI { background-color: var(--partner-ti); }
        .partner-badge-DBF { background-color: var(--partner-dbf); }
        .partner-badge-DBC { background-color: var(--partner-dbc); }
        .partner-badge-DBCNL { background-color: var(--partner-dbcnl); }
        .partner-badge-SBBC { background-color: var(--partner-sbbc); }
        .partner-badge-SBBCI { background-color: var(--partner-sbbci); }
        .partner-badge-RCA { background-color: var(--partner-rca); }
        .partner-badge-MEV { background-color: var(--partner-mev); }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerBadge {
    readonly partner = input('');
}
