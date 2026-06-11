import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { EMPTY, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateTrainPage } from './create-train-page';
import { CreatePageState } from './create-train-page.state';
import { BackendApiService } from '../../core/api/backend-api.service';
import { ErrorNotificationService } from '../../core/error/error-notification.service';
import { Journey } from '../../shared/models/api.models';

const VALID_FORM = { trainNumber: 'IC 1', operationalDay: '2026-06-11', creationComment: 'my comment' };
const NON_EMPTY_JOURNEY: Journey = { featuresets: [], journeylocations: [{ locations: [] }] };

function makeFormValid(state: CreatePageState): void {
    (state as unknown as { model: { set: (v: typeof VALID_FORM) => void } }).model.set(VALID_FORM);
}

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
        const comp = fixture.componentInstance as unknown as { isJourneyEmpty: () => boolean };
        expect(comp.isJourneyEmpty()).toBe(true);

        state.journey.set({ featuresets: [], journeylocations: [{ locations: [] }] });
        fixture.detectChanges();

        expect(comp.isJourneyEmpty()).toBe(false);
    });

    it('onJourneyChange updates the state journey signal', () => {
        const journey: Journey = { featuresets: [], journeylocations: [{ locations: [] }] };
        (fixture.componentInstance as unknown as { onJourneyChange: (j: Journey) => void }).onJourneyChange(journey);
        expect(state.journey()).toEqual(journey);
    });

    it('save button is disabled when form is invalid or journey is empty', () => {
        const btn = fixture.nativeElement.querySelector('#sticky-save-btn') as HTMLButtonElement;
        expect(btn.disabled).toBe(true);
    });

    it('save button is disabled when form is valid but journey is empty', () => {
        makeFormValid(state);
        fixture.detectChanges();
        const btn = fixture.nativeElement.querySelector('#sticky-save-btn') as HTMLButtonElement;
        expect(btn.disabled).toBe(true);
    });

    it('save button is disabled when createTrainRunning is true even with valid form and journey', () => {
        makeFormValid(state);
        state.journey.set(NON_EMPTY_JOURNEY);
        state.createTrainRunning.set(true);
        fixture.detectChanges();
        const btn = fixture.nativeElement.querySelector('#sticky-save-btn') as HTMLButtonElement;
        expect(btn.disabled).toBe(true);
    });

    it('save button is enabled when form is valid, journey is non-empty and createTrainRunning is false', () => {
        makeFormValid(state);
        state.journey.set(NON_EMPTY_JOURNEY);
        fixture.detectChanges();
        const btn = fixture.nativeElement.querySelector('#sticky-save-btn') as HTMLButtonElement;
        expect(btn.disabled).toBe(false);
    });

    it('navigates to /traffic-overview, shows success and resets createTrainRunning on successful createTrain', async () => {
        const api = TestBed.inject(BackendApiService);
        const notifications = TestBed.inject(ErrorNotificationService);
        (api.createTrain as ReturnType<typeof vi.fn>).mockReturnValue(of({}));
        const router = TestBed.inject(Router);
        vi.spyOn(router, 'navigate').mockResolvedValue(true);

        makeFormValid(state);
        state.journey.set(NON_EMPTY_JOURNEY);

        (fixture.componentInstance as unknown as { createTrain: () => void }).createTrain();
        await fixture.whenStable();

        expect(api.createTrain).toHaveBeenCalledWith(
            VALID_FORM.trainNumber,
            VALID_FORM.operationalDay,
            VALID_FORM.creationComment,
            NON_EMPTY_JOURNEY,
        );
        expect(notifications.showSuccess).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/traffic-overview']);
        expect(state.createTrainRunning()).toBe(false);
    });

    it('resets createTrainRunning to false and does not navigate on API error', async () => {
        const api = TestBed.inject(BackendApiService);
        const notifications = TestBed.inject(ErrorNotificationService);
        (api.createTrain as ReturnType<typeof vi.fn>).mockReturnValue(
            throwError(() => new Error('API error')),
        );
        const router = TestBed.inject(Router);
        vi.spyOn(router, 'navigate').mockResolvedValue(true);

        makeFormValid(state);

        (fixture.componentInstance as unknown as { createTrain: () => void }).createTrain();
        await fixture.whenStable();

        expect(state.createTrainRunning()).toBe(false);
        expect(router.navigate).not.toHaveBeenCalled();
        expect(notifications.showSuccess).not.toHaveBeenCalled();
    });
});
