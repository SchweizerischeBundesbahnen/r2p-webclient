import { TestBed } from '@angular/core/testing';
import { EventTypes, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { AuthSessionService } from './auth-session.service';

const REDIRECT_COUNT_KEY = 'r2p-auth-redirect-count';

interface OidcEvent {
    type: EventTypes;
    value: unknown;
}

describe('AuthSessionService', () => {
    let authorizeSpy: ReturnType<typeof vi.fn>;
    let onReauthFailed: Mock<() => void>;
    let events$: Subject<OidcEvent>;
    let service: AuthSessionService;

    beforeEach(() => {
        authorizeSpy = vi.fn();
        onReauthFailed = vi.fn<() => void>();
        events$ = new Subject<OidcEvent>();
        sessionStorage.removeItem(REDIRECT_COUNT_KEY);

        TestBed.configureTestingModule({
            providers: [
                AuthSessionService,
                { provide: OidcSecurityService, useValue: { authorize: authorizeSpy } },
                { provide: PublicEventsService, useValue: { registerForEvents: () => events$.asObservable() } },
            ],
        });
        service = TestBed.inject(AuthSessionService);
    });

    describe('initialize / silent-renew failure handling', () => {
        it('triggers a re-auth redirect when a SilentRenewFailed event fires', () => {
            service.initialize(onReauthFailed);
            events$.next({ type: EventTypes.SilentRenewFailed, value: null });

            expect(authorizeSpy).toHaveBeenCalledTimes(1);
            expect(service.redirectInProgress()).toBe(true);
            expect(onReauthFailed).not.toHaveBeenCalled();
        });

        it('ignores unrelated OIDC events', () => {
            service.initialize(onReauthFailed);
            events$.next({ type: EventTypes.SilentRenewStarted, value: null });

            expect(authorizeSpy).not.toHaveBeenCalled();
            expect(service.redirectInProgress()).toBe(false);
        });

        it('invokes the failure callback when a background authorize() fails', () => {
            authorizeSpy.mockImplementation(() => {
                throw new Error('authorize failed');
            });
            service.initialize(onReauthFailed);

            // Must not throw out of the event subscription.
            expect(() => events$.next({ type: EventTypes.SilentRenewFailed, value: null })).not.toThrow();
            // The guard flag is rolled back so error toasts are not suppressed.
            expect(service.redirectInProgress()).toBe(false);
            // The caller is notified so it can surface the settings dialog immediately.
            expect(onReauthFailed).toHaveBeenCalledTimes(1);
        });
    });

    describe('beginReauth', () => {
        it('sets the redirect flag, increments the counter and calls authorize', () => {
            service.beginReauth();

            expect(authorizeSpy).toHaveBeenCalledTimes(1);
            expect(service.redirectInProgress()).toBe(true);
            expect(sessionStorage.getItem(REDIRECT_COUNT_KEY)).toBe('1');
        });

        it('is re-entrant-safe: a second call while a redirect is in progress is a no-op', () => {
            service.beginReauth();
            service.beginReauth();

            expect(authorizeSpy).toHaveBeenCalledTimes(1);
            expect(sessionStorage.getItem(REDIRECT_COUNT_KEY)).toBe('1');
        });

        it('rolls back the redirect flag and rethrows when authorize() fails', () => {
            authorizeSpy.mockImplementation(() => {
                throw new Error('authorize failed');
            });

            expect(() => service.beginReauth()).toThrow('authorize failed');
            expect(service.redirectInProgress()).toBe(false);
        });

        it('does not double-count when repeated SilentRenewFailed events fire before unload', () => {
            service.initialize(onReauthFailed);
            events$.next({ type: EventTypes.SilentRenewFailed, value: null });
            events$.next({ type: EventTypes.SilentRenewFailed, value: null });

            expect(authorizeSpy).toHaveBeenCalledTimes(1);
            expect(sessionStorage.getItem(REDIRECT_COUNT_KEY)).toBe('1');
        });
    });

    describe('redirect budget', () => {
        // The counter persists in sessionStorage across the full-page redirects,
        // so each failed redirect cycle is a fresh service instance with the
        // counter already at its prior value.
        it('is not exceeded initially', () => {
            expect(service.hasExceededRedirectBudget()).toBe(false);
        });

        it('is exceeded after a single failed redirect attempt', () => {
            sessionStorage.setItem(REDIRECT_COUNT_KEY, '0');
            expect(service.hasExceededRedirectBudget()).toBe(false);
            sessionStorage.setItem(REDIRECT_COUNT_KEY, '1');
            expect(service.hasExceededRedirectBudget()).toBe(true);
        });

        it('treats missing or invalid counter values as zero', () => {
            sessionStorage.setItem(REDIRECT_COUNT_KEY, 'not-a-number');
            expect(service.hasExceededRedirectBudget()).toBe(false);
        });

        it('resetRedirectBudget clears the counter', () => {
            sessionStorage.setItem(REDIRECT_COUNT_KEY, '2');
            service.resetRedirectBudget();
            expect(service.hasExceededRedirectBudget()).toBe(false);
            expect(sessionStorage.getItem(REDIRECT_COUNT_KEY)).toBe('0');
        });
    });

    describe('markAuthenticated', () => {
        it('resets the counter and clears the redirect flag', () => {
            service.beginReauth();
            service.markAuthenticated();

            expect(service.redirectInProgress()).toBe(false);
            expect(service.hasExceededRedirectBudget()).toBe(false);
            expect(sessionStorage.getItem(REDIRECT_COUNT_KEY)).toBe('0');
        });
    });
});
