import { describe, expect, it } from 'vitest';
import { computeJourneyStops } from './journey-route-card.utils';
import { Activity, JourneyLocation } from '../../models/api.models';

function loc(name: string, activities: Activity[] = []): JourneyLocation {
    return { locations: [{ name }], activities };
}

function rsActivity(localOnly = false): Activity {
    return {
        capability: { type: 'rollingStock', capabilityFeatures: [], ...(localOnly ? { localOnly } : {}) },
        timings: [],
        relations: [],
    };
}

function staffActivity(): Activity {
    return { capability: { type: 'staff', capabilityFeatures: [] }, timings: [], relations: [] };
}

function pathActivity(): Activity {
    return { capability: { type: 'path', capabilityFeatures: [] }, timings: [], relations: [] };
}

describe('computeJourneyStops', () => {
    it('returns empty array for empty input', () => {
        expect(computeJourneyStops([])).toEqual([]);
    });

    it('maps stop name and location from first location entry', () => {
        const stops = computeJourneyStops([loc('Zürich HB')]);
        expect(stops[0].stopName).toBe('Zürich HB');
        expect(stops[0].location?.name).toBe('Zürich HB');
    });

    it('falls back to "?" when locations array is empty', () => {
        const stops = computeJourneyStops([{ locations: [] }]);
        expect(stops[0].stopName).toBe('?');
        expect(stops[0].location).toBeUndefined();
    });

    it('marks isFirst and isLast correctly', () => {
        const stops = computeJourneyStops([loc('A'), loc('B'), loc('C')]);
        expect(stops[0].isFirst).toBe(true);
        expect(stops[0].isLast).toBe(false);
        expect(stops[1].isFirst).toBe(false);
        expect(stops[1].isLast).toBe(false);
        expect(stops[2].isFirst).toBe(false);
        expect(stops[2].isLast).toBe(true);
    });

    it('single stop with no activities has spanRole "none"', () => {
        const stops = computeJourneyStops([loc('A')]);
        expect(stops[0].spanRole).toBe('none');
    });

    describe('spanRole computation', () => {
        it('solo: RS at only stop with no onward span', () => {
            const stops = computeJourneyStops([loc('A', [rsActivity()])]);
            expect(stops[0].spanRole).toBe('solo');
        });

        it('start/end: RS introduced at first stop, inherited at second', () => {
            const stops = computeJourneyStops([loc('A', [rsActivity()]), loc('B')]);
            expect(stops[0].spanRole).toBe('start');
            expect(stops[1].spanRole).toBe('end');
        });

        it('start/mid/end: RS spans across three stops', () => {
            const stops = computeJourneyStops([loc('A', [rsActivity()]), loc('B'), loc('C')]);
            expect(stops[0].spanRole).toBe('start');
            expect(stops[1].spanRole).toBe('mid');
            expect(stops[2].spanRole).toBe('end');
        });

        it('new RS at middle stop resets span — previous end, new start', () => {
            const stops = computeJourneyStops([
                loc('A', [rsActivity()]),
                loc('B', [rsActivity()]),
                loc('C'),
            ]);
            expect(stops[0].spanRole).toBe('solo');
            expect(stops[1].spanRole).toBe('start');
            expect(stops[2].spanRole).toBe('end');
        });

        it('solo RS at last stop has spanRole "solo"', () => {
            const stops = computeJourneyStops([loc('A'), loc('B', [rsActivity()])]);
            expect(stops[0].spanRole).toBe('none');
            expect(stops[1].spanRole).toBe('solo');
        });
    });

    describe('localOnly RS activities', () => {
        it('localOnly RS at a stop is "solo" — counted as own RS but does not propagate', () => {
            const stops = computeJourneyStops([loc('A', [rsActivity(true)]), loc('B')]);
            // A has own RS (even if localOnly) → not 'none'
            // localOnly resets activeRsActivity → B gets no inherited span → A has no onward span → 'solo'
            expect(stops[0].spanRole).toBe('solo');
            expect(stops[1].spanRole).toBe('none');
        });

        it('localOnly RS after a non-local RS resets the inherited span', () => {
            const stops = computeJourneyStops([
                loc('A', [rsActivity()]),
                loc('B', [rsActivity(true)]),
                loc('C'),
            ]);
            // A: non-local RS, B resets active → A has no onward span → 'solo'
            // B: own localOnly RS, C has no inherited span → 'solo'
            // C: no RS, no inherited → 'none'
            expect(stops[0].spanRole).toBe('solo');
            expect(stops[1].spanRole).toBe('solo');
            expect(stops[2].spanRole).toBe('none');
        });

        it('non-local RS at stop with mixed localOnly activities spans onward', () => {
            const stops = computeJourneyStops([
                loc('A', [rsActivity(true), rsActivity(false)]),
                loc('B'),
            ]);
            // nonLocal array has the non-local RS → activeRsActivity is set → B inherits
            expect(stops[0].spanRole).toBe('start');
            expect(stops[1].spanRole).toBe('end');
        });
    });

    describe('inheritedOriginName', () => {
        it('sets inheritedOriginName on end-of-span stop to origin stop name', () => {
            const stops = computeJourneyStops([loc('Zürich HB', [rsActivity()]), loc('Basel SBB')]);
            expect(stops[1].inheritedOriginName).toBe('Zürich HB');
        });

        it('sets inheritedOriginName on end stop in three-stop span', () => {
            const stops = computeJourneyStops([
                loc('Bern', [rsActivity()]),
                loc('Olten'),
                loc('Basel SBB'),
            ]);
            expect(stops[1].inheritedOriginName).toBeUndefined();
            expect(stops[2].inheritedOriginName).toBe('Bern');
        });

        it('is undefined for non-end-of-span stops', () => {
            const stops = computeJourneyStops([loc('A', [rsActivity()]), loc('B'), loc('C')]);
            expect(stops[0].inheritedOriginName).toBeUndefined();
            expect(stops[1].inheritedOriginName).toBeUndefined();
        });
    });

    describe('activity categorisation', () => {
        it('separates rollingStock, staff, and path activities into their arrays', () => {
            const stops = computeJourneyStops([
                loc('A', [rsActivity(), staffActivity(), pathActivity()]),
            ]);
            expect(stops[0].rollingStockActivities).toHaveLength(1);
            expect(stops[0].staffActivities).toHaveLength(1);
            expect(stops[0].pathActivities).toHaveLength(1);
        });

        it('stop with no activities has all activity arrays empty', () => {
            const stops = computeJourneyStops([loc('A')]);
            expect(stops[0].rollingStockActivities).toHaveLength(0);
            expect(stops[0].staffActivities).toHaveLength(0);
            expect(stops[0].pathActivities).toHaveLength(0);
        });
    });
});
