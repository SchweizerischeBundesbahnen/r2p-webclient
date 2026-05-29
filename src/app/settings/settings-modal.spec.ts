import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SettingsModal, SettingsModalData } from './settings-modal';
import { SettingsService, ORGANIZATION_OPTIONS } from './settings.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

const VALID_SETTINGS = {
    serverUrl: 'https://api.example.com',
    organization: ORGANIZATION_OPTIONS[0].name,
    authority: 'https://login.microsoftonline.com/tenant/v2.0',
    clientId: 'my-client',
    scope: 'openid profile email',
    responseMode: 'fragment' as const,
};

function makeSettingsService(overrides: Partial<typeof VALID_SETTINGS> = {}): SettingsService {
    const settings = { ...VALID_SETTINGS, ...overrides };
    const complete = !!(settings.serverUrl && settings.organization && settings.authority && settings.clientId && settings.scope);
    return {
        settings: vi.fn().mockReturnValue(settings),
        hasConfiguredSettings: vi.fn().mockReturnValue(complete),
        save: vi.fn(),
        load: vi.fn().mockReturnValue(settings),
    } as unknown as SettingsService;
}

function createComponent(settingsService: SettingsService, dialogData: SettingsModalData = {}): ComponentFixture<SettingsModal> {
    TestBed.configureTestingModule({
        imports: [SettingsModal],
        providers: [
            { provide: SettingsService, useValue: settingsService },
            { provide: MatDialogRef, useValue: { disableClose: false, close: vi.fn() } },
            { provide: OidcSecurityService, useValue: { logoffLocal: vi.fn() } },
            { provide: MAT_DIALOG_DATA, useValue: dialogData },
        ],
    });
    return TestBed.createComponent(SettingsModal);
}

describe('SettingsModal', () => {

    describe('first-time setup (no settings configured)', () => {
        let fixture: ComponentFixture<SettingsModal>;

        beforeEach(() => {
            const service = makeSettingsService({ serverUrl: '', organization: '', authority: '', clientId: '', scope: '' });
            fixture = createComponent(service);
            fixture.detectChanges();
        });

        it('shows the first-time banner, hides the title, blocks continue and disables dialog close', () => {
            expect(fixture.nativeElement.querySelector('.settings-modal__first-time-banner')).toBeTruthy();
            expect(fixture.nativeElement.querySelector('.settings-modal__title')).toBeFalsy();
            expect(fixture.componentInstance.isFirstTime()).toBe(true);
            expect(fixture.componentInstance.canContinue()).toBe(false);
            const dialogRef = TestBed.inject(MatDialogRef) as { disableClose: boolean };
            expect(dialogRef.disableClose).toBe(true);
        });
    });

    describe('edit mode (settings already configured)', () => {
        let fixture: ComponentFixture<SettingsModal>;

        beforeEach(() => {
            fixture = createComponent(makeSettingsService());
            fixture.detectChanges();
        });

        it('shows the title, hides the banner and allows dialog close', () => {
            expect(fixture.nativeElement.querySelector('.settings-modal__title')).toBeTruthy();
            expect(fixture.componentInstance.isFirstTime()).toBe(false);
            const dialogRef = TestBed.inject(MatDialogRef) as { disableClose: boolean };
            expect(dialogRef.disableClose).toBe(false);
        });
    });

    describe('URL validation', () => {
        let fixture: ComponentFixture<SettingsModal>;

        beforeEach(() => {
            fixture = createComponent(makeSettingsService());
            fixture.detectChanges();
        });

        it('isServerUrlValid returns false for empty or non-URL values, true for valid URLs', () => {
            fixture.componentInstance.serverUrl.set('');
            expect(fixture.componentInstance.isServerUrlValid()).toBe(false);
            fixture.componentInstance.serverUrl.set('not-a-url');
            expect(fixture.componentInstance.isServerUrlValid()).toBe(false);
            fixture.componentInstance.serverUrl.set('http://localhost:8080');
            expect(fixture.componentInstance.isServerUrlValid()).toBe(true);
            fixture.componentInstance.serverUrl.set('https://api.example.com');
            expect(fixture.componentInstance.isServerUrlValid()).toBe(true);
        });

        it('isAuthorityValid returns false for empty or non-URL values, true for valid URLs', () => {
            fixture.componentInstance.authority.set('');
            expect(fixture.componentInstance.isAuthorityValid()).toBe(false);
            fixture.componentInstance.authority.set('not-valid');
            expect(fixture.componentInstance.isAuthorityValid()).toBe(false);
            fixture.componentInstance.authority.set('https://login.microsoftonline.com/tenant/v2.0');
            expect(fixture.componentInstance.isAuthorityValid()).toBe(true);
            fixture.componentInstance.authority.set('http://localhost:8180/realms/r2p');
            expect(fixture.componentInstance.isAuthorityValid()).toBe(true);
        });
    });

    describe('canContinue', () => {
        let fixture: ComponentFixture<SettingsModal>;

        beforeEach(() => {
            fixture = createComponent(makeSettingsService());
            fixture.detectChanges();
        });

        it('is true when all required fields are valid', () => {
            expect(fixture.componentInstance.canContinue()).toBe(true);
        });

        it('is false when any required field is invalid', () => {
            const ci = fixture.componentInstance;

            ci.serverUrl.set(''); expect(ci.canContinue()).toBe(false);
            ci.serverUrl.set('not-a-url'); expect(ci.canContinue()).toBe(false);
            ci.serverUrl.set(VALID_SETTINGS.serverUrl);

            ci.organization.set(''); expect(ci.canContinue()).toBe(false);
            ci.organization.set(VALID_SETTINGS.organization);

            ci.authority.set(''); expect(ci.canContinue()).toBe(false);
            ci.authority.set('not-a-url'); expect(ci.canContinue()).toBe(false);
            ci.authority.set(VALID_SETTINGS.authority);

            ci.clientId.set(''); expect(ci.canContinue()).toBe(false);
            ci.clientId.set(VALID_SETTINGS.clientId);

            ci.scope.set(''); expect(ci.canContinue()).toBe(false);
        });

        it('isAzureV1Authority is true for bare login.microsoftonline.com URL and blocks canContinue', () => {
            const ci = fixture.componentInstance;
            ci.authority.set('https://login.microsoftonline.com/2cda5d11-f0ac-46b3-967d-af1b2e1bd01a');
            expect(ci.isAzureV1Authority()).toBe(true);
            expect(ci.canContinue()).toBe(false);
        });

        it('isAzureV1Authority is true for bare URL with trailing slash and blocks canContinue', () => {
            const ci = fixture.componentInstance;
            ci.authority.set('https://login.microsoftonline.com/2cda5d11-f0ac-46b3-967d-af1b2e1bd01a/');
            expect(ci.isAzureV1Authority()).toBe(true);
            expect(ci.canContinue()).toBe(false);
        });

        it('isAzureV1Authority is false for v2.0 URL and does not block canContinue', () => {
            const ci = fixture.componentInstance;
            ci.authority.set('https://login.microsoftonline.com/2cda5d11-f0ac-46b3-967d-af1b2e1bd01a/v2.0');
            expect(ci.isAzureV1Authority()).toBe(false);
            expect(ci.canContinue()).toBe(true);
        });

        it('isAzureV1Authority is false for non-Azure URLs', () => {
            const ci = fixture.componentInstance;
            ci.authority.set('http://localhost:8180/realms/r2p');
            expect(ci.isAzureV1Authority()).toBe(false);
            expect(ci.canContinue()).toBe(true);
        });
    });


    describe('persist on close', () => {
        it('calls settingsService.save() with trimmed field values on save', () => {
            const service = makeSettingsService();
            const fixture = createComponent(service);
            fixture.detectChanges();

            fixture.componentInstance.serverUrl.set('  https://api.example.com  ');
            fixture.componentInstance.clientId.set('  new-client  ');

            (fixture.componentInstance as unknown as { onClose(): void }).onClose();

            expect(service.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    serverUrl: 'https://api.example.com',
                    clientId: 'new-client',
                }),
            );
        });
    });

    describe('error banners', () => {
        it('shows the unreachable-URL banner when unreachableUrl is provided', () => {
            const fixture = createComponent(makeSettingsService(), { unreachableUrl: 'https://bad.example.com/.well-known/openid-configuration' });
            fixture.detectChanges();
            const banner = fixture.nativeElement.querySelector('.settings-modal__error-banner');
            expect(banner).toBeTruthy();
            expect((banner as HTMLElement).textContent).toContain('bad.example.com');
        });

        it('shows the IdP error banner when oidcError is provided', () => {
            const fixture = createComponent(makeSettingsService(), { oidcError: 'unauthorized_client: Client is not enabled' });
            fixture.detectChanges();
            const banners = fixture.nativeElement.querySelectorAll('.settings-modal__error-banner') as NodeListOf<HTMLElement>;
            const texts = Array.from(banners).map((b) => b.textContent ?? '');
            expect(texts.some((t) => t.includes('unauthorized_client'))).toBe(true);
        });

        it('shows the failed-redirect banner when failedRedirectUri is provided', () => {
            const fixture = createComponent(makeSettingsService(), { failedRedirectUri: 'http://localhost:4200' });
            fixture.detectChanges();
            const banners = fixture.nativeElement.querySelectorAll('.settings-modal__error-banner') as NodeListOf<HTMLElement>;
            const texts = Array.from(banners).map((b) => b.textContent ?? '');
            expect(texts.some((t) => t.includes('localhost:4200'))).toBe(true);
        });

        it('shows no error banners when no dialog data is provided', () => {
            const fixture = createComponent(makeSettingsService());
            fixture.detectChanges();
            const banners = fixture.nativeElement.querySelectorAll('.settings-modal__error-banner');
            expect(banners.length).toBe(0);
        });
    });
});

