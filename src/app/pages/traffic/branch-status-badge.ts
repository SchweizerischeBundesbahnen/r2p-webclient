import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BranchState } from '../../shared/models/api.models';

@Component({
    selector: 'app-branch-status-badge',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <span class="branch-status-wrap">
            <span class="branch-status-label" i18n="@@traffic.statusLabel">Status</span>
            <span class="badge" [class]="badgeClass()">{{ label() }}</span>
        </span>
    `,
    styles: `
        .branch-status-wrap {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 2px;
        }

        .branch-status-label {
            font-size: 0.65rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--text-secondary);
        }
    `,
})
export class BranchStatusBadgeComponent {
    readonly state = input.required<BranchState>();

    protected readonly label = computed(() => {
        switch (this.state()) {
            case 'open':            return $localize`:@@traffic.statusLabel.open:Open`;
            case 'merge_requested': return $localize`:@@traffic.statusLabel.mergeRequested:Variant Proposed`;
            case 'merged':          return $localize`:@@traffic.statusLabel.merged:Accepted`;
            case 'deleted':         return $localize`:@@traffic.statusLabel.deleted:Deleted`;
        }
    });

    protected readonly badgeClass = computed(() => {
        const classMap: Record<BranchState, string> = {
            open:            'badge badge-open',
            merge_requested: 'badge badge-merge-requested',
            merged:          'badge badge-merged',
            deleted:         'badge badge-deleted',
        };
        return classMap[this.state()];
    });
}

