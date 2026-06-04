import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Activity, Journey, TimingType } from '../../models/api.models';

/** Capability Types for grouping Columns */
const CAPABILITY_TYPE_ROLLING_STOCK = 'rollingStock' as const;
const CAPABILITY_TYPE_STAFF = 'staff' as const;
const CAPABILITY_TYPE_PATH = 'path' as const;

export interface JourneyStop {
    stopName: string;
    isFirst: boolean;
    isLast: boolean;
    rollingStockActivities: Activity[];
    staffActivities: Activity[];
    pathActivities: Activity[];
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
        const locations = j?.journeylocations;
        if (!locations?.length) return [];

        // Pre-compute spanning rolling stock state
        const spanningRollingStock: (Activity | null)[] = new Array(locations.length).fill(null);
        const spanningRollingStockOrigin: (number | null)[] = new Array(locations.length).fill(null);
        let activeRollingStockActivity: Activity | null = null;
        let activeRollingStockOrigin: number | null = null;

        for (let i = 0; i < locations.length; i++) {
            const ownRollingStockActivities = (locations[i].activities ?? []).filter(a => a.capability?.type === CAPABILITY_TYPE_ROLLING_STOCK);
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
        const spanRole: JourneyStop['spanRole'][] = new Array(locations.length).fill('none');
        for (let i = 0; i < locations.length; i++) {
            const ownRollingStockActivities = (locations[i].activities ?? []).filter(a => a.capability?.type === CAPABILITY_TYPE_ROLLING_STOCK);
            if (ownRollingStockActivities.length > 0) {
                const spansOnward = i + 1 < locations.length && spanningRollingStock[i + 1] !== null;
                spanRole[i] = spansOnward ? 'start' : 'solo';
            } else if (spanningRollingStock[i]) {
                const continuesNext = i + 1 < locations.length && spanningRollingStock[i + 1] !== null;
                spanRole[i] = continuesNext ? 'mid' : 'end';
            }
        }

        return locations.map((jl, idx) => {
            const activities = jl.activities ?? [];
            const inheritedOriginName =
                spanRole[idx] === 'end' && spanningRollingStockOrigin[idx] != null
                    ? (locations[spanningRollingStockOrigin[idx]]?.locations?.[0]?.name ??
                      `Stop ${spanningRollingStockOrigin[idx] + 1}`)
                    : undefined;

            return {
                stopName: jl.locations?.[0]?.name ?? '?',
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
    });

    private static readonly ARRIVAL_TYPES = [
        TimingType.Arrival,
        TimingType.EarliestArrival,
        TimingType.LatestArrival,
    ];

    private static readonly DEPARTURE_TYPES = [
        TimingType.Departure,
        TimingType.EarliestDeparture,
        TimingType.LatestDeparture,
    ];

    getArrival(activity: Activity): string | undefined {
        const duration = activity.timings?.find(
            t => JourneyRouteCard.ARRIVAL_TYPES.includes(t.type),
        )?.duration;
        return duration ? parseDurationToHHMM(duration) : undefined;
    }

    getDeparture(activity: Activity): string | undefined {
        const duration = activity.timings?.find(
            t => JourneyRouteCard.DEPARTURE_TYPES.includes(t.type),
        )?.duration;
        return duration ? parseDurationToHHMM(duration) : undefined;
    }
}

/**
 * Parses an ISO-8601 duration string (e.g. "PT8H12M", "P1DT14H35M") into a
 * zero-padded "HH:MM" clock string. Days are converted to hours so that
 * e.g. "P1DT14H35M" yields "38:35".
 */
export function parseDurationToHHMM(duration: string): string | undefined {
    const match = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/.exec(duration);
    if (!match) return undefined;
    const days = parseInt(match[1] ?? '0', 10);
    const hours = parseInt(match[2] ?? '0', 10);
    const minutes = parseInt(match[3] ?? '0', 10);
    const totalHours = days * 24 + hours;
    return `${String(totalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
