import { describe, expect, it } from 'vitest';
import { planStatusLabel, responsibilityTypeLabel } from './activity-display.utils';

describe('responsibilityTypeLabel', () => {
    it('returns formatted labels for all known types', () => {
        expect(responsibilityTypeLabel('rim')).toBe('rim – Responsible Infrastructure Manager');
        expect(responsibilityTypeLabel('pim')).toBe('pim – Planning Infrastructure Manager');
        expect(responsibilityTypeLabel('ra')).toBe('ra – Responsible Applicant');
        expect(responsibilityTypeLabel('rru')).toBe('rru – Responsible RU');
        expect(responsibilityTypeLabel('tru')).toBe('tru – Traction RU');
        expect(responsibilityTypeLabel('pru')).toBe('pru – Personnel RU');
    });

    it('returns the raw type string for unknown or stale types', () => {
        expect(responsibilityTypeLabel('rp')).toBe('rp');
        expect(responsibilityTypeLabel('unknown')).toBe('unknown');
        expect(responsibilityTypeLabel('')).toBe('');
        expect(responsibilityTypeLabel('RRU')).toBe('RRU');
    });
});

describe('planStatusLabel', () => {
    it('returns a localized label for each known status', () => {
        expect(planStatusLabel('proposed')).toContain('Proposed');
        expect(planStatusLabel('requested')).toContain('Requested');
        expect(planStatusLabel('confirmed')).toContain('Confirmed');
        expect(planStatusLabel('refused')).toContain('Refused');
        expect(planStatusLabel('dropped')).toContain('Dropped');
    });

    it('returns the raw status string for unknown or uppercase values', () => {
        expect(planStatusLabel('REFUSED')).toBe('REFUSED');
        expect(planStatusLabel('PROPOSED')).toBe('PROPOSED');
        expect(planStatusLabel('unknown-status')).toBe('unknown-status');
        expect(planStatusLabel('')).toBe('');
    });
});
