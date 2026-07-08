# Solaris UI — Accessibility Standard

## Official baseline

Solaris targets:

```txt
WCAG 2.2 AA
```

## Accessibility rule

Accessibility is a component entry requirement.

It is not a future improvement.

## Interactive components

Interactive components must support:

- keyboard navigation;
- focus-visible;
- proper ARIA;
- disabled behavior;
- screen-reader labels;
- visible and accessible error states;
- reduced motion when applicable.

## Keyboard

Components must document keyboard behavior when interactive.

Examples:

- button activation;
- menu navigation;
- tabs navigation;
- dialog closing;
- stepper movement;
- dropdown movement;
- table interactions.

## Focus

Components must not hide focus.

Components must provide visible focus using Solaris tokens.

Focus management is required for:

- dialog;
- dropdown menu;
- tooltip when interactive;
- tabs;
- stepper;
- select;
- command-like components.

## Labels

Icon-only controls must have accessible names.

Form controls must have associated labels.

Error messages must be associated with controls.

## Disabled behavior

Disabled components must be disabled semantically, not only visually.

## Motion

Reduced motion must be respected.

Animations must not be required to understand state.

## Forbidden

- interactive components without keyboard support;
- focus removed without replacement;
- icon-only buttons without labels;
- visual-only error messages;
- disabled state implemented only through opacity;
- tooltip content required to complete a form;
- color-only state communication.

## Testing

Accessibility tests are required for every public component.

Interactive components must include keyboard tests.
