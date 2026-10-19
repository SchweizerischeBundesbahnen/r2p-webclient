# AGENTS.md

Single-module Angular app (not multi-module); no separate backend in this repo.

## Commands
- Build: `npm run build` (output in `dist/`, ~10 s).
- Tests: `npx ng test --no-watch` (Vitest via Angular builder, jsdom). Plain `npm test` may start watch mode — always pass `--no-watch` in automation.
- Lint: `npm run lint`; dependency rules: `npm run check-deps`.
- Translations: `npm run check-translations` (see below).

## Design & Brand
- Before adding or changing any UI, styling, chrome, or accent, read `docs/design-reference.md`. It is the authoritative brand + interaction contract (vendor-neutral navy + signal-orange + white, flat/no-shadows, the hard colour rules, component and interaction patterns). It must be followed for every UI extension.
- Implemented design tokens are CSS variables in `src/styles.scss` (`:root`) and the Material M3 theme in `src/styles/` — use `var(--navy)`, `var(--orange)`, etc., never hard-coded hex.

## Pitfalls
- Run commands from the repo root; the PowerShell tool has no `&&`, chain with `;`.
- Test output contains `Not implemented: navigation to another Document` on stderr (jsdom). It is harmless, but PowerShell reports it as a `NativeCommandError`; judge success by the Vitest summary, not by that error.
- Node must satisfy `engines` in `package.json` (22.22+/24.15+); the environment provides it.
- Build and tests need no network or extra setup if `node_modules` exists; only run `npm install` if it is missing.

## Project conventions (details in other docs)
- UI/styling: read `docs/design-reference.md` first; use CSS variables from `src/styles.scss`, never hard-coded hex.
- Code style: `CODING_STANDARDS.md`.
- i18n: source locale is en-US (inline `i18n="@@key"` / `$localize`); only `public/locale/messages.de-CH.json` is maintained. After string changes: `ng extract-i18n --output-path src/locale --out-file messages.json --format json`, `npm run sync-translations`, translate `TODO:` entries, then `npm run check-translations`.
- Commits: conventional commits, max 100 chars per line. Agents must not commit or push.

## Code Style
- See `CODING_STANDARDS.md`.

## Ready to commit
- If the user asks if this is ready to commit, please execute the tests , the lint and the translation check. Fix any issues (also preexisting ones) and create a brief git-commit-message.txt file that can be taken as git commit message. Base the file on all work that has been done during the session but be brief and don't mention obvious details e.g added translation keys. Also include the most important decisions or design choices especially new concepts
