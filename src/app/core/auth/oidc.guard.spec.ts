import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { of } from 'rxjs';
import { oidcGuard } from './oidc.guard';
import { SettingsService } from '../settings/settings.service';
import { AuthSessionService } from './auth-session.service';

const CONFIGURED_SETTINGS = {
    authority: 'https://login.example.com/realms/r2p',
    serverUrl: 'https://api.example.com',
    organization: 'SBB',
    clientId: 'r2p-sp',
    scope: 'openid profile',
};

function makeSettingsService(configured = true) {
    return {
        hasConfiguredSettings: vi.fn().mockReturnValue(configured),
        settings: vi.fn().mockReturnValue(CONFIGURED_SETTINGS),
    } as unknown as SettingsService;
}

function makeAuthSession(budgetExceeded = false) {
    return {
        redirectInProgress: vi.fn().mockReturnValue(false),
        hasExceededRedirectBudget: vi.fn().mockReturnValue(budgetExceeded),
        beginReauth: vi.fn(),
        markAuthenticated: vi.fn(),
        resetRedirectBudget: vi.fn(),
    } as unknown as AuthSessionService;
}

function runGuard(): unknown {
    return TestBed.runInInjectionContext(() =>
        (oidcGuard as (a: ActivatedRouteSnapshot, s: RouterStateSnapshot) => unknown)(
            {} as ActivatedRouteSnapshot,
            {} as RouterStateSnapshot,
        ),
    );
}

describe('oidcGuard', () => {
    let openSpy: ReturnType<typeof vi.fn>;
    let checkAuthSpy: ReturnType<typeof vi.fn>;
    let authorizeSpy: ReturnType<typeof vi.fn>;
    let fetchSpy: ReturnType<typeof vi.fn>;
    let authSession: AuthSessionService;
    let originalFetch: typeof fetch;

    beforeEach(() => {
        openSpy = vi.fn().mockReturnValue({ disableClose: false });
        checkAuthSpy = vi.fn().mockReturnValue(of({ isAuthenticated: false }));
        authorizeSpy = vi.fn();
        authSession = makeAuthSession();
        originalFetch = globalThis.fetch;

        // Default: discovery endpoint reachable with a valid OIDC discovery document
        fetchSpy = vi.fn().mockResolvedValue({
            ok: true,
            headers: { get: () => 'application/json' },
            json: () => Promise.resolve({ issuer: 'https://login.example.com/realms/r2p' }),
        });
        globalThis.fetch = fetchSpy as unknown as typeof fetch;

        // Clear sessionStorage before each test
        sessionStorage.removeItem('r2p-webclient');

        // Clear URL params
        window.history.replaceState({}, '', '/');

        TestBed.configureTestingModule({
            providers: [
                { provide: SettingsService, useValue: makeSettingsService() },
                { provide: MatDialog, useValue: { open: openSpy, openDialogs: [] } },
                { provide: OidcSecurityService, useValue: { checkAuth: checkAuthSpy, authorize: authorizeSpy } },
                { provide: AuthSessionService, useFactory: () => authSession },
            ],
        });
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    describe('incomplete settings', () => {
        it('opens settings modal and returns false immediately', () =>
            new Promise<void>((resolve) => {
                TestBed.overrideProvider(SettingsService, { useValue: makeSettingsService(false) });
                const result$ = runGuard() as ReturnType<typeof of>;
                result$.subscribe((v: boolean) => {
                    expect(v).toBe(false);
                    expect(openSpy).toHaveBeenCalledTimes(1);
                    expect(fetchSpy).not.toHaveBeenCalled();
                    resolve();
                });
            }),
        );
    });

    describe('IdP error in redirect callback', () => {
        it('opens settings modal with oidcError and returns false when ?error= is present', () =>
            new Promise<void>((resolve) => {
                window.history.replaceState({}, '', '/?error=unauthorized_client&error_description=Client+not+found');
                const result$ = runGuard() as ReturnType<typeof of>;
                result$.subscribe((v: boolean) => {
                    expect(v).toBe(false);
                    expect(openSpy).toHaveBeenCalledTimes(1);
                    const data = openSpy.mock.calls[0][1].data as { oidcError: string };
                    expect(data.oidcError).toContain('unauthorized_client');
                    expect(fetchSpy).not.toHaveBeenCalled();
                    resolve();
                });
            }),
        );

        it('cleans up the error params from the URL', () =>
            new Promise<void>((resolve) => {
                window.history.replaceState({}, '', '/?error=access_denied');
                const result$ = runGuard() as ReturnType<typeof of>;
                result$.subscribe(() => {
                    expect(window.location.search).toBe('');
                    resolve();
                });
            }),
        );
    });

    describe('stale auth state (expired session, no code)', () => {
        it('re-authenticates silently without opening the settings dialog', () =>
            new Promise<void>((resolve) => {
                sessionStorage.setItem('r2p-webclient', JSON.stringify({ authStateControl: 'abc123' }));
                const result$ = runGuard() as ReturnType<typeof of>;
                result$.subscribe((v: boolean) => {
                    expect(v).toBe(false);
                    expect(authSession.beginReauth).toHaveBeenCalledTimes(1);
                    expect(openSpy).not.toHaveBeenCalled();
                    resolve();
                });
            }),
        );

        it('clears the stale auth state from sessionStorage', () =>
            new Promise<void>((resolve) => {
                sessionStorage.setItem('r2p-webclient', JSON.stringify({ authStateControl: 'abc123', someOtherKey: 'keep' }));
                const result$ = runGuard() as ReturnType<typeof of>;
                result$.subscribe(() => {
                    const stored = JSON.parse(sessionStorage.getItem('r2p-webclient') ?? '{}') as Record<string, unknown>;
                    expect(stored['authStateControl']).toBeUndefined();
                    expect(stored['someOtherKey']).toBe('keep');
                    resolve();
                });
            }),
        );

        it('opens the settings dialog only once the redirect budget is exceeded', () =>
            new Promise<void>((resolve) => {
                authSession = makeAuthSession(true);
                sessionStorage.setItem('r2p-webclient', JSON.stringify({ authStateControl: 'abc123' }));
                const result$ = runGuard() as ReturnType<typeof of>;
                result$.subscribe((v: boolean) => {
                    expect(v).toBe(false);
                    expect(authSession.beginReauth).not.toHaveBeenCalled();
                    expect(authSession.resetRedirectBudget).toHaveBeenCalledTimes(1);
                    expect(openSpy).toHaveBeenCalledTimes(1);
                    const data = openSpy.mock.calls[0][1].data as { failedRedirectUri: string };
                    expect(data.failedRedirectUri).toBe(window.location.origin);
                    resolve();
                });
            }),
        );

        it('does not re-authenticate when code is present in URL', () =>
            new Promise<void>((resolve) => {
                sessionStorage.setItem('r2p-webclient', JSON.stringify({ authStateControl: 'abc123' }));
                window.history.replaceState({}, '', '/?code=somecode&state=abc123');
                checkAuthSpy.mockReturnValue(of({ isAuthenticated: true }));
                const result$ = runGuard() as ReturnType<typeof of>;
                result$.subscribe((v: boolean) => {
                    expect(v).toBe(true);
                    expect(authSession.markAuthenticated).toHaveBeenCalledTimes(1);
                    expect(openSpy).not.toHaveBeenCalled();
                    resolve();
                });
            }),
        );
    });

    describe('unreachable discovery endpoint', () => {
        it('opens settings modal with unreachableUrl when fetch fails', () =>
            new Promise<void>((resolve) => {
                fetchSpy.mockRejectedValue(new Error('Network error'));
                const result$ = runGuard() as ReturnType<typeof of>;
                result$.subscribe((v: boolean) => {
                    expect(v).toBe(false);
                    expect(openSpy).toHaveBeenCalledTimes(1);
                    const data = openSpy.mock.calls[0][1].data as { unreachableUrl: string };
                    expect(data.unreachableUrl).toContain('/.well-known/openid-configuration');
                    resolve();
                });
            }),
        );

        it('opens settings modal when fetch returns non-ok status', () =>
            new Promise<void>((resolve) => {
                fetchSpy.mockResolvedValue({ ok: false });
                const result$ = runGuard() as ReturnType<typeof of>;
                result$.subscribe((v: boolean) => {
                    expect(v).toBe(false);
                    expect(openSpy).toHaveBeenCalledTimes(1);
                    resolve();
                });
            }),
        );
    });

    describe('successful auth flow', () => {
        it('returns true and marks authenticated when already authenticated', () =>
            new Promise<void>((resolve) => {
                checkAuthSpy.mockReturnValue(of({ isAuthenticated: true }));
                const result$ = runGuard() as ReturnType<typeof of>;
                result$.subscribe((v: boolean) => {
                    expect(v).toBe(true);
                    expect(authSession.markAuthenticated).toHaveBeenCalledTimes(1);
                    expect(openSpy).not.toHaveBeenCalled();
                    resolve();
                });
            }),
        );

        it('re-authenticates silently and returns false when not authenticated', () =>
            new Promise<void>((resolve) => {
                checkAuthSpy.mockReturnValue(of({ isAuthenticated: false }));
                const result$ = runGuard() as ReturnType<typeof of>;
                result$.subscribe((v: boolean) => {
                    expect(v).toBe(false);
                    expect(authSession.beginReauth).toHaveBeenCalledTimes(1);
                    expect(authorizeSpy).not.toHaveBeenCalled();
                    expect(openSpy).not.toHaveBeenCalled();
                    resolve();
                });
            }),
        );
    });
});


