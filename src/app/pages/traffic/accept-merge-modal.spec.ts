import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi, describe, it, expect } from 'vitest';
import { of, throwError } from 'rxjs';
import { AcceptMergeModalComponent, AcceptMergeDialogData } from './accept-merge-modal';
import { BackendApiService } from '../../backend-api.service';
import { TrainListElement } from '../../shared/models/api.models';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { WritableSignal } from '@angular/core';

function makeApiService(): BackendApiService {
    return { merge: vi.fn() } as unknown as BackendApiService;
}

function makeDialogRef(): { close: ReturnType<typeof vi.fn> } {
    return { close: vi.fn() };
}

const DEFAULT_DATA: AcceptMergeDialogData = {
    trainId: 'train-1',
    branchId: 'branch-1',
    branchName: 'BLS-variant',
    reviewedVersion: 'v-002',
};

function createComponent(
    data: AcceptMergeDialogData = DEFAULT_DATA,
    apiService: BackendApiService = makeApiService(),
    dialogRef: { close: ReturnType<typeof vi.fn> } = makeDialogRef(),
): {
    fixture: ComponentFixture<AcceptMergeModalComponent>;
    apiService: BackendApiService;
    dialogRef: { close: ReturnType<typeof vi.fn> };
} {
    TestBed.configureTestingModule({
        imports: [AcceptMergeModalComponent],
        providers: [
            provideAnimationsAsync(),
            { provide: MAT_DIALOG_DATA, useValue: data },
            { provide: MatDialogRef, useValue: dialogRef },
            { provide: BackendApiService, useValue: apiService },
        ],
    });
    const fixture = TestBed.createComponent(AcceptMergeModalComponent);
    fixture.detectChanges();
    return { fixture, apiService, dialogRef };
}

function setComment(fixture: ComponentFixture<AcceptMergeModalComponent>, comment: string): void {
    const comp = fixture.componentInstance as unknown as {
        model: WritableSignal<{ comment: string }>;
    };
    comp.model.set({ comment });
    fixture.detectChanges();
}

const STUB_TRAIN = { trainId: 'train-1', branches: [], mainTimestamp: '' } as unknown as TrainListElement;

describe('AcceptMergeModalComponent', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('creates the component with form initially invalid', () => {
        const { fixture } = createComponent();
        expect(fixture.componentInstance).toBeTruthy();
        const form = (fixture.componentInstance as unknown as { acceptForm: (() => { invalid(): boolean }) }).acceptForm;
        expect(form().invalid()).toBe(true);
    });

    it('shows branch name in warning paragraph', async () => {
        const { fixture } = createComponent();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('BLS-variant');
    });

    it('shows required error after submit with empty comment', async () => {
        const { fixture } = createComponent();
        const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="button"]:last-of-type');
        submitBtn.click();
        await fixture.whenStable();
        fixture.detectChanges();
        const errors = fixture.nativeElement.querySelectorAll('mat-error');
        expect(errors.length).toBeGreaterThan(0);
    });

    it('calls apiService.merge with correct parameters including reviewedVersion', async () => {
        const apiService = makeApiService();
        (apiService.merge as ReturnType<typeof vi.fn>).mockReturnValue(of(STUB_TRAIN));
        const dialogRef = makeDialogRef();
        const { fixture } = createComponent(DEFAULT_DATA, apiService, dialogRef);

        setComment(fixture, 'Accepting merge');
        await fixture.whenStable();

        const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="button"]:last-of-type');
        submitBtn.click();
        await fixture.whenStable();

        expect(apiService.merge).toHaveBeenCalledWith('train-1', 'branch-1', 'v-002', 'Accepting merge');
    });

    it('calls dialogRef.close with "success" after successful submission', async () => {
        const apiService = makeApiService();
        (apiService.merge as ReturnType<typeof vi.fn>).mockReturnValue(of(STUB_TRAIN));
        const dialogRef = makeDialogRef();
        const { fixture } = createComponent(DEFAULT_DATA, apiService, dialogRef);

        setComment(fixture, 'Accepting merge');
        await fixture.whenStable();

        const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="button"]:last-of-type');
        submitBtn.click();
        await fixture.whenStable();

        expect(dialogRef.close).toHaveBeenCalledWith('success');
    });

    it('does not call dialogRef.close on API error', async () => {
        const apiService = makeApiService();
        (apiService.merge as ReturnType<typeof vi.fn>).mockReturnValue(throwError(() => new Error('API error')));
        const dialogRef = makeDialogRef();
        const { fixture } = createComponent(DEFAULT_DATA, apiService, dialogRef);

        setComment(fixture, 'Accepting merge');
        await fixture.whenStable();

        const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="button"]:last-of-type');
        submitBtn.click();
        await fixture.whenStable();

        expect(dialogRef.close).not.toHaveBeenCalled();
    });
});

