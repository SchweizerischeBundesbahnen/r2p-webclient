import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal,
} from '@angular/core';
import { disabled, form, FormField, required, submit } from '@angular/forms/signals';
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
    DEPARTURE_TIMING_TYPES,
    TimingType,
} from '../../models/api.models';
import { parseDurationToHoursAndMinutes } from '../../utils/date.utils';
import { CapabilityType } from './journey-activity-item';
import { buildActivity } from './activity-builder.utils';
import { planStatusLabel } from './activity-display.utils';

export interface EditActivityDialogData {
    activity: Activity | null;
    capabilityType: CapabilityType;
    partners?: string[];
    /** When false, the responsible partner cannot be changed (non-lead RU editing their own activity). Defaults to true. */
    canReassignPartner?: boolean;
}

export const RESPONSIBILITY_TYPES = [
    { value: 'rru', label: 'rru – Responsible RU' },
    { value: 'ra', label: 'ra – Responsible Applicant' },
    { value: 'rim', label: 'rim – Responsible Infrastructure Manager' },
    { value: 'pim', label: 'pim – Planning Infrastructure Manager' },
    { value: 'tru', label: 'tru – Traction RU' },
    { value: 'pru', label: 'pru – Personnel RU' },
] as const;

export const PARTNERS = ['SBB', 'BLS', 'SOB', 'TI', 'DBF', 'DBC', 'DBCNL', 'SBBC', 'SBBCI', 'RCA', 'MEV'] as const;

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
    protected readonly partners = this.data.partners ?? [];
    protected readonly canReassignPartner = this.data.canReassignPartner ?? true;
    protected readonly planStatuses = PLAN_STATUSES;
    protected readonly rsFeatureTypes = RS_FEATURE_TYPES;
    protected readonly capabilityType = this.data.capabilityType;
    protected readonly planStatusLabel = planStatusLabel;

    protected readonly modalTitle = computed(() => {
        const isEdit = this.data.activity !== null;
        if (this.capabilityType === 'rollingStock') {
            return isEdit
                ? $localize`:@@editActivityModal.title.editRollingStock:Edit Rolling Stock Activity`
                : $localize`:@@editActivityModal.title.addRollingStock:Add Rolling Stock Activity`;
        } else if (this.capabilityType === 'staff') {
            return isEdit
                ? $localize`:@@editActivityModal.title.editStaff:Edit Staff Activity`
                : $localize`:@@editActivityModal.title.addStaff:Add Staff Activity`;
        } else {
            return isEdit
                ? $localize`:@@editActivityModal.title.editPath:Edit Path Activity`
                : $localize`:@@editActivityModal.title.addPath:Add Path Activity`;
        }
    });

    // ── Responsibility + Path (required path fields are validated via this form) ──
    private readonly responsibilityModel = signal({
        type: this.data.activity?.responsibility?.type ?? 'rru',
        id: this.data.activity?.responsibility?.id ?? (this.partners[0] ?? ''),
        status: this.data.activity?.responsibility?.status ?? 'proposed',
        pathLength:
            this.data.activity?.capability?.path?.length != null
                ? String(this.data.activity.capability.path.length)
                : '',
        pathWeight:
            this.data.activity?.capability?.path?.weight != null
                ? String(this.data.activity.capability.path.weight)
                : '',
        pathMaxSpeed:
            this.data.activity?.capability?.path?.maxSpeed != null
                ? String(this.data.activity.capability.path.maxSpeed)
                : '',
    });

    protected readonly activityForm = form(this.responsibilityModel, (p) => {
        required(p.type, { message: $localize`:@@validation.required:Required` });
        required(p.id, { message: $localize`:@@validation.required:Required` });
        required(p.status, { message: $localize`:@@validation.required:Required` });
        if (!this.canReassignPartner) {
            disabled(p.id);
        }
        if (this.data.capabilityType === 'path') {
            required(p.pathLength, { message: $localize`:@@validation.required:Required` });
            required(p.pathWeight, { message: $localize`:@@validation.required:Required` });
            required(p.pathMaxSpeed, { message: $localize`:@@validation.required:Required` });
        }
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
        this.data.activity?.capability?.staff?.type ?? '',
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
            const { type, id, status, pathLength, pathWeight, pathMaxSpeed } = field().value();
            this.dialogRef.close(
                buildActivity({
                    existing: this.data.activity,
                    capabilityType: this.data.capabilityType,
                    responsibility: { type, id, status },
                    arrivalTime: this.arrivalTime(),
                    departureTime: this.departureTime(),
                    rollingStock: {
                        length: this.rsLength(),
                        weight: this.rsWeight(),
                        composition: this.rsComposition(),
                        localOnly: this.rsLocalOnly(),
                        features: this.rsFeatures(),
                    },
                    staffRole: this.staffRole(),
                    pathPassthrough: this.pathPassthrough(),
                    pathFields: { length: pathLength, weight: pathWeight, maxSpeed: pathMaxSpeed },
                }),
            );
        });
    }
}
