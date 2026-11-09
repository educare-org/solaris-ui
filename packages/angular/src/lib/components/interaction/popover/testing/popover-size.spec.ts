import {
  ceilToDevicePixels,
  normalizePopoverDimension,
  quantizeToDevicePixels,
  resolvePopoverSize,
} from '../functions/popover-size';

describe('normalizePopoverDimension', () => {
  it('should return undefined for undefined input', () => {
    expect(normalizePopoverDimension(undefined)).toBeUndefined();
  });

  it('should append px to numeric input', () => {
    expect(normalizePopoverDimension(200)).toBe('200px');
  });

  it('should pass string input through unchanged', () => {
    expect(normalizePopoverDimension('50%')).toBe('50%');
  });
});

describe('quantizeToDevicePixels', () => {
  it('should round to whole CSS pixels at DPR 1', () => {
    expect(quantizeToDevicePixels(189.734375, 1)).toBe(190);
    expect(quantizeToDevicePixels(189.2, 1)).toBe(189);
  });

  it('should snap to half pixels at DPR 2', () => {
    expect(quantizeToDevicePixels(189.734375, 2)).toBe(189.5);
  });

  it('should default to DPR 1 without a ratio', () => {
    expect(quantizeToDevicePixels(189.734375)).toBe(190);
  });

  it('should pass invalid values through untouched', () => {
    expect(quantizeToDevicePixels(0, 1)).toBe(0);
    expect(quantizeToDevicePixels(-4, 1)).toBe(-4);
    expect(quantizeToDevicePixels(NaN, 1)).toBeNaN();
  });

  it('should ignore non-positive ratios', () => {
    expect(quantizeToDevicePixels(189.734375, 0)).toBe(190);
  });
});

describe('ceilToDevicePixels', () => {
  it('should round fractional widths up to whole CSS pixels at DPR 1', () => {
    expect(ceilToDevicePixels(189.734375, 1)).toBe(190);
    expect(ceilToDevicePixels(189.2, 1)).toBe(190);
  });

  it('should keep exact integers untouched', () => {
    expect(ceilToDevicePixels(190, 1)).toBe(190);
    expect(ceilToDevicePixels(190, 2)).toBe(190);
  });

  it('should round up to half pixels at DPR 2', () => {
    expect(ceilToDevicePixels(189.734375, 2)).toBe(190);
    expect(ceilToDevicePixels(189.2, 2)).toBe(189.5);
  });

  it('should never grow by a full pixel or more', () => {
    expect(ceilToDevicePixels(189.0001, 1) - 189.0001).toBeLessThan(1);
    expect(ceilToDevicePixels(189.0001, 2) - 189.0001).toBeLessThan(0.5);
  });

  it('should pass invalid values through untouched', () => {
    expect(ceilToDevicePixels(0, 1)).toBe(0);
    expect(ceilToDevicePixels(NaN, 1)).toBeNaN();
  });
});

describe('resolvePopoverSize', () => {
  it('should match the trigger width by default when matchTriggerWidth is true', () => {
    expect(
      resolvePopoverSize({ triggerWidth: 236, matchTriggerWidth: true }),
    ).toEqual({ width: 236, minWidth: 236, maxWidth: 236 });
  });

  it('should cap the panel at the trigger width so it never renders wider', () => {
    const size = resolvePopoverSize({
      triggerWidth: 320,
      matchTriggerWidth: true,
    });
    expect(size.maxWidth).toBe(320);
  });

  it('should prefer an explicit minWidth over the trigger width', () => {
    expect(
      resolvePopoverSize({
        triggerWidth: 236,
        matchTriggerWidth: true,
        minWidth: 300,
      }),
    ).toEqual({ width: 236, minWidth: '300px', maxWidth: 236 });
  });

  it('should prefer an explicit maxWidth over the trigger width cap', () => {
    expect(
      resolvePopoverSize({
        triggerWidth: 236,
        matchTriggerWidth: true,
        maxWidth: 400,
      }),
    ).toEqual({ width: 236, minWidth: 236, maxWidth: '400px' });
  });

  it('should only apply explicit dimensions when matchTriggerWidth is false', () => {
    expect(
      resolvePopoverSize({
        triggerWidth: 236,
        matchTriggerWidth: false,
        minWidth: '300px',
      }),
    ).toEqual({ minWidth: '300px' });
  });

  it('should return an empty size without match or explicit dimensions', () => {
    expect(
      resolvePopoverSize({ triggerWidth: 236, matchTriggerWidth: false }),
    ).toEqual({});
  });

  it('should normalize an explicit maxHeight', () => {
    expect(
      resolvePopoverSize({
        triggerWidth: 236,
        matchTriggerWidth: false,
        maxHeight: 320,
      }),
    ).toEqual({ maxHeight: '320px' });
  });

  it('should snap fractional trigger widths to device pixels so both seam edges share whole pixels', () => {
    expect(
      resolvePopoverSize({ triggerWidth: 236.4, matchTriggerWidth: true }),
    ).toEqual({ width: 236, minWidth: 236, maxWidth: 236 });
    expect(
      resolvePopoverSize({
        triggerWidth: 189.734375,
        matchTriggerWidth: true,
      }),
    ).toEqual({ width: 190, minWidth: 190, maxWidth: 190 });
  });

  it('should snap to the caller devicePixelRatio instead of assuming DPR 1', () => {
    expect(
      resolvePopoverSize({
        triggerWidth: 189.734375,
        matchTriggerWidth: true,
        devicePixelRatio: 2,
      }),
    ).toEqual({ width: 189.5, minWidth: 189.5, maxWidth: 189.5 });
  });
});
