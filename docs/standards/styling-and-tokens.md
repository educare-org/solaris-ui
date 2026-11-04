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
radius: none | sm | md | lg | xl | full
```

`radius: xl | full` is forbidden on textual inputs (input, textarea, select,
date pickers). Textual fields allow only `none | sm | md | lg` (`md` is the
default); `xl` and `full` would break text clipping and touch affordance.
`xl | full` remain allowed elsewhere (badges, avatars, toggles).

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
- CSS classes for variants — use `data-size`, `data-color`, `data-variant`,
  `data-appearance`, `data-density` attributes instead;
- deep selectors against Solaris internals;
- CSS that depends on private DOM structure;
- global CSS leakage;
- color-only state communication.

## Appearance semantics

`outline` has two intentional meanings. Do not mix them in new components:

- Transparent `outline` (no background): `button`, `icon-button`, `badge`,
  `alert`/`announcement`, `card`, `checkbox`, `radio`, `switch` (track),
  `selection-card` (unselected), `preview-code` (frame). Idle background is
  `transparent`; semantic `*-soft` tints apply only to `hover`/`active`.
  The border + background combination lives in another appearance.
- Opaque `outline` (background + visible border, never transparent):
  `toast`, `tooltip`, `popover`/`dropdown-menu`, `dialog`, `table`,
  `segmented-control`, `form-field` family (`input`, `textarea`, `select`,
  date pickers, `otp-input`, `file-upload`), `code-block`. These surfaces
  require an opaque background for readability; here `outline` itself is the
  border + background variant and `surface` is the same background without a
  strong border.

Canonical naming for border + background:

- `surface` is the canonical name for neutral border + background containers
  (`card`, `toast`, `popover`, `dialog`, `code-block`).
- `tonal` is reserved for semantic tinted backgrounds (`primary-soft`,
  `success-soft`, …) on components with a `data-color` axis (`badge`,
  `button`, `icon-button`). Legacy divergence is kept for compatibility:
  `badge`/`button` expose border + background as `tonal`, while `alert`
  exposes it as `surface` (`tonal` there means background without border).
  New components must follow the canonical rule above and document which
  `outline` family they belong to.
