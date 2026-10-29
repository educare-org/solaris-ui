import {
  interpolateCarouselText,
  normalizeMediaCarouselAspectRatio,
  normalizeMediaCarouselRadius,
  normalizeMediaSlides,
  normalizeOptionalString,
  DEFAULT_MEDIA_CAROUSEL_ASPECT_RATIO,
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
