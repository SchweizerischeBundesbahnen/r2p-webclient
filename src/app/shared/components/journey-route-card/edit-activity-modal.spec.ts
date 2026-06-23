import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EditActivityModal, EditActivityDialogData } from './edit-activity-modal';
import { Activity } from '../../models/api.models';
import { CapabilityType } from './journey-activity-item';

function makeDialogRef() {
    return { close: vi.fn() };
}

function createComponent(
    capabilityType: CapabilityType,
    activity: Activity | null = null,
    dialogRef = makeDialogRef(),
): { fixture: ComponentFixture<EditActivityModal>; dialogRef: ReturnType<typeof makeDialogRef> } {
    const data: EditActivityDialogData = { activity, capabilityType, partners: ['SBB', 'BLS'] };
    TestBed.configureTestingModule({
        imports: [EditActivityModal],
        providers: [
            provideAnimationsAsync(),
            { provide: MAT_DIALOG_DATA, useValue: data },
            { provide: MatDialogRef, useValue: dialogRef },
        ],
    });
    const fixture = TestBed.createComponent(EditActivityModal);
    fixture.detectChanges();
    return { fixture, dialogRef };
}

function clickSave(fixture: ComponentFixture<EditActivityModal>): void {
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const saveBtn = Array.from(buttons).find((b) => b.textContent?.includes('Save Activity'));
    saveBtn?.click();
}

function fillPathFields(fixture: ComponentFixture<EditActivityModal>): void {
    const inputs = fixture.nativeElement.querySelectorAll('input[type="number"]') as NodeListOf<HTMLInputElement>;
    // path section renders length, weight, maxSpeed in order
    [165400, 384000, 140].forEach((val, i) => {
        if (inputs[i]) {
            inputs[i].value = String(val);
            inputs[i].dispatchEvent(new Event('input'));
        }
    });
    fixture.detectChanges();
}

const STUB_EXISTING: Activity = {
    id: 'existing-id',
    timings: [],
    relations: [],
    responsibility: { type: 'rru', id: 'SBB', status: 'proposed' },
    capability: {
        type: 'rollingStock',
        capabilityFeatures: [],
        rollingStock: { activityType: 'rollingStock', units: [] },
    },
};

describe('EditActivityModal', () => {
    afterEach(() => TestBed.resetTestingModule());

    describe('partner dropdown', () => {
        it('uses the partners from dialog data when provided', () => {
            TestBed.resetTestingModule();
            const data: EditActivityDialogData = {
                activity: null,
                capabilityType: 'rollingStock',
                partners: ['SBB', 'BLS'],
            };
            TestBed.configureTestingModule({
                imports: [EditActivityModal],
                providers: [
                    provideAnimationsAsync(),
                    { provide: MAT_DIALOG_DATA, useValue: data },
                    { provide: MatDialogRef, useValue: makeDialogRef() },
                ],
            });
            const fixture = TestBed.createComponent(EditActivityModal);
            fixture.detectChanges();
            const component = fixture.componentInstance as unknown as { partners: string[] };
            expect(component.partners).toEqual(['SBB', 'BLS']);
        });

        it('uses empty array when dialog data provides no partners', () => {
            TestBed.resetTestingModule();
            const data: EditActivityDialogData = {
                activity: null,
                capabilityType: 'rollingStock',
            };
            TestBed.configureTestingModule({
                imports: [EditActivityModal],
                providers: [
                    provideAnimationsAsync(),
                    { provide: MAT_DIALOG_DATA, useValue: data },
                    { provide: MatDialogRef, useValue: makeDialogRef() },
                ],
            });
            const fixture = TestBed.createComponent(EditActivityModal);
            fixture.detectChanges();
            const component = fixture.componentInstance as unknown as { partners: string[] };
            expect(component.partners).toEqual([]);
        });

        it('defaults responsibility id to the first partner when creating a new activity', () => {
            TestBed.resetTestingModule();
            const dr = makeDialogRef();
            const data: EditActivityDialogData = {
                activity: null,
                capabilityType: 'rollingStock',
                partners: ['BLS', 'SBB'],
            };
            TestBed.configureTestingModule({
                imports: [EditActivityModal],
                providers: [
                    provideAnimationsAsync(),
                    { provide: MAT_DIALOG_DATA, useValue: data },
                    { provide: MatDialogRef, useValue: dr },
                ],
            });
            const fixture = TestBed.createComponent(EditActivityModal);
            fixture.detectChanges();
            clickSave(fixture);
            const emitted = dr.close.mock.calls[0][0] as Activity;
            expect(emitted.responsibility?.id).toBe('BLS');
        });

        it('leaves responsibility id empty when no partners provided, preventing form submission', () => {
            TestBed.resetTestingModule();
            const dr = makeDialogRef();
            const data: EditActivityDialogData = {
                activity: null,
                capabilityType: 'rollingStock',
            };
            TestBed.configureTestingModule({
                imports: [EditActivityModal],
                providers: [
                    provideAnimationsAsync(),
                    { provide: MAT_DIALOG_DATA, useValue: data },
                    { provide: MatDialogRef, useValue: dr },
                ],
            });
            const fixture = TestBed.createComponent(EditActivityModal);
            fixture.detectChanges();
            clickSave(fixture);
            expect(dr.close).not.toHaveBeenCalled();
        });
    });

    describe('title', () => {
        it('shows "Add <Type> Activity" for each capability type when creating new', () => {
            const cases: [CapabilityType, string][] = [
                ['rollingStock', 'Add Rolling Stock Activity'],
                ['staff', 'Add Staff Activity'],
                ['path', 'Add Path Activity'],
            ];
            for (const [type, expected] of cases) {
                TestBed.resetTestingModule();
                const { fixture } = createComponent(type);
                const title: HTMLElement = fixture.nativeElement.querySelector('[mat-dialog-title]');
                expect(title.textContent?.trim()).toBe(expected);
            }
        });

        it('shows "Edit Rolling Stock Activity" when editing an existing activity', () => {
            const { fixture } = createComponent('rollingStock', STUB_EXISTING);
            const title: HTMLElement = fixture.nativeElement.querySelector('[mat-dialog-title]');
            expect(title.textContent?.trim()).toBe('Edit Rolling Stock Activity');
        });
    });

    describe('new activity — required backend fields', () => {
        it('generates a non-empty id and sets rollingStock activityType "rollingStock"', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent('rollingStock', null, dr);
            clickSave(fixture);
            const emitted = dr.close.mock.calls[0][0] as Activity;
            expect(emitted.id).toBeTruthy();
            expect(emitted.capability?.rollingStock?.activityType).toBe('rollingStock');
        });

        it('sets staff type and activityType "move" when a role is selected', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent('staff', null, dr);
            const component = fixture.componentInstance as unknown as {
                staffRole: { set: (v: string) => void };
            };
            component.staffRole.set('driver');
            fixture.detectChanges();
            clickSave(fixture);
            const emitted = dr.close.mock.calls[0][0] as Activity;
            expect(emitted.id).toBeTruthy();
            expect(emitted.capability?.staff?.type).toBe('driver');
            expect(emitted.capability?.staff?.activityType).toBe('move');
        });

        it('sets path activityType "path.runthrough" for new path activity', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent('path', null, dr);
            fillPathFields(fixture);
            clickSave(fixture);
            const emitted = dr.close.mock.calls[0][0] as Activity;
            expect(emitted.id).toBeTruthy();
            expect(emitted.capability?.path?.activityType).toBe('path.runthrough');
        });

        it('sends timings as empty array when no timing is entered', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent('rollingStock', null, dr);
            clickSave(fixture);
            const emitted = dr.close.mock.calls[0][0] as Activity;
            expect(emitted.timings).toEqual([]);
        });

        it('sends relations as empty array', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent('rollingStock', null, dr);
            clickSave(fixture);
            const emitted = dr.close.mock.calls[0][0] as Activity;
            expect(emitted.relations).toEqual([]);
        });

        it('sends capabilityFeatures as empty array and rollingStock.units as empty array when no input given', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent('rollingStock', null, dr);
            clickSave(fixture);
            const emitted = dr.close.mock.calls[0][0] as Activity;
            expect(emitted.capability?.capabilityFeatures).toEqual([]);
            expect(emitted.capability?.rollingStock?.units).toEqual([]);
        });

        it('sends capabilityFeatures as empty array for new staff activity', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent('staff', null, dr);
            clickSave(fixture);
            const emitted = dr.close.mock.calls[0][0] as Activity;
            expect(emitted.capability?.capabilityFeatures).toEqual([]);
        });

        it('sends capabilityFeatures as empty array for new path activity', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent('path', null, dr);
            fillPathFields(fixture);
            clickSave(fixture);
            const emitted = dr.close.mock.calls[0][0] as Activity;
            expect(emitted.capability?.capabilityFeatures).toEqual([]);
        });
    });

    describe('editing existing activity — field preservation', () => {
        it('preserves id and the resource activityType from the existing activity', () => {
            const existing: Activity = {
                ...STUB_EXISTING,
                id: 'my-existing-id',
                capability: {
                    type: 'rollingStock',
                    capabilityFeatures: [],
                    rollingStock: { activityType: 'rollingStock.traction', units: [] },
                },
            };
            const dr = makeDialogRef();
            const { fixture } = createComponent('rollingStock', existing, dr);
            clickSave(fixture);
            const emitted = dr.close.mock.calls[0][0] as Activity;
            expect(emitted.id).toBe('my-existing-id');
            expect(emitted.capability?.rollingStock?.activityType).toBe('rollingStock.traction');
        });

        it('preserves existing relations', () => {
            const relations = [{ activityid: 'other-1', type: 'FS' }];
            const existing: Activity = { ...STUB_EXISTING, relations };
            const dr = makeDialogRef();
            const { fixture } = createComponent('rollingStock', existing, dr);
            clickSave(fixture);
            const emitted = dr.close.mock.calls[0][0] as Activity;
            expect(emitted.relations).toEqual(relations);
        });

        it('pre-fills responsibility fields from existing activity', () => {
            const existing: Activity = {
                ...STUB_EXISTING,
                responsibility: { type: 'ra', id: 'BLS', status: 'confirmed' },
            };
            const dr = makeDialogRef();
            const { fixture } = createComponent('rollingStock', existing, dr);
            clickSave(fixture);
            const emitted = dr.close.mock.calls[0][0] as Activity;
            expect(emitted.responsibility).toEqual({ type: 'ra', id: 'BLS', status: 'confirmed' });
        });
    });

    describe('rollingStock capability', () => {
        it('sets units from composition input when text is entered', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent('rollingStock', null, dr);
            const compositionInput: HTMLInputElement = fixture.nativeElement.querySelector(
                'input[placeholder="e.g., RABDe 502"]',
            );
            compositionInput.value = 'RABe 502';
            compositionInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            clickSave(fixture);
            const emitted = dr.close.mock.calls[0][0] as Activity;
            const unit = emitted.capability?.rollingStock?.units?.[0];
            expect(unit?.name).toBe('RABe 502');
            expect(typeof unit?.id).toBe('string');
            expect(unit?.carbodies).toEqual([]);
            expect(unit?.capabilityFeatures).toEqual([]);
            expect(unit?.featuresetRefs).toEqual([]);
        });

        it('preserves existing units when composition input is left empty', () => {
            const existing: Activity = {
                ...STUB_EXISTING,
                capability: {
                    type: 'rollingStock',
                    capabilityFeatures: [],
                    rollingStock: { activityType: 'rollingStock', units: [{ name: 'RABe 511' }] },
                },
            };
            const dr = makeDialogRef();
            const { fixture } = createComponent('rollingStock', existing, dr);
            clickSave(fixture);
            const emitted = dr.close.mock.calls[0][0] as Activity;
            expect(emitted.capability?.rollingStock?.units).toEqual([{ name: 'RABe 511' }]);
        });
    });

    describe('cancel button', () => {
        it('calls dialogRef.close() without arguments', () => {
            const dr = makeDialogRef();
            const { fixture } = createComponent('rollingStock', null, dr);
            const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
            const cancelBtn = Array.from(buttons).find((b) => b.textContent?.includes('Cancel'));
            cancelBtn?.click();
            expect(dr.close).toHaveBeenCalledOnce();
            expect(dr.close).toHaveBeenCalledWith();
        });
    });
});
