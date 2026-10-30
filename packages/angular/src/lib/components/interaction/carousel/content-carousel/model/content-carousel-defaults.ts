import type { SolarisContentCarouselAlign } from './content-carousel-align';
import type { SolarisContentCarouselDividerSide } from './content-carousel-divider-side';
import type { SolarisContentCarouselNavigation } from './content-carousel-navigation';

export const DEFAULT_CONTENT_CAROUSEL_ACTIVE_INDEX = 0;
export const DEFAULT_CONTENT_CAROUSEL_NAVIGATION: SolarisContentCarouselNavigation =
  'dots';
export const DEFAULT_CONTENT_CAROUSEL_ALIGN: SolarisContentCarouselAlign =
  'none';
export const DEFAULT_CONTENT_CAROUSEL_SHOW_DIVIDER = false;
export const DEFAULT_CONTENT_CAROUSEL_LOOP = true;
export const DEFAULT_CONTENT_CAROUSEL_SHOW_ARROWS = true;
export const DEFAULT_CONTENT_CAROUSEL_AUTOPLAY = false;
export const DEFAULT_CONTENT_CAROUSEL_DURATION = 5000;
export const DEFAULT_CONTENT_CAROUSEL_PAUSE_ON_HOVER = true;

export const CONTENT_CAROUSEL_PREV_LABEL_KEY = 'carousel.prev';
export const CONTENT_CAROUSEL_PREV_LABEL = 'Previous slide';
export const CONTENT_CAROUSEL_NEXT_LABEL_KEY = 'carousel.next';
export const CONTENT_CAROUSEL_NEXT_LABEL = 'Next slide';
export const CONTENT_CAROUSEL_GO_TO_SLIDE_LABEL_KEY = 'carousel.goToSlide';
export const CONTENT_CAROUSEL_GO_TO_SLIDE_LABEL =
  'Go to slide {{index}} of {{total}}';
export const CONTENT_CAROUSEL_SLIDE_N_OF_M_LABEL_KEY = 'carousel.slideNofM';
export const CONTENT_CAROUSEL_SLIDE_N_OF_M_LABEL = '{{index}} of {{total}}';
export const CONTENT_CAROUSEL_PLAY_LABEL_KEY = 'carousel.play';
export const CONTENT_CAROUSEL_PLAY_LABEL = 'Play';
export const CONTENT_CAROUSEL_PAUSE_LABEL_KEY = 'carousel.pause';
export const CONTENT_CAROUSEL_PAUSE_LABEL = 'Pause';
export const CONTENT_CAROUSEL_EMPTY_TEXT_KEY = 'carousel.empty';
export const CONTENT_CAROUSEL_EMPTY_TEXT = 'No slides to show';

const CONTENT_CAROUSEL_NAVIGATIONS: ReadonlySet<SolarisContentCarouselNavigation> =
  new Set(['dots', 'progress', 'none']);

const CONTENT_CAROUSEL_ALIGNS: ReadonlySet<SolarisContentCarouselAlign> =
  new Set(['start', 'end', 'center', 'top', 'bottom', 'none']);

export function normalizeContentCarouselNavigation(
  value: SolarisContentCarouselNavigation,
): SolarisContentCarouselNavigation {
  if (CONTENT_CAROUSEL_NAVIGATIONS.has(value)) {
    return value;
  }
  return DEFAULT_CONTENT_CAROUSEL_NAVIGATION;
}

export function normalizeContentCarouselAlign(
  value: SolarisContentCarouselAlign,
): SolarisContentCarouselAlign {
  if (CONTENT_CAROUSEL_ALIGNS.has(value)) {
    return value;
  }
  return DEFAULT_CONTENT_CAROUSEL_ALIGN;
}

export function resolveContentCarouselDividerSide(
  align: SolarisContentCarouselAlign,
  showDivider: boolean,
): SolarisContentCarouselDividerSide {
  if (!showDivider) {
    return 'none';
  }
  switch (align) {
    case 'end':
      return 'left';
    case 'start':
      return 'right';
    case 'center':
      return 'both';
    case 'top':
      return 'bottom';
    case 'bottom':
      return 'top';
    case 'none':
    default:
      return 'none';
  }
}

export function normalizeOptionalString(
  value: string | null | undefined,
): string | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function interpolateContentCarouselText(
  template: string,
  params: Record<string, string | number>,
): string {
  return Object.entries(params).reduce((resolved, [key, value]) => {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return resolved
      .replace(
        new RegExp(String.raw`\{\{\s*${escaped}\s*}}`, 'g'),
        String(value),
      )
      .replace(new RegExp(String.raw`\{${escaped}\}`, 'g'), String(value));
  }, template);
}

export const CONTENT_CAROUSEL_SWIPE_THRESHOLD_PX = 48;

export function resolveContentSwipeDirection(
  deltaX: number,
  deltaY: number,
  threshold: number = CONTENT_CAROUSEL_SWIPE_THRESHOLD_PX,
): 'next' | 'prev' | null {
  if (!Number.isFinite(deltaX) || !Number.isFinite(deltaY)) {
    return null;
  }
  if (Math.abs(deltaX) <= threshold || Math.abs(deltaX) <= Math.abs(deltaY)) {
    return null;
  }
  return deltaX < 0 ? 'next' : 'prev';
}
