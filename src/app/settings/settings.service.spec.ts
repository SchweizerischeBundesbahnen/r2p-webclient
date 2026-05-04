import { TestBed } from '@angular/core/testing';
import { ORGANIZATION_OPTIONS, SettingsService } from './settings.service';

const SETTINGS_KEY = 'r2p-settings';

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
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}')).toEqual(next);
    expect(service.hasConfiguredSettings()).toBe(true);
  });

  it('loads previously persisted settings on construction', () => {
    const serverUrl = 'https://restored.example';
    const organization = ORGANIZATION_OPTIONS[2].name;
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ serverUrl, organization }),
    );

    const service = createService();

    expect(service.settings()).toEqual({
      serverUrl,
      organization,
    });
  });

  it('clears the organization when the stored organization is unknown', () => {
    const serverUrl = 'https://restored.example';
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ serverUrl, organization: 'UNKNOWN' }),
    );

    const service = createService();

    expect(service.settings().organization).toBe('');
    expect(service.settings().serverUrl).toBe(serverUrl);
    expect(service.hasConfiguredSettings()).toBe(false);
  });

  it('returns empty settings when stored JSON is malformed', () => {
    localStorage.setItem(SETTINGS_KEY, '{not valid json');

    const service = createService();

    expect(service.settings()).toEqual({
      serverUrl: '',
      organization: '',
    });
    expect(service.hasConfiguredSettings()).toBe(false);
  });
});

