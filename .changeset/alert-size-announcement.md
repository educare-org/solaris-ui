---
'@educarehq/solaris-ui': minor
---

Refactor alert with the size × density matrix and add the announcement banner.

**Alert**

- New `size` input (`sm | md | lg`, default `md`): size selects the
  padding/gap step (`--solaris-density-padding-*` /
  `--solaris-density-gap-*`) while the effective density resolves the
  value — the same tier composition as Card `data-padding`, so all 9
  `size × density` combinations resolve distinctly. Typography follows
  the pilot scale (`sm → xs`, `md → sm`, `lg → md`) with matching
  icon/close sizes. `md + normal` keeps previous visuals.
- `hasTitle` is now an optional override (`boolean | undefined`): title
  presence is auto-detected from a projected `[solaris-alert-title]`
  (`data-has-title` + first-line typography bump work without the input).
- `density` is explicitly `input<T | undefined>` with
  `effectiveDensity` fallback to the theme density; host uses
  `data-size` + `data-density(effective)`.
- Boolean host bindings follow the presence pattern (`|| undefined`).
- `radius` gains `'none'` (square, for full-bleed banners).
- Stories rewritten against the real API (title/description directives).
- `surface` appearance now carries the `tonal` colors (soft variant
  background + semantic text) with a visible variant border, so it no
  longer looks identical to `outline`. `tonal` is now borderless to
  keep the four appearances distinct.

**Announcement (new `solaris-announcement`)**

- Thin full-bleed container over `solaris-alert`: free `ng-content`
  (text, links, images, animated blocks, image backgrounds via
  `variant="custom"` + `--solaris-alert-custom-*` tokens inherited
  from the host).
- `align` (`center` default), `sticky` (default `true`,
  `--solaris-z-index-sticky`), `size`/`density`/`variant`/`appearance`
  passthrough, `radius` default `'none'`.
- `closable` (default `true`) stays in-flow so container padding is
  always respected; `dismissed` mirrors Alert semantics.
- `dismissKey` persists dismissal in `localStorage` (SSR-safe,
  best-effort) with `is/persist/clearSolarisAnnouncementDismissed`
  helpers for `*ngIf` guards.
- Polite live region by default (`role="status"`); inner alert stays silent.

**Showcase**

- Alert page rewritten to the pilot standard (`docs-page-layout`,
  `preview-code` per example, variant/appearance `solaris-tabs`,
  interactive size + density with computed `code()`, simple
  installation, props placeholder, mirrored `en-US`/`pt-BR`).
- Showcase alert page: variants + appearances share one preview with two
  selector tabs (button pattern); announcement section with basic
  (Brex-style), persistent (`dismissKey`) and image-background
  (`custom` variant) examples switching through tabs; announcement
  banner content flows as a single wrapping row.

**Follow-ups (documented only)**

- Alert auto-dismiss timer/progress (toast owns timed messages).
- `border-position` accent styles (`left-accent` / `top-accent`).
- Announcement stack manager / marquee built-in (project animated content).
