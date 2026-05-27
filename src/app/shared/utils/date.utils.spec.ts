import { assertIsoDate, isoDateToUtc } from './date.utils';

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

