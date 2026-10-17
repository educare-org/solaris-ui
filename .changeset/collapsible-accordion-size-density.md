---
'@educarehq/solaris-ui': minor
---

Refactor collapsible and accordion with the size x density matrix.

**Collapsible**

- New `density` input (`compact | normal | comfortable | undefined`, default `undefined`): standalone it falls back to the theme density; inside an accordion the container `density` always wins, matching `size` and `appearance`.
- Full 3x3 `size x density` matrix: `size` selects the label/icon/padding step (sm: 16px label + 18px chevron, md: 18px + 20px, lg: 20px + 24px, all from `--solaris-font-size-*`), the effective density resolves the padding/gap tier (`--solaris-density-padding-*` / `--solaris-density-gap-*`), and the trigger `min-height` always equals its `--solaris-control-height-<density>-<size>` ladder token (28-52px). This fixes the disproportionate chevron left behind by the spacing rescale (the icon was pinned to `--solaris-spacing-4`, now 6px).
- Host now exposes effective `data-size` + `data-density`, with normal-density fallbacks while density resolves.

**Accordion**

- New `density` input (same contract, theme fallback) exposed as `data-density`; the section gap now follows the density gap tier instead of a raw spacing token.
- Container `size`/`density` propagate to every item and win over per-item inputs, so all sections share the same geometry; `SOLARIS_ACCORDION` exposes `effectiveDensity` for controlled items.

The showcase gains docs-page layouts for both with interactive appearance and size x density sections, mirrored `en-US`/`pt-BR` strings.

Panel collapse uses `minmax(0, 0fr)`/`minmax(0, 1fr)`: bare `0fr` does not
collapse the track in Chromium (it resolves to the content height, leaking
8px of panel padding into the closed card), while the `minmax` clamp truly
reaches zero with the expand animation preserved.

Removed the legacy `--solaris-collapsible-header-inset-top` top margin on the
boxed header: with the trigger geometry now owned by the matrix it only broke
the card's vertical symmetry (4px top, 0 bottom). The closed card is now
symmetric (trigger + 1px borders each side).

Fixed collapsed-panel content leak (calendar shell "Opções de exibição"):
the zero track left `panel-inner` with an 8px border box (`content-box`
padding-bottom), leaking the first checkbox sliver over the following
content. `padding-bottom` is now 0 while collapsed and resolves to the
density tier only when open (animated with the same motion tokens).

Build note: the collapsible 3x3 matrix adds ~6kB of raw CSS to the global
stylesheet, pushing the showcase `initial` bundle 2.37kB over the previous
2.95mb error budget, so `maximumError` moves 2.95mb to 3mb (warning stays at
2.5mb) — same practice as the earlier sustainable-headroom raises.
