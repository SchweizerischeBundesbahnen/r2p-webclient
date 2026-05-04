import { Injectable, signal } from '@angular/core';

export interface Settings {
  serverUrl: string;
  organization: string;
}

export interface OrganizationOption {
  name: string;
  shortName: string;
  color: string;
}

export const ORGANIZATION_OPTIONS: OrganizationOption[] = [
  { name: 'SBB - Schweizerische Bundesbahnen', shortName: 'SBB', color: '#d70810' },
  { name: 'SOB - Schweizerische Südostbahn', shortName: 'SOB', color: '#009b3a' },
  { name: 'BLS', shortName: 'BLS', color: '#00539b' },
];

const SETTINGS_KEY = 'r2p-settings';

const EMPTY_SETTINGS: Settings = {
  serverUrl: '',
  organization: '',
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly _settings = signal<Settings>(this.load());

  readonly settings = this._settings.asReadonly();

  hasConfiguredSettings(): boolean {
    const settings = this._settings();
    return settings.serverUrl.trim().length > 0 && this.isKnownOrganization(settings.organization);
  }

  save(settings: Settings): void {
    const normalized = this.normalize(settings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(normalized));
    this._settings.set(normalized);
  }

  load(): Settings {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return EMPTY_SETTINGS;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<Settings>;
      return this.normalize(parsed);
    } catch {
      return EMPTY_SETTINGS;
    }
  }

  private normalize(settings: Partial<Settings>): Settings {
    const serverUrl = typeof settings.serverUrl === 'string' ? settings.serverUrl.trim() : '';
    const organization =
      typeof settings.organization === 'string' && this.isKnownOrganization(settings.organization)
        ? settings.organization
        : '';
    return { serverUrl, organization };
  }

  private isKnownOrganization(organization: string): boolean {
    return ORGANIZATION_OPTIONS.some((option) => option.name === organization);
  }
}


