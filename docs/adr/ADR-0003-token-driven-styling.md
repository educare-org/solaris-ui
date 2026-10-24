# ADR-0003: Token-driven Styling

## Status

Accepted

## Context

Components need a consistent visual language. Without a shared token system, each component defines its own colors, spacing, and typography, leading to visual drift.

## Decision

All visual properties MUST use CSS custom properties (design tokens) with the `--solaris-*` prefix. Raw values (hex colors, rem lengths) are forbidden in component styles.

Tokens are organized by category:

- Color: `--solaris-{role}-{variant}` (e.g. `--solaris-primary-solid`)
- Spacing: `--solaris-spacing-{n}` (1-20, based on 4px grid)
- Radius: `--solaris-radius-{size}`
- Font: `--solaris-font-{family|size|weight}-{variant}`
- Shadow: `--solaris-shadow-{size}`
- Opacity: `--solaris-opacity-{n}`

Theme files in `packages/angular/src/styles/token/color/` define token values per theme (light, dark, high-contrast).

## Consequences

Positive:

- Single source of truth for visual properties
- Theme switching works automatically
- Consumers can override individual tokens
- Visual consistency across all components

Negative:

- Debugging requires tracing token resolution through DevTools
- New tokens must be added to all theme files

## Compliance

Enforced by `check-token-references.mjs` (validates token usage) and `check-tokens.mjs` (validates token definitions).
