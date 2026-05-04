import { loadTranslations } from '@angular/localize';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { SupportedLocale } from './app/locale/locale.config';
import { resolveInitialLocale } from './app/locale/locale.service';

async function loadLocaleData(locale: SupportedLocale): Promise<void> {
  if (locale === 'en-US') {
    return; // English is the source locale; Angular ships en-US data by default.
  }
  if (locale === 'de-CH') {
    const mod = await import('@angular/common/locales/de');
    registerLocaleData(mod.default, 'de-CH');
  }
}

async function loadRuntimeTranslations(locale: SupportedLocale): Promise<void> {
  if (locale === 'en-US') {
    return; // No translations needed for the source locale.
  }
  const response = await fetch(`locale/messages.${locale}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load translations for ${locale}: ${response.status}`);
  }
  const payload: { translations: Record<string, string> } = await response.json();
  loadTranslations(payload.translations);
}

async function main(): Promise<void> {
  const locale = resolveInitialLocale();
  await loadRuntimeTranslations(locale);
  await loadLocaleData(locale);

  // Dynamically import the app AFTER translations are loaded, so any
  // module-level $localize tagged strings resolve against the right locale.
  const [{ bootstrapApplication }, { App }, { appConfig }] = await Promise.all([
    import('@angular/platform-browser'),
    import('./app/app'),
    import('./app/app.config'),
  ]);

  await bootstrapApplication(App, {
    ...appConfig,
    providers: [...(appConfig.providers ?? []), { provide: LOCALE_ID, useValue: locale }],
  });
}

main().catch((err) => console.error(err));
