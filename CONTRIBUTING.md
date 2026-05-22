# Contributing

Thank you for contributing to {{PROJECT_NAME}}.

This document describes how to propose changes, report issues, and work with the maintainers. Replace any remaining `{{TOKEN_NAME}}` placeholders before making a repository public.

## Code of Conduct

Participation in this repository is governed by the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before You Start

- Read the [README.md](README.md) for project setup, support channels, and scope.
- Review the [CODING_STANDARDS.md](CODING_STANDARDS.md) file before submitting code changes.
- If the repository contains architecture or design documentation, read that before proposing larger changes.

## Questions and Support

- Use the support channel documented in [README.md](README.md).
- Use GitHub Discussions if the repository has Discussions enabled.
- Do not use public issues for private security reports. Follow the repository security reporting instructions.

## Reporting Bugs

When reporting a bug, include the following:

- a concise summary of the problem
- exact steps to reproduce it
- expected behavior and actual behavior
- environment details such as OS, runtime, browser, and version
- logs, screenshots, or a minimal reproduction when available

## Requesting Features

- Explain the problem you want to solve, not only the proposed solution.
- For large changes, open an issue or discussion before implementing code.
- For small and well-scoped improvements, a pull request may be acceptable directly.

## Pull Request Expectations

- Keep pull requests focused and easy to review.
- Add or update tests when the change affects behavior.
- Update documentation when setup, behavior, or public APIs change.
- Call out breaking changes explicitly.
- Make sure all relevant checks pass before requesting review.

## Commit Messages

This template recommends [Conventional Commits](https://www.conventionalcommits.org/). If the repository uses automated release notes, follow the configured convention consistently.

## Review Process

- Maintainers may request changes, clarification, tests, or documentation updates before merge.
- Approval does not guarantee merge if new risks are discovered later in review.
- Rebase or merge from the default branch when requested by maintainers.

## Translations (i18n)

All user-facing strings are externalised via Angular's built-in i18n.

| File | Purpose |
|---|---|
| `src/locale/messages.json` | Auto-generated source of truth (English, `en-US`) – **do not edit manually** |
| `public/locale/messages.de-CH.json` | German (Switzerland) translations – edit here |

### Workflow: adding or changing a string

1. Use `$localize` / `i18n` attribute in the template as usual.
2. Run `npm run extract-i18n` – this re-generates `src/locale/messages.json` **and** automatically merges new keys into every locale file, marking them as `TODO: <English source>`.
3. Search for `TODO:` in `public/locale/messages.de-CH.json`, translate the marked strings, and remove the `TODO:` prefix.
4. Commit both `messages.json` and the updated locale file(s) together.

### CI check

`npm run check-translations` exits with code 1 if any locale file is missing keys or contains obsolete ones. This is intended for use in CI pipelines.

## Maintainer Notes

Replace this section with repository-specific contribution details if the project needs additional guidance, such as development commands, local tooling, CLA requirements, or architecture review expectations.
