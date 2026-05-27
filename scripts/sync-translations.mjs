#!/usr/bin/env node
/**
 * Sync translation files with the extracted source messages.
 *
 * Usage:
 *   node scripts/sync-translations.mjs [--check]
 *
 * Without flags: merges new keys from messages.json into each locale file,
 *                removes obsolete keys, and writes the updated files.
 * With --check:  only reports missing/obsolete keys and exits with code 1
 *                if anything is out of sync (useful in CI).
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');

const SOURCE = resolve(root, 'src/locale/messages.json');
const LOCALES = [resolve(root, 'public/locale/messages.de-CH.json')];

const checkOnly = process.argv.includes('--check');

const source = JSON.parse(readFileSync(SOURCE, 'utf-8'));
const sourceKeys = Object.keys(source.translations);

let hasIssues = false;

for (const localePath of LOCALES) {
  const locale = JSON.parse(readFileSync(localePath, 'utf-8'));
  const localeKeys = new Set(Object.keys(locale.translations));

  const missing = sourceKeys.filter((k) => !localeKeys.has(k));
  const obsolete = [...localeKeys].filter((k) => !sourceKeys.includes(k));

  const label = localePath.split('/public/locale/')[1];

  if (missing.length === 0 && obsolete.length === 0) {
    console.log(`✅  ${label}  –  all ${sourceKeys.length} keys in sync`);
    continue;
  }

  hasIssues = true;

  if (missing.length > 0) {
    console.log(`\n⚠️  ${label}  –  ${missing.length} missing key(s):`);
    for (const key of missing) {
      console.log(`   + ${key}  →  "${source.translations[key]}"`);
    }
  }

  if (obsolete.length > 0) {
    console.log(`\n🗑️  ${label}  –  ${obsolete.length} obsolete key(s):`);
    for (const key of obsolete) {
      console.log(`   - ${key}`);
    }
  }

  if (!checkOnly) {
    // Build updated translations: keep existing, add missing at the end, drop obsolete
    const updated = {};
    for (const key of sourceKeys) {
      updated[key] = locale.translations[key] ?? `TODO: ${source.translations[key]}`;
    }

    const updatedFile = { locale: locale.locale, translations: updated };
    writeFileSync(localePath, JSON.stringify(updatedFile, null, 2) + '\n', 'utf-8');
    console.log(`💾  ${label}  –  written (missing keys marked as TODO:…)`);
  }
}

if (checkOnly && hasIssues) {
  console.log('\n❌  Translation files are out of sync. Run: npm run sync-translations');
  process.exit(1);
}

