# Solaris UI — Start Here

Solaris UI is an institutional, international, and accessible Angular UI framework.

It is built first for Educare and personal projects, but its architecture must be strong enough for critical products.

## Official package name

```txt
@educarehq/solaris-ui
```

This is the name published to npm. Consumers install and import from it:

```txt
npm install @educarehq/solaris-ui
import { ... } from '@educarehq/solaris-ui';
@use '@educarehq/solaris-ui/styles' as solaris;
```

`@solaris-ui/angular` is only the internal workspace alias used for imports inside this monorepo. It is never published.

## Project thesis

Solaris must be strict for maintainers and simple for consumers.

## What Solaris is

Solaris is:

- an Angular UI framework;
- a design system implementation;
- an accessibility-first component foundation;
- a governed public API;
- a token-driven styling system;
- a test-heavy component platform;
- a framework prepared for institutional products.

## What Solaris is not

Solaris is not:

- a loose component library;
- an Angular Material clone;
- a visual template;
- a collection of random UI snippets;
- a project where flexibility overrides consistency;
- a project where generated code defines architecture.

## Core decisions

- Monorepo: Nx + pnpm.
- Angular: current stable version.
- Components: standalone by default.
- State: signals where they make sense.
- Styling: SCSS + CSS custom properties.
- Accessibility: WCAG 2.2 AA.
- Testing: Vitest, Playwright, Storybook, Angular CDK Harness.
- i18n: native and mandatory.
- Public API: explicit and controlled.
- Security: baseline from day zero.
- Release: SemVer + Changesets.
- Git: GitHub Flow + Conventional Commits.
- Commands: cross-platform by default.
- AI: allowed only inside approved rules and checklists.

## Initial repository shape

```txt
apps/
  showcase/

packages/
  angular/
```

Future packages may exist only when justified:

```txt
packages/
  tokens/
  icons/
  schematics/
  eslint-plugin/
```

## Required reading order

1. `docs/architecture/architecture.md`
2. `docs/engineering/engineering-principles.md`
3. `docs/quality-and-validation/cross-platform-commands.md`
4. `docs/standards/styling-and-tokens.md`
5. `docs/standards/accessibility-standard.md`
6. `docs/standards/i18n-standard.md`
7. `docs/standards/component-standard.md`
8. `docs/quality-and-validation/testing-strategy.md`
9. `docs/engineering/security-baseline.md`
10. `docs/quality-and-validation/definition-of-done.md`
11. `docs/engineering/ai-development-rules.md`

## Non-negotiable rule

A component without tests, accessibility, documentation, and a stable public API is not part of Solaris.
