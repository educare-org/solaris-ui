# Solaris UI — Definition of Done

## Component Definition of Done

A component is done only when it has:

- approved public API;
- correct domain location;
- correct folder structure;
- token-driven styling;
- light and dark theme support;
- density support when applicable;
- disabled state when applicable;
- loading state when applicable;
- error state when applicable;
- accessibility support;
- keyboard support when interactive;
- i18n support when text exists;
- SSR-safe implementation;
- tests;
- documentation;
- showcase example;
- no forbidden imports;
- no unjustified `any`;
- no hardcoded style values;
- no unsafe DOM access.

## Required tests

See `docs/quality-and-validation/testing-strategy.md` (test pyramid and
coverage targets) for the required set per component kind. Coverage without
meaningful assertions is not accepted.

## Blocking failures

The following block completion:

- broken build;
- broken lint;
- broken typecheck;
- broken tests;
- coverage below required target;
- accessibility issue;
- public API without documentation;
- dependency without justification;
- hardcoded visual values;
- unjustified `any`;
- unsafe DOM usage;
- missing showcase example;
- missing documentation.

## Rule

A component without tests, accessibility, and documentation is not part of Solaris.
