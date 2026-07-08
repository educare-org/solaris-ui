# Solaris UI — Dependency Policy

## Dependency principle

Dependencies are liabilities until proven valuable.

## Before adding a dependency

Answer:

1. What problem does it solve?
2. Is the problem real now?
3. Is there an Angular/CDK/native alternative?
4. Is the package maintained?
5. Is the license compatible?
6. Is it tree-shakable?
7. Does it support SSR?
8. Does it work with strict TypeScript?
9. What is the bundle impact?
10. Is it easy to replace?
11. Should it be a dependency, peer dependency, or dev dependency?
12. Does it introduce security risk?

## Preferred dependencies

- Angular CDK for infrastructure;
- Vitest for tests;
- Playwright for E2E and visual checks;
- Storybook for isolated component documentation;
- Changesets for release management.

## Not allowed by default

- Tailwind inside the library;
- heavy date libraries in core;
- icon family lock-in;
- state management frameworks in core;
- dependencies that mutate consumers on install.

## Icon policy

Solaris uses a generic icon registry.

It must not be locked to one icon family.

## Date policy

Solaris starts with `Intl` and date adapters.

Date libraries may be evaluated only when datepicker/calendar components require them.

## Mask policy

Masks should use a small internal implementation or adapter.

Heavy masking dependencies are not allowed on day zero.
