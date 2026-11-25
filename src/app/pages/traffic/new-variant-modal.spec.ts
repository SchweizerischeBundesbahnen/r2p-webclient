import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, provideRouter } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NewVariantModal, NewVariantDialogData } from './new-variant-modal';
import { BackendApiService } from '../../core/api/backend-api.service';
import { SettingsService } from '../../core/settings/settings.service';
import { Train } from '../../shared/models/api.models';

function makeApiService(): BackendApiService {
    return { createBranch: vi.fn() } as unknown as BackendApiService;
}

function makeDialogRef(): { close: ReturnType<typeof vi.fn> } {
    return { close: vi.fn() };
}

const STUB_TRAIN = {} as unknown as Train;

const DEFAULT_DATA: NewVariantDialogData = {
    trainId: 'train-1',
    mainBranchTrain: STUB_TRAIN,
};

function createComponent(
    data: NewVariantDialogData = DEFAULT_DATA,
    apiService: BackendApiService = makeApiService(),
    dialogRef: { close: ReturnType<typeof vi.fn> } = makeDialogRef(),
): {
    fixture: ComponentFixture<NewVariantModal>;
    apiService: BackendApiService;
    dialogRef: { close: ReturnType<typeof vi.fn> };
} {
    TestBed.configureTestingModule({
        imports: [NewVariantModal],
        providers: [
            provideAnimationsAsync(),
            provideRouter([]),
            { provide: MAT_DIALOG_DATA, useValue: data },
            { provide: MatDialogRef, useValue: dialogRef },
            { provide: BackendApiService, useValue: apiService },
            {
                provide: SettingsService,
                useValue: { settings: signal({ organization: 'SBB', serverUrl: '' }) },
            },
        ],
    });
    const fixture = TestBed.createComponent(NewVariantModal);
    fixture.detectChanges();
    return { fixture, apiService, dialogRef };
}

function setFormValues(
    fixture: ComponentFixture<NewVariantModal>,
    variantName: string,
    comment: string,
): void {
    const comp = fixture.componentInstance as unknown as {
        model: WritableSignal<{ variantName: string; comment: string }>;
    };
    comp.model.set({ variantName, comment });
    fixture.detectChanges();
}

describe('NewVariantModal', () => {
    afterEach(() => TestBed.resetTestingModule());

    it('form is initially invalid with both fields empty', () => {
        const { fixture } = createComponent();
        expect((fixture.componentInstance as unknown as { createTrainVariant: () => { invalid: () => boolean } }).createTrainVariant().invalid()).toBe(true);
    });

    it('shows validation errors and does not call API when submitting empty fields', async () => {
        const apiService = makeApiService();
        const { fixture } = createComponent(DEFAULT_DATA, apiService);
        const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
            'button[mat-raised-button]',
        );
        submitBtn.click();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('mat-error').length).toBeGreaterThan(0);
        expect(apiService.createBranch).not.toHaveBeenCalled();
    });

    it('shows max-length error and does not call API when variant name exceeds 255 characters', async () => {
        const apiService = makeApiService();
        const { fixture } = createComponent(DEFAULT_DATA, apiService);
        setFormValues(fixture, 'a'.repeat(256), 'some comment');
        const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
            'button[mat-raised-button]',
        );
        submitBtn.click();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('mat-error').length).toBeGreaterThan(0);
        expect(apiService.createBranch).not.toHaveBeenCalled();
    });

    it('calls createBranch with correct params, closes with "success" and navigates on valid submit', async () => {
        const apiService = makeApiService();
        (apiService.createBranch as ReturnType<typeof vi.fn>).mockReturnValue(
            of({ branchId: 'new-branch-1' }),
        );
        const dialogRef = makeDialogRef();
        const { fixture } = createComponent(DEFAULT_DATA, apiService, dialogRef);
        const router = TestBed.inject(Router);
        vi.spyOn(router, 'navigate');

        setFormValues(fixture, 'my-variant', 'testing this variant');
        await fixture.whenStable();

        const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
            'button[mat-raised-button]',
        );
        submitBtn.click();
        await fixture.whenStable();

        expect(apiService.createBranch).toHaveBeenCalledWith(
            'train-1',
            'my-variant',
            'testing this variant',
            STUB_TRAIN,
        );
        expect(dialogRef.close).toHaveBeenCalledWith('success');
        expect(router.navigate).toHaveBeenCalledWith(['/edit-train'], {
            queryParams: { trainId: 'train-1', branchId: 'new-branch-1' },
        });
    });

    it('does not close dialog or navigate on API error', async () => {
        const apiService = makeApiService();
        (apiService.createBranch as ReturnType<typeof vi.fn>).mockReturnValue(
            throwError(() => new Error('API error')),
        );
        const dialogRef = makeDialogRef();
        const { fixture } = createComponent(DEFAULT_DATA, apiService, dialogRef);
        const router = TestBed.inject(Router);
        vi.spyOn(router, 'navigate');

        setFormValues(fixture, 'my-variant', 'testing');
        await fixture.whenStable();

        const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
            'button[mat-raised-button]',
        );
        submitBtn.click();
        await fixture.whenStable();

        expect(dialogRef.close).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('cancel button does not call API', async () => {
        const apiService = makeApiService();
        const { fixture } = createComponent(DEFAULT_DATA, apiService);
        const cancelBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
            'button[mat-dialog-close]',
        );
        cancelBtn.click();
        await fixture.whenStable();
        expect(apiService.createBranch).not.toHaveBeenCalled();
    });
});
