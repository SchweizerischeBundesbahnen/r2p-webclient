import { Activity, JourneyLocation, Location } from '../../models/api.models';

const CAPABILITY_TYPE_ROLLING_STOCK = 'rollingStock' as const;
const CAPABILITY_TYPE_STAFF = 'staff' as const;
const CAPABILITY_TYPE_PATH = 'path' as const;

export interface JourneyStop {
    stopName: string;
    location: Location | undefined;
    isFirst: boolean;
    isLast: boolean;
    rollingStockActivities: Activity[];
    staffActivities: Activity[];
    pathActivities: Activity[];
    spanRole: 'none' | 'start' | 'mid' | 'end' | 'solo';
    inheritedOriginName?: string;
}

export function computeJourneyStops(locations: JourneyLocation[]): JourneyStop[] {
    if (!locations.length) return [];

    const spanningRs: (Activity | null)[] = new Array(locations.length).fill(null);
    const spanningRsOrigin: (number | null)[] = new Array(locations.length).fill(null);
    let activeRsActivity: Activity | null = null;
    let activeRsOrigin: number | null = null;

    for (let i = 0; i < locations.length; i++) {
        const ownRs = (locations[i].activities ?? []).filter(
            (a) => a.capability?.type === CAPABILITY_TYPE_ROLLING_STOCK,
        );
        if (ownRs.length > 0) {
            const nonLocal = ownRs.filter(
                (a) =>
                    !((a.capability as { localOnly?: boolean } | undefined)?.localOnly ?? false),
            );
            if (nonLocal.length > 0) {
                activeRsActivity = nonLocal.at(-1)!;
                activeRsOrigin = i;
            } else {
                activeRsActivity = null;
                activeRsOrigin = null;
            }
            spanningRs[i] = null;
        } else {
            spanningRs[i] = activeRsActivity;
            spanningRsOrigin[i] = activeRsOrigin;
        }
    }

    const spanRole: JourneyStop['spanRole'][] = new Array(locations.length).fill('none');
    for (let i = 0; i < locations.length; i++) {
        const ownRs = (locations[i].activities ?? []).filter(
            (a) => a.capability?.type === CAPABILITY_TYPE_ROLLING_STOCK,
        );
        if (ownRs.length > 0) {
            const spansOnward = i + 1 < locations.length && spanningRs[i + 1] !== null;
            spanRole[i] = spansOnward ? 'start' : 'solo';
        } else if (spanningRs[i]) {
            const continuesNext = i + 1 < locations.length && spanningRs[i + 1] !== null;
            spanRole[i] = continuesNext ? 'mid' : 'end';
        }
    }

    return locations.map((jl, idx) => {
        const activities = jl.activities ?? [];
        const inheritedOriginName =
            spanRole[idx] === 'end' && spanningRsOrigin[idx] != null
                ? (locations[spanningRsOrigin[idx]]?.locations?.[0]?.name ??
                  `Stop ${(spanningRsOrigin[idx] ?? 0) + 1}`)
                : undefined;

        return {
            stopName: jl.locations?.[0]?.name ?? '?',
            location: jl.locations?.[0],
            isFirst: idx === 0,
            isLast: idx === locations.length - 1,
            rollingStockActivities: activities.filter(
                (a) => a.capability?.type === CAPABILITY_TYPE_ROLLING_STOCK,
            ),
            staffActivities: activities.filter(
                (a) => a.capability?.type === CAPABILITY_TYPE_STAFF,
            ),
            pathActivities: activities.filter(
                (a) => a.capability?.type === CAPABILITY_TYPE_PATH,
            ),
            spanRole: spanRole[idx],
            inheritedOriginName,
        };
    });
}
