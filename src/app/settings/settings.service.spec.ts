import { TestBed } from '@angular/core/testing';
import { ORGANIZATION_OPTIONS, SettingsService } from './settings.service';

const SERVER_URL_KEY = 'r2p-serverUrl';
const ORGANIZATION_KEY = 'r2p-organization';
const AUTHORITY_KEY = 'r2p-authority';
const CLIENT_ID_KEY = 'r2p-clientId';
const SCOPE_KEY = 'r2p-scope';

describe('SettingsService', () => {

    beforeEach(() => {
        localStorage.clear();
        TestBed.resetTestingModule();
    });

    function createService(): SettingsService {
        return TestBed.runInInjectionContext(() => TestBed.inject(SettingsService));
    }

    it('returns default settings when local storage is empty', () => {
        const service = createService();
        expect(service.settings()).toEqual({
            serverUrl: '',
            organization: '',
            authority: '',
            clientId: '',
            scope: '',
            responseMode: 'fragment',
        });
        expect(service.hasConfiguredSettings()).toBe(false);
    });

    it('persists settings to local storage on save() and updates the signal', () => {
        const service = createService();
        const next = {
            serverUrl: 'https://api.example.com',
            organization: ORGANIZATION_OPTIONS[1].name,
            authority: 'https://login.microsoftonline.com/tenant/v2.0',
            clientId: 'my-client-id',
            scope: 'openid profile email',
            responseMode: 'query' as const,
        };

        service.save(next);

        expect(service.settings()).toEqual(next);
        expect(localStorage.getItem(SERVER_URL_KEY)).toBe(next.serverUrl);
        expect(localStorage.getItem(ORGANIZATION_KEY)).toBe(next.organization);
        expect(localStorage.getItem(AUTHORITY_KEY)).toBe(next.authority);
        expect(localStorage.getItem(CLIENT_ID_KEY)).toBe(next.clientId);
        expect(localStorage.getItem(SCOPE_KEY)).toBe(next.scope);
        expect(service.hasConfiguredSettings()).toBe(true);
    });

    it('loads previously persisted settings on construction', () => {
        const serverUrl = 'https://restored.example';
        const organization = ORGANIZATION_OPTIONS[2].name;
        const authority = 'https://idp.example.com';
        const clientId = 'client-abc';
        const scope = 'openid profile';
        localStorage.setItem(SERVER_URL_KEY, serverUrl);
        localStorage.setItem(ORGANIZATION_KEY, organization);
        localStorage.setItem(AUTHORITY_KEY, authority);
        localStorage.setItem(CLIENT_ID_KEY, clientId);
        localStorage.setItem(SCOPE_KEY, scope);

        const service = createService();

        expect(service.settings()).toEqual({ serverUrl, organization, authority, clientId, scope, responseMode: 'fragment' });
    });

    it('clears the organization when the stored organization is unknown', () => {
        localStorage.setItem(SERVER_URL_KEY, 'https://restored.example');
        localStorage.setItem(ORGANIZATION_KEY, 'UNKNOWN');
        localStorage.setItem(AUTHORITY_KEY, 'https://idp.example.com');
        localStorage.setItem(CLIENT_ID_KEY, 'client-abc');
        localStorage.setItem(SCOPE_KEY, 'openid profile');

        const service = createService();

        expect(service.settings().organization).toBe('');
        expect(service.hasConfiguredSettings()).toBe(false);
    });

    it('persists and restores responseMode fragment', () => {
        const service = createService();
        service.save({
            serverUrl: 'https://api.example.com',
            organization: ORGANIZATION_OPTIONS[0].name,
            authority: 'https://idp.example.com',
            clientId: 'client',
            scope: 'openid',
            responseMode: 'fragment',
        });
        expect(service.settings().responseMode).toBe('fragment');
        expect(localStorage.getItem('r2p-responseMode')).toBe('fragment');

        const restored = createService();
        expect(restored.settings().responseMode).toBe('fragment');
    });

    it('persists and restores responseMode query', () => {
        const service = createService();
        service.save({
            serverUrl: 'https://api.example.com',
            organization: ORGANIZATION_OPTIONS[0].name,
            authority: 'https://idp.example.com',
            clientId: 'client',
            scope: 'openid',
            responseMode: 'query',
        });
        expect(service.settings().responseMode).toBe('query');

        const restored = createService();
        expect(restored.settings().responseMode).toBe('query');
    });

    it('falls back to "fragment" responseMode when an invalid value is stored in localStorage', () => {
        localStorage.setItem('r2p-responseMode', 'invalid-value');
        const service = createService();
        expect(service.settings().responseMode).toBe('fragment');
    });

    it('returns empty settings when stored values are malformed', () => {
        localStorage.setItem(SERVER_URL_KEY, '  ');
        localStorage.setItem(ORGANIZATION_KEY, 'UNKNOWN');

        const service = createService();

        expect(service.settings()).toEqual({
            serverUrl: '',
            organization: '',
            authority: '',
            clientId: '',
            scope: '',
            responseMode: 'fragment',
        });
        expect(service.hasConfiguredSettings()).toBe(false);
    });
});
