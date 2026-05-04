export const SUPPORTED_LOCALES = ['en-US', 'de-CH'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = 'en-US';
export const LOCALE_STORAGE_KEY = 'app.locale';

export function isSupportedLocale(value: string | null | undefined): value is SupportedLocale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function normalizeToSupportedLocale(value: string | null | undefined): SupportedLocale | null {
  if (!value) {
    return null;
  }
  if (isSupportedLocale(value)) {
    return value;
  }
  const language = value.toLowerCase().split('-')[0];
  if (language === 'de') {
    return 'de-CH';
  }
  if (language === 'en') {
    return 'en-US';
  }
  return null;
}
