import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Activity, Journey } from '../../models/api.models';

type ColumnType = 'rollingStock' | 'staff' | 'plan';

function activityColumnType(activityType: string | undefined): ColumnType {
    if (activityType === 'rollingStock' || activityType === 'wagons' || activityType === 'formation' || activityType === 'traction') return 'rollingStock';
    if (activityType === 'journey' || activityType === 'train.runthrough' || activityType === 'commercial' || activityType?.startsWith('train.halt')) return 'staff';
    return 'plan';
}

export interface JourneyStop {
    stopName: string;
    isFirst: boolean;
    isLast: boolean;
    rollingStockActivities: Activity[];
    staffActivities: Activity[];
    planActivities: Activity[];
    spanRole: 'none' | 'start' | 'mid' | 'end' | 'solo';
    inheritedOriginName?: string;
}

@Component({
    selector: 'app-journey-route-card',
    templateUrl: './journey-route-card.html',
    styleUrl: './journey-route-card.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyRouteCard {
    readonly readonly = input<boolean>(false);
    readonly journey = input<Journey | undefined>(undefined);

    readonly stops = computed<JourneyStop[]>(() => {
        const j = this.journey();
        const locs = j?.journeylocations;
        if (!locs?.length) return [];

        // Pre-compute spanning rolling stock state
        const spanningRollingStock: (Activity | null)[] = new Array(locs.length).fill(null);
        const spanningRollingStockOrigin: (number | null)[] = new Array(locs.length).fill(null);
        let activeRollingStockActivity: Activity | null = null;
        let activeRollingStockOrigin: number | null = null;

        for (let i = 0; i < locs.length; i++) {
            const ownRollingStockActivities = (locs[i].activities ?? []).filter(a => activityColumnType(a.type) === 'rollingStock');
            if (ownRollingStockActivities.length > 0) {
                activeRollingStockActivity = ownRollingStockActivities.at(-1)!;
                activeRollingStockOrigin = i;
                spanningRollingStock[i] = null;
            } else {
                spanningRollingStock[i] = activeRollingStockActivity;
                spanningRollingStockOrigin[i] = activeRollingStockOrigin;
            }
        }

        // Compute span roles
        const spanRole: JourneyStop['spanRole'][] = new Array(locs.length).fill('none');
        for (let i = 0; i < locs.length; i++) {
            const ownRollingStockActivities = (locs[i].activities ?? []).filter(a => activityColumnType(a.type) === 'rollingStock');
            if (ownRollingStockActivities.length > 0) {
                const spansOnward = i + 1 < locs.length && spanningRollingStock[i + 1] !== null;
                spanRole[i] = spansOnward ? 'start' : 'solo';
            } else if (spanningRollingStock[i]) {
                const continuesNext = i + 1 < locs.length && spanningRollingStock[i + 1] !== null;
                spanRole[i] = continuesNext ? 'mid' : 'end';
            }
        }

        return locs.map((jl, idx) => {
            const activities = jl.activities ?? [];
            const inheritedOriginName = spanRole[idx] === 'end' && spanningRollingStockOrigin[idx] != null
                ? locs[spanningRollingStockOrigin[idx]!]?.locations?.[0]?.name ?? `Stop ${spanningRollingStockOrigin[idx]! + 1}`
                : undefined;

            return {
                stopName: jl.locations?.[0]?.name ?? '?',
                isFirst: idx === 0,
                isLast: idx === locs.length - 1,
                rollingStockActivities: activities.filter(a => activityColumnType(a.type) === 'rollingStock'),
                staffActivities: activities.filter(a => activityColumnType(a.type) === 'staff'),
                planActivities: activities.filter(a => activityColumnType(a.type) === 'plan'),
                spanRole: spanRole[idx],
                inheritedOriginName,
            };
        });
    });

    getArrival(activity: Activity): string | undefined {
        return activity.timings?.find(t => t.type === 'arrival')?.duration?.slice(0, 5);
    }

    getDeparture(activity: Activity): string | undefined {
        return activity.timings?.find(t => t.type === 'departure')?.duration?.slice(0, 5);
    }
}
