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
import { MatTooltip } from '@angular/material/tooltip';
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
import { computeJourneyStops, JourneyStop } from './journey-route-card.utils';

export type { JourneyStop };

interface ActivityRef {
    activity: Activity;
    colType: CapabilityType;
}

@Component({
    selector: 'app-journey-route-card',
    templateUrl: './journey-route-card.html',
    styleUrl: './journey-route-card.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [JourneyActivityItem, MatTooltip],
})
export class JourneyRouteCard {
    readonly readonly = input<boolean>(false);
    readonly required = input<boolean>(false);
    readonly journey = input<Journey | undefined>(undefined);
    readonly journeyChange = output<Journey>();

    private readonly dialog = inject(MatDialog);

    protected readonly localJourney = linkedSignal(() => this.journey());

    readonly stops = computed<JourneyStop[]>(() =>
        computeJourneyStops(this.localJourney()?.journeylocations ?? []),
    );

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
