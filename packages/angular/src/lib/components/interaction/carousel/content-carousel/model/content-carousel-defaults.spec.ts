import {
  DEFAULT_CONTENT_CAROUSEL_ALIGN,
  DEFAULT_CONTENT_CAROUSEL_NAVIGATION,
  interpolateContentCarouselText,
  normalizeContentCarouselAlign,
  normalizeContentCarouselNavigation,
  normalizeOptionalString,
  resolveContentCarouselDividerSide,
  resolveContentSwipeDirection,
} from './content-carousel-defaults';

describe('normalizeContentCarouselNavigation', () => {
  it('should keep the v1 navigation values', () => {
    expect(normalizeContentCarouselNavigation('dots')).toBe('dots');
    expect(normalizeContentCarouselNavigation('progress')).toBe('progress');
    expect(normalizeContentCarouselNavigation('none')).toBe('none');
  });

  it('should fall back to dots for unknown values', () => {
    expect(normalizeContentCarouselNavigation('preview' as 'dots')).toBe(
      DEFAULT_CONTENT_CAROUSEL_NAVIGATION,
    );
  });
});

describe('normalizeContentCarouselAlign', () => {
  it('should keep the six align values', () => {
    for (const align of [
      'start',
      'end',
      'center',
      'top',
      'bottom',
      'none',
    ] as const) {
      expect(normalizeContentCarouselAlign(align)).toBe(align);
    }
  });

  it('should fall back to none for unknown values', () => {
    expect(normalizeContentCarouselAlign('left' as 'none')).toBe(
      DEFAULT_CONTENT_CAROUSEL_ALIGN,
    );
  });
});

describe('resolveContentCarouselDividerSide', () => {
  it('should resolve the align/divider matrix', () => {
    expect(resolveContentCarouselDividerSide('end', true)).toBe('left');
    expect(resolveContentCarouselDividerSide('start', true)).toBe('right');
    expect(resolveContentCarouselDividerSide('center', true)).toBe('both');
    expect(resolveContentCarouselDividerSide('top', true)).toBe('bottom');
    expect(resolveContentCarouselDividerSide('bottom', true)).toBe('top');
    expect(resolveContentCarouselDividerSide('none', true)).toBe('none');
  });

  it('should render no divider by default', () => {
    for (const align of [
      'start',
      'end',
      'center',
      'top',
      'bottom',
      'none',
    ] as const) {
      expect(resolveContentCarouselDividerSide(align, false)).toBe('none');
    }
  });
});

describe('normalizeOptionalString', () => {
  it('should trim values and reject blanks', () => {
    expect(normalizeOptionalString('  Featured  ')).toBe('Featured');
    expect(normalizeOptionalString('')).toBeNull();
    expect(normalizeOptionalString('   ')).toBeNull();
    expect(normalizeOptionalString(undefined)).toBeNull();
    expect(normalizeOptionalString(null)).toBeNull();
  });
});

describe('interpolateContentCarouselText', () => {
  it('should replace spaced and unspaced placeholders', () => {
    expect(
      interpolateContentCarouselText('Go to slide {{index}} of {{total}}', {
        index: 2,
        total: 3,
      }),
    ).toBe('Go to slide 2 of 3');
    expect(
      interpolateContentCarouselText('{index} of {total}', {
        index: 1,
        total: 2,
      }),
    ).toBe('1 of 2');
  });
});

describe('resolveContentSwipeDirection', () => {
  it('should map left swipes to next and right swipes to prev', () => {
    expect(resolveContentSwipeDirection(-120, 4)).toBe('next');
    expect(resolveContentSwipeDirection(120, -4)).toBe('prev');
  });

  it('should ignore short and vertical drags', () => {
    expect(resolveContentSwipeDirection(-48, 0)).toBeNull();
    expect(resolveContentSwipeDirection(10, 0)).toBeNull();
    expect(resolveContentSwipeDirection(-120, 120)).toBeNull();
    expect(resolveContentSwipeDirection(Number.NaN, 0)).toBeNull();
  });
});
