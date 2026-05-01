import { Injectable, signal } from '@angular/core';

export interface Settings {
  serverUrl: string;
  partner: string;
}

export interface PartnerOption {
  name: string;
  shortName: string;
  color: string;
}

export const PARTNER_OPTIONS: PartnerOption[] = [
  { name: 'SBB - Schweizerische Bundesbahnen', shortName: 'SBB', color: '#d70810' },
  { name: 'SOB - Schweizerische Südostbahn', shortName: 'SOB', color: '#009b3a' },
  { name: 'BLS', shortName: 'BLS', color: '#00539b' },
];

const SETTINGS_KEY = 'r2p-settings';

const DEFAULTS: Settings = {
  serverUrl: 'http://localhost:8080',
  partner: PARTNER_OPTIONS[0].name,
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly _settings = signal<Settings>(this.load());

  readonly settings = this._settings.asReadonly();

  get partner(): string {
    return this._settings().partner;
  }

  get serverUrl(): string {
    return this._settings().serverUrl;
  }

  save(settings: Settings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    this._settings.set(settings);
  }

  load(): Settings {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      try {
        const parsed = { ...DEFAULTS, ...JSON.parse(raw) } as Settings;
        const isKnownPartner = PARTNER_OPTIONS.some((option) => option.name === parsed.partner);
        return {
          serverUrl: parsed.serverUrl || DEFAULTS.serverUrl,
          partner: isKnownPartner ? parsed.partner : DEFAULTS.partner,
        };
      } catch {
        return DEFAULTS;
      }
    }
    return DEFAULTS;
  }
}


