import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Activity, Journey } from '../../models/api.models';

type ColumnType = 'rs' | 'staff' | 'plan';

function activityColumnType(actType: string | undefined): ColumnType {
    if (actType === 'rollingStock' || actType === 'wagons' || actType === 'formation' || actType === 'traction') return 'rs';
    if (actType === 'journey' || actType === 'train.runthrough' || actType === 'commercial' || actType?.startsWith('train.halt')) return 'staff';
    return 'plan';
}

export interface JourneyStop {
    stopName: string;
    isFirst: boolean;
    isLast: boolean;
    rsActs: Activity[];
    staffActs: Activity[];
    planActs: Activity[];
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

        // Pre-compute spanning RS state
        const spanningRs: (Activity | null)[] = new Array(locs.length).fill(null);
        const spanningRsOrigin: (number | null)[] = new Array(locs.length).fill(null);
        let activeRsAct: Activity | null = null;
        let activeRsOrigin: number | null = null;

        for (let i = 0; i < locs.length; i++) {
            const ownRsActs = (locs[i].activities ?? []).filter(a => activityColumnType(a.type) === 'rs');
            if (ownRsActs.length > 0) {
                activeRsAct = ownRsActs.at(-1)!;
                activeRsOrigin = i;
                spanningRs[i] = null;
            } else {
                spanningRs[i] = activeRsAct;
                spanningRsOrigin[i] = activeRsOrigin;
            }
        }

        // Compute span roles
        const spanRole: JourneyStop['spanRole'][] = new Array(locs.length).fill('none');
        for (let i = 0; i < locs.length; i++) {
            const ownRsActs = (locs[i].activities ?? []).filter(a => activityColumnType(a.type) === 'rs');
            if (ownRsActs.length > 0) {
                const spansOnward = i + 1 < locs.length && spanningRs[i + 1] !== null;
                spanRole[i] = spansOnward ? 'start' : 'solo';
            } else if (spanningRs[i]) {
                const continuesNext = i + 1 < locs.length && spanningRs[i + 1] !== null;
                spanRole[i] = continuesNext ? 'mid' : 'end';
            }
        }

        return locs.map((jl, idx) => {
            const acts = jl.activities ?? [];
            const inheritedOriginName = spanRole[idx] === 'end' && spanningRsOrigin[idx] != null
                ? locs[spanningRsOrigin[idx]!]?.locations?.[0]?.name ?? `Stop ${spanningRsOrigin[idx]! + 1}`
                : undefined;

            return {
                stopName: jl.locations?.[0]?.name ?? '?',
                isFirst: idx === 0,
                isLast: idx === locs.length - 1,
                rsActs: acts.filter(a => activityColumnType(a.type) === 'rs'),
                staffActs: acts.filter(a => activityColumnType(a.type) === 'staff'),
                planActs: acts.filter(a => activityColumnType(a.type) === 'plan'),
                spanRole: spanRole[idx],
                inheritedOriginName,
            };
        });
    });

    getArrival(act: Activity): string | undefined {
        return act.timings?.find(t => t.type === 'arrival')?.duration?.slice(0, 5);
    }

    getDeparture(act: Activity): string | undefined {
        return act.timings?.find(t => t.type === 'departure')?.duration?.slice(0, 5);
    }
}
