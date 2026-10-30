export interface ButtonWidthMotionFlags {
  readonly fullWidth: boolean;
  readonly attached: boolean;
  readonly reducedMotion: boolean;
  readonly contentChanged: boolean;
  readonly animatable: boolean;
}

export function shouldAnimateWidth(
  from: number,
  to: number,
  flags: ButtonWidthMotionFlags,
): boolean {
  if (flags.fullWidth) {
    return false;
  }
  if (flags.attached) {
    return false;
  }
  if (flags.reducedMotion) {
    return false;
  }
  if (!flags.animatable) {
    return false;
  }
  if (!flags.contentChanged) {
    return false;
  }
  if (from < 0) {
    return false;
  }
  return Math.abs(to - from) >= 0.5;
}
