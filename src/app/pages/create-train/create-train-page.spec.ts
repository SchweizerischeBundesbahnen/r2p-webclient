import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EMPTY } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateTrainPage } from './create-train-page';
import { CreatePageState } from './create-train-page.state';
import { BackendApiService } from '../../core/api/backend-api.service';
import { ErrorNotificationService } from '../../core/error/error-notification.service';
import { Journey } from '../../shared/models/api.models';

describe('CreateTrainPage', () => {
    let fixture: ComponentFixture<CreateTrainPage>;
    let state: CreatePageState;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CreateTrainPage],
            providers: [
                provideRouter([]),
                { provide: BackendApiService, useValue: { createTrain: vi.fn().mockReturnValue(EMPTY) } },
                { provide: ErrorNotificationService, useValue: { showSuccess: vi.fn(), showError: vi.fn() } },
            ],
        });
        fixture = TestBed.createComponent(CreateTrainPage);
        state = fixture.debugElement.injector.get(CreatePageState);
        fixture.detectChanges();
    });

    it('isJourneyEmpty is true initially and false after journeylocations are set', () => {
        expect((fixture.componentInstance as any).isJourneyEmpty()).toBe(true);

        state.journey.set({ featuresets: [], journeylocations: [{ locations: [] }] });
        fixture.detectChanges();

        expect((fixture.componentInstance as any).isJourneyEmpty()).toBe(false);
    });

    it('onJourneyChange updates the state journey signal', () => {
        const journey: Journey = { featuresets: [], journeylocations: [{ locations: [] }] };
        (fixture.componentInstance as any).onJourneyChange(journey);
        expect(state.journey()).toEqual(journey);
    });

    it('save button is disabled when form is invalid or journey is empty', () => {
        const btn = fixture.nativeElement.querySelector('#sticky-save-btn') as HTMLButtonElement;
        expect(btn.disabled).toBe(true);
    });
});
