# Solaris UI — Motion Standard

Institutional motion: subtle, fast, and never required to understand state.
If a user enables reduced motion, the UI must communicate the same state instantly.

## Tokens

Defined in `packages/angular/src/styles/token/motion/_motion.scss`:

| Token                                | Value                                   | Use                                           |
| ------------------------------------ | --------------------------------------- | --------------------------------------------- |
| `--solaris-motion-duration-fast`     | 150ms                                   | hover, press, tooltip, exits                  |
| `--solaris-motion-duration-normal`   | 300ms                                   | overlay enter, expand/collapse                |
| `--solaris-motion-duration-slow`     | 600ms                                   | spinner indeterminate                         |
| `--solaris-motion-duration-slower`   | 1200ms                                  | skeleton shimmer                              |
| `--solaris-motion-duration-slowest`  | 2400ms                                  | long ambient loops only                       |
| `--solaris-motion-duration-exit`     | = fast                                  | semantic alias for every exit                 |
| `--solaris-motion-duration-instant`  | 0ms                                     | no-motion escape hatch                        |
| `--solaris-motion-translate-sm`      | 4px                                     | standard slide distance                       |
| `--solaris-motion-easing-standard`   | cubic-bezier(0.4, 0, 0.2, 1)            | default                                       |
| `--solaris-motion-easing-decelerate` | cubic-bezier(0, 0, 0.2, 1)              | every enter                                   |
| `--solaris-motion-easing-accelerate` | cubic-bezier(0.4, 0, 1, 1)              | every exit                                    |
| `--solaris-motion-easing-spring`     | cubic-bezier(0.175, 0.885, 0.32, 1.275) | opt-in only, avoid where vestibular-sensitive |
| `--solaris-motion-easing-linear`     | linear                                  | rotations, progress                           |
| `--solaris-motion-scale-enter`       | 0.96                                    | shared enter scale                            |
| `--solaris-motion-scale-active`      | 0.99                                    | press feedback (Phase 3)                      |

## Shared keyframes and mixins

- Keyframes live in `token/motion/_motion-keyframes.scss` and are emitted once
  globally by `core()`. Names: `solaris-motion-overlay-enter/exit[-top]`,
  `solaris-motion-dialog-enter/exit`, `solaris-motion-backdrop-enter/exit`,
  `solaris-motion-tooltip-enter/exit`, `solaris-motion-drawer-enter/exit-left/right`
  (dialog side placements), `solaris-motion-pop-in` (checkbox/radio check pop).
- Mixins live in `token/motion/_motion-mixins.scss`, re-exported for consumers as
  `@solaris-ui/angular/styles/motion`. Components may keep using raw
  `var(--solaris-motion-*)` declarations; mixins are preferred for overlays.
- TS exit delays mirror the token: `SOLARIS_MOTION_EXIT_MS = 150`
  (see `lib/core/utils/motion-close.ts`). The actual detach uses
  `SOLARIS_MOTION_DETACH_MS` (exit + 60ms buffer, see rule 3).

## Rules

1. Animate only `opacity` and `transform`. Never layout (`width`, `height`, `top`, `left`
   for motion — the switch thumb `left` is a legacy exception, do not copy it).
2. Enter uses `decelerate`; exit uses `accelerate` with
   `var(--solaris-motion-duration-exit, var(--solaris-motion-duration-fast))`.
   Every motion `animation` shorthand ends with `both` fill mode: exits hold
   opacity 0 until the delayed detach, enters hold `from` before the first frame.
3. Exiting overlays set `data-closing` + `pointer-events: none` (+ `aria-hidden`
   where a role is exposed). The closing mark must land synchronously in the same
   tick as the detach timer — an async mark (e.g. via `setInput` alone) starts the
   CSS exit late and the detach cuts it off mid-flight (visible snap).
   State/outputs stay synchronous; only DOM detach is delayed
   (`SOLARIS_MOTION_DETACH_MS` = exit 150ms + 60ms frame-skew buffer).
4. `transition: all` is forbidden (enforced by stylelint). List explicit properties.
5. Every `@keyframes` and every `transition`/`animation` ships with the doubled
   reduced-motion guard:

```scss
@media (prefers-reduced-motion: reduce) {
  <selector > {
    animation: none;
    transition: none;
  }
}

:host-context([data-reduced-motion='true']) <selector > {
  animation: none;
  transition: none;
}
```

6. Token-zeroing (`_reduced-motion.scss`, `theme(motion: reduce)`) covers
   `fast/normal/slow/slower/slowest`. `exit` inherits zero via its `fast` alias.
7. Motion is never the only channel for state (see accessibility-standard §6);
   blink/flash loops are forbidden (WCAG 2.3.1).

## Side-aware panels

Panels attached below the trigger use `*-enter/exit`; panels attached above
(`data-connected-side="top"`) use `*-enter-top/exit-top` so the slide always
originates from the trigger.

## Expand/collapse (Phase 2)

Uniform pattern, reference: `collapsible` (`collapsible-input` mirrors it,
accordion items are `collapsible` instances so they inherit it):

- Outer panel: `display: grid; grid-template-rows: 0fr` →
  `[data-open]: 1fr`, `transition: grid-template-rows normal + standard`.
- Inner content: `overflow: hidden` + `opacity: 0 → 1`,
  `transition: opacity normal + standard` (components keep their own
  padding transitions alongside).
- Chevron/icon: `transition: transform normal + standard`;
  `[data-open]: rotate(180deg)`.
- Opt-in mixins in `token/motion/_motion-mixins.scss`:
  `solaris-motion-expand-panel[-open]`, `solaris-motion-expand-inner[-open]`,
  `solaris-motion-chevron[-open]` (components may keep raw declarations;
  mixins are preferred for new code).
- Doubled reduced-motion guard (media + `:host-context`) on every block.

Adopters: table detail-row (`detail-wrapper`/`detail-inner` + expand
buttons), table-toolbar chips/count (`chips` reuses `overlay-enter-top`
with `both` instead of its former local keyframe), code-block fade
(reuses `backdrop-enter` with `both` instead of its former local keyframe —
the viewport keeps its JS pixel `max-height` animation, which already
honours reduced motion, because the viewport is a scroll region, not a
plain panel). Switching commands in a `command`-variant code-block replays
a `fast` + `decelerate` fade (`backdrop-enter`, `both`) on the incoming
`<pre>` content via a `--swap` class remove/reflow/add cycle (skipped
under reduced motion — state still swaps instantly; text has no border
ring, so no conflict). `preview-code` tab switches glide instead of
fading: each switch inserts a fresh panel node whose content is revealed
collapsible-style while the frame tweens `height` old→new px over `normal` +
`standard` — no opacity is animated, so the border ring stays complete at
every frame (any translucency would read as a broken ring). Details:
uncontrolled mode only (controlled parents own the timing;
destroy/navigation release the lock): measure, swap + sync render, lock,
tween, release to auto on `transitionend` (fallback timer +100ms). The
bordered box of the incoming panel (preview surface or code frame) is
locked in parallel via inline styles — a stylesheet class cannot reach
inside another component's template (code frame) through view
encapsulation, while custom properties inherit, so the tween stays
token-driven — keeping its border complete while growing instead of being
clipped by the frame. The inline lock also zeroes `min-block-size`
(the preview surface enforces a min-height that would otherwise clamp the
locked height and kill the transition) and pins `border-box` (exact
border-box math on boxes without it); all reverted on finish/destroy.

## Micro-interactions (Phase 3)

Subtle, `fast`-only, `opacity` + `transform` only. Every block ships with the
doubled reduced-motion guard (rule 5).

- Press: `transform: scale(var(--solaris-motion-scale-active))` (0.99) under
  `:active` / `[data-active]` / `[data-pressed]`, with `transition: transform`
  in `fast` + `standard` (`solaris-motion-press` / `solaris-motion-press-active`
  mixins; components with existing color transitions keep their own list and add
  the `transform` line). Adopters: `solaris-button`, `solaris-icon-button`.
  The `icon-button[data-chromeless]` icon scale (1.12 hover / 0.9 active) is an
  older, stronger treatment kept as-is (already reduced-motion guarded).
- Check pop: `solaris-motion-pop-in` (`fast` + `decelerate`, `both`) on the
  incoming indicator node (checkbox `.solaris-checkbox__icon`, radio
  `.solaris-radio__dot`). Both nodes are inserted by `@if` on check, so the
  enter replays per toggle with zero TS.
- Tabs indicator: same sliding treatment as `segmented-control`
  (`transform`/`width`/`height` in `normal` + `standard`, gated by
  `indicatorReady()` so the first paint does not glide). Tab panels reuse the
  shared fade (`backdrop-enter`, `normal` + `decelerate`, `both`); the
  directional slides stay local (`tabs-slide-in-right/left`) with `both` +
  `decelerate` + `--solaris-motion-translate-sm`.
- Alert enter: `solaris-motion-overlay-enter` (`normal` + `decelerate`, `both`)
  on `:host`. Enter-only by design — dismissal is owned by the consumer
  (`*ngIf`), with no hook for a `data-closing` exit.
- Toast enter: local `solaris-toast-enter` (`normal` + `decelerate`, `both`)
  on `:host` (slide distance is larger than `translate-sm` — stacked toasts
  read better with a longer travel; easing and fill follow rule 2).
  Enter-only by design — dismissal removes the entry from the service
  signal synchronously (`dismiss()` / `dismissAll()`), with no overlay
  chrome to delay only the detach (same rationale as alert, documented
  decision — no `data-closing` exit).
- Reduced-motion completeness: `segmented-control` ships the
  `:host-context([data-reduced-motion])` mirror on the indicator;
  checkbox/radio guards cover the pre-existing `__control` / `__label-text`
  transitions as well as the pop animation; toast guards cover `animation`
  - `transition` under the standard (unqualified) `host-context` mirror —
    the flag lives on `documentElement`, so a `body[...]`-qualified mirror
    never matches.
