import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorNotificationService } from './error-notification.service';

describe('ErrorNotificationService', () => {
    let service: ErrorNotificationService;

    beforeEach(() => {
        vi.useFakeTimers();
        TestBed.configureTestingModule({});
        service = TestBed.inject(ErrorNotificationService);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
        vi.useRealTimers();
    });

    it('starts with an empty error list', () => {
        expect(service.errors()).toEqual([]);
    });

    describe('showError', () => {
        it('adds a toast with type "error" and the given message', () => {
            service.showError('Something went wrong');
            const toasts = service.errors();
            expect(toasts).toHaveLength(1);
            expect(toasts[0].message).toBe('Something went wrong');
            expect(toasts[0].type).toBe('error');
            expect(toasts[0].id).toBeTruthy();
        });

        it('auto-dismisses after 8 seconds', () => {
            service.showError('Timeout error');
            vi.advanceTimersByTime(7999);
            expect(service.errors()).toHaveLength(1);
            vi.advanceTimersByTime(1);
            expect(service.errors()).toHaveLength(0);
        });
    });

    describe('showSuccess', () => {
        it('adds a toast with type "success" and the given message', () => {
            service.showSuccess('Saved successfully');
            const toasts = service.errors();
            expect(toasts).toHaveLength(1);
            expect(toasts[0].message).toBe('Saved successfully');
            expect(toasts[0].type).toBe('success');
        });

        it('auto-dismisses after 4 seconds', () => {
            service.showSuccess('Done');
            vi.advanceTimersByTime(3999);
            expect(service.errors()).toHaveLength(1);
            vi.advanceTimersByTime(1);
            expect(service.errors()).toHaveLength(0);
        });
    });

    describe('dismiss', () => {
        it('removes only the targeted toast by id', () => {
            service.showError('Error A');
            service.showError('Error B');
            const idA = service.errors()[0].id;
            service.dismiss(idA);
            expect(service.errors()).toHaveLength(1);
            expect(service.errors()[0].message).toBe('Error B');
        });

        it('is a no-op for an unknown id', () => {
            service.showError('Stays');
            service.dismiss('non-existent-id');
            expect(service.errors()).toHaveLength(1);
        });
    });

    it('multiple toasts from mixed calls coexist until dismissed', () => {
        service.showError('Error 1');
        service.showSuccess('Success 1');
        service.showError('Error 2');
        expect(service.errors()).toHaveLength(3);
        // Success auto-dismisses at 4s, errors survive until 8s
        vi.advanceTimersByTime(4000);
        expect(service.errors()).toHaveLength(2);
        expect(service.errors().every((e) => e.type === 'error')).toBe(true);
    });
});
