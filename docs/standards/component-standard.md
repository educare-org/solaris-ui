# Solaris UI — Component Standard

## Component definition

A Solaris component is a governed UI building block with:

- explicit purpose;
- strict public API;
- documented behavior;
- accessibility support;
- theme support;
- i18n support when text exists;
- tests;
- showcase example.

## Component categories

```txt
actions
forms
feedback
overlay
navigation
data-display
interaction
icon
scheduling
```

## Minimum component questions

Before implementing a component, answer:

1. What problem does this component solve?
2. Is it a component, directive, primitive, or pattern?
3. Which domain owns it?
4. What states does it support?
5. What ARIA behavior does it need?
6. What keyboard behavior does it need?
7. Does it integrate with Angular Forms?
8. Does it expose text?
9. Does it require i18n?
10. Does it support SSR?
11. Does it use overlay/focus/portal behavior?
12. Which tokens does it use?
13. Which tests are required?
14. What is its public API?
15. What must not be exposed?

## Mandatory states

When applicable, components must support:

- default;
- hover;
- focus-visible;
- active;
- disabled;
- readonly;
- loading;
- error;
- success;
- warning;
- selected;
- expanded;
- collapsed;
- empty;
- skeleton.

## File organization

Required shape:

```txt
button/
  component/              .ts, .html, .scss (wiring only — no exported types, no utils)
  model/                  types, defaults, consts (data only — no Angular imports)
  functions/              pure logic, utils, helpers (no Angular imports, testable)
  translation/            pt-BR.json, en-US.json, es-419.json + index.ts
  testing/                spec files, harnesses (never beside the component file)
  docs/                   component docs
  token/                  optional — only when the component owns tokens
  service/                optional — only when the component owns a service
  directives/             optional — only when the component owns directives
  index.ts                barrel export (only public entry point)
```

`component/` holds wiring: inputs, outputs, signals, lifecycle, DOM glue.
`model/` holds data: types, interfaces, defaults, consts. It must not import
Angular. `functions/` holds logic: pure functions and utils extracted from
the component so they are independently testable. It must not import Angular
or browser globals. `translation/` ships all three locales
(`pt-BR`, `en-US`, `es-419`) — enforced by `check-translation.mjs`.
Specs and harnesses live in `testing/` (never beside the component file).
`token/`, `service/`, and `directives/` folders live alongside only when the
component needs them, per `docs/architecture/architecture.md` (accepted, not
a violation). `validate-component.mjs` requires `functions/` for new
components and warns on contract drift in existing ones (missing `functions/`,
types or helpers inside `component/`, Angular value imports inside `model/`);
warnings become blocking errors once the migration completes.

## Folder import contract

| Folder         | May import Angular | May import browser globals | May export types | May export functions |
| -------------- | ------------------ | -------------------------- | ---------------- | -------------------- |
| `component/`   | yes                | via SSR-safe wrappers only | no               | no                   |
| `model/`       | no                 | no                         | yes              | consts/defaults only |
| `functions/`   | no                 | no                         | yes              | yes                  |
| `translation/` | no                 | no                         | maps only        | no                   |
| `testing/`     | yes                | yes (guarded)              | no               | helpers for tests    |

Mixing models and functions inside the component file is an error, including
in showcase pages (see showcase structure below).

## Public API

Every public component must be exported through the official public API.

Consumers must not import internal files.

## Inputs and outputs

Use explicit names.

Good:

```txt
appearance
variant
density
disabled
loading
pressed
selectedChange
openedChange
valueChange
selected (+ selectedChange as a pair — bare `selected` input alone is forbidden)
```

Bad:

```txt
type
mode
data
event
changed
callback
```

## Angular Forms

Real form controls must implement `ControlValueAccessor`.

They must support:

- disabled state;
- touched state;
- invalid state;
- value updates;
- Reactive Forms tests;
- accessible error messages.

## i18n

Components with user-facing text must support direct text and translation keys:

```txt
label / labelKey
title / titleKey
description / descriptionKey
ariaLabel / ariaLabelKey
```

Every dictionary ships `pt-BR`, `en-US`, and `es-419` — enforced by CI.
Values identical to `en-US` are allowed (proper nouns, brand and market
terms stay in English). See `docs/standards/i18n-standard.md`.

Hardcoded public text is forbidden.

## Accessibility

Interactive components must support:

- keyboard interaction;
- focus-visible;
- proper roles;
- proper ARIA attributes;
- disabled behavior;
- screen-reader meaningful labels.

## Styling

Components must use:

- CSS custom properties;
- Solaris tokens;
- px-based values;
- local component styles.
- `data-*` attributes for variants (`data-size`, `data-color`,
  `data-variant`, `data-appearance`, `data-density`) — never CSS classes
  for variants.

Raw values are forbidden unless technically justified.

## Required tests

At minimum:

- component test;
- state tests;
- accessibility test;
- keyboard test for interactive components;
- Reactive Forms test for form controls;
- harness test when applicable;
- public API check when released.

## Component approval rule

A component without tests, accessibility, documentation, and showcase coverage is not complete.
