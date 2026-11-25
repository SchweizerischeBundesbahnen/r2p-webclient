import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi, describe, it, expect } from 'vitest';
import { of, throwError } from 'rxjs';
import { ShareTrainModalComponent, ShareTrainDialogData } from './share-train-modal';
import { BackendApiService } from '../../core/api/backend-api.service';
import { TrainListElement } from '../../shared/models/api.models';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { WritableSignal } from '@angular/core';

function makeApiService(): BackendApiService {
    return { shareTrain: vi.fn() } as unknown as BackendApiService;
}

function makeDialogRef(): { close: ReturnType<typeof vi.fn> } {
    return { close: vi.fn() };
}

function createComponent(
    data: ShareTrainDialogData,
    apiService: BackendApiService = makeApiService(),
    dialogRef: { close: ReturnType<typeof vi.fn> } = makeDialogRef(),
): { fixture: ComponentFixture<ShareTrainModalComponent>; apiService: BackendApiService; dialogRef: { close: ReturnType<typeof vi.fn> } } {
    TestBed.configureTestingModule({
        imports: [ShareTrainModalComponent],
        providers: [
            provideAnimationsAsync(),
            { provide: MAT_DIALOG_DATA, useValue: data },
            { provide: MatDialogRef, useValue: dialogRef },
            { provide: BackendApiService, useValue: apiService },
        ],
    });
    const fixture = TestBed.createComponent(ShareTrainModalComponent);
    fixture.detectChanges();
    return { fixture, apiService, dialogRef };
}

/** Set form model directly via the private signal to avoid mat-select DOM complexity. */
function setFormValues(fixture: ComponentFixture<ShareTrainModalComponent>, shareWith: string, comment: string): void {
    const comp = fixture.componentInstance as unknown as {
        model: WritableSignal<{ shareWith: string; comment: string }>;
    };
    comp.model.set({ shareWith, comment });
    fixture.detectChanges();
}

const STUB_TRAIN = { trainId: 'train-1', branches: [], mainTimestamp: '' } as unknown as TrainListElement;

describe('ShareTrainModalComponent', () => {
    describe('initialization', () => {
        it('creates the component and form is initially invalid (empty fields)', () => {
            const { fixture } = createComponent({ trainId: 'train-1', partners: [] });
            expect(fixture.componentInstance).toBeTruthy();
            const form = (fixture.componentInstance as unknown as { shareForm: (() => { invalid(): boolean }) }).shareForm;
            expect(form().invalid()).toBe(true);
        });
    });

    describe('partner badges', () => {
        it('renders partner badges when data.partners has entries', async () => {
            const { fixture } = createComponent({ trainId: 'train-1', partners: ['BLS', 'SBB'] });
            await fixture.whenStable();
            fixture.detectChanges();
            const badges = fixture.nativeElement.querySelectorAll('.partner-badge');
            // badges in the "already shared" section (at least 2)
            expect(badges.length).toBeGreaterThanOrEqual(2);
        });

        it('does not render the already-shared section when data.partners is empty', async () => {
            const { fixture } = createComponent({ trainId: 'train-1', partners: [] });
            await fixture.whenStable();
            fixture.detectChanges();
            // The "Already shared with" paragraph should not be present
            const para = fixture.nativeElement.querySelector('p');
            expect(para).toBeNull();
        });

        it('filters out already-shared partners from the select options', () => {
            const { fixture } = createComponent({ trainId: 'train-1', partners: ['SBB'] });
            const comp = fixture.componentInstance as unknown as { availableOrganizations: { name: string }[] };
            const names = comp.availableOrganizations.map((o) => o.name);
            expect(names).not.toContain('SBB');
            expect(names.length).toBeGreaterThan(0);
        });
    });

    describe('validation', () => {
        it('shows required errors after submit with empty fields', async () => {
            const { fixture } = createComponent({ trainId: 'train-1', partners: [] });
            const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="button"]:last-of-type');
            submitBtn.click();
            await fixture.whenStable();
            fixture.detectChanges();
            const errors = fixture.nativeElement.querySelectorAll('mat-error');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    describe('submission', () => {
        it('calls apiService.shareTrain with correct parameters on valid submit', async () => {
            const apiService = makeApiService();
            (apiService.shareTrain as ReturnType<typeof vi.fn>).mockReturnValue(of(STUB_TRAIN));
            const dialogRef = makeDialogRef();
            const { fixture } = createComponent({ trainId: 'train-1', partners: [] }, apiService, dialogRef);

            setFormValues(fixture, 'BLS', 'Sharing reason');
            await fixture.whenStable();

            const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="button"]:last-of-type');
            submitBtn.click();
            await fixture.whenStable();

            expect(apiService.shareTrain).toHaveBeenCalledWith('train-1', 'BLS', 'Sharing reason');
        });

        it('calls dialogRef.close with "success" after successful submission', async () => {
            const apiService = makeApiService();
            (apiService.shareTrain as ReturnType<typeof vi.fn>).mockReturnValue(of(STUB_TRAIN));
            const dialogRef = makeDialogRef();
            const { fixture } = createComponent({ trainId: 'train-1', partners: [] }, apiService, dialogRef);

            setFormValues(fixture, 'BLS', 'Sharing reason');
            await fixture.whenStable();

            const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="button"]:last-of-type');
            submitBtn.click();
            await fixture.whenStable();

            expect(dialogRef.close).toHaveBeenCalledWith('success');
        });

        it('does not call dialogRef.close on API error', async () => {
            const apiService = makeApiService();
            (apiService.shareTrain as ReturnType<typeof vi.fn>).mockReturnValue(throwError(() => new Error('API error')));
            const dialogRef = makeDialogRef();
            const { fixture } = createComponent({ trainId: 'train-1', partners: [] }, apiService, dialogRef);

            setFormValues(fixture, 'BLS', 'Sharing reason');
            await fixture.whenStable();

            const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="button"]:last-of-type');
            submitBtn.click();
            await fixture.whenStable();

            expect(dialogRef.close).not.toHaveBeenCalled();
        });
    });
});
