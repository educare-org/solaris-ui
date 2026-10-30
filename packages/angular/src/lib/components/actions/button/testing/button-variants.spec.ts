import {
  resolveDisabled,
  resolveEffectiveDensity,
  resolveEffectiveSize,
  resolveGroupPlacement,
  resolveVariant,
} from '../functions/button-variants';

describe('button-variants', () => {
  it('prefers data value over input value', () => {
    expect(resolveVariant('sm', 'md')).toBe('sm');
    expect(resolveVariant(undefined, 'md')).toBe('md');
  });

  it('resolves effective size from group when present', () => {
    expect(resolveEffectiveSize('lg', 'md')).toBe('lg');
    expect(resolveEffectiveSize(undefined, 'md')).toBe('md');
  });

  it('resolves group placement only when attached', () => {
    expect(resolveGroupPlacement(true, 'horizontal')).toBe('horizontal');
    expect(resolveGroupPlacement(false, 'horizontal')).toBeNull();
    expect(resolveGroupPlacement(true, null)).toBeNull();
  });

  it('resolves density with group first then theme fallback', () => {
    expect(
      resolveEffectiveDensity('compact', 'normal', 'comfortable', 'normal'),
    ).toBe('compact');
    expect(
      resolveEffectiveDensity(undefined, 'compact', undefined, 'normal'),
    ).toBe('compact');
    expect(
      resolveEffectiveDensity(undefined, undefined, undefined, 'normal'),
    ).toBe('normal');
  });

  it('treats loading as disabled', () => {
    expect(resolveDisabled(false, false)).toBe(false);
    expect(resolveDisabled(true, false)).toBe(true);
    expect(resolveDisabled(false, true)).toBe(true);
  });
});
