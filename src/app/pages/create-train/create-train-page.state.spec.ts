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

    it('initialises journey to { featuresets: [] } and createTrainRunning to false', () => {
        expect(state.journey()).toEqual({ featuresets: [] });
        expect(state.createTrainRunning()).toBe(false);
    });

    it('form is invalid when all required fields are empty', () => {
        expect(state.createTrainForm().invalid()).toBe(true);
    });

    it('updates the journey signal when set', () => {
        const journey: Journey = { featuresets: [], journeylocations: [{ locations: [] }] };
        state.journey.set(journey);
        expect(state.journey()).toEqual(journey);
    });
});
