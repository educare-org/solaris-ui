import {
  anchorRectForScroll,
  interpolateCarouselText,
  normalizeMediaCarouselAspectRatio,
  normalizeMediaCarouselPreviewCount,
  normalizeMediaCarouselRadius,
  normalizeMediaSlides,
  normalizeOptionalString,
  previewReorderDelta,
  resolveMediaCarouselPreviewIndices,
  DEFAULT_MEDIA_CAROUSEL_ASPECT_RATIO,
  DEFAULT_MEDIA_CAROUSEL_PREVIEW_COUNT,
  DEFAULT_MEDIA_CAROUSEL_RADIUS,
} from './media-carousel-defaults';

describe('normalizeMediaSlides', () => {
  it('should return the slides unchanged', () => {
    const slides = [{ type: 'image', src: 'a.jpg', alt: 'A' }] as const;
    expect(normalizeMediaSlides(slides)).toBe(slides);
  });

  it('should return an empty list for nullish or non-array values', () => {
    expect(normalizeMediaSlides(undefined)).toEqual([]);
    expect(normalizeMediaSlides(null)).toEqual([]);
  });
});

describe('normalizeMediaCarouselRadius', () => {
  it('should keep valid radii', () => {
    expect(normalizeMediaCarouselRadius('none')).toBe('none');
    expect(normalizeMediaCarouselRadius('xl')).toBe('xl');
  });

  it('should fall back to lg for unknown values', () => {
    expect(
      normalizeMediaCarouselRadius(
        'full' as 'none' | 'sm' | 'md' | 'lg' | 'xl',
      ),
    ).toBe(DEFAULT_MEDIA_CAROUSEL_RADIUS);
  });
});

describe('normalizeMediaCarouselAspectRatio', () => {
  it('should keep trimmed consumer values', () => {
    expect(normalizeMediaCarouselAspectRatio('  4 / 3  ')).toBe('4 / 3');
  });

  it('should fall back to the default for empty values', () => {
    expect(normalizeMediaCarouselAspectRatio('')).toBe(
      DEFAULT_MEDIA_CAROUSEL_ASPECT_RATIO,
    );
    expect(normalizeMediaCarouselAspectRatio(undefined)).toBe(
      DEFAULT_MEDIA_CAROUSEL_ASPECT_RATIO,
    );
    expect(normalizeMediaCarouselAspectRatio(null)).toBe(
      DEFAULT_MEDIA_CAROUSEL_ASPECT_RATIO,
    );
  });
});

describe('normalizeOptionalString', () => {
  it('should trim non-empty values', () => {
    expect(normalizeOptionalString('  Hi  ')).toBe('Hi');
  });

  it('should return null for empty values', () => {
    expect(normalizeOptionalString(undefined)).toBeNull();
    expect(normalizeOptionalString('')).toBeNull();
    expect(normalizeOptionalString('   ')).toBeNull();
  });
});

describe('interpolateCarouselText', () => {
  it('should replace double and single brace params', () => {
    expect(
      interpolateCarouselText('Go to slide {{index}} of {{total}}', {
        index: 2,
        total: 3,
      }),
    ).toBe('Go to slide 2 of 3');
    expect(interpolateCarouselText('Slide {index}', { index: 1 })).toBe(
      'Slide 1',
    );
  });

  it('should leave unknown placeholders untouched', () => {
    expect(interpolateCarouselText('Slide {{index}}', {})).toBe(
      'Slide {{index}}',
    );
  });
});

describe('normalizeMediaCarouselPreviewCount', () => {
  it('should keep values inside the locked range', () => {
    expect(normalizeMediaCarouselPreviewCount(1)).toBe(1);
    expect(normalizeMediaCarouselPreviewCount(3)).toBe(3);
  });

  it('should clamp values outside the locked range', () => {
    expect(normalizeMediaCarouselPreviewCount(9)).toBe(
      DEFAULT_MEDIA_CAROUSEL_PREVIEW_COUNT,
    );
    expect(normalizeMediaCarouselPreviewCount(0)).toBe(1);
  });

  it('should fall back to the default for non-numeric values', () => {
    expect(normalizeMediaCarouselPreviewCount(undefined)).toBe(
      DEFAULT_MEDIA_CAROUSEL_PREVIEW_COUNT,
    );
    expect(normalizeMediaCarouselPreviewCount(Number.NaN)).toBe(
      DEFAULT_MEDIA_CAROUSEL_PREVIEW_COUNT,
    );
  });
});

describe('resolveMediaCarouselPreviewIndices', () => {
  it('should return current plus next two with loop wrap', () => {
    expect(resolveMediaCarouselPreviewIndices(3, 4, true, 3)).toEqual([
      3, 0, 1,
    ]);
  });

  it('should truncate at the end when loop is off', () => {
    expect(resolveMediaCarouselPreviewIndices(3, 4, false, 3)).toEqual([3]);
    expect(resolveMediaCarouselPreviewIndices(0, 2, false, 3)).toEqual([0, 1]);
  });

  it('should return no indices without slides', () => {
    expect(resolveMediaCarouselPreviewIndices(0, 0, true, 3)).toEqual([]);
  });

  it('should never show more thumbs than slides', () => {
    expect(resolveMediaCarouselPreviewIndices(0, 2, true, 3)).toEqual([0, 1]);
    expect(resolveMediaCarouselPreviewIndices(1, 2, true, 3)).toEqual([1, 0]);
    expect(resolveMediaCarouselPreviewIndices(0, 1, true, 3)).toEqual([0]);
  });
});

describe('previewReorderDelta', () => {
  it('should return null without a previous position', () => {
    expect(previewReorderDelta(null, { left: 100, top: 0 })).toBeNull();
    expect(previewReorderDelta(undefined, { left: 100, top: 0 })).toBeNull();
  });

  it('should return null when the thumb did not move', () => {
    expect(
      previewReorderDelta({ left: 100, top: 0 }, { left: 100, top: 0 }),
    ).toBeNull();
  });

  it('should return the inverted displacement for moved thumbs', () => {
    expect(
      previewReorderDelta({ left: 0, top: 0 }, { left: 100, top: 0 }),
    ).toEqual({ dx: -100, dy: 0 });
  });
});

describe('anchorRectForScroll', () => {
  it('should keep document coordinates stable across scroll', () => {
    expect(anchorRectForScroll({ left: 100, top: 400 }, 0, 0)).toEqual({
      left: 100,
      top: 400,
    });
    expect(anchorRectForScroll({ left: 100, top: -800 }, 0, 1200)).toEqual({
      left: 100,
      top: 400,
    });
  });
});
