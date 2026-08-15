# Solaris UI — Styling and Tokens

## Styling stack

Solaris uses:

- SCSS;
- CSS custom properties;
- px-based design tokens;
- controlled theme providers.

Tailwind is forbidden inside the Solaris library.

## Unit strategy

Solaris uses a px-based typography, spacing, sizing, and radius strategy.

All design tokens are expressed in `px` so rendering is deterministic. Solaris is a library and cannot control the consumer's root font-size; a consumer who sets a custom root font-size (e.g. `62.5%`) would silently rescale `rem`-based components and break the intended layout. `px` values are immune to that.

WCAG 1.4.4 (Resize Text) is satisfied by page zoom, which scales `px`-based layouts in every modern browser.

## Token rule

Typography, spacing, sizing, and radius tokens must use `px`.

Relative units are allowed only where the relationship is required:

- `vw` / `dvh` for viewport-sized overlays (e.g. fullscreen dialog, toast container);
- `em` for `letter-spacing`, which is relative to the element's font-size;
- `%`, `fr`, and unitless values where appropriate.

Raw `rem` values are forbidden in component styles unless technically justified.

## Allowed customization

Consumers may customize Solaris through supported options only:

```txt
colorScheme: light | dark | system
density: compact | normal | comfortable
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
- normal density;
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
    density: normal,
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
