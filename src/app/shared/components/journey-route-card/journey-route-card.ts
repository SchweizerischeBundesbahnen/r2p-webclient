import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    linkedSignal,
    output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    Activity,
    ARRIVAL_TIMING_TYPES,
    DEPARTURE_TIMING_TYPES,
    Journey,
    JourneyLocation,
    Location,
} from '../../models/api.models';
import { parseDurationToHoursAndMinutes } from '../../utils/date.utils';
import { CapabilityType, JourneyActivityItem } from './journey-activity-item';
import { EditStopModal, EditStopDialogData } from './edit-stop-modal';
import { EditActivityModal, EditActivityDialogData } from './edit-activity-modal';

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

interface ActivityRef {
    activity: Activity;
    colType: CapabilityType;
}

@Component({
    selector: 'app-journey-route-card',
    templateUrl: './journey-route-card.html',
    styleUrl: './journey-route-card.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [JourneyActivityItem],
})
export class JourneyRouteCard {
    readonly readonly = input<boolean>(false);
    readonly required = input<boolean>(false);
    readonly journey = input<Journey | undefined>(undefined);
    readonly journeyChange = output<Journey>();

    private readonly dialog = inject(MatDialog);

    protected readonly localJourney = linkedSignal(() => this.journey());

    readonly stops = computed<JourneyStop[]>(() => {
        const j = this.localJourney();
        const locations = j?.journeylocations;
        if (!locations?.length) return [];

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
    });

    // ── Stop mutations ────────────────────────────────────────────────────────

    protected addStop(insertAt: number): void {
        const ref = this.dialog.open<EditStopModal, EditStopDialogData, Location>(EditStopModal, {
            data: { location: {}, isNew: true },
            width: '480px',
        });
        ref.afterClosed().subscribe((result) => {
            if (!result) return;
            const j = this.localJourney();
            const locs = [...(j?.journeylocations ?? [])];
            const newLoc: JourneyLocation = { locations: [result], activities: [] };
            locs.splice(insertAt, 0, newLoc);
            this.emit(this.withLocations(j, locs));
        });
    }

    protected openEditStop(stopIndex: number): void {
        const location = this.localJourney()?.journeylocations?.[stopIndex]?.locations?.[0] ?? {};
        const ref = this.dialog.open<EditStopModal, EditStopDialogData, Location>(EditStopModal, {
            data: { location },
            width: '480px',
        });
        ref.afterClosed().subscribe((result) => {
            if (!result) return;
            const j = this.localJourney();
            const locs = (j?.journeylocations ?? []).map((jl, i) => {
                if (i !== stopIndex) return jl;
                const existing = jl.locations ? [...jl.locations] : [];
                existing[0] = result;
                return { ...jl, locations: existing };
            });
            this.emit(this.withLocations(j, locs));
        });
    }

    protected deleteStop(stopIndex: number): void {
        const j = this.localJourney();
        const locs = [...(j?.journeylocations ?? [])];
        locs.splice(stopIndex, 1);
        this.emit(this.withLocations(j, locs));
    }

    // ── Activity mutations ────────────────────────────────────────────────────

    protected openAddActivity(stopIndex: number, colType: CapabilityType): void {
        const ref = this.dialog.open<EditActivityModal, EditActivityDialogData, Activity>(
            EditActivityModal,
            { data: { activity: null, capabilityType: colType }, width: '640px' },
        );
        ref.afterClosed().subscribe((result) => {
            if (!result) return;
            this.applyActivitySaved(stopIndex, null, result);
        });
    }

    protected openEditActivity(stopIndex: number, ref: ActivityRef): void {
        const dialogRef = this.dialog.open<EditActivityModal, EditActivityDialogData, Activity>(
            EditActivityModal,
            {
                data: { activity: ref.activity, capabilityType: ref.colType },
                width: '640px',
            },
        );
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;
            this.applyActivitySaved(stopIndex, ref.activity, result);
        });
    }

    protected deleteActivity(stopIndex: number, ref: ActivityRef): void {
        const j = this.localJourney();
        const locs = (j?.journeylocations ?? []).map((jl, i) => {
            if (i !== stopIndex) return jl;
            return { ...jl, activities: (jl.activities ?? []).filter((a) => a !== ref.activity) };
        });
        this.emit(this.withLocations(j, locs));
    }

    private applyActivitySaved(
        stopIndex: number,
        existing: Activity | null,
        activity: Activity,
    ): void {
        const j = this.localJourney();
        const locs = (j?.journeylocations ?? []).map((jl, i) => {
            if (i !== stopIndex) return jl;
            const acts = jl.activities ?? [];
            const updated =
                existing === null
                    ? [...acts, activity]
                    : acts.map((a) => (a === existing ? activity : a));
            return { ...jl, activities: updated };
        });
        this.emit(this.withLocations(j, locs));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private withLocations(base: Journey | undefined, locs: JourneyLocation[]): Journey {
        return { ...(base ?? {}), journeylocations: locs };
    }

    private emit(updated: Journey): void {
        this.localJourney.set(updated);
        this.journeyChange.emit(updated);
    }

    // Legacy public helpers
    getArrival(activity: Activity): string | undefined {
        const d = activity.timings?.find((t) => ARRIVAL_TIMING_TYPES.has(t.type))?.duration;
        return d ? parseDurationToHoursAndMinutes(d) : undefined;
    }

    getDeparture(activity: Activity): string | undefined {
        const d = activity.timings?.find((t) => DEPARTURE_TIMING_TYPES.has(t.type))?.duration;
        return d ? parseDurationToHoursAndMinutes(d) : undefined;
    }
}
