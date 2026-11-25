import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi, describe, it, expect } from 'vitest';
import { of, throwError } from 'rxjs';
import { WritableSignal } from '@angular/core';
import { DeleteTrainModal, DeleteTrainDialogData } from './delete-train-modal';
import { BackendApiService } from '../../core/api/backend-api.service';
import { Branch } from '../../shared/models/api.models';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

function makeApiService(): BackendApiService {
    return { deleteBranch: vi.fn() } as unknown as BackendApiService;
}

function makeDialogRef(): { close: ReturnType<typeof vi.fn> } {
    return { close: vi.fn() };
}

const DEFAULT_DATA: DeleteTrainDialogData = {
    trainId: 'train-1',
    branchId: 'branch-main',
    trainNumber: 'IC 1234',
};

function createComponent(
    data: DeleteTrainDialogData = DEFAULT_DATA,
    apiService: BackendApiService = makeApiService(),
    dialogRef: { close: ReturnType<typeof vi.fn> } = makeDialogRef(),
): {
    fixture: ComponentFixture<DeleteTrainModal>;
    apiService: BackendApiService;
    dialogRef: { close: ReturnType<typeof vi.fn> };
} {
    TestBed.configureTestingModule({
        imports: [DeleteTrainModal],
        providers: [
            provideAnimationsAsync(),
            { provide: MAT_DIALOG_DATA, useValue: data },
            { provide: MatDialogRef, useValue: dialogRef },
            { provide: BackendApiService, useValue: apiService },
        ],
    });
    const fixture = TestBed.createComponent(DeleteTrainModal);
    fixture.detectChanges();
    return { fixture, apiService, dialogRef };
}

function setComment(fixture: ComponentFixture<DeleteTrainModal>, comment: string): void {
    const comp = fixture.componentInstance as unknown as {
        model: WritableSignal<{ comment: string }>;
    };
    comp.model.set({ comment });
    fixture.detectChanges();
}

const STUB_BRANCH = { branchId: 'branch-main' } as unknown as Branch;

describe('DeleteTrainModal', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('creates the component with form initially invalid and shows train number in warning', async () => {
        const { fixture } = createComponent();
        expect(fixture.componentInstance).toBeTruthy();
        const form = (
            fixture.componentInstance as unknown as {
                deleteForm: () => { invalid(): boolean };
            }
        ).deleteForm;
        expect(form().invalid()).toBe(true);
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('IC 1234');
    });

    it('shows required validation error and does not call API when submitting empty comment', async () => {
        const apiService = makeApiService();
        const { fixture } = createComponent(DEFAULT_DATA, apiService);
        const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
            'button[type="button"]:last-of-type',
        );
        submitBtn.click();
        await fixture.whenStable();
        fixture.detectChanges();
        const errors = fixture.nativeElement.querySelectorAll('mat-error');
        expect(errors.length).toBeGreaterThan(0);
        expect(apiService.deleteBranch).not.toHaveBeenCalled();
    });

    it('calls deleteBranch with correct params and closes with "success" on valid submit', async () => {
        const apiService = makeApiService();
        (apiService.deleteBranch as ReturnType<typeof vi.fn>).mockReturnValue(of(STUB_BRANCH));
        const dialogRef = makeDialogRef();
        const { fixture } = createComponent(DEFAULT_DATA, apiService, dialogRef);

        setComment(fixture, 'Removing train — service discontinued');
        await fixture.whenStable();

        const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
            'button[type="button"]:last-of-type',
        );
        submitBtn.click();
        await fixture.whenStable();

        expect(apiService.deleteBranch).toHaveBeenCalledWith(
            'train-1',
            'branch-main',
            'Removing train — service discontinued',
        );
        expect(dialogRef.close).toHaveBeenCalledWith('success');
    });

    it('does not close dialog on API error', async () => {
        const apiService = makeApiService();
        (apiService.deleteBranch as ReturnType<typeof vi.fn>).mockReturnValue(
            throwError(() => new Error('API error')),
        );
        const dialogRef = makeDialogRef();
        const { fixture } = createComponent(DEFAULT_DATA, apiService, dialogRef);

        setComment(fixture, 'Removing train');
        await fixture.whenStable();

        const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
            'button[type="button"]:last-of-type',
        );
        submitBtn.click();
        await fixture.whenStable();

        expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('cancel button closes dialog without calling API', async () => {
        const apiService = makeApiService();
        const dialogRef = makeDialogRef();
        const { fixture } = createComponent(DEFAULT_DATA, apiService, dialogRef);

        const cancelBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
            'button[mat-dialog-close]',
        );
        cancelBtn.click();
        await fixture.whenStable();

        expect(apiService.deleteBranch).not.toHaveBeenCalled();
    });
});
