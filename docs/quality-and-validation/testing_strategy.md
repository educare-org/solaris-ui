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

## CI rule

Local hooks help.

CI decides.
