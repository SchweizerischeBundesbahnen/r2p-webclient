import {
    assertIsoDate,
    durationToMinutes,
    hoursMinutesToDuration,
    isoDateToUtc,
    parseDurationToDate,
    parseDurationToHoursAndMinutes,
} from './date.utils';

describe('isoDateToUtc', () => {
    it('returns a Date at UTC midnight for a given ISO date string', () => {
        const result = isoDateToUtc('2026-05-26');
        expect(result.toISOString()).toBe('2026-05-26T00:00:00.000Z');
    });

    it('is stable across different local timezones (date does not shift)', () => {
        const result = isoDateToUtc('2026-01-01');
        expect(result.getUTCFullYear()).toBe(2026);
        expect(result.getUTCMonth()).toBe(0);
        expect(result.getUTCDate()).toBe(1);
    });
});

describe('assertIsoDate', () => {
    describe('valid dates', () => {
        it('does not throw for a standard date', () => {
            expect(() => assertIsoDate('2026-05-26')).not.toThrow();
        });

        it('does not throw for the first day of a month', () => {
            expect(() => assertIsoDate('2026-01-01')).not.toThrow();
        });

        it('does not throw for the last day of a 31-day month', () => {
            expect(() => assertIsoDate('2026-03-31')).not.toThrow();
        });

        it('does not throw for a valid leap day', () => {
            expect(() => assertIsoDate('2024-02-29')).not.toThrow();
        });
    });

    describe('calendar overflow', () => {
        it('throws for day 30 in February', () => {
            expect(() => assertIsoDate('2026-02-30')).toThrow('Invalid ISO date "2026-02-30"');
        });

        it('throws for day 29 in February in a non-leap year', () => {
            expect(() => assertIsoDate('2026-02-29')).toThrow();
        });

        it('throws for an invalid month (13)', () => {
            expect(() => assertIsoDate('2026-13-01')).toThrow();
        });

        it('throws for day 32', () => {
            expect(() => assertIsoDate('2026-01-32')).toThrow();
        });
    });

    describe('wrong format', () => {
        it('throws for a date-time string', () => {
            expect(() => assertIsoDate('2026-05-26T10:00:00')).toThrow();
        });

        it('throws for a date-time string with timezone', () => {
            expect(() => assertIsoDate('2026-05-26T10:00:00Z')).toThrow();
        });

        it('throws for an empty string', () => {
            expect(() => assertIsoDate('')).toThrow();
        });

        it('throws for a free-form string', () => {
            expect(() => assertIsoDate('irgendwas')).toThrow();
        });

        it('throws for a date with slashes', () => {
            expect(() => assertIsoDate('26/05/2026')).toThrow();
        });

        it('throws for a date with dots', () => {
            expect(() => assertIsoDate('26.05.2026')).toThrow();
        });
    });

    describe('error message', () => {
        it('includes the invalid value in the error message', () => {
            expect(() => assertIsoDate('not-a-date')).toThrow('Invalid ISO date "not-a-date"');
        });
    });
});

describe('durationToMinutes', () => {
    describe('hours only', () => {
        it('converts PTxH to x*60 minutes', () => {
            expect(durationToMinutes('PT8H')).toBe(480);
        });

        it('converts PT1H to 60 minutes', () => {
            expect(durationToMinutes('PT1H')).toBe(60);
        });
    });

    describe('minutes only', () => {
        it('converts PTxM to x minutes', () => {
            expect(durationToMinutes('PT30M')).toBe(30);
        });

        it('converts PT1M to 1 minute', () => {
            expect(durationToMinutes('PT1M')).toBe(1);
        });
    });

    describe('hours and minutes', () => {
        it('converts PT8H12M to 492 minutes', () => {
            expect(durationToMinutes('PT8H12M')).toBe(492);
        });

        it('converts PT1H1M to 61 minutes', () => {
            expect(durationToMinutes('PT1H1M')).toBe(61);
        });
    });

    describe('days', () => {
        it('converts P1D to 1440 minutes', () => {
            expect(durationToMinutes('P1D')).toBe(1440);
        });

        it('converts P1DT14H35M to 1*1440 + 14*60 + 35 = 2315 minutes', () => {
            expect(durationToMinutes('P1DT14H35M')).toBe(2315);
        });

        it('converts P2DT0H0M to 2880 minutes', () => {
            expect(durationToMinutes('P2DT0H0M')).toBe(2880);
        });
    });

    describe('zero duration', () => {
        it('converts PT0M to 0 minutes', () => {
            expect(durationToMinutes('PT0M')).toBe(0);
        });

        it('converts PT0H0M to 0 minutes', () => {
            expect(durationToMinutes('PT0H0M')).toBe(0);
        });
    });

    describe('invalid input', () => {
        it('returns Infinity for an empty string', () => {
            expect(durationToMinutes('')).toBe(Infinity);
        });

        it('returns Infinity for a free-form string', () => {
            expect(durationToMinutes('not-a-duration')).toBe(Infinity);
        });

        it('returns Infinity for an ISO date string', () => {
            expect(durationToMinutes('2026-05-26')).toBe(Infinity);
        });
    });
});

describe('hoursMinutesToDuration', () => {
    it('converts HH:MM to ISO-8601 duration', () => {
        expect(hoursMinutesToDuration('08:30')).toBe('PT8H30M');
        expect(hoursMinutesToDuration('10:00')).toBe('PT10H');
        expect(hoursMinutesToDuration('00:45')).toBe('PT45M');
    });

    it('converts 00:00 to PT0M (midnight is a valid time)', () => {
        expect(hoursMinutesToDuration('00:00')).toBe('PT0M');
    });

    it('returns undefined for empty, undefined, or malformed input', () => {
        expect(hoursMinutesToDuration(undefined)).toBeUndefined();
        expect(hoursMinutesToDuration('')).toBeUndefined();
        expect(hoursMinutesToDuration('abc')).toBeUndefined();
        expect(hoursMinutesToDuration('8:30:00')).toBeUndefined();
        expect(hoursMinutesToDuration('8.5:30')).toBeUndefined();
    });

    it('returns undefined for out-of-range minutes', () => {
        expect(hoursMinutesToDuration('08:60')).toBeUndefined();
        expect(hoursMinutesToDuration('08:-1')).toBeUndefined();
    });
});

describe('parseDurationToHoursAndMinutes', () => {
    it('parses hours and minutes without days', () => {
        expect(parseDurationToHoursAndMinutes('PT8H12M')).toBe('08:12');
    });

    it('parses hours only', () => {
        expect(parseDurationToHoursAndMinutes('PT10H')).toBe('10:00');
    });

    it('parses minutes only', () => {
        expect(parseDurationToHoursAndMinutes('PT45M')).toBe('00:45');
    });

    it('converts days to hours', () => {
        expect(parseDurationToHoursAndMinutes('P1DT14H35M')).toBe('38:35');
    });

    it('pads single-digit hours and minutes', () => {
        expect(parseDurationToHoursAndMinutes('PT7H5M')).toBe('07:05');
    });

    it('returns undefined for invalid input', () => {
        expect(parseDurationToHoursAndMinutes('invalid')).toBeUndefined();
    });
});

describe('parseDurationToDate', () => {
    it('adds hours and minutes to a date', () => {
        expect(parseDurationToDate('2025-06-15', 'PT8H12M')).toBe('2025-06-15T08:12:00.000Z');
    });

    it('adds days, hours and minutes crossing a day boundary', () => {
        expect(parseDurationToDate('2025-06-15', 'P1DT14H35M')).toBe('2025-06-16T14:35:00.000Z');
    });

    it('adds multiple days', () => {
        expect(parseDurationToDate('2025-06-15', 'P2D')).toBe('2025-06-17T00:00:00.000Z');
    });

    it('adds zero duration', () => {
        expect(parseDurationToDate('2025-06-15', 'PT0M')).toBe('2025-06-15T00:00:00.000Z');
    });

    it('handles minute overflow correctly', () => {
        expect(parseDurationToDate('2025-12-31', 'PT23H59M')).toBe('2025-12-31T23:59:00.000Z');
    });

    it('handles gap year correctly', () => {
        expect(parseDurationToDate('2024-02-28', 'P2DT8H14M')).toBe('2024-03-01T08:14:00.000Z');
    });

    it('returns undefined when date is undefined', () => {
        expect(parseDurationToDate(undefined, 'PT8H')).toBeUndefined();
    });

    it('returns undefined when duration is undefined', () => {
        expect(parseDurationToDate('2025-06-15', undefined)).toBeUndefined();
    });

    it('returns undefined when duration is invalid', () => {
        expect(parseDurationToDate('2025-06-15', 'not-a-duration')).toBeUndefined();
    });
});
