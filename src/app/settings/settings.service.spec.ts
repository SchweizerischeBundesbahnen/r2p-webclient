import { TestBed } from '@angular/core/testing';
import { PARTNER_OPTIONS, SettingsService } from './settings.service';

const SETTINGS_KEY = 'r2p-settings';

describe('SettingsService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  function createService(): SettingsService {
    return TestBed.runInInjectionContext(() => TestBed.inject(SettingsService));
  }

  it('returns defaults when local storage is empty', () => {
    const service = createService();

    expect(service.settings()).toEqual({
      serverUrl: 'http://localhost:8080',
      partner: PARTNER_OPTIONS[0].name,
    });
  });

  it('persists settings to local storage on save() and updates the signal', () => {
    const service = createService();
    const next = {
      serverUrl: 'https://api.example.com',
      partner: PARTNER_OPTIONS[1].name,
    };

    service.save(next);

    expect(service.settings()).toEqual(next);
    expect(service.serverUrl).toBe(next.serverUrl);
    expect(service.partner).toBe(next.partner);
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}')).toEqual(next);
  });

  it('loads previously persisted settings on construction', () => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ serverUrl: 'https://restored.example', partner: PARTNER_OPTIONS[2].name }),
    );

    const service = createService();

    expect(service.settings()).toEqual({
      serverUrl: 'https://restored.example',
      partner: PARTNER_OPTIONS[2].name,
    });
  });

  it('falls back to the default partner when the stored partner is unknown', () => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ serverUrl: 'https://restored.example', partner: 'UNKNOWN' }),
    );

    const service = createService();

    expect(service.settings().partner).toBe(PARTNER_OPTIONS[0].name);
    expect(service.settings().serverUrl).toBe('https://restored.example');
  });

  it('falls back to the defaults when stored JSON is malformed', () => {
    localStorage.setItem(SETTINGS_KEY, '{not valid json');

    const service = createService();

    expect(service.settings()).toEqual({
      serverUrl: 'http://localhost:8080',
      partner: PARTNER_OPTIONS[0].name,
    });
  });
});

