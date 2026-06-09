import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Activity, ARRIVAL_TIMING_TYPES, DEPARTURE_TIMING_TYPES } from '../../models/api.models';
import { parseDurationToHoursAndMinutes } from '../../utils/date.utils';
import { PartnerBadge } from '../partner-badge/partner-badge';

export type CapabilityType = 'rollingStock' | 'staff' | 'path';

@Component({
    selector: 'app-journey-activity-item',
    templateUrl: './journey-activity-item.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PartnerBadge],
})
export class JourneyActivityItem {
    readonly activity = input.required<Activity>();
    readonly capabilityType = input.required<CapabilityType>();
    readonly readonly = input<boolean>(false);

    readonly editActivity = output<void>();
    readonly deleteActivity = output<void>();

    protected readonly arrival = computed(() => {
        const d = this.activity().timings?.find((t) => ARRIVAL_TIMING_TYPES.has(t.type))?.duration;
        return d ? parseDurationToHoursAndMinutes(d) : undefined;
    });

    protected readonly departure = computed(() => {
        const d = this.activity().timings?.find((t) => DEPARTURE_TIMING_TYPES.has(t.type))?.duration;
        return d ? parseDurationToHoursAndMinutes(d) : undefined;
    });

    protected readonly staffRole = computed(() => {
        return this.activity().capability?.staffs?.[0]?.type;
    });

    protected readonly isPassthrough = computed(() => {
        return (this.activity().capability as { passthrough?: boolean } | undefined)?.passthrough ??
            false;
    });
}
