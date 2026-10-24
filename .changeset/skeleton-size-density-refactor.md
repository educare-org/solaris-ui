---
'@educarehq/solaris-ui': minor
---

Refactor skeleton onto the explicit size × density matrix and add delay, deterministic multi-line, RTL wave, and aspect ratio.

**Skeleton**

- Explicit size × density × variant matrix in px (own scale — skeleton is a
  decorative placeholder, so the `--solaris-control-height-*` ladder for
  interactive controls does not apply): text 8–24px, rectangular 48–160px,
  circular 20–48px. Size and density no longer fight through cascade order;
  every cell is a dedicated rule. Multiline gap follows density
  (compact 8px, normal 12px, comfortable 16px).
- `density` is explicitly `input<T | undefined>` with `effectiveDensity`
  fallback to the theme density; host uses `data-size` +
  `data-density(effective)`.
- Boolean host bindings follow the presence pattern (`|| undefined`,
  including `data-multiline` and the new `data-pending`).
- New `delay` input (ms, default `0`): postpones rendering to avoid flashing
  on fast loads. While pending the host carries `data-pending` and stays
  `visibility: hidden` (layout space preserved). SSR-safe.
- Multi-line widths are now deterministic: first line `100%` (or custom
  `width`), fixed middle sequence, last line via the new `lastLineWidth`
  input (default `'68%'`).
- New `aspectRatio` input for `rectangular` (e.g. `'16 / 9'`); ignored when
  `height` is set. Custom `width`/`height` still override the matrix.
- Wave shimmer fixed: `animation-name` is now a literal (resolving it
  through `var(--solaris-skeleton-wave-name)` silently prevented the
  keyframes from running in Chromium — verified via ::after transform
  sampling). Band widened to 30–70% stops for a perceptible sweep.
- Wave travels right-to-left under `[dir='rtl']` by mirroring the symmetric
  host (`scaleX(-1)`), without chained `:host` selectors.
- New `duration` input (e.g. `[duration]="'400ms'"`): sets
  `--solaris-skeleton-animation-duration` inline on the host, inherited by
  the wave/pulse layers and multi-line rows.
- Reduced motion uses `:host-context([data-reduced-motion='true'])` (the
  previous global element selector never matched under view encapsulation)
  plus `prefers-reduced-motion`.
- Multiline host layout moved after the animation rules so `animation: none`
  wins at equal specificity (previously a multiline host kept pulsing).
- Docs rewritten in px with the full matrix, new inputs, CSS vars, and
  composition presets. Stories rewritten against the real API (the old
  `Heading` play test asserted text the component never renders).
- Showcase rebuilt on the docs-page layout: preview-code per example,
  variants/animations/multiline in tabs, interactive size-density selectors
  with computed snippet, preset examples (profile, dashboard, list-row,
  media-block) behind a single preset tab group with computed snippet,
  delay + aspect-ratio + duration demos behind an advanced tab group
  (duration has its own slow/default/fast selector), installation, props
  placeholder, mirrored en-US/pt-BR translations.
