import { inject, Injectable, LOCALE_ID, signal } from '@angular/core';
import {
    DEFAULT_LOCALE,
    isSupportedLocale,
    LOCALE_STORAGE_KEY,
    normalizeToSupportedLocale,
    SupportedLocale,
} from './locale.config';

/**
 * Determines the initial locale by checking (in order):
 * 1. The value persisted in localStorage
 * 2. The browser's language preferences
 * 3. The app default locale (DEFAULT_LOCALE)
 */
export function resolveInitialLocale(): SupportedLocale {
    const stored = normalizeToSupportedLocale(globalThis.localStorage?.getItem(LOCALE_STORAGE_KEY));
    if (stored) {
        return stored;
    }

    const browserPreferences = [
        ...(globalThis.navigator?.languages ?? []),
        globalThis.navigator?.language,
    ];

    for (const preference of browserPreferences) {
        const locale = normalizeToSupportedLocale(preference);
        if (locale) {
            return locale;
        }
    }

    return DEFAULT_LOCALE;
}

export interface LocaleOption {
    code: SupportedLocale;
    label: string;
    shortLabel: string;
}

export const LOCALE_OPTIONS: LocaleOption[] = [
    { code: 'en-US', label: 'English', shortLabel: 'EN' },
    { code: 'de-CH', label: 'Deutsch', shortLabel: 'DE' },
];

@Injectable({ providedIn: 'root' })
export class LocaleService {
    private readonly localeId = inject(LOCALE_ID);

    readonly currentLocale = signal<SupportedLocale>(
        isSupportedLocale(this.localeId) ? this.localeId : DEFAULT_LOCALE,
    );

    readonly locales = LOCALE_OPTIONS;

    switchLocale(newLocale: string): void {
        if (newLocale === this.localeId) {
            return;
        }
        if (!isSupportedLocale(newLocale)) {
            return;
        }
        globalThis.localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
        globalThis.location.reload();
    }
}

