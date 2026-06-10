import { describe, expect, it } from 'vitest';
import type { Train } from '../../models/api.models';
import { computeOverallStatus } from './overall-status.utils';

function makeTrain(activities: { status?: string }[]): Train {
    return {
        journey: {
            journeylocations: activities.map((a) => ({
                activities: [{ responsibility: { type: 'staff', ...a } }],
            })),
        },
    };
}

describe('computeOverallStatus', () => {
    it('returns green for null', () => {
        expect(computeOverallStatus(null)).toBe('green');
    });

    it('returns green for undefined', () => {
        expect(computeOverallStatus(undefined)).toBe('green');
    });

    it('returns green when there are no activities', () => {
        expect(computeOverallStatus({ journey: { journeylocations: [] } })).toBe('green');
    });

    it('returns green when all responsibilities are confirmed', () => {
        expect(computeOverallStatus(makeTrain([{ status: 'confirmed' }, { status: 'confirmed' }]))).toBe('green');
    });

    it('returns green when activities have no responsibility', () => {
        expect(computeOverallStatus({ journey: { journeylocations: [{ activities: [{ type: 'journey' }] }] } })).toBe('green');
    });

    it('returns yellow when at least one responsibility is proposed', () => {
        expect(computeOverallStatus(makeTrain([{ status: 'confirmed' }, { status: 'proposed' }]))).toBe('yellow');
    });

    it('returns yellow when at least one responsibility is requested', () => {
        expect(computeOverallStatus(makeTrain([{ status: 'requested' }]))).toBe('yellow');
    });

    it('returns red when at least one responsibility is dropped', () => {
        expect(computeOverallStatus(makeTrain([{ status: 'confirmed' }, { status: 'dropped' }]))).toBe('red');
    });

    it('returns red when at least one responsibility is refused', () => {
        expect(computeOverallStatus(makeTrain([{ status: 'refused' }]))).toBe('red');
    });

    it('red takes precedence over yellow', () => {
        expect(computeOverallStatus(makeTrain([{ status: 'proposed' }, { status: 'refused' }]))).toBe('red');
    });

    it('is case-insensitive for status values', () => {
        expect(computeOverallStatus(makeTrain([{ status: 'REFUSED' }]))).toBe('red');
    });
});
