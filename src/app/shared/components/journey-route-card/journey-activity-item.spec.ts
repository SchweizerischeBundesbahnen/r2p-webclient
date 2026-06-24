import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JourneyActivityItem } from './journey-activity-item';
import { Activity } from '../../models/api.models';

const ACTIVITY: Activity = {
    capability: { type: 'staff' },
    responsibility: { type: 'rru', id: 'BLS' },
};

describe('JourneyActivityItem', () => {
    let fixture: ComponentFixture<JourneyActivityItem>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [JourneyActivityItem],
            providers: [provideAnimationsAsync()],
        }).compileComponents();

        fixture = TestBed.createComponent(JourneyActivityItem);
        fixture.componentRef.setInput('activity', ACTIVITY);
        fixture.componentRef.setInput('capabilityType', 'staff');
    });

    afterEach(() => TestBed.resetTestingModule());

    const editBtn = (el: HTMLElement) => el.querySelector('.btn-icon:not(.btn-icon-danger)');
    const deleteBtn = (el: HTMLElement) => el.querySelector('.btn-icon-danger');

    it('shows no actions by default (canEdit and canDelete false)', () => {
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement;
        expect(el.querySelector('.activity-actions')).toBeNull();
    });

    it('shows only the edit button when canEdit is true', () => {
        fixture.componentRef.setInput('canEdit', true);
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement;
        expect(editBtn(el)).not.toBeNull();
        expect(deleteBtn(el)).toBeNull();
    });

    it('shows only the delete button when canDelete is true', () => {
        fixture.componentRef.setInput('canDelete', true);
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement;
        expect(editBtn(el)).toBeNull();
        expect(deleteBtn(el)).not.toBeNull();
    });

    it('emits editActivity and deleteActivity when the respective buttons are clicked', () => {
        fixture.componentRef.setInput('canEdit', true);
        fixture.componentRef.setInput('canDelete', true);
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement;

        const editSpy = vi.fn();
        const deleteSpy = vi.fn();
        fixture.componentInstance.editActivity.subscribe(editSpy);
        fixture.componentInstance.deleteActivity.subscribe(deleteSpy);

        (editBtn(el) as HTMLButtonElement).click();
        (deleteBtn(el) as HTMLButtonElement).click();

        expect(editSpy).toHaveBeenCalledOnce();
        expect(deleteSpy).toHaveBeenCalledOnce();
    });
});
