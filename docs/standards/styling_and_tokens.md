# Solaris UI — Styling and Tokens

## Styling stack

Solaris uses:

- SCSS;
- CSS custom properties;
- rem-based design tokens;
- controlled theme providers.

Tailwind is forbidden inside the Solaris library.

## Root font-size strategy

Solaris uses a rem-based typography and spacing strategy.

Solaris keeps the browser default root font-size (100%, typically `16px`).

Setting a custom root font-size (e.g. `62.5%` to make `1rem` equal `10px`) is forbidden because it breaks WCAG 1.4.4 (Resize Text). Tokens use `rem` and scale with the user's font-size preference.

## Token rule

Typography, spacing, sizing, and radius tokens must use `rem`.

Raw `px` values are forbidden in component styles unless technically justified.

## Allowed customization

Consumers may customize Solaris through supported options only:

```txt
colorScheme: light | dark | system
density: compact | comfortable
radius: none | sm | md | lg | xl
```

Custom arbitrary values are not allowed unless explicitly supported.

Forbidden:

```txt
radius: "17.5px"
density: "random-density"
```

## Theme modes

Required:

- light;
- dark;
- system;
- reduced motion;
- compact density;
- comfortable density.

High contrast must be provisioned from the foundation.

## CSS rule

Components must not depend on application global styles except official Solaris setup.

## Consumer setup

Solaris must provide an explicit setup generator/schematic that creates or updates the consumer style setup.

Recommended consumer file:

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

The exact API may evolve before implementation, but the rule remains:

Consumer customization must happen through documented setup contracts.

## Forbidden styling practices

- hardcoded component spacing;
- hardcoded component font sizes;
- hardcoded component radii;
- deep selectors against Solaris internals;
- CSS that depends on private DOM structure;
- global CSS leakage;
- color-only state communication.
