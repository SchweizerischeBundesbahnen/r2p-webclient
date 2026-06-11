import { describe, expect, it } from 'vitest';
import { buildActivity, ActivityBuildInput } from './activity-builder.utils';
import { Activity, TimingType } from '../../models/api.models';

const BASE_INPUT: ActivityBuildInput = {
    existing: null,
    capabilityType: 'rollingStock',
    responsibility: { type: 'rru', id: 'SBB', status: 'proposed' },
    arrivalTime: '',
    departureTime: '',
    rollingStock: { length: '', weight: '', composition: '', localOnly: false, features: [] },
    staffRole: '',
    pathPassthrough: false,
    pathFields: { length: '', weight: '', maxSpeed: '' },
};

const STUB_EXISTING: Activity = {
    id: 'existing-id',
    type: 'rollingStock',
    timings: [],
    relations: [],
    responsibility: { type: 'rru', id: 'SBB', status: 'proposed' },
};

describe('buildActivity — timing types', () => {
    it('uses EarliestArrival and EarliestDeparture for new activities', () => {
        const result = buildActivity({ ...BASE_INPUT, arrivalTime: '08:30', departureTime: '09:00' });
        const arr = result.timings?.find((t) => t.type === TimingType.EarliestArrival);
        const dep = result.timings?.find((t) => t.type === TimingType.EarliestDeparture);
        expect(arr?.duration).toBe('PT8H30M');
        expect(dep?.duration).toBe('PT9H');
        expect(result.timings?.some((t) => t.type === TimingType.Arrival)).toBe(false);
        expect(result.timings?.some((t) => t.type === TimingType.Departure)).toBe(false);
    });

    it('preserves existing arrival timing type when editing', () => {
        const existing: Activity = {
            ...STUB_EXISTING,
            timings: [{ type: TimingType.LatestArrival, duration: 'PT7H', focus: 'planning' }],
        };
        const result = buildActivity({ ...BASE_INPUT, existing, arrivalTime: '08:30' });
        const arr = result.timings?.find((t) => t.type === TimingType.LatestArrival);
        expect(arr?.duration).toBe('PT8H30M');
        expect(result.timings?.some((t) => t.type === TimingType.Arrival)).toBe(false);
        expect(result.timings?.some((t) => t.type === TimingType.EarliestArrival)).toBe(false);
    });

    it('preserves existing departure timing type when editing', () => {
        const existing: Activity = {
            ...STUB_EXISTING,
            timings: [{ type: TimingType.EarliestDeparture, duration: 'PT9H', focus: 'planning' }],
        };
        const result = buildActivity({ ...BASE_INPUT, existing, departureTime: '10:00' });
        const dep = result.timings?.find((t) => t.type === TimingType.EarliestDeparture);
        expect(dep?.duration).toBe('PT10H');
        expect(result.timings?.some((t) => t.type === TimingType.Departure)).toBe(false);
    });

    it('keeps non-arrival/departure timings unchanged', () => {
        const existing: Activity = {
            ...STUB_EXISTING,
            timings: [{ type: TimingType.DwellTime, duration: 'PT5M', focus: 'planning' }],
        };
        const result = buildActivity({ ...BASE_INPUT, existing });
        expect(result.timings?.some((t) => t.type === TimingType.DwellTime)).toBe(true);
    });
});

describe('buildActivity — rolling stock NaN guard', () => {
    it('omits length and weight when inputs are empty', () => {
        const result = buildActivity(BASE_INPUT);
        expect(result.capability?.rollingStock?.length).toBeUndefined();
        expect(result.capability?.rollingStock?.weight).toBeUndefined();
    });

    it('sends length 0 when user enters 0', () => {
        const result = buildActivity({
            ...BASE_INPUT,
            rollingStock: { ...BASE_INPUT.rollingStock, length: '0' },
        });
        expect(result.capability?.rollingStock?.length).toBe(0);
    });

    it('omits length when input is not a finite number', () => {
        const result = buildActivity({
            ...BASE_INPUT,
            rollingStock: { ...BASE_INPUT.rollingStock, length: 'abc' },
        });
        expect(result.capability?.rollingStock?.length).toBeUndefined();
    });

    it('sends correct length and weight for valid numeric inputs', () => {
        const result = buildActivity({
            ...BASE_INPUT,
            rollingStock: { ...BASE_INPUT.rollingStock, length: '200000', weight: '420000' },
        });
        expect(result.capability?.rollingStock?.length).toBe(200000);
        expect(result.capability?.rollingStock?.weight).toBe(420000);
    });
});

describe('buildActivity — path NaN guard', () => {
    it('omits path numeric fields when inputs are empty strings', () => {
        const result = buildActivity({ ...BASE_INPUT, capabilityType: 'path' });
        const path = result.capability?.path;
        expect(path?.length).toBeUndefined();
        expect(path?.weight).toBeUndefined();
        expect(path?.maxSpeed).toBeUndefined();
    });

    it('sends correct values for valid path fields', () => {
        const result = buildActivity({
            ...BASE_INPUT,
            capabilityType: 'path',
            pathFields: { length: '165400', weight: '384000', maxSpeed: '140' },
        });
        const path = result.capability?.path;
        expect(path?.length).toBe(165400);
        expect(path?.weight).toBe(384000);
        expect(path?.maxSpeed).toBe(140);
    });

    it('sends maxSpeed 0 when user enters 0', () => {
        const result = buildActivity({
            ...BASE_INPUT,
            capabilityType: 'path',
            pathFields: { length: '', weight: '', maxSpeed: '0' },
        });
        expect(result.capability?.path?.maxSpeed).toBe(0);
    });
});
