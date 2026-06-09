import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { vi } from 'vitest';
import { settingsGuard } from './settings.guard';
import { SettingsService } from '../settings/settings.service';

describe('settingsGuard', () => {
    let hasConfiguredSettings: ReturnType<typeof vi.fn>;
    let openSpy: ReturnType<typeof vi.fn>;
    let afterAllClosed$: Subject<void>;

    beforeEach(() => {
        afterAllClosed$ = new Subject<void>();
        hasConfiguredSettings = vi.fn();
        openSpy = vi.fn().mockReturnValue({ disableClose: false } as MatDialogRef<unknown>);

        TestBed.configureTestingModule({
            providers: [
                { provide: SettingsService, useValue: { hasConfiguredSettings } },
                { provide: MatDialog, useValue: { open: openSpy, afterAllClosed: afterAllClosed$.asObservable() } },
            ],
        });
    });

    function runGuard(): boolean | { subscribe: (fn: (v: boolean) => void) => void } {
        return TestBed.runInInjectionContext(() =>
            (settingsGuard as (a: ActivatedRouteSnapshot, s: RouterStateSnapshot) => unknown)(
                {} as ActivatedRouteSnapshot,
                {} as RouterStateSnapshot,
            ),
        ) as boolean | { subscribe: (fn: (v: boolean) => void) => void };
    }

    it('returns true immediately when settings are configured', () => {
        hasConfiguredSettings.mockReturnValue(true);
        const result = runGuard();
        expect(result).toBe(true);
        expect(openSpy).not.toHaveBeenCalled();
    });

    it('opens the settings modal when settings are not configured', () => {
        hasConfiguredSettings.mockReturnValue(false);
        runGuard();
        expect(openSpy).toHaveBeenCalledTimes(1);
    });

    it('blocks navigation (emits false) when the modal is closed without completing settings', () =>
        new Promise<void>((resolve) => {
            hasConfiguredSettings.mockReturnValue(false);
            const result$ = runGuard() as { subscribe: (fn: (v: boolean) => void) => void };
            result$.subscribe((value: boolean) => {
                expect(value).toBe(false);
                resolve();
            });
            afterAllClosed$.next();
        }),
    );
});


