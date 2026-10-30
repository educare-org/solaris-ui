# Solaris UI — Agent Guide

## What is Solaris?

Solaris is an institutional Angular UI framework built for Educare.
It is strict for maintainers and simple for consumers.
Every component ships with tests, accessibility, documentation, and a stable public API.

**Stack:** Angular 21+, standalone components, signals, SCSS + CSS custom properties, Vitest, Playwright, Storybook.

## Quick start

```bash
pnpm install
pnpm test            # unit + component tests
pnpm storybook       # open Storybook
pnpm nx e2e showcase-e2e -- --project=chromium
```

## Before coding, read (mandatory)

1. `docs/architecture/architecture.md` — modular architecture, folder contract
2. `docs/standards/component-standard.md` — component API, states, file structure
3. `docs/standards/styling-and-tokens.md` — token-driven styling
4. `docs/standards/motion-standard.md` — minimal motion guards
5. `docs/standards/i18n-standard.md` — pt-BR + en-US + es-419, English names stay

Further reference (read as needed): `accessibility-standard.md`,
`showcase-content-standard.md`, `testing-strategy.md`,
`definition-of-done.md`, `ai-development-rules.md`, `engineering-principles.md`.

## Project structure

```
apps/
  showcase-e2e/             Playwright E2E tests

packages/angular/src/lib/
  components/{category}/{name}/
    component/              .ts, .html, .scss (wiring only)
    model/                  types, defaults (no Angular imports)
    functions/              pure logic, utils (no Angular imports)
    translation/            pt-BR.json, en-US.json, es-419.json
    testing/                spec files
    docs/                   component docs
    index.ts                barrel export
  services/                 theme, translation, accessibility, icon, export
  styles/                   SCSS tokens, mixins
  testing/                  testing utilities

docs/                       guides, ADRs, architecture, standards
tools/scripts/              validation, check scripts
```

Showcase pages mirror the same separation: `component/` (wiring),
`model/` (page data), `functions/` (page actions), `translation/` (triple locale).

## Non-negotiable rules

- **Standalone components only** — never create an NgModule
- **Signal inputs/outputs** — use `input()`, `output()`, `model()`, never decorators
- **OnPush change detection** — always
- **Separate template file** — never inline template in `.ts`
- **Separate stylesheet** — never inline styles
- **Folder contract** — `component/` wiring only (no exported types/utils); `model/` data only (no Angular value imports); `functions/` pure logic (no Angular or browser globals). Enforced by `validate-component.mjs` (purity errors block CI; drift in existing code warns until migration completes)
- **Token-driven colors** — never raw color values; always use `--solaris-*` variables
- **No CSS fallbacks** — never provide a fallback for a design token
- **Data attributes for variants** — `data-size`, `data-color`, `data-variant`, not CSS classes
- **ARIA required** — every interactive element must have appropriate aria attributes
- **Reduced motion required** — every transition/animation ships the doubled guard; motion is never the only state channel; no flashing loops. Motion beyond that is free
- **Triple locale required** — every dictionary and showcase page ships `pt-BR` + `en-US` + `es-419`; identical-to-English values allowed for proper nouns and market terms
- **English only** — branch names, docs, file names, and code identifiers are always in English
- **Spec + docs + changeset required** — never create a component without all three
- **No autonomous commits** — never commit, push, or publish without explicit human validation for each action
- **Cross-platform commands** — never bash-only or PowerShell-only syntax in scripts
- **Commit standard** — Conventional Commits enforced by commitlint. Types: `feature`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Use `feature`, never `feat`. Subject in lowercase or camelCase for API names (e.g. `feature(schematics): add provideSolaris setup`). See `docs/workflow-and-release/branching-and-commits.md`.

## Reference

| Command                    | Description                          |
| -------------------------- | ------------------------------------ |
| `pnpm test`                | Run all unit tests                   |
| `pnpm test:watch`          | Watch mode                           |
| `pnpm test:coverage`       | With coverage report                 |
| `pnpm nx e2e showcase-e2e` | Run E2E tests                        |
| `pnpm storybook`           | Start Storybook                      |
| `pnpm build-storybook`     | Build Storybook static               |
| `pnpm check`               | Static checks (lint, tokens, deps)   |
| `pnpm verify`              | Full pipeline (check + test + build) |

| Doc                    | Location                                            |
| ---------------------- | --------------------------------------------------- |
| Component Standard     | `docs/standards/component-standard.md`              |
| Motion Standard        | `docs/standards/motion-standard.md`                 |
| I18n Standard          | `docs/standards/i18n-standard.md`                   |
| Showcase Standard      | `docs/standards/showcase-content-standard.md`       |
| Creating a Component   | `docs/guides/creating-a-component.md`               |
| Theme Customization    | `docs/guides/theme-customization.md`                |
| Icon System            | `docs/guides/icons.md`                              |
| Architecture           | `docs/architecture/architecture.md`                 |
| Engineering Principles | `docs/engineering/engineering-principles.md`        |
| Styling & Tokens       | `docs/standards/styling-and-tokens.md`              |
| Accessibility          | `docs/standards/accessibility-standard.md`          |
| Testing Strategy       | `docs/quality-and-validation/testing-strategy.md`   |
| Definition of Done     | `docs/quality-and-validation/definition-of-done.md` |
| AI Dev Rules           | `docs/engineering/ai-development-rules.md`          |
| ADRs                   | `docs/adr/ADR-0001-standalone-components.md`        |
