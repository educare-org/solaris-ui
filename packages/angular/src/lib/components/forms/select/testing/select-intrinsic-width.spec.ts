import {
  SOLARIS_SELECT_MAX_INTRINSIC_WIDTH,
  parseCssPixelDimension,
  resolveIntrinsicCap,
  resolveIntrinsicTarget,
} from '../functions/select-intrinsic-width';

describe('parseCssPixelDimension', () => {
  it('should return undefined for undefined', () => {
    expect(parseCssPixelDimension(undefined)).toBeUndefined();
  });

  it('should accept positive numbers', () => {
    expect(parseCssPixelDimension(320)).toBe(320);
  });

  it('should reject non-positive numbers', () => {
    expect(parseCssPixelDimension(0)).toBeUndefined();
  });

  it('should parse px strings', () => {
    expect(parseCssPixelDimension('400px')).toBe(400);
  });

  it('should ignore non-px dimensions for browser resolution', () => {
    expect(parseCssPixelDimension('50%')).toBeUndefined();
    expect(parseCssPixelDimension('20rem')).toBeUndefined();
    expect(parseCssPixelDimension('auto')).toBeUndefined();
  });
});

describe('resolveIntrinsicCap', () => {
  it('should default to the hard ceiling', () => {
    expect(resolveIntrinsicCap()).toBe(SOLARIS_SELECT_MAX_INTRINSIC_WIDTH);
  });

  it('should respect narrow parents so constrained containers keep wrapping', () => {
    expect(resolveIntrinsicCap({ parentWidth: 320 })).toBe(320);
  });

  it('should keep a viewport gutter', () => {
    expect(
      resolveIntrinsicCap({ viewportWidth: 800, maxIntrinsic: 1024 }),
    ).toBe(768);
  });

  it('should pick the smallest positive candidate', () => {
    expect(resolveIntrinsicCap({ parentWidth: 320, viewportWidth: 800 })).toBe(
      320,
    );
  });

  it('should honor an explicit px max-width override', () => {
    expect(
      resolveIntrinsicCap({ parentWidth: 800, maxWidthOverride: '200px' }),
    ).toBe(200);
  });
});

describe('resolveIntrinsicTarget', () => {
  it('should grow toward the content width', () => {
    expect(
      resolveIntrinsicTarget({
        contentWidth: 260,
        triggerWidth: 160,
        cap: 480,
      }),
    ).toBe(260);
  });

  it('should never shrink an already-wider trigger', () => {
    expect(
      resolveIntrinsicTarget({
        contentWidth: 200,
        triggerWidth: 300,
        cap: 480,
      }),
    ).toBe(300);
  });

  it('should cap growth so it never sizes without bounds', () => {
    expect(
      resolveIntrinsicTarget({
        contentWidth: 900,
        triggerWidth: 160,
        cap: 320,
      }),
    ).toBe(320);
  });

  it('should fall back to the trigger width without measurable content', () => {
    expect(
      resolveIntrinsicTarget({ contentWidth: 0, triggerWidth: 160, cap: 480 }),
    ).toBe(160);
  });
});
