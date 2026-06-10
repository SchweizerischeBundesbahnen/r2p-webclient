import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EditStopModal, EditStopDialogData } from './edit-stop-modal';
import { Location, LOCATION_TYPES } from '../../models/api.models';

interface FieldState { value(): string }
interface StopFormComp { stopForm: { name(): FieldState; code(): FieldState; type(): FieldState } }

const STUB_LOCATION: Location = { type: 'UIC', code: '8507000', name: 'Bern' };

function makeDialogRef() {
    return { close: vi.fn() };
}

function createComponent(
    location: Location = STUB_LOCATION,
    dialogRef = makeDialogRef(),
    isNew = false,
): { fixture: ComponentFixture<EditStopModal>; dialogRef: ReturnType<typeof makeDialogRef> } {
    const data: EditStopDialogData = { location, isNew };
    TestBed.configureTestingModule({
        imports: [EditStopModal],
        providers: [
            provideAnimationsAsync(),
            { provide: MAT_DIALOG_DATA, useValue: data },
            { provide: MatDialogRef, useValue: dialogRef },
        ],
    });
    const fixture = TestBed.createComponent(EditStopModal);
    fixture.detectChanges();
    return { fixture, dialogRef };
}

describe('EditStopModal', () => {
    afterEach(() => TestBed.resetTestingModule());

    describe('title', () => {
        it('shows "Edit Stop" title when isNew is false', () => {
            const { fixture } = createComponent(STUB_LOCATION, makeDialogRef(), false);
            const title: HTMLElement = fixture.nativeElement.querySelector('[mat-dialog-title]');
            expect(title.textContent?.trim()).toBe('Edit Stop');
        });

        it('shows "Add Stop" title when isNew is true', () => {
            const { fixture } = createComponent(STUB_LOCATION, makeDialogRef(), true);
            const title: HTMLElement = fixture.nativeElement.querySelector('[mat-dialog-title]');
            expect(title.textContent?.trim()).toBe('Add Stop');
        });
    });

    describe('initialization', () => {
        it('creates the component', () => {
            const { fixture } = createComponent();
            expect(fixture.componentInstance).toBeTruthy();
        });

        it('pre-fills the name form field from location.name', () => {
            const { fixture } = createComponent();
            const comp = fixture.componentInstance as unknown as StopFormComp;
            expect(comp.stopForm.name().value()).toBe('Bern');
        });

        it('pre-fills the code form field from location.code', () => {
            const { fixture } = createComponent();
            const comp = fixture.componentInstance as unknown as StopFormComp;
            expect(comp.stopForm.code().value()).toBe('8507000');
        });

        it('pre-fills the type form field from location.type', () => {
            const { fixture } = createComponent();
            const comp = fixture.componentInstance as unknown as StopFormComp;
            expect(comp.stopForm.type().value()).toBe('UIC');
        });

        it('sets type form field to empty string when location has no type', () => {
            const { fixture } = createComponent({ code: '123', name: 'No Type' });
            const comp = fixture.componentInstance as unknown as StopFormComp;
            expect(comp.stopForm.type().value()).toBe('');
        });

        it('pre-fills the name input element', () => {
            const { fixture } = createComponent();
            const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#stop-name');
            expect(nameInput.value).toBe('Bern');
        });

        it('pre-fills the code input element', () => {
            const { fixture } = createComponent();
            const codeInput: HTMLInputElement = fixture.nativeElement.querySelector('#stop-code');
            expect(codeInput.value).toBe('8507000');
        });
    });

    describe('user interaction – name input', () => {
        it('updates name form field on input event', () => {
            const { fixture } = createComponent();
            const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#stop-name');
            nameInput.value = 'Zürich HB';
            nameInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            const comp = fixture.componentInstance as unknown as StopFormComp;
            expect(comp.stopForm.name().value()).toBe('Zürich HB');
        });
    });

    describe('user interaction – code input', () => {
        it('updates code form field on input event', () => {
            const { fixture } = createComponent();
            const codeInput: HTMLInputElement = fixture.nativeElement.querySelector('#stop-code');
            codeInput.value = 'NEW_CODE';
            codeInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            const comp = fixture.componentInstance as unknown as StopFormComp;
            expect(comp.stopForm.code().value()).toBe('NEW_CODE');
        });
    });

    describe('cancel button', () => {
        it('calls dialogRef.close() without arguments when Cancel is clicked', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent(STUB_LOCATION, dr);
            const buttons: NodeListOf<HTMLButtonElement> =
                fixture.nativeElement.querySelectorAll('button');
            const cancelBtn = Array.from(buttons).find((b) => b.textContent?.includes('Cancel'));
            cancelBtn?.click();
            expect(dr.close).toHaveBeenCalledOnce();
            expect(dr.close).toHaveBeenCalledWith();
        });
    });

    describe('save button', () => {
        it('is enabled even when required fields are empty', () => {
            const { fixture } = createComponent({}, makeDialogRef(), true);
            fixture.detectChanges();

            const buttons: NodeListOf<HTMLButtonElement> =
                fixture.nativeElement.querySelectorAll('button');
            const saveBtn = Array.from(buttons).find((b) => b.textContent?.includes('Save'));
            expect(saveBtn?.disabled).toBe(false);
        });

        it('calls dialogRef.close with updated location when Save is clicked', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent(STUB_LOCATION, dr);

            const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#stop-name');
            nameInput.value = 'Zürich HB';
            nameInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const buttons: NodeListOf<HTMLButtonElement> =
                fixture.nativeElement.querySelectorAll('button');
            const saveBtn = Array.from(buttons).find((b) => b.textContent?.includes('Save'));
            saveBtn?.click();

            expect(dr.close).toHaveBeenCalledOnce();
            const emitted = dr.close.mock.calls[0][0] as Location;
            expect(emitted.name).toBe('Zürich HB');
            expect(emitted.type).toBe('UIC');
            expect(emitted.code).toBe('8507000');
        });

        it('shows required error and does not close when name is empty on submit', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent(STUB_LOCATION, dr);

            const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#stop-name');
            nameInput.value = '';
            nameInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const buttons: NodeListOf<HTMLButtonElement> =
                fixture.nativeElement.querySelectorAll('button');
            const saveBtn = Array.from(buttons).find((b) => b.textContent?.includes('Save'));
            saveBtn?.click();
            fixture.detectChanges();

            const errors = fixture.nativeElement.querySelectorAll('mat-error');
            expect(errors.length).toBeGreaterThan(0);
            expect(dr.close).not.toHaveBeenCalled();
        });

        it('shows required error and does not close when code is empty on submit', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent(STUB_LOCATION, dr);

            const codeInput: HTMLInputElement = fixture.nativeElement.querySelector('#stop-code');
            codeInput.value = '';
            codeInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const buttons: NodeListOf<HTMLButtonElement> =
                fixture.nativeElement.querySelectorAll('button');
            const saveBtn = Array.from(buttons).find((b) => b.textContent?.includes('Save'));
            saveBtn?.click();
            fixture.detectChanges();

            const errors = fixture.nativeElement.querySelectorAll('mat-error');
            expect(errors.length).toBeGreaterThan(0);
            expect(dr.close).not.toHaveBeenCalled();
        });

        it('shows required errors and does not close when submitting an empty form', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent({}, dr, true);
            fixture.detectChanges();

            const buttons: NodeListOf<HTMLButtonElement> =
                fixture.nativeElement.querySelectorAll('button');
            const saveBtn = Array.from(buttons).find((b) => b.textContent?.includes('Save'));
            saveBtn?.click();
            fixture.detectChanges();

            const errors = fixture.nativeElement.querySelectorAll('mat-error');
            expect(errors.length).toBeGreaterThanOrEqual(2);
            expect(dr.close).not.toHaveBeenCalled();
        });

        it('preserves other location properties (e.g. typeCode) when saving', () => {
            const location: Location = { type: 'UIC', typeCode: 'TC1', code: '8507000', name: 'Bern' };
            const dr = makeDialogRef();
            const { fixture } = createComponent(location, dr);

            const buttons: NodeListOf<HTMLButtonElement> =
                fixture.nativeElement.querySelectorAll('button');
            const saveBtn = Array.from(buttons).find((b) => b.textContent?.includes('Save'));
            saveBtn?.click();

            const emitted = dr.close.mock.calls[0][0] as Location;
            expect(emitted.typeCode).toBe('TC1');
        });

        it('pre-selects each available location type in the form field', () => {
            for (const type of LOCATION_TYPES) {
                TestBed.resetTestingModule();
                const { fixture } = createComponent({ type, code: 'X', name: 'X' });
                const comp = fixture.componentInstance as unknown as StopFormComp;
                expect(comp.stopForm.type().value()).toBe(type);
            }
        });
    });
});
