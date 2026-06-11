import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { Train } from '../../models/api.models';
import { computeOverallStatus } from './overall-status.utils';
export { computeOverallStatus } from './overall-status.utils';
export type { OverallStatus } from './overall-status.utils';

@Component({
    selector: 'app-overall-status',
    imports: [NgClass],
    template: `<span class="traffic-light" [ngClass]="'tl-' + status()"><span class="tl-dot"></span></span>`,
    styleUrl: './overall-status.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverallStatusComponent {
    readonly train = input<Train | null | undefined>();
    protected readonly status = computed(() => computeOverallStatus(this.train()));
}
