/**
 * Shared exit-motion timing for overlay close transitions.
 *
 * Mirrors the `--solaris-motion-duration-exit` CSS token (which aliases
 * `--solaris-motion-duration-fast`, 150ms). When the token value changes,
 * update `SOLARIS_MOTION_EXIT_MS` to match.
 *
 * Strategy (see docs/standards/motion-standard.md): `close()` keeps state and
 * outputs synchronous and only delays the CDK `detach()+dispose()` so the
 * `[data-closing]` exit animation can play. Reopening cancels the pending
 * detach via `cancelMotionClose`.
 *
 * The detach delay adds a buffer over the animation duration: the CSS exit may
 * start up to a frame late (style recalc after the closing mark), and cutting
 * it off exactly at 150ms produces a visible snap. The panel already sits at
 * opacity 0 with `pointer-events: none` during the buffer, so the extra time
 * is imperceptible. Exit keyframes must use `forwards` fill so the panel holds
 * opacity 0 until detach.
 */
export const SOLARIS_MOTION_EXIT_MS = 150;

/** Frame-skew tolerance between the closing mark and the CSS exit start. */
const SOLARIS_MOTION_DETACH_BUFFER_MS = 60;

/** Actual `detach()+dispose()` delay used by `scheduleMotionClose`. */
export const SOLARIS_MOTION_DETACH_MS =
  SOLARIS_MOTION_EXIT_MS + SOLARIS_MOTION_DETACH_BUFFER_MS;

/**
 * Schedules `finish` after the detach delay (exit duration + buffer).
 * Returns the timeout handle so the caller can cancel it on reopen/destroy.
 */
export function scheduleMotionClose(
  finish: () => void,
): ReturnType<typeof setTimeout> {
  return setTimeout(finish, SOLARIS_MOTION_DETACH_MS);
}

/**
 * Cancels a pending motion-close timeout. Safe to call with `null`.
 */
export function cancelMotionClose(
  timeout: ReturnType<typeof setTimeout> | null,
): null {
  if (timeout !== null) {
    clearTimeout(timeout);
  }
  return null;
}
