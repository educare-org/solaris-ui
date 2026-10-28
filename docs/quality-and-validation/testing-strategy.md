# Solaris UI — Testing Strategy

## Official testing stack

Solaris uses:

- Vitest for unit and component tests;
- Playwright for E2E, showcase, and visual checks;
- Storybook for isolated documentation and interaction examples;
- Angular CDK Harness for stable component testing APIs.

## Test pyramid

Solaris testing must include:

1. Static checks.
2. Unit tests.
3. Component tests.
4. Harness tests.
5. Accessibility tests.
6. Keyboard interaction tests.
7. Reactive Forms integration tests.
8. E2E tests in showcase.
9. Visual regression for critical components.
10. Public API and package validation tests.

## Static checks

Required:

- TypeScript strict;
- Angular strict templates;
- ESLint;
- Prettier;
- Nx boundaries;
- circular dependency detection;
- package validation.

## Unit tests

Required for:

- utilities;
- adapters;
- services;
- validators;
- formatters;
- state helpers;
- pure functions.

## Component tests

Required for:

- rendering;
- inputs;
- outputs;
- signals;
- classes;
- attributes;
- states;
- content projection;
- theme behavior;
- i18n behavior.

## Harness tests

Required for complex or interactive components, including:

- select;
- dialog;
- dropdown menu;
- tabs;
- segmented control;
- stepper;
- table;
- phone input.

## Accessibility tests

Every public component requires accessibility validation.

Interactive components must validate:

- keyboard support;
- focus behavior;
- ARIA attributes;
- roles;
- labels;
- error announcements;
- disabled behavior.

## Form tests

Form controls must include tests for:

- `ControlValueAccessor`;
- disabled state;
- touched state;
- value propagation;
- invalid state;
- error message association;
- Reactive Forms usage.

## Visual tests

Visual regression is required for critical components:

- button;
- card;
- badge;
- input;
- dialog;
- menu;
- tabs;
- stepper;
- table;
- toast;
- alert.

## Coverage targets

Enforced by `vitest-base.config.ts` and the `test:coverage` target:

```txt
global: statements 85% | branches 85% | functions 85% | lines 85%
core/adapters: 95% (goal)
critical components: 90% (goal)
```

The `85%` branch threshold is enforced globally (current: 85.07%). Integration
tests covering hover/placement/keyboard/overlay combinations in `multi-select`,
`select`, and `dropdown-submenu` keep the branch target above `85%`. Do not lower
the threshold silently; add targeted branch tests instead.

Coverage without meaningful assertions is not accepted.

## SSR + hydration tests

Two spec kinds cover server rendering, both matched by `test:ssr`
(`vitest.ssr.config.ts`, against the built `dist/` bundle):

- `*.ssr.spec.ts` (node environment): `renderApplication` assertions only —
  the server can serialize the component (node structure, `hidden` state,
  container counts). Necessary but not sufficient: these never claim the
  DOM, so projection mismatches (NG0500) pass silently here.
- `*.hydration.ssr.spec.ts` (jsdom environment): full SSR + hydration
  matrix via `lib/testing/hydration/hydration-harness.ts`. Each scenario
  renders on the server with
  `renderApplication`, installs the HTML into the document, bootstraps the
  same host on the client with `provideClientHydration(withEventReplay())`,
  and fails on any NG0500–NG0505 mismatch or hydration warning. Scenarios
  cover empty/valued, `disabled`/`readonly`/`loading`, error, projected
  prefix/suffix/actions placement, icon inputs, and post-hydration input
  propagation (listener survival — the observable signal of the NG0500
  class of defects).

Run:

```bash
pnpm nx run angular:test:ssr                      # build + full SSR/hydration matrix
npx vitest run --config packages/angular/vitest.ssr.config.ts \
  packages/angular/src/lib/components/forms/email-field/testing/email-field.hydration.ssr.spec.ts --no-coverage
```

Projection contract (enforced by the matrix): wrapper-style field presets
must NOT declare their own selective nodes (anything matching
`[solaris-form-prefix]` / `[solaris-form-suffix]` /
`[solaris-form-suffix-action]`) as light DOM of the inner
`solaris-form-field` mixed with re-projection outlets — dehydrated slot
bookkeeping then disagrees with the client claim walk (NG0500). Icon
affixes go through the `prefix`/`suffix` inputs; chrome buttons go through
the `prefixTemplate`/`suffixTemplate`/`suffixActionTemplate` inputs as
`ng-template` references (visibility via `[hidden]`, never a structural
gate over replay-mutable state).

True pre-hydration event replay (typing between SSR paint and hydration
completion) additionally requires the early jsaction contract
(`window._ejsas`) inlined by the application shell, which
`renderApplication` does not emit — so it is covered by consumer-side E2E,
not by this harness (see the consumer validation note in the release
policy).

## CI rule

Local hooks help.

CI decides.
