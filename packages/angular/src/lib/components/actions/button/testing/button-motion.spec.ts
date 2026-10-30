import {
  shouldAnimateWidth,
  type ButtonWidthMotionFlags,
} from '../functions/button-motion';

const baseFlags: ButtonWidthMotionFlags = {
  fullWidth: false,
  attached: false,
  reducedMotion: false,
  contentChanged: true,
  animatable: true,
};

describe('shouldAnimateWidth', () => {
  it('animates content-driven growth', () => {
    expect(shouldAnimateWidth(80, 140, baseFlags)).toBe(true);
  });

  it('skips full-width hosts', () => {
    expect(shouldAnimateWidth(80, 140, { ...baseFlags, fullWidth: true })).toBe(
      false,
    );
  });

  it('skips attached group members', () => {
    expect(shouldAnimateWidth(80, 140, { ...baseFlags, attached: true })).toBe(
      false,
    );
  });

  it('skips reduced motion', () => {
    expect(
      shouldAnimateWidth(80, 140, { ...baseFlags, reducedMotion: true }),
    ).toBe(false);
  });

  it('skips container-driven changes without content mutation', () => {
    expect(
      shouldAnimateWidth(80, 140, { ...baseFlags, contentChanged: false }),
    ).toBe(false);
  });

  it('skips negligible deltas and negative baselines', () => {
    expect(shouldAnimateWidth(80, 80.2, baseFlags)).toBe(false);
    expect(shouldAnimateWidth(-1, 140, baseFlags)).toBe(false);
  });

  it('skips when WAAPI is unavailable', () => {
    expect(
      shouldAnimateWidth(80, 140, { ...baseFlags, animatable: false }),
    ).toBe(false);
  });
});
