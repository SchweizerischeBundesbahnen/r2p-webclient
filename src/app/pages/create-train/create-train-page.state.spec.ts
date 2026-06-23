import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreatePageState } from './create-train-page.state';
import { Journey } from '../../shared/models/api.models';

describe('CreatePageState', () => {
    let state: CreatePageState;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CreatePageState],
        });
        state = TestBed.inject(CreatePageState);
    });

    it('initialises journey to an empty object and createTrainRunning to false', () => {
        expect(state.journey()).toEqual({});
        expect(state.createTrainRunning()).toBe(false);
    });

    it('form is invalid when all required fields are empty', () => {
        expect(state.createTrainForm().invalid()).toBe(true);
    });

    it('form remains invalid when only trainNumber is set', () => {
        (state as unknown as { model: { set: (v: { trainNumber: string; operationalDay: string; creationComment: string }) => void } }).model.set({ trainNumber: 'IC 1', operationalDay: '', creationComment: '' });
        expect(state.createTrainForm().invalid()).toBe(true);
    });

    it('form remains invalid when only operationalDay is set', () => {
        (state as unknown as { model: { set: (v: { trainNumber: string; operationalDay: string; creationComment: string }) => void } }).model.set({ trainNumber: '', operationalDay: '2026-06-11', creationComment: '' });
        expect(state.createTrainForm().invalid()).toBe(true);
    });

    it('form remains invalid when only creationComment is set', () => {
        (state as unknown as { model: { set: (v: { trainNumber: string; operationalDay: string; creationComment: string }) => void } }).model.set({ trainNumber: '', operationalDay: '', creationComment: 'my comment' });
        expect(state.createTrainForm().invalid()).toBe(true);
    });

    it('form becomes valid when all required fields are non-empty', () => {
        (state as unknown as { model: { set: (v: { trainNumber: string; operationalDay: string; creationComment: string }) => void } }).model.set({ trainNumber: 'IC 1', operationalDay: '2026-06-11', creationComment: 'my comment' });
        expect(state.createTrainForm().invalid()).toBe(false);
    });

    it('updates the journey signal when set', () => {
        const journey: Journey = { journeylocations: [{ locations: [] }] };
        state.journey.set(journey);
        expect(state.journey()).toEqual(journey);
    });
});
