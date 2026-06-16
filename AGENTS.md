# Agent Instructions

## Ready to commit
- If the user asks if this is ready to commit, please execute the tests , the lint and the translation check. Fix any issues (also preexisting ones) and create a brief git-commit-message.txt file that can be taken as git commit message. Base the file on all work that has been done during the session but be brief and don't mention obvious details e.g added translation keys. Also include the most important decisions or design choices especially new concepts

## Git messages
- Need to follow the conventional commit standard which includes the rule to have max. 100 chars per line
- Always use `git --no-pager` to prevent interactive pager output,
  e.g. `git --no-pager diff --name-only`, `git --no-pager log --oneline -10`

## Angular 21
- Be aware that you have limited knowledge about Angular 21. Use the docs/forms-reference.md, docs/signal-reference.md and docs/testing-reference.md to get up to date information when working with signals, forms or testing.
- Avoid importing Modules, import the standalone components instead (e.g. Angular Material provides standalone components)

## i18n
- `en-US` is the **source locale** — its text lives in the `i18n="@@key"` / `$localize` defaults and is never loaded at runtime, so there is **no** `messages.en-US.json` to maintain. Only `public/locale/messages.de-CH.json` is a real translation file.
- After changing strings, run `ng extract-i18n --output-path src/locale --out-file messages.json --format json` to update the source file, then run `npm run sync-translations` to sync de-CH.json (it marks missing keys as `TODO:`). Fill in the German translation for any `TODO:` entries.
- Always run `npm run check-translations` before finishing and treat all issues.

## Testing
- Uses **Vitest**. Import: `import { vi, describe, it, expect, beforeEach } from 'vitest'`
- No Jasmine: use `vi.fn()`, `toBe(true/false)` – not `spyOn`, `toBeTrue`, `toBeFalse`.
- Run tests with: `npm test` (runs via `ng test`). **Never use `npx vitest run` directly** — it bypasses Angular's test environment setup and produces false negatives.
- Run tests without watch mode: `npm test -- --watch=false` · lint: `npm run lint` · fix all issues (also preexisting ones!) before finishing.
- After adding async operations to a component constructor (e.g. reachability checks), reset affected signals to `'idle'` in `beforeEach` when testing computed properties that depend on them.
- `SettingsService.load()` normalizes values – specs that test normalization must **not** bypass it by calling `loadSettingsRaw()` directly.
- Components that use `OidcSecurityService` need `{ provide: OidcSecurityService, useValue: { ... } }` in the TestBed providers (the real service requires `StsConfigLoader`).

## ESLint
- Run lint with: `npm run lint` · fix all issues (also preexisting ones!) before finishing.
- `@typescript-eslint/no-explicit-any` – use typed casts instead of `any`.
- `@typescript-eslint/array-type` – use `T[]` not `Array<T>`.
- `@typescript-eslint/no-empty-function` – add `void e` body to empty functions.
- `@typescript-eslint/no-unsafe-function-type` – use explicit signatures instead of `Function`.
- `@typescript-eslint/prefer-function-type` – **Type literal call signatures:** use function type syntax `(() => ReturnType)` instead of `{ (): ReturnType }` in type casts.

## Code Style
- See `CODING_STANDARDS.md`. Use Angular signals (`signal`, `computed`), standalone components, `inject()`.
- All OIDC and server configuration comes exclusively from `SettingsService` (localStorage). There are **no** auth defaults in `environment.ts`.
- OIDC `configId` is `'r2p-webclient'` – this is also the `sessionStorage` key used by the OIDC library.
