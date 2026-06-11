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
import { hoursMinutesToDuration } from '../../utils/date.utils';
import { CapabilityType } from './journey-activity-item';

export interface ActivityBuildInput {
    existing: Activity | null;
    capabilityType: CapabilityType;
    responsibility: { type: string; id: string; status: string };
    arrivalTime: string;
    departureTime: string;
    rollingStock: {
        length: string;
        weight: string;
        composition: string;
        localOnly: boolean;
        features: { type: string; offeredservice: string }[];
    };
    staffRole: string;
    pathPassthrough: boolean;
    pathFields: { length: string; weight: string; maxSpeed: string };
}

interface ExtendedCapability extends Capability {
    localOnly?: boolean;
    passthrough?: boolean;
}

export function buildActivity(input: ActivityBuildInput): Activity {
    const { existing, capabilityType: colType } = input;

    const responsibility: Responsibility = {
        type: input.responsibility.type,
        id: input.responsibility.id,
        status: input.responsibility.status,
    };

    const existingTimings = existing?.timings ?? [];
    const existingArrType = existingTimings.find((t) => ARRIVAL_TIMING_TYPES.has(t.type))?.type;
    const existingDepType = existingTimings.find((t) => DEPARTURE_TIMING_TYPES.has(t.type))?.type;
    const otherTimings = existingTimings.filter(
        (t) => !ARRIVAL_TIMING_TYPES.has(t.type) && !DEPARTURE_TIMING_TYPES.has(t.type),
    );
    const arrDur = hoursMinutesToDuration(input.arrivalTime);
    const depDur = hoursMinutesToDuration(input.departureTime);
    const timings = [
        ...otherTimings,
        ...(arrDur ? [{ type: existingArrType ?? TimingType.EarliestArrival, duration: arrDur, focus: 'planning' }] : []),
        ...(depDur ? [{ type: existingDepType ?? TimingType.EarliestDeparture, duration: depDur, focus: 'planning' }] : []),
    ];

    let capability: ExtendedCapability = { type: colType, capabilityFeatures: [] };

    if (colType === 'rollingStock') {
        const features: CapabilityFeature[] = input.rollingStock.features
            .filter((f) => f.type)
            .map((f) => ({
                feature: {
                    type: f.type,
                    ...(f.offeredservice ? { offeredservice: f.offeredservice } : {}),
                } satisfies Feature,
            }));
        const rsLength = input.rollingStock.length ? Number(input.rollingStock.length) : undefined;
        const rsWeight = input.rollingStock.weight ? Number(input.rollingStock.weight) : undefined;
        const rsUnits = input.rollingStock.composition
            ? [{ name: input.rollingStock.composition }]
            : (existing?.capability?.rollingStock?.units ?? []);

        capability = {
            type: colType,
            localOnly: input.rollingStock.localOnly,
            capabilityFeatures: features,
            rollingStock: {
                ...(existing?.capability?.rollingStock ?? {}),
                ...(Number.isFinite(rsLength ?? NaN) ? { length: rsLength } : {}),
                ...(Number.isFinite(rsWeight ?? NaN) ? { weight: rsWeight } : {}),
                units: rsUnits,
            },
        };
    } else if (colType === 'staff') {
        const staffs: Staff[] = input.staffRole
            ? [{ type: input.staffRole }]
            : (existing?.capability?.staffs ?? []);
        capability = {
            type: colType,
            capabilityFeatures: [],
            ...(staffs.length ? { staffs } : {}),
        };
    } else if (colType === 'path') {
        const toFiniteOrNaN = (s: string) => (s.trim() !== '' ? Number(s) : NaN);
        const pathLength = toFiniteOrNaN(input.pathFields.length);
        const pathWeight = toFiniteOrNaN(input.pathFields.weight);
        const pathMaxSpeed = toFiniteOrNaN(input.pathFields.maxSpeed);
        capability = {
            type: colType,
            capabilityFeatures: [],
            passthrough: input.pathPassthrough,
            path: {
                ...(existing?.capability?.path ?? {}),
                id: existing?.capability?.path?.id ?? crypto.randomUUID(),
                ...(Number.isFinite(pathLength) ? { length: pathLength } : {}),
                ...(Number.isFinite(pathWeight) ? { weight: pathWeight } : {}),
                ...(Number.isFinite(pathMaxSpeed) ? { maxSpeed: pathMaxSpeed } : {}),
            },
        };
    }

    const defaultActivityType =
        colType === 'rollingStock' ? 'rollingStock' : colType === 'path' ? 'path.runthrough' : 'move';

    return {
        ...(existing ?? {}),
        id: existing?.id ?? crypto.randomUUID(),
        type: existing?.type ?? defaultActivityType,
        responsibility,
        timings,
        relations: existing?.relations ?? [],
        capability: capability as Activity['capability'],
    } satisfies Activity;
}
