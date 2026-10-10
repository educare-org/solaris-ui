---
'@educarehq/solaris-ui': minor
---

Stacked (nested) dialogs, edge-docked sheets and validated dialog flows.

- Nested dialogs: `SolarisDialogService` tracks the stack (`topmostId`, `isTopmost(ref)`, `openCount`). Only the topmost dialog reacts to Escape; panels below get `aria-hidden="true"`. Each dialog keeps its own backdrop, so backdrop clicks stay scoped to the inner dialog. Keep nesting to one level.
- Sheet: new `sheet` option (`SolarisDialogOptions`, `SolarisDialogComponentConfig`, global config) docks the panel to an edge `placement` (`top`/`bottom`/`left`/`right`) with full-edge span and radius only on the exposed side, reflected as `data-sheet`. Ignored for `center`, corners and `fullscreen`.
- Dialog Flow: `next()`, `previous()` and `goTo(index)` on `SolarisDialogFlowComponent`, plus `[disabled]` on `solaris-dialog-step` (skipped by navigation, exposed as `data-disabled`). Docs cover form-validity gating and a router query-param sync recipe.
- Hygiene: `effectiveDensity` computed (option wins, then theme density) on the container, content and actions; header ids via central `nextIdFor('solaris-dialog-header')`; `data-backdrop` kept as `"true"`/`"false"` (consumed by SCSS) and the `'Close'` last-resort label kept (icon-only close button requires an accessible name) — both evaluated and intentionally unchanged. `width` stays free-form by design (no `size` presets); glass appearance evaluated and rejected for dialog semantics. Follow-ups: drag/resize, swipe gestures.
- Fix: the close `x` icon had no explicit size and rendered at ~8px — both the header in-flow close and the container fallback close now size their `svg` via the new `--solaris-dialog-close-icon-size` token (`--solaris-font-size-md`, same as alert). Root cause included the UA button padding (`1px 6px`) shrinking the centered icon flex item, so both close buttons also reset `padding` to `var(--solaris-spacing-0)`.
