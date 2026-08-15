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

Recommended shape:

```txt
button/
  component/
    button.component.ts
    button.component.html
    button.component.scss
    button.component.spec.ts
  model/
    button.types.ts
  testing/
    button.harness.ts
  docs/
    button.md
  index.ts
```

The structure must not be inflated when not needed.

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
selected
valueChange
selectedChange
openedChange
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
