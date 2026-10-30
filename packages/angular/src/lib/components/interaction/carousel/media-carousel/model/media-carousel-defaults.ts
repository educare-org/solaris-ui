import type { SolarisMediaSlide } from './solaris-media-slide';
import type { SolarisMediaCarouselDotsPosition } from './media-carousel-dots-position';
import type { SolarisMediaCarouselNavigation } from './media-carousel-navigation';
import type { SolarisMediaCarouselObjectFit } from './media-carousel-object-fit';
import type { SolarisMediaCarouselPreviewPosition } from './media-carousel-preview-position';
import type { SolarisMediaCarouselRadius } from './media-carousel-radius';
import type { SolarisMediaCarouselVisibleCount } from './media-carousel-visible-count';

export const DEFAULT_MEDIA_CAROUSEL_ACTIVE_INDEX = 0;
export const DEFAULT_MEDIA_CAROUSEL_VISIBLE_COUNT: SolarisMediaCarouselVisibleCount =
  'single';
export const DEFAULT_MEDIA_CAROUSEL_NAVIGATION: SolarisMediaCarouselNavigation =
  'dots';
export const DEFAULT_MEDIA_CAROUSEL_DOTS_POSITION: SolarisMediaCarouselDotsPosition =
  'overlay';
export const DEFAULT_MEDIA_CAROUSEL_LOOP = true;
export const DEFAULT_MEDIA_CAROUSEL_SHOW_ARROWS = true;
export const DEFAULT_MEDIA_CAROUSEL_AUTOPLAY = false;
export const DEFAULT_MEDIA_CAROUSEL_DURATION = 5000;
export const DEFAULT_MEDIA_CAROUSEL_PAUSE_ON_HOVER = true;
export const DEFAULT_MEDIA_CAROUSEL_PREVIEW_COUNT = 3;
export const DEFAULT_MEDIA_CAROUSEL_PREVIEW_POSITION: SolarisMediaCarouselPreviewPosition =
  'overlay';
export const DEFAULT_MEDIA_CAROUSEL_ASPECT_RATIO = '16 / 9';
export const DEFAULT_MEDIA_CAROUSEL_OBJECT_FIT: SolarisMediaCarouselObjectFit =
  'cover';
export const DEFAULT_MEDIA_CAROUSEL_RADIUS: SolarisMediaCarouselRadius = 'lg';

export const MEDIA_CAROUSEL_PREV_LABEL_KEY = 'carousel.prev';
export const MEDIA_CAROUSEL_PREV_LABEL = 'Previous slide';
export const MEDIA_CAROUSEL_NEXT_LABEL_KEY = 'carousel.next';
export const MEDIA_CAROUSEL_NEXT_LABEL = 'Next slide';
export const MEDIA_CAROUSEL_GO_TO_SLIDE_LABEL_KEY = 'carousel.goToSlide';
export const MEDIA_CAROUSEL_GO_TO_SLIDE_LABEL =
  'Go to slide {{index}} of {{total}}';
export const MEDIA_CAROUSEL_SLIDE_N_OF_M_LABEL_KEY = 'carousel.slideNofM';
export const MEDIA_CAROUSEL_SLIDE_N_OF_M_LABEL = '{{index}} of {{total}}';
export const MEDIA_CAROUSEL_PLAY_LABEL_KEY = 'carousel.play';
export const MEDIA_CAROUSEL_PLAY_LABEL = 'Play';
export const MEDIA_CAROUSEL_PAUSE_LABEL_KEY = 'carousel.pause';
export const MEDIA_CAROUSEL_PAUSE_LABEL = 'Pause';
export const MEDIA_CAROUSEL_EMPTY_TEXT_KEY = 'carousel.empty';
export const MEDIA_CAROUSEL_EMPTY_TEXT = 'No slides to show';

const MEDIA_CAROUSEL_RADII: ReadonlySet<SolarisMediaCarouselRadius> = new Set([
  'none',
  'sm',
  'md',
  'lg',
  'xl',
]);

export function normalizeMediaSlides(
  value: readonly SolarisMediaSlide[] | undefined | null,
): readonly SolarisMediaSlide[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value;
}

export function normalizeMediaCarouselRadius(
  value: SolarisMediaCarouselRadius,
): SolarisMediaCarouselRadius {
  if (MEDIA_CAROUSEL_RADII.has(value)) {
    return value;
  }
  return DEFAULT_MEDIA_CAROUSEL_RADIUS;
}

export function normalizeMediaCarouselAspectRatio(
  value: string | undefined | null,
): string {
  const normalized = value?.trim();
  if (normalized) {
    return normalized;
  }
  return DEFAULT_MEDIA_CAROUSEL_ASPECT_RATIO;
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

export function interpolateCarouselText(
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

export function normalizeMediaCarouselPreviewCount(value: unknown): number {
  const numeric = Math.floor(Number(value));
  if (!Number.isFinite(numeric)) {
    return DEFAULT_MEDIA_CAROUSEL_PREVIEW_COUNT;
  }
  if (numeric < 1) {
    return 1;
  }
  if (numeric > DEFAULT_MEDIA_CAROUSEL_PREVIEW_COUNT) {
    return DEFAULT_MEDIA_CAROUSEL_PREVIEW_COUNT;
  }
  return numeric;
}

export function resolveMediaCarouselPreviewIndices(
  current: number,
  count: number,
  loop: boolean,
  previewCount: number,
): readonly number[] {
  if (count <= 0) {
    return [];
  }
  const size = Math.min(
    normalizeMediaCarouselPreviewCount(previewCount),
    count,
  );
  const start = Number.isFinite(current) ? Math.floor(current) : 0;
  const clampedStart = Math.min(Math.max(start, 0), count - 1);
  const indices: number[] = [];
  for (let offset = 0; offset < size; offset += 1) {
    if (loop) {
      indices.push((((clampedStart + offset) % count) + count) % count);
    } else {
      const next = clampedStart + offset;
      if (next >= count) {
        break;
      }
      indices.push(next);
    }
  }
  return indices;
}

export const MEDIA_CAROUSEL_PREVIEW_REORDER_MS = 300;
export const MEDIA_CAROUSEL_PREVIEW_REORDER_EASING =
  'cubic-bezier(0.4, 0, 0.2, 1)';

export function previewReorderDelta(
  previous: { left: number; top: number } | null | undefined,
  current: { left: number; top: number },
): { dx: number; dy: number } | null {
  if (!previous) {
    return null;
  }
  const dx = previous.left - current.left;
  const dy = previous.top - current.top;
  if (dx === 0 && dy === 0) {
    return null;
  }
  return { dx, dy };
}

export function anchorRectForScroll(
  rect: { left: number; top: number },
  scrollX: number,
  scrollY: number,
): { left: number; top: number } {
  return { left: rect.left + scrollX, top: rect.top + scrollY };
}

export const MEDIA_CAROUSEL_SWIPE_THRESHOLD_PX = 48;

export function resolveSwipeDirection(
  deltaX: number,
  deltaY: number,
  threshold: number = MEDIA_CAROUSEL_SWIPE_THRESHOLD_PX,
): 'next' | 'prev' | null {
  if (!Number.isFinite(deltaX) || !Number.isFinite(deltaY)) {
    return null;
  }
  if (Math.abs(deltaX) <= threshold || Math.abs(deltaX) <= Math.abs(deltaY)) {
    return null;
  }
  return deltaX < 0 ? 'next' : 'prev';
}
