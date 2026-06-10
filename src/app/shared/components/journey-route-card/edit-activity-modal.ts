import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal,
} from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import {
    Activity,
    ARRIVAL_TIMING_TYPES,
    Capability,
    CapabilityFeature,
    DEPARTURE_TIMING_TYPES,
    Feature,
    Responsibility,
    Staff,
    TimingType,
} from '../../models/api.models';
import { hoursMinutesToDuration, parseDurationToHoursAndMinutes } from '../../utils/date.utils';
import { CapabilityType } from './journey-activity-item';

export interface EditActivityDialogData {
    activity: Activity | null;
    capabilityType: CapabilityType;
}

export const RESPONSIBILITY_TYPES = [
    { value: 'rru', label: 'rru – Responsible RU' },
    { value: 'rp', label: 'rp – Resource Provider' },
    { value: 'ra', label: 'ra – Responsible Applicant' },
    { value: 'rim', label: 'rim – Responsible Infrastructure Manager' },
    { value: 'pim', label: 'pim – Planning Infrastructure Manager' },
] as const;

export const PARTNERS = ['SBB', 'BLS', 'SOB'] as const;

export const PLAN_STATUSES = ['proposed', 'requested', 'confirmed', 'refused', 'dropped'] as const;

export const RS_FEATURE_TYPES = [
    { value: 'WLAN_HOTSPOT', label: 'WLAN Hotspot' },
    { value: 'RESTAURANT', label: 'Restaurant' },
    { value: 'QUIET_ZONE_1ST_CLASS', label: 'Quiet zone 1st class' },
    { value: 'LOW_FLOOR_ENTRY', label: 'Low-floor entry' },
] as const;

interface FeatureRow {
    type: string;
    offeredservice: string;
}

interface ExtendedCapability extends Capability {
    localOnly?: boolean;
    passthrough?: boolean;
}

function initialTiming(
    activity: Activity | null,
    types: Set<TimingType>,
): string {
    const d = activity?.timings?.find((t) => types.has(t.type))?.duration;
    return d ? (parseDurationToHoursAndMinutes(d) ?? '') : '';
}

@Component({
    selector: 'app-edit-activity-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle, MatDialogContent, MatDialogActions,
        MatFormField, MatLabel, MatError, MatInput, MatSelect, MatOption,
        MatButton, MatIconButton, MatIcon, MatCheckbox, MatDivider, FormField,
    ],
    templateUrl: './edit-activity-modal.html',
    styleUrl: './edit-activity-modal.scss',
})
export class EditActivityModal {
    readonly dialogRef = inject(MatDialogRef<EditActivityModal>);
    private readonly data = inject<EditActivityDialogData>(MAT_DIALOG_DATA);

    protected readonly responsibilityTypes = RESPONSIBILITY_TYPES;
    protected readonly partners = PARTNERS;
    protected readonly planStatuses = PLAN_STATUSES;
    protected readonly rsFeatureTypes = RS_FEATURE_TYPES;
    protected readonly capabilityType = this.data.capabilityType;

    protected readonly modalTitle = computed(() => {
        const isEdit = this.data.activity !== null;
        const typeLabel =
            this.capabilityType === 'rollingStock'
                ? 'Rolling Stock'
                : this.capabilityType === 'staff'
                  ? 'Staff'
                  : 'Path';
        return `${isEdit ? 'Edit' : 'Add'} ${typeLabel} Activity`;
    });

    // ── Responsibility ────────────────────────────────────────────────────────
    private readonly responsibilityModel = signal({
        type: this.data.activity?.responsibility?.type ?? 'rru',
        id: this.data.activity?.responsibility?.id ?? 'SBB',
        status: this.data.activity?.responsibility?.status ?? 'proposed',
    });

    protected readonly activityForm = form(this.responsibilityModel, (p) => {
        required(p.type, { message: $localize`:@@validation.required:Required` });
        required(p.id, { message: $localize`:@@validation.required:Required` });
        required(p.status, { message: $localize`:@@validation.required:Required` });
    });

    // ── Timing ────────────────────────────────────────────────────────────────
    protected readonly arrivalTime = signal(
        initialTiming(this.data.activity, ARRIVAL_TIMING_TYPES),
    );
    protected readonly departureTime = signal(
        initialTiming(this.data.activity, DEPARTURE_TIMING_TYPES),
    );

    // ── Rolling Stock ─────────────────────────────────────────────────────────
    protected readonly rsLength = signal(
        this.data.activity?.capability?.rollingStock?.length != null
            ? String(this.data.activity.capability!.rollingStock!.length)
            : '',
    );
    protected readonly rsWeight = signal(
        this.data.activity?.capability?.rollingStock?.weight != null
            ? String(this.data.activity.capability!.rollingStock!.weight)
            : '',
    );
    protected readonly rsComposition = signal(
        this.data.activity?.capability?.rollingStock?.units?.[0]?.name ?? '',
    );
    protected readonly rsLocalOnly = signal(
        (this.data.activity?.capability as ExtendedCapability | undefined)?.localOnly ?? false,
    );
    protected readonly rsFeatures = signal<FeatureRow[]>(
        (this.data.activity?.capability?.capabilityFeatures ?? []).map((cf) => ({
            type: cf.feature.type,
            offeredservice: cf.feature.offeredservice ?? '',
        })),
    );

    // ── Staff ─────────────────────────────────────────────────────────────────
    protected readonly staffRole = signal(
        this.data.activity?.capability?.staffs?.[0]?.type ?? '',
    );

    // ── Path ──────────────────────────────────────────────────────────────────
    protected readonly pathPassthrough = signal(
        (this.data.activity?.capability as ExtendedCapability | undefined)?.passthrough ?? false,
    );

    // ── Feature list mutations ────────────────────────────────────────────────
    protected addFeature(): void {
        this.rsFeatures.update((rows) => [
            ...rows,
            { type: RS_FEATURE_TYPES[0].value, offeredservice: '' },
        ]);
    }

    protected removeFeature(index: number): void {
        this.rsFeatures.update((rows) => rows.filter((_, i) => i !== index));
    }

    protected updateFeatureType(index: number, value: string): void {
        this.rsFeatures.update((rows) =>
            rows.map((r, i) => (i === index ? { ...r, type: value } : r)),
        );
    }

    protected updateFeatureService(index: number, event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.rsFeatures.update((rows) =>
            rows.map((r, i) => (i === index ? { ...r, offeredservice: value } : r)),
        );
    }

    // ── Save ──────────────────────────────────────────────────────────────────
    protected onSave(): void {
        void submit(this.activityForm, async (field) => {
            const { type, id, status } = field().value();
            this.doSave(type, id, status);
        });
    }

    private doSave(respType: string, respPartner: string, respStatus: string): void {
        const existing = this.data.activity;
        const colType = this.data.capabilityType;

        const responsibility: Responsibility = {
            type: respType,
            id: respPartner,
            status: respStatus,
        };

        const otherTimings = (existing?.timings ?? []).filter(
            (t) => !ARRIVAL_TIMING_TYPES.has(t.type) && !DEPARTURE_TIMING_TYPES.has(t.type),
        );
        const arrDur = hoursMinutesToDuration(this.arrivalTime());
        const depDur = hoursMinutesToDuration(this.departureTime());
        const timings = [
            ...otherTimings,
            ...(arrDur ? [{ type: TimingType.Arrival, duration: arrDur }] : []),
            ...(depDur ? [{ type: TimingType.Departure, duration: depDur }] : []),
        ];

        let capability: ExtendedCapability = { type: colType };

        if (colType === 'rollingStock') {
            const features: CapabilityFeature[] = this.rsFeatures()
                .filter((f) => f.type)
                .map((f) => ({
                    feature: {
                        type: f.type,
                        ...(f.offeredservice ? { offeredservice: f.offeredservice } : {}),
                    } satisfies Feature,
                }));
            const rsLength = this.rsLength() ? Number(this.rsLength()) : undefined;
            const rsWeight = this.rsWeight() ? Number(this.rsWeight()) : undefined;
            const rsUnits = this.rsComposition()
                ? [{ name: this.rsComposition() }]
                : (existing?.capability?.rollingStock?.units ?? []);

            capability = {
                type: colType,
                localOnly: this.rsLocalOnly(),
                capabilityFeatures: features.length ? features : undefined,
                rollingStock: {
                    ...(existing?.capability?.rollingStock ?? {}),
                    ...(rsLength != null ? { length: rsLength } : {}),
                    ...(rsWeight != null ? { weight: rsWeight } : {}),
                    ...(rsUnits.length ? { units: rsUnits } : {}),
                },
            };
        } else if (colType === 'staff') {
            const staffs: Staff[] = this.staffRole()
                ? [{ type: this.staffRole() }]
                : (existing?.capability?.staffs ?? []);
            capability = { type: colType, ...(staffs.length ? { staffs } : {}) };
        } else if (colType === 'path') {
            capability = {
                type: colType,
                passthrough: this.pathPassthrough(),
                path: existing?.capability?.path ?? {},
            };
        }

        this.dialogRef.close({
            ...(existing ?? {}),
            responsibility,
            timings: timings.length ? timings : undefined,
            capability,
        } satisfies Activity);
    }
}
