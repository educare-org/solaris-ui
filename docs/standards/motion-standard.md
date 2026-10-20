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
| `--solaris-motion-scale-enter`       | 0.95                                    | shared enter scale                            |
| `--solaris-motion-scale-active`      | 0.97                                    | press feedback (Phase 3)                      |

## Shared keyframes and mixins

- Keyframes live in `token/motion/_motion-keyframes.scss` and are emitted once
  globally by `core()`. Names: `solaris-motion-overlay-enter/exit[-top]`,
  `solaris-motion-dialog-enter/exit`, `solaris-motion-backdrop-enter/exit`,
  `solaris-motion-tooltip-enter/exit`, `solaris-motion-drawer-enter/exit-left/right`
  (dialog side placements).
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
