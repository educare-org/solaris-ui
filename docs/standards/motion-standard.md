# Solaris UI — Motion Standard

Institutional motion: alive but delicate. Each component is encouraged to own
a unique motion signature within this proposal. There is no mandated property
set and no mandated keyframe per component — every case is different.

## Tokens

Defined in `packages/angular/src/styles/token/motion/_motion.scss`:

| Token                                | Value                                   | Use                                      |
| ------------------------------------ | --------------------------------------- | ---------------------------------------- |
| `--solaris-motion-duration-fast`     | 150ms                                   | hover, press, tooltip, exits             |
| `--solaris-motion-duration-normal`   | 300ms                                   | overlay enter, expand/collapse           |
| `--solaris-motion-duration-slow`     | 600ms                                   | spinner indeterminate                    |
| `--solaris-motion-duration-slower`   | 1200ms                                  | skeleton shimmer                         |
| `--solaris-motion-duration-slowest`  | 2400ms                                  | long ambient loops only                  |
| `--solaris-motion-duration-exit`     | = fast                                  | semantic alias for every exit            |
| `--solaris-motion-duration-instant`  | 0ms                                     | no-motion escape hatch                   |
| `--solaris-motion-translate-sm`      | 4px                                     | standard slide distance                  |
| `--solaris-motion-easing-standard`   | cubic-bezier(0.4, 0, 0.2, 1)            | default                                  |
| `--solaris-motion-easing-decelerate` | cubic-bezier(0, 0, 0.2, 1)              | every enter                              |
| `--solaris-motion-easing-accelerate` | cubic-bezier(0.4, 0, 1, 1)              | every exit                               |
| `--solaris-motion-easing-spring`     | cubic-bezier(0.175, 0.885, 0.32, 1.275) | opt-in, avoid where vestibular-sensitive |
| `--solaris-motion-easing-linear`     | linear                                  | rotations, progress                      |
| `--solaris-motion-scale-enter`       | 0.96                                    | shared enter scale                       |
| `--solaris-motion-scale-active`      | 0.97                                    | press feedback                           |

Tokens are the starting point, not a ceiling. Custom durations, distances,
and easings are allowed when the component documents its intent in its
`docs/*.md`. Prefer token values first; diverge deliberately.

## Shared keyframes and mixins

- Keyframes live in `token/motion/_motion-keyframes.scss` and are emitted once
  globally by `core()`. Names: `solaris-motion-overlay-enter/exit[-top]`,
  `solaris-motion-dialog-enter/exit`, `solaris-motion-backdrop-enter/exit`,
  `solaris-motion-tooltip-enter/exit`, `solaris-motion-drawer-enter/exit-left/right`,
  `solaris-motion-pop-in`.
- Mixins live in `token/motion/_motion-mixins.scss`, re-exported for consumers as
  `@solaris-ui/angular/styles/motion`.
- TS exit delays mirror the token: `SOLARIS_MOTION_EXIT_MS = 150`
  (see `lib/core/utils/motion-close.ts`). The actual detach uses
  `SOLARIS_MOTION_DETACH_MS` (exit + 60ms frame-skew buffer).

Reuse shared keyframes when they fit. Create local keyframes when the
component needs its own signature. Both are valid.

## Minimal guards (MUST)

These are the only blocking motion rules. Everything else is guidance.

1. **Reduced motion is mandatory.** Every `transition`/`animation` ships with
   the doubled guard:

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

2. **Motion is never the only channel for state.** The UI must communicate the
   same state instantly with motion disabled (see `accessibility-standard` §6).
3. **No flashing loops.** Blink/flash loops are forbidden (WCAG 2.3.1).
4. **Exiting overlays stay operable.** Exiting overlays set `data-closing` +
   `pointer-events: none` (+ `aria-hidden` where a role is exposed). State and
   outputs stay synchronous; only DOM detach is delayed.

## Guidance (SHOULD, not blocking)

- Prefer compositor-friendly and paint-only properties
  (`transform`, `opacity`, `filter`, `color` / `background-color` /
  `border-color`, `clip-path`, `box-shadow`) over layout properties
  (`width`, `height`, `top`, `left`, `margin`) to hold 60fps. Layout animation
  is discouraged, not forbidden — justify it in the component doc when used.
- Enter with `decelerate`, exit with `accelerate`, end `animation` shorthands
  with `both` fill mode so exits hold opacity 0 until delayed detach.
- `transition: all` is discouraged (stylelint warns). List explicit
  properties. Existing `transition: all` instances should migrate on touch.
- Keep motion fast and subtle by default (`fast`/`normal`). Use `slow` and
  above only for indeterminate, shimmer, or long ambient loops.
- Document the component motion signature in `docs/*.md`: intent, properties
  animated, duration/easing, and reduced-motion behavior.
