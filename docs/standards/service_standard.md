# Solaris UI — Service Standard

## Purpose

Services exist to provide reusable infrastructure, not hidden global behavior.

A service must have a clear responsibility.

## Allowed service domains

Services are allowed mainly in:

- core;
- theme;
- i18n;
- a11y;
- overlay;
- icon registry;
- adapters;
- testing utilities.

## Forbidden service patterns

Do not create services that:

- hide component state without need;
- act as global mutable stores;
- couple unrelated domains;
- access browser APIs directly;
- replace simple inputs/outputs;
- create implicit behavior.

## Browser APIs

Services that access browser APIs must be SSR-safe.

Direct usage of these APIs is forbidden without wrappers:

- `window`;
- `document`;
- `localStorage`;
- `sessionStorage`;
- `matchMedia`.

## Testing

Services require:

- unit tests;
- edge case tests;
- SSR safety tests when browser APIs are involved;
- adapter contract tests when applicable.
