import { TestBed } from '@angular/core/testing';
import { ORGANIZATION_OPTIONS, SettingsService } from './settings.service';

const SERVER_URL_KEY = 'r2p-serverUrl';
const ORGANIZATION_KEY = 'r2p-organization';

describe('SettingsService', () => {

    beforeEach(() => {
        localStorage.clear();
        TestBed.resetTestingModule();
    });

    function createService(): SettingsService {
        return TestBed.runInInjectionContext(() => TestBed.inject(SettingsService));
    }

    it('returns empty settings when local storage is empty', () => {
        const service = createService();
        expect(service.settings()).toEqual({
            serverUrl: '',
            organization: '',
        });
        expect(service.hasConfiguredSettings()).toBe(false);
    });

    it('persists settings to local storage on save() and updates the signal', () => {
        const service = createService();
        const next = {
            serverUrl: 'https://api.example.com',
            organization: ORGANIZATION_OPTIONS[1].name,
        };

        service.save(next);

        expect(service.settings()).toEqual(next);
        expect(service.settings().serverUrl).toBe(next.serverUrl);
        expect(service.settings().organization).toBe(next.organization);
        expect(localStorage.getItem(SERVER_URL_KEY)).toBe(next.serverUrl);
        expect(localStorage.getItem(ORGANIZATION_KEY)).toBe(next.organization);
        expect(service.hasConfiguredSettings()).toBe(true);
    });

    it('loads previously persisted settings on construction', () => {
        const serverUrl = 'https://restored.example';
        const organization = ORGANIZATION_OPTIONS[2].name;
        localStorage.setItem(SERVER_URL_KEY, serverUrl);
        localStorage.setItem(ORGANIZATION_KEY, organization);

        const service = createService();

        expect(service.settings()).toEqual({
            serverUrl,
            organization,
        });
    });

    it('clears the organization when the stored organization is unknown', () => {
        const serverUrl = 'https://restored.example';
        localStorage.setItem(SERVER_URL_KEY, serverUrl);
        localStorage.setItem(ORGANIZATION_KEY, 'UNKNOWN');

        const service = createService();

        expect(service.settings().organization).toBe('');
        expect(service.settings().serverUrl).toBe(serverUrl);
        expect(service.hasConfiguredSettings()).toBe(false);
    });

    it('returns empty settings when stored values are malformed', () => {
        localStorage.setItem(SERVER_URL_KEY, '  ');
        localStorage.setItem(ORGANIZATION_KEY, 'UNKNOWN');

        const service = createService();

        expect(service.settings()).toEqual({
            serverUrl: '',
            organization: '',
        });
        expect(service.hasConfiguredSettings()).toBe(false);
    });
});

