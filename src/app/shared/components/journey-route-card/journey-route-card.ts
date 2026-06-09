import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    linkedSignal,
    output,
    signal
} from '@angular/core';
import {
    Activity,
    ARRIVAL_TIMING_TYPES,
    DEPARTURE_TIMING_TYPES,
    Journey,
    JourneyLocation,
    Location
} from '../../models/api.models';
import { parseDurationToHoursAndMinutes } from '../../utils/date.utils';
import { EditLocationModal } from './edit-location-modal';

/** Capability Types for grouping Columns */
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

@Component({
    selector: 'app-journey-route-card',
    templateUrl: './journey-route-card.html',
    styleUrl: './journey-route-card.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditLocationModal],
})
export class JourneyRouteCard {
    readonly readonly = input<boolean>(false);
    readonly journey = input<Journey | undefined>(undefined);
    readonly journeyChange = output<Journey>();

    /** Local mutable copy of the journey – resets when the input changes. */
    protected readonly localJourney = linkedSignal(() => this.journey());

    protected readonly editingStopIndex = signal<number | null>(null);

    protected readonly currentEditLocation = computed<Location | null>(() => {
        const idx = this.editingStopIndex();
        if (idx === null) return null;
        return this.localJourney()?.journeylocations?.[idx]?.locations?.[0] ?? null;
    });

    protected openEditLocation(stopIndex: number): void {
        this.editingStopIndex.set(stopIndex);
    }

    protected closeEditLocation(): void {
        this.editingStopIndex.set(null);
    }

    protected onLocationSaved(location: Location): void {
        const idx = this.editingStopIndex();
        const j = this.localJourney();
        if (idx === null || !j?.journeylocations) return;

        const updatedJourneyLocations: JourneyLocation[] = j.journeylocations.map((jl, i) => {
            if (i !== idx) return jl;
            const locs = jl.locations ? [...jl.locations] : [];
            locs[0] = location;
            return { ...jl, locations: locs };
        });

        const updatedJourney: Journey = { ...j, journeylocations: updatedJourneyLocations };
        this.localJourney.set(updatedJourney);
        this.journeyChange.emit(updatedJourney);
        this.editingStopIndex.set(null);
    }

    readonly stops = computed<JourneyStop[]>(() => {
        const j = this.localJourney();
        const locations = j?.journeylocations;
        if (!locations?.length) return [];

        // Pre-compute spanning rolling stock state
        const spanningRollingStock: (Activity | null)[] = new Array(locations.length).fill(null);
        const spanningRollingStockOrigin: (number | null)[] = new Array(locations.length).fill(
            null,
        );
        let activeRollingStockActivity: Activity | null = null;
        let activeRollingStockOrigin: number | null = null;

        for (let i = 0; i < locations.length; i++) {
            const ownRollingStockActivities = (locations[i].activities ?? []).filter(
                (a) => a.capability?.type === CAPABILITY_TYPE_ROLLING_STOCK,
            );
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
            const ownRollingStockActivities = (locations[i].activities ?? []).filter(
                (a) => a.capability?.type === CAPABILITY_TYPE_ROLLING_STOCK,
            );
            if (ownRollingStockActivities.length > 0) {
                const spansOnward =
                    i + 1 < locations.length && spanningRollingStock[i + 1] !== null;
                spanRole[i] = spansOnward ? 'start' : 'solo';
            } else if (spanningRollingStock[i]) {
                const continuesNext =
                    i + 1 < locations.length && spanningRollingStock[i + 1] !== null;
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
    });

    getArrival(activity: Activity): string | undefined {
        const duration = activity.timings?.find((t) => ARRIVAL_TIMING_TYPES.has(t.type))?.duration;
        return duration ? parseDurationToHoursAndMinutes(duration) : undefined;
    }

    getDeparture(activity: Activity): string | undefined {
        const duration = activity.timings?.find((t) => DEPARTURE_TIMING_TYPES.has(t.type))?.duration;
        return duration ? parseDurationToHoursAndMinutes(duration) : undefined;
    }
}
