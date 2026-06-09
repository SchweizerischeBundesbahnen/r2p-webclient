import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EditLocationModal } from './edit-location-modal';
import { Location, LOCATION_TYPES } from '../../models/api.models';

const STUB_LOCATION: Location = { type: 'UIC', code: '8507000', name: 'Bern' };

function createComponent(location: Location = STUB_LOCATION): ComponentFixture<EditLocationModal> {
    TestBed.configureTestingModule({
        imports: [EditLocationModal],
    });
    const fixture = TestBed.createComponent(EditLocationModal);
    fixture.componentRef.setInput('location', location);
    fixture.detectChanges();
    return fixture;
}

describe('EditLocationModal', () => {
    describe('initialization', () => {
        it('creates the component', () => {
            const fixture = createComponent();
            expect(fixture.componentInstance).toBeTruthy();
        });

        it('pre-fills the code input with the location code', () => {
            const fixture = createComponent();
            const codeInput: HTMLInputElement = fixture.nativeElement.querySelector('#loc-code');
            expect(codeInput.value).toBe('8507000');
        });

        it('pre-fills the name input with the location name', () => {
            const fixture = createComponent();
            const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#loc-name');
            expect(nameInput.value).toBe('Bern');
        });

        it('pre-selects the correct type option in the select', () => {
            const fixture = createComponent({ type: 'PLC', code: '001', name: 'Test' });
            const select: HTMLSelectElement = fixture.nativeElement.querySelector('#loc-type');
            expect(select.value).toBe('PLC');
        });

        it('pre-selects each available type correctly', () => {
            for (const type of LOCATION_TYPES) {
                TestBed.resetTestingModule();
                const fixture = createComponent({ type, code: 'X', name: 'X' });
                const select: HTMLSelectElement = fixture.nativeElement.querySelector('#loc-type');
                expect(select.value).toBe(type);
            }
        });

        it('selects the blank option when location has no type', () => {
            const fixture = createComponent({ code: '123', name: 'No Type' });
            const select: HTMLSelectElement = fixture.nativeElement.querySelector('#loc-type');
            expect(select.value).toBe('');
        });

        it('shows all location type options plus the blank option', () => {
            const fixture = createComponent();
            const options: HTMLOptionElement[] = Array.from(
                fixture.nativeElement.querySelectorAll('#loc-type option'),
            );
            const values = options.map((o) => o.value);
            expect(values).toContain('');
            for (const type of LOCATION_TYPES) {
                expect(values).toContain(type);
            }
            expect(options.length).toBe(LOCATION_TYPES.length + 1);
        });
    });

    describe('user interaction – type select', () => {
        let fixture: ComponentFixture<EditLocationModal>;

        beforeEach(() => {
            fixture = createComponent();
        });

        it('updates editedType signal when a new type is selected', () => {
            const select: HTMLSelectElement = fixture.nativeElement.querySelector('#loc-type');
            select.value = 'SLC';
            select.dispatchEvent(new Event('change'));
            fixture.detectChanges();

            const comp = fixture.componentInstance as unknown as { editedType: () => string };
            expect(comp.editedType()).toBe('SLC');
        });

        it('updates editedType signal to empty string when blank option is selected', () => {
            const select: HTMLSelectElement = fixture.nativeElement.querySelector('#loc-type');
            select.value = '';
            select.dispatchEvent(new Event('change'));
            fixture.detectChanges();

            const comp = fixture.componentInstance as unknown as { editedType: () => string };
            expect(comp.editedType()).toBe('');
        });
    });

    describe('user interaction – code input', () => {
        let fixture: ComponentFixture<EditLocationModal>;

        beforeEach(() => {
            fixture = createComponent();
        });

        it('updates editedCode signal on input', () => {
            const codeInput: HTMLInputElement = fixture.nativeElement.querySelector('#loc-code');
            codeInput.value = 'NEW_CODE';
            codeInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const comp = fixture.componentInstance as unknown as { editedCode: () => string };
            expect(comp.editedCode()).toBe('NEW_CODE');
        });
    });

    describe('user interaction – name input', () => {
        let fixture: ComponentFixture<EditLocationModal>;

        beforeEach(() => {
            fixture = createComponent();
        });

        it('updates editedName signal on input', () => {
            const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#loc-name');
            nameInput.value = 'Zürich HB';
            nameInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const comp = fixture.componentInstance as unknown as { editedName: () => string };
            expect(comp.editedName()).toBe('Zürich HB');
        });
    });

    describe('cancel button', () => {
        it('emits cancelled when the close (✕) button is clicked', () => {
            const fixture = createComponent();
            const cancelledSpy = vi.fn();
            fixture.componentInstance.cancelled.subscribe(cancelledSpy);

            const closeBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.modal-close');
            closeBtn.click();

            expect(cancelledSpy).toHaveBeenCalledOnce();
        });

        it('emits cancelled when the footer Cancel button is clicked', () => {
            const fixture = createComponent();
            const cancelledSpy = vi.fn();
            fixture.componentInstance.cancelled.subscribe(cancelledSpy);

            const cancelBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
                '.modal-footer .btn-ghost',
            );
            cancelBtn.click();

            expect(cancelledSpy).toHaveBeenCalledOnce();
        });
    });

    describe('save button', () => {
        it('emits locationSaved with updated values when Save is clicked', () => {
            const fixture = createComponent();
            const savedSpy = vi.fn();
            fixture.componentInstance.locationSaved.subscribe(savedSpy);

            // Change name
            const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#loc-name');
            nameInput.value = 'Zürich HB';
            nameInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const saveBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
                '.modal-footer .btn-primary',
            );
            saveBtn.click();

            expect(savedSpy).toHaveBeenCalledOnce();
            const emitted = savedSpy.mock.calls[0][0] as Location;
            expect(emitted.name).toBe('Zürich HB');
            expect(emitted.type).toBe('UIC');
            expect(emitted.code).toBe('8507000');
        });

        it('emits locationSaved with type undefined when blank type is saved', () => {
            const fixture = createComponent({ type: 'UIC', code: '123', name: 'X' });
            const savedSpy = vi.fn();
            fixture.componentInstance.locationSaved.subscribe(savedSpy);

            const select: HTMLSelectElement = fixture.nativeElement.querySelector('#loc-type');
            select.value = '';
            select.dispatchEvent(new Event('change'));
            fixture.detectChanges();

            (fixture.nativeElement.querySelector('.modal-footer .btn-primary') as HTMLButtonElement).click();

            expect(savedSpy).toHaveBeenCalledOnce();
            const emitted = savedSpy.mock.calls[0][0] as Location;
            expect(emitted.type).toBeUndefined();
        });

        it('emits locationSaved with code undefined when code is cleared', () => {
            const fixture = createComponent();
            const savedSpy = vi.fn();
            fixture.componentInstance.locationSaved.subscribe(savedSpy);

            const codeInput: HTMLInputElement = fixture.nativeElement.querySelector('#loc-code');
            codeInput.value = '';
            codeInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            (fixture.nativeElement.querySelector('.modal-footer .btn-primary') as HTMLButtonElement).click();

            expect(savedSpy).toHaveBeenCalledOnce();
            const emitted = savedSpy.mock.calls[0][0] as Location;
            expect(emitted.code).toBeUndefined();
        });

        it('emits locationSaved with name undefined when name is cleared', () => {
            const fixture = createComponent();
            const savedSpy = vi.fn();
            fixture.componentInstance.locationSaved.subscribe(savedSpy);

            const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#loc-name');
            nameInput.value = '';
            nameInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            (fixture.nativeElement.querySelector('.modal-footer .btn-primary') as HTMLButtonElement).click();

            expect(savedSpy).toHaveBeenCalledOnce();
            const emitted = savedSpy.mock.calls[0][0] as Location;
            expect(emitted.name).toBeUndefined();
        });

        it('preserves other location properties (e.g. typeCode) when saving', () => {
            const location: Location = { type: 'UIC', typeCode: 'TC1', code: '8507000', name: 'Bern' };
            const fixture = createComponent(location);
            const savedSpy = vi.fn();
            fixture.componentInstance.locationSaved.subscribe(savedSpy);

            (fixture.nativeElement.querySelector('.modal-footer .btn-primary') as HTMLButtonElement).click();

            const emitted = savedSpy.mock.calls[0][0] as Location;
            expect(emitted.typeCode).toBe('TC1');
        });
    });

    describe('input reactivity', () => {
        it('resets fields when the location input changes', async () => {
            const fixture = createComponent({ type: 'UIC', code: 'OLD', name: 'Old Name' });

            // Mutate the code field
            const codeInput: HTMLInputElement = fixture.nativeElement.querySelector('#loc-code');
            codeInput.value = 'CHANGED';
            codeInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            // Now update the input to a new location
            fixture.componentRef.setInput('location', { type: 'PLC', code: 'NEW', name: 'New Name' });
            fixture.detectChanges();
            await fixture.whenStable();

            const comp = fixture.componentInstance as unknown as {
                editedCode: () => string;
                editedType: () => string;
                editedName: () => string;
            };
            expect(comp.editedCode()).toBe('NEW');
            expect(comp.editedType()).toBe('PLC');
            expect(comp.editedName()).toBe('New Name');
        });
    });
});

