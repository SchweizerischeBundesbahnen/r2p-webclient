import { Injectable, signal } from '@angular/core';

export interface Settings {
    serverUrl: string;
    organization: string;
    authority: string;
    clientId: string;
    scope: string;
}

export interface OrganizationOption {
    name: string;
    label: string;
    color: string;
}

export const ORGANIZATION_OPTIONS: OrganizationOption[] = [
    { name: 'SBB', label: 'SBB - Schweizerische Bundesbahnen', color: '#d70810' },
    { name: 'SOB', label: 'SOB - Schweizerische Südostbahn', color: '#009b3a' },
    { name: 'BLS', label: 'BLS - Bern-Lötschberg-Simplon-Bahn', color: '#00539b' },
];

const SERVER_URL_KEY = 'r2p-serverUrl';
const ORGANIZATION_KEY = 'r2p-organization';
const AUTHORITY_KEY = 'r2p-authority';
const CLIENT_ID_KEY = 'r2p-clientId';
const SCOPE_KEY = 'r2p-scope';

/** Pure helper – reads settings directly from localStorage without DI (usable in app.config.ts). */
export function loadSettingsRaw(): Settings {
    return {
        serverUrl: localStorage.getItem(SERVER_URL_KEY) ?? '',
        organization: localStorage.getItem(ORGANIZATION_KEY) ?? '',
        authority: localStorage.getItem(AUTHORITY_KEY) ?? '',
        clientId: localStorage.getItem(CLIENT_ID_KEY) ?? '',
        scope: localStorage.getItem(SCOPE_KEY) ?? '',
    };
}

/** Returns true when all required settings fields are filled in. */
export function isSettingsComplete(s: Settings): boolean {
    return (
        s.serverUrl.trim().length > 0 &&
        ORGANIZATION_OPTIONS.some((o) => o.name === s.organization) &&
        s.authority.trim().length > 0 &&
        s.clientId.trim().length > 0 &&
        s.scope.trim().length > 0
    );
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
    private readonly _settings = signal<Settings>(this.load());

    readonly settings = this._settings.asReadonly();

    hasConfiguredSettings(): boolean {
        return isSettingsComplete(this._settings());
    }

    save(settings: Settings): void {
        const normalized = this.normalize(settings);
        localStorage.setItem(SERVER_URL_KEY, normalized.serverUrl);
        localStorage.setItem(ORGANIZATION_KEY, normalized.organization);
        localStorage.setItem(AUTHORITY_KEY, normalized.authority);
        localStorage.setItem(CLIENT_ID_KEY, normalized.clientId);
        localStorage.setItem(SCOPE_KEY, normalized.scope);
        this._settings.set(normalized);
    }

    load(): Settings {
        return this.normalize(loadSettingsRaw());
    }

    private normalize(settings: Partial<Settings>): Settings {
        const serverUrl = typeof settings.serverUrl === 'string' ? settings.serverUrl.trim().replace(/\/$/, '') : '';
        const rawOrg = typeof settings.organization === 'string' ? settings.organization : '';
        const organization = this.isKnownOrganization(rawOrg) ? rawOrg : '';
        const authority = typeof settings.authority === 'string' ? settings.authority.trim() : '';
        const clientId = typeof settings.clientId === 'string' ? settings.clientId.trim() : '';
        const scope = typeof settings.scope === 'string' ? settings.scope.trim() : '';
        return { serverUrl, organization, authority, clientId, scope };
    }

    private isKnownOrganization(organization: string): boolean {
        return ORGANIZATION_OPTIONS.some((option) => option.name === organization);
    }
}
