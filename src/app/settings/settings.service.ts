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

const SERVER_URL_KEY = 'r2p-serverUrl';
const ORGANIZATION_KEY = 'r2p-organization';

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
    localStorage.setItem(SERVER_URL_KEY, normalized.serverUrl);
    localStorage.setItem(ORGANIZATION_KEY, normalized.organization);
    this._settings.set(normalized);
  }

  load(): Settings {
    const serverUrl = localStorage.getItem(SERVER_URL_KEY) ?? '';
    const organization = localStorage.getItem(ORGANIZATION_KEY) ?? '';
    return this.normalize({ serverUrl, organization });
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


