# Agent Instructions

## i18n
- Update **both** `public/locale/messages.de-CH.json` and `messages.en-US.json` whenever you add, change or remove any `i18n="@@key"` or `$localize` string.
- After changing strings, run `ng extract-i18n --output-path src/locale --out-file messages.json --format json` to update the source file, then run `npm run sync-translations` to sync de-CH.json (it marks missing keys as `TODO:`). Fill in the German translation for any `TODO:` entries and mirror the same change in `en-US.json` manually (en-US is not auto-synced).
- Always run `npm run check-translations` before finishing and treat all issues.

## Testing
- Uses **Vitest**. Import: `import { vi, describe, it, expect, beforeEach } from 'vitest'`
- No Jasmine: use `vi.fn()`, `toBe(true/false)` – not `spyOn`, `toBeTrue`, `toBeFalse`.
- Run tests with: `npm test -- --watch=false` · lint: `npm run lint` · fix all issues before finishing.
- After adding async operations to a component constructor (e.g. reachability checks), reset affected signals to `'idle'` in `beforeEach` when testing computed properties that depend on them.
- `SettingsService.load()` normalizes values – specs that test normalization must **not** bypass it by calling `loadSettingsRaw()` directly.
- ESLint rules to watch: `@typescript-eslint/no-explicit-any` (use typed casts), `@typescript-eslint/array-type` (use `T[]` not `Array<T>`), `@typescript-eslint/no-empty-function` (add `void e` body), `@typescript-eslint/no-unsafe-function-type` (use explicit signatures instead of `Function`).
- Components that use `OidcSecurityService` need `{ provide: OidcSecurityService, useValue: { ... } }` in the TestBed providers (the real service requires `StsConfigLoader`).

## Code Style
- See `CODING_STANDARDS.md`. Use Angular signals (`signal`, `computed`), standalone components, `inject()`.
- All OIDC and server configuration comes exclusively from `SettingsService` (localStorage). There are **no** auth defaults in `environment.ts`.
- OIDC `configId` is `'r2p-webclient'` – this is also the `sessionStorage` key used by the OIDC library.
