# Agent Instructions

## Design & Brand
- Before adding or changing any UI, styling, chrome, or accent, read `docs/design-reference.md`. It is the authoritative brand + interaction contract (vendor-neutral navy + signal-orange + white, flat/no-shadows, the hard colour rules, component and interaction patterns). It must be followed for every UI extension.
- Implemented design tokens are CSS variables in `src/styles.scss` (`:root`) and the Material M3 theme in `src/styles/` — use `var(--navy)`, `var(--orange)`, etc., never hard-coded hex.

## Ready to commit
- If the user asks if this is ready to commit, please execute the tests , the lint and the translation check. Fix any issues (also preexisting ones) and create a brief git-commit-message.txt file that can be taken as git commit message. Base the file on all work that has been done during the session but be brief and don't mention obvious details e.g added translation keys. Also include the most important decisions or design choices especially new concepts

## Git messages
- Need to follow the conventional commit standard which includes the rule to have max. 100 chars per line
- Always use `git --no-pager` to prevent interactive pager output,
  e.g. `git --no-pager diff --name-only`, `git --no-pager log --oneline -10`

## i18n
- `en-US` is the **source locale** — its text lives in the `i18n="@@key"` / `$localize` defaults and is never loaded at runtime, so there is **no** `messages.en-US.json` to maintain. Only `public/locale/messages.de-CH.json` is a real translation file.
- After changing strings, run `ng extract-i18n --output-path src/locale --out-file messages.json --format json` to update the source file, then run `npm run sync-translations` to sync de-CH.json (it marks missing keys as `TODO:`). Fill in the German translation for any `TODO:` entries.
- Always run `npm run check-translations` before finishing and treat all issues.

## Code Style
- See `CODING_STANDARDS.md`.
