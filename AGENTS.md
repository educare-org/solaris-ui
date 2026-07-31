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

## Before coding, read

1. `docs/architecture/architecture.md` — modular architecture
2. `docs/engineering/engineering_principles.md` — core principles
3. `docs/standards/styling_and_tokens.md` — token-driven styling
4. `docs/standards/accessibility_standard.md` — WCAG 2.2 AA
5. `docs/standards/component_standard.md` — component API, states, file structure
6. `docs/quality-and-validation/testing_strategy.md` — what and how to test
7. `docs/quality-and-validation/definition_of_done.md` — acceptance criteria
8. `docs/engineering/ai_development_rules.md` — AI constraints
9. `docs/ai/phase-plan.md` — current phase status

## Project structure

```
apps/
  showcase-e2e/             Playwright E2E tests

packages/angular/src/lib/
  components/{category}/{name}/
    component/              .ts, .html, .scss
    model/                  types, tokens
    testing/                spec files
    docs/                   component docs
    index.ts                barrel export
  services/                 theme, i18n, accessibility, icon
  styles/                   SCSS tokens, mixins
  testing/                  testing utilities

docs/                       guides, ADRs, architecture, standards
tools/scripts/              validation, check scripts
```

## Non-negotiable rules

- **Standalone components only** — never create an NgModule
- **Signal inputs/outputs** — use `input()`, `output()`, `model()`, never decorators
- **OnPush change detection** — always
- **Separate template file** — never inline template in `.ts`
- **Separate stylesheet** — never inline styles
- **Token-driven colors** — never raw color values; always use `--solaris-*` variables
- **No CSS fallbacks** — never provide a fallback for a design token
- **Data attributes for variants** — `data-size`, `data-color`, `data-variant`, not CSS classes
- **ARIA required** — every interactive element must have appropriate aria attributes
- **Spec + docs + changeset required** — never create a component without all three
- **Cross-platform commands** — never bash-only or PowerShell-only syntax in scripts

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
| Component Standard     | `docs/standards/component_standard.md`              |
| Creating a Component   | `docs/guides/creating-a-component.md`               |
| Theme Customization    | `docs/guides/theme-customization.md`                |
| Icon System            | `docs/guides/icons.md`                              |
| Architecture           | `docs/architecture/architecture.md`                 |
| Engineering Principles | `docs/engineering/engineering_principles.md`        |
| Styling & Tokens       | `docs/standards/styling_and_tokens.md`              |
| Accessibility          | `docs/standards/accessibility_standard.md`          |
| Testing Strategy       | `docs/quality-and-validation/testing_strategy.md`   |
| Definition of Done     | `docs/quality-and-validation/definition_of_done.md` |
| AI Dev Rules           | `docs/engineering/ai_development_rules.md`          |
| ADRs                   | `docs/adr/ADR-0001-standalone-components.md`        |
| Phase Plan             | `docs/ai/phase-plan.md`                             |
