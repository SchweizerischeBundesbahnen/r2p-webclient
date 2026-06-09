import { describe, expect, it } from 'vitest';
import type { JourneyLocation, Train } from '../models/api.models';
import { TimingType } from '../models/api.models';
import {
    getEarliestJourneyLocationDeparture,
    getFirstJourneyLocationName,
    getLastJourneyLocationName,
    getLatestJourneyLocationArrival,
} from './journeyLocation.utils';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeTrain(journeylocations: JourneyLocation[]): Train {
    return { journey: { journeylocations } };
}

function makeJourneyLocation(
    name: string | undefined,
    timings: { type: TimingType; duration?: string }[] = [],
): JourneyLocation {
    return {
        locations: name != null ? [{ name }] : [],
        activities: timings.length > 0 ? [{ timings }] : [],
    };
}

// ── getFirstJourneyLocationName ───────────────────────────────────────────────

describe('getFirstJourneyLocationName', () => {
    describe('null / undefined input', () => {
        it('returns undefined for null', () => {
            expect(getFirstJourneyLocationName(null)).toBeUndefined();
        });

        it('returns undefined for undefined', () => {
            expect(getFirstJourneyLocationName(undefined)).toBeUndefined();
        });
    });

    describe('missing nested data', () => {
        it('returns undefined when train has no journey', () => {
            expect(getFirstJourneyLocationName({})).toBeUndefined();
        });

        it('returns undefined when journeylocations is empty', () => {
            expect(getFirstJourneyLocationName(makeTrain([]))).toBeUndefined();
        });

        it('returns undefined when the first journey location has no locations', () => {
            expect(getFirstJourneyLocationName(makeTrain([{ activities: [] }]))).toBeUndefined();
        });

        it('returns undefined when the first location has no name', () => {
            expect(getFirstJourneyLocationName(makeTrain([{ locations: [{}] }]))).toBeUndefined();
        });
    });

    describe('valid data', () => {
        it('returns the name of the first location of the first journey location', () => {
            const train = makeTrain([makeJourneyLocation('Bern'), makeJourneyLocation('Zürich')]);
            expect(getFirstJourneyLocationName(train)).toBe('Bern');
        });

        it('returns the name even when there is only one journey location', () => {
            expect(getFirstJourneyLocationName(makeTrain([makeJourneyLocation('Lausanne')]))).toBe(
                'Lausanne',
            );
        });
    });
});

// ── getLastJourneyLocationName ────────────────────────────────────────────────

describe('getLastJourneyLocationName', () => {
    describe('null / undefined input', () => {
        it('returns undefined for null', () => {
            expect(getLastJourneyLocationName(null)).toBeUndefined();
        });

        it('returns undefined for undefined', () => {
            expect(getLastJourneyLocationName(undefined)).toBeUndefined();
        });
    });

    describe('missing nested data', () => {
        it('returns undefined when train has no journey', () => {
            expect(getLastJourneyLocationName({})).toBeUndefined();
        });

        it('returns undefined when journeylocations is empty', () => {
            expect(getLastJourneyLocationName(makeTrain([]))).toBeUndefined();
        });

        it('returns undefined when the last journey location has no locations', () => {
            expect(getLastJourneyLocationName(makeTrain([{ activities: [] }]))).toBeUndefined();
        });

        it('returns undefined when the last location has no name', () => {
            expect(getLastJourneyLocationName(makeTrain([{ locations: [{}] }]))).toBeUndefined();
        });
    });

    describe('valid data', () => {
        it('returns the name of the last journey location when there is only one', () => {
            expect(getLastJourneyLocationName(makeTrain([makeJourneyLocation('Basel')]))).toBe(
                'Basel',
            );
        });

        it('returns the name of the last journey location when there are multiple', () => {
            const train = makeTrain([
                makeJourneyLocation('Bern'),
                makeJourneyLocation('Olten'),
                makeJourneyLocation('Zürich'),
            ]);
            expect(getLastJourneyLocationName(train)).toBe('Zürich');
        });

        it('returns a different value than getFirstJourneyLocationName for a multi-stop train', () => {
            const train = makeTrain([makeJourneyLocation('Bern'), makeJourneyLocation('Zürich')]);
            expect(getFirstJourneyLocationName(train)).toBe('Bern');
            expect(getLastJourneyLocationName(train)).toBe('Zürich');
        });
    });
});

// ── getEarliestJourneyLocationDeparture ──────────────────────────────────────

describe('getEarliestJourneyLocationDeparture', () => {
    describe('null / undefined input', () => {
        it('returns undefined for null', () => {
            expect(getEarliestJourneyLocationDeparture(null)).toBeUndefined();
        });

        it('returns undefined for undefined', () => {
            expect(getEarliestJourneyLocationDeparture(undefined)).toBeUndefined();
        });
    });

    describe('no matching timings', () => {
        it('returns undefined when train has no journey', () => {
            expect(getEarliestJourneyLocationDeparture({})).toBeUndefined();
        });

        it('returns undefined when journeylocations is empty', () => {
            expect(getEarliestJourneyLocationDeparture(makeTrain([]))).toBeUndefined();
        });

        it('returns undefined when there are no activities', () => {
            expect(
                getEarliestJourneyLocationDeparture(makeTrain([{ locations: [] }])),
            ).toBeUndefined();
        });

        it('returns undefined when there are only arrival timings', () => {
            const train = makeTrain([
                makeJourneyLocation('Bern', [{ type: TimingType.Arrival, duration: 'PT10M' }]),
            ]);
            expect(getEarliestJourneyLocationDeparture(train)).toBeUndefined();
        });

        it('returns undefined when all departure timings have no duration', () => {
            const train = makeTrain([
                makeJourneyLocation('Bern', [{ type: TimingType.Departure }]),
            ]);
            expect(getEarliestJourneyLocationDeparture(train)).toBeUndefined();
        });
    });

    describe('timing type coverage', () => {
        it('includes TimingType.Departure', () => {
            const train = makeTrain([
                makeJourneyLocation('Bern', [{ type: TimingType.Departure, duration: 'PT5M' }]),
            ]);
            expect(getEarliestJourneyLocationDeparture(train)).toBe('PT5M');
        });

        it('includes TimingType.EarliestDeparture', () => {
            const train = makeTrain([
                makeJourneyLocation('Bern', [
                    { type: TimingType.EarliestDeparture, duration: 'PT15M' },
                ]),
            ]);
            expect(getEarliestJourneyLocationDeparture(train)).toBe('PT15M');
        });

        it('includes TimingType.LatestDeparture', () => {
            const train = makeTrain([
                makeJourneyLocation('Bern', [
                    { type: TimingType.LatestDeparture, duration: 'PT20M' },
                ]),
            ]);
            expect(getEarliestJourneyLocationDeparture(train)).toBe('PT20M');
        });

        it('excludes TimingType.EarliestArrival', () => {
            const train = makeTrain([
                makeJourneyLocation('Bern', [
                    { type: TimingType.EarliestArrival, duration: 'PT5M' },
                ]),
            ]);
            expect(getEarliestJourneyLocationDeparture(train)).toBeUndefined();
        });

        it('excludes TimingType.LatestArrival', () => {
            const train = makeTrain([
                makeJourneyLocation('Bern', [{ type: TimingType.LatestArrival, duration: 'PT5M' }]),
            ]);
            expect(getEarliestJourneyLocationDeparture(train)).toBeUndefined();
        });
    });

    describe('picking the smallest duration', () => {
        it('returns the single duration when there is only one', () => {
            const train = makeTrain([
                makeJourneyLocation('Bern', [{ type: TimingType.Departure, duration: 'PT30M' }]),
            ]);
            expect(getEarliestJourneyLocationDeparture(train)).toBe('PT30M');
        });

        it('returns the smallest duration across multiple timings', () => {
            const train = makeTrain([
                makeJourneyLocation('Bern', [
                    { type: TimingType.Departure, duration: 'PT30M' },
                    { type: TimingType.EarliestDeparture, duration: 'PT10M' },
                    { type: TimingType.LatestDeparture, duration: 'PT45M' },
                ]),
            ]);
            expect(getEarliestJourneyLocationDeparture(train)).toBe('PT10M');
        });

        it('returns the smallest duration across multiple journey locations', () => {
            const train = makeTrain([
                makeJourneyLocation('Bern', [{ type: TimingType.Departure, duration: 'PT1H' }]),
                makeJourneyLocation('Olten', [{ type: TimingType.Departure, duration: 'PT20M' }]),
            ]);
            expect(getEarliestJourneyLocationDeparture(train)).toBe('PT20M');
        });

        it('skips timings without a duration when picking the minimum', () => {
            const train = makeTrain([
                makeJourneyLocation('Bern', [
                    { type: TimingType.Departure },
                    { type: TimingType.EarliestDeparture, duration: 'PT25M' },
                ]),
            ]);
            expect(getEarliestJourneyLocationDeparture(train)).toBe('PT25M');
        });

        it('handles durations with hours correctly (PT2H < PT150M)', () => {
            const train = makeTrain([
                makeJourneyLocation('Bern', [
                    { type: TimingType.Departure, duration: 'PT150M' },
                    { type: TimingType.EarliestDeparture, duration: 'PT2H' },
                ]),
            ]);
            // PT2H = 120 min < PT150M = 150 min
            expect(getEarliestJourneyLocationDeparture(train)).toBe('PT2H');
        });
    });
});

// ── getLatestJourneyLocationArrival ───────────────────────────────────────────

describe('getLatestJourneyLocationArrival', () => {
    describe('null / undefined input', () => {
        it('returns undefined for null', () => {
            expect(getLatestJourneyLocationArrival(null)).toBeUndefined();
        });

        it('returns undefined for undefined', () => {
            expect(getLatestJourneyLocationArrival(undefined)).toBeUndefined();
        });
    });

    describe('no matching timings', () => {
        it('returns undefined when train has no journey', () => {
            expect(getLatestJourneyLocationArrival({})).toBeUndefined();
        });

        it('returns undefined when journeylocations is empty', () => {
            expect(getLatestJourneyLocationArrival(makeTrain([]))).toBeUndefined();
        });

        it('returns undefined when there are no activities', () => {
            expect(getLatestJourneyLocationArrival(makeTrain([{ locations: [] }]))).toBeUndefined();
        });

        it('returns undefined when there are only departure timings', () => {
            const train = makeTrain([
                makeJourneyLocation('Zürich', [{ type: TimingType.Departure, duration: 'PT10M' }]),
            ]);
            expect(getLatestJourneyLocationArrival(train)).toBeUndefined();
        });

        it('returns undefined when all arrival timings have no duration', () => {
            const train = makeTrain([
                makeJourneyLocation('Zürich', [{ type: TimingType.Arrival }]),
            ]);
            expect(getLatestJourneyLocationArrival(train)).toBeUndefined();
        });
    });

    describe('timing type coverage', () => {
        it('includes TimingType.Arrival', () => {
            const train = makeTrain([
                makeJourneyLocation('Zürich', [{ type: TimingType.Arrival, duration: 'PT5M' }]),
            ]);
            expect(getLatestJourneyLocationArrival(train)).toBe('PT5M');
        });

        it('includes TimingType.EarliestArrival', () => {
            const train = makeTrain([
                makeJourneyLocation('Zürich', [
                    { type: TimingType.EarliestArrival, duration: 'PT15M' },
                ]),
            ]);
            expect(getLatestJourneyLocationArrival(train)).toBe('PT15M');
        });

        it('includes TimingType.LatestArrival', () => {
            const train = makeTrain([
                makeJourneyLocation('Zürich', [
                    { type: TimingType.LatestArrival, duration: 'PT20M' },
                ]),
            ]);
            expect(getLatestJourneyLocationArrival(train)).toBe('PT20M');
        });

        it('excludes TimingType.EarliestDeparture', () => {
            const train = makeTrain([
                makeJourneyLocation('Zürich', [
                    { type: TimingType.EarliestDeparture, duration: 'PT5M' },
                ]),
            ]);
            expect(getLatestJourneyLocationArrival(train)).toBeUndefined();
        });

        it('excludes TimingType.LatestDeparture', () => {
            const train = makeTrain([
                makeJourneyLocation('Zürich', [
                    { type: TimingType.LatestDeparture, duration: 'PT5M' },
                ]),
            ]);
            expect(getLatestJourneyLocationArrival(train)).toBeUndefined();
        });
    });

    describe('picking the largest duration', () => {
        it('returns the single duration when there is only one', () => {
            const train = makeTrain([
                makeJourneyLocation('Zürich', [{ type: TimingType.Arrival, duration: 'PT30M' }]),
            ]);
            expect(getLatestJourneyLocationArrival(train)).toBe('PT30M');
        });

        it('returns the largest duration across multiple timings', () => {
            const train = makeTrain([
                makeJourneyLocation('Zürich', [
                    { type: TimingType.Arrival, duration: 'PT30M' },
                    { type: TimingType.EarliestArrival, duration: 'PT10M' },
                    { type: TimingType.LatestArrival, duration: 'PT45M' },
                ]),
            ]);
            expect(getLatestJourneyLocationArrival(train)).toBe('PT45M');
        });

        it('returns the largest duration across multiple journey locations', () => {
            const train = makeTrain([
                makeJourneyLocation('Olten', [{ type: TimingType.Arrival, duration: 'PT20M' }]),
                makeJourneyLocation('Zürich', [{ type: TimingType.Arrival, duration: 'PT1H' }]),
            ]);
            expect(getLatestJourneyLocationArrival(train)).toBe('PT1H');
        });

        it('skips timings without a duration when picking the maximum', () => {
            const train = makeTrain([
                makeJourneyLocation('Zürich', [
                    { type: TimingType.Arrival },
                    { type: TimingType.LatestArrival, duration: 'PT25M' },
                ]),
            ]);
            expect(getLatestJourneyLocationArrival(train)).toBe('PT25M');
        });

        it('handles durations with hours correctly (PT2H > PT90M)', () => {
            const train = makeTrain([
                makeJourneyLocation('Zürich', [
                    { type: TimingType.Arrival, duration: 'PT90M' },
                    { type: TimingType.LatestArrival, duration: 'PT2H' },
                ]),
            ]);
            // PT2H = 120 min > PT90M = 90 min
            expect(getLatestJourneyLocationArrival(train)).toBe('PT2H');
        });
    });
});
