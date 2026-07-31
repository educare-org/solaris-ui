# Solaris UI — Consumer Setup Policy

## Purpose

Solaris must be easy to install and safe to configure.

## Installation rule

Package installation must not silently mutate consumer files.

Correct:

```txt
pnpm add @educarehq/solaris-ui
pnpm exec nx g @educarehq/solaris-ui:init
```

or:

```txt
ng add @educarehq/solaris-ui
```

Wrong:

```txt
postinstall script modifies consumer files silently
```

## Generator/schematic responsibilities

The setup generator should:

1. Detect the Angular workspace.
2. Detect whether the project uses SCSS.
3. Find the global styles file.
4. Create an editable Solaris style setup file.
5. Import that file from the global styles entry.
6. Add `provideSolaris(...)` to application config when possible.
7. Configure theme defaults.
8. Configure i18n defaults.
9. Configure root font-size strategy when selected.
10. Avoid overwriting user changes silently.
11. Print clear messages about every change.

## Recommended style setup file

```txt
src/styles/solaris.scss
```

Conceptual shape:

```scss
@use '@educarehq/solaris-ui/styles' as solaris;

@include solaris.core();

@include solaris.theme(
  (
    color-scheme: system,
    density: comfortable,
    radius: md,
  )
);
```

## Editable consumer configuration

Consumers may edit supported options:

```txt
colorScheme
density
radius
typographyScale
reducedMotion
defaultLocale
fallbackLocale
```

## Forbidden customization

Consumers must not customize Solaris through:

- private DOM structure;
- internal CSS classes;
- private CSS variables;
- deep selectors;
- internal package paths.

## Rule

The consumer customizes by contract, not by invasion.
