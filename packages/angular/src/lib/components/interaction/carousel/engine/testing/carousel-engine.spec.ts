import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  SolarisCarouselEngine,
  canGoNext,
  canGoPrev,
  clampCarouselIndex,
  nextCarouselIndex,
  prevCarouselIndex,
  resolveCarouselIndex,
  shouldAutoRun,
  wrapCarouselIndex,
} from '../carousel-engine';
import type { SolarisCarouselEngineConfig } from '../carousel-engine.types';

function createEngine(
  overrides: Partial<SolarisCarouselEngineConfig> = {},
): SolarisCarouselEngine {
  return new SolarisCarouselEngine({
    slideCount: 3,
    loop: true,
    autoplay: false,
    duration: 5000,
    isBrowser: true,
    ...overrides,
  });
}

describe('carousel index utils', () => {
  it('should wrap forward and backward when loop is enabled', () => {
    expect(nextCarouselIndex(2, 3, true)).toBe(0);
    expect(prevCarouselIndex(0, 3, true)).toBe(2);
    expect(resolveCarouselIndex(5, 3, true)).toBe(2);
    expect(resolveCarouselIndex(-1, 3, true)).toBe(2);
  });

  it('should clamp out-of-range indexes when loop is disabled', () => {
    expect(nextCarouselIndex(2, 3, false)).toBe(2);
    expect(prevCarouselIndex(0, 3, false)).toBe(0);
    expect(resolveCarouselIndex(9, 3, false)).toBe(2);
    expect(resolveCarouselIndex(-4, 3, false)).toBe(0);
  });

  it('should return 0 for empty lists', () => {
    expect(clampCarouselIndex(2, 0)).toBe(0);
    expect(wrapCarouselIndex(2, 0)).toBe(0);
    expect(resolveCarouselIndex(2, 0, true)).toBe(0);
    expect(nextCarouselIndex(0, 0, true)).toBe(0);
    expect(prevCarouselIndex(0, 0, false)).toBe(0);
    expect(canGoNext(0, 0, true)).toBe(false);
    expect(canGoPrev(0, 0, true)).toBe(false);
  });

  it('should pin a single slide at 0 and disable navigation', () => {
    expect(wrapCarouselIndex(7, 1)).toBe(0);
    expect(clampCarouselIndex(7, 1)).toBe(0);
    expect(nextCarouselIndex(0, 1, true)).toBe(0);
    expect(prevCarouselIndex(0, 1, true)).toBe(0);
    expect(canGoNext(0, 1, true)).toBe(false);
    expect(canGoPrev(0, 1, true)).toBe(false);
    expect(shouldAutoRun(true, 5000, 1, false)).toBe(false);
  });
});

describe('SolarisCarouselEngine navigation', () => {
  it('should wrap with loop enabled', () => {
    const engine = createEngine({ slideCount: 3, loop: true });
    engine.goTo(2);
    engine.next();
    expect(engine.activeIndex()).toBe(0);
    engine.prev();
    expect(engine.activeIndex()).toBe(2);
    engine.destroy();
  });

  it('should clamp with loop disabled', () => {
    const engine = createEngine({ slideCount: 3, loop: false });
    engine.goTo(2);
    engine.next();
    expect(engine.activeIndex()).toBe(2);
    engine.goTo(0);
    engine.prev();
    expect(engine.activeIndex()).toBe(0);
    engine.destroy();
  });

  it('should ignore navigation for empty and single lists', () => {
    const empty = createEngine({ slideCount: 0 });
    empty.next();
    empty.prev();
    empty.goTo(4);
    expect(empty.activeIndex()).toBe(0);

    const single = createEngine({ slideCount: 1 });
    single.next();
    expect(single.activeIndex()).toBe(0);
    single.prev();
    expect(single.activeIndex()).toBe(0);

    empty.destroy();
    single.destroy();
  });

  it('should emit index changes', () => {
    const seen: number[] = [];
    const engine = new SolarisCarouselEngine(
      { slideCount: 3, loop: true, isBrowser: true },
      { onIndexChange: (index) => seen.push(index) },
    );
    engine.goTo(2);
    engine.goTo(2);
    expect(seen).toEqual([2]);
    engine.destroy();
  });
});

describe('SolarisCarouselEngine autoplay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should advance on duration and stop after pause', () => {
    const engine = createEngine({
      slideCount: 3,
      autoplay: true,
      duration: 1000,
    });
    expect(engine.isPlaying()).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(engine.activeIndex()).toBe(1);
    engine.pause();
    expect(engine.isPlaying()).toBe(false);
    vi.advanceTimersByTime(5000);
    expect(engine.activeIndex()).toBe(1);
    engine.resume();
    expect(engine.isPlaying()).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(engine.activeIndex()).toBe(2);
    engine.destroy();
  });

  it('should pause when the tab is hidden and resume when visible', () => {
    const engine = createEngine({
      slideCount: 3,
      autoplay: true,
      duration: 1000,
    });
    engine.handleVisibilityChange(true);
    expect(engine.isPlaying()).toBe(false);
    vi.advanceTimersByTime(3000);
    expect(engine.activeIndex()).toBe(0);
    engine.handleVisibilityChange(false);
    expect(engine.isPlaying()).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(engine.activeIndex()).toBe(1);
    engine.destroy();
  });

  it('should pause when leaving the viewport and resume when back', () => {
    const engine = createEngine({
      slideCount: 3,
      autoplay: true,
      duration: 1000,
    });
    engine.handleViewportChange(false);
    expect(engine.isPlaying()).toBe(false);
    engine.handleViewportChange(true);
    expect(engine.isPlaying()).toBe(true);
    engine.destroy();
  });

  it('should stay off under reduced motion until the user resumes', () => {
    const engine = createEngine({
      slideCount: 3,
      autoplay: true,
      duration: 1000,
      reducedMotion: true,
    });
    expect(engine.isPlaying()).toBe(false);
    vi.advanceTimersByTime(3000);
    expect(engine.activeIndex()).toBe(0);
    engine.resume();
    expect(engine.isPlaying()).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(engine.activeIndex()).toBe(1);
    engine.destroy();
  });

  it('should pause on hover and focus and resume after', () => {
    const engine = createEngine({
      slideCount: 3,
      autoplay: true,
      duration: 1000,
    });
    engine.handleHoverChange(true);
    expect(engine.isPlaying()).toBe(false);
    engine.handleHoverChange(false);
    expect(engine.isPlaying()).toBe(true);
    engine.handleFocusChange(true);
    expect(engine.isPlaying()).toBe(false);
    vi.advanceTimersByTime(2000);
    expect(engine.activeIndex()).toBe(0);
    engine.handleFocusChange(false);
    vi.advanceTimersByTime(1000);
    expect(engine.activeIndex()).toBe(1);
    engine.destroy();
  });

  it('should never autoplay empty or single lists', () => {
    const empty = createEngine({
      slideCount: 0,
      autoplay: true,
      duration: 1000,
    });
    const single = createEngine({
      slideCount: 1,
      autoplay: true,
      duration: 1000,
    });
    expect(empty.isPlaying()).toBe(false);
    expect(single.isPlaying()).toBe(false);
    empty.destroy();
    single.destroy();
  });

  it('should clamp the index and emit when the slide count shrinks', () => {
    const seen: number[] = [];
    const engine = new SolarisCarouselEngine(
      { slideCount: 3, loop: true, isBrowser: true },
      { onIndexChange: (index) => seen.push(index) },
    );
    engine.goTo(2);
    engine.setSlideCount(2);
    expect(engine.activeIndex()).toBe(1);
    expect(seen).toEqual([2, 1]);
    engine.setSlideCount(0);
    expect(engine.activeIndex()).toBe(0);
    engine.destroy();
  });

  it('should restart the timer when autoplay or duration change', () => {
    const engine = createEngine({ slideCount: 3, duration: 1000 });
    expect(engine.isPlaying()).toBe(false);
    engine.setAutoplay(true);
    expect(engine.isPlaying()).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(engine.activeIndex()).toBe(1);
    engine.setDuration(2000);
    vi.advanceTimersByTime(1000);
    expect(engine.activeIndex()).toBe(1);
    vi.advanceTimersByTime(1000);
    expect(engine.activeIndex()).toBe(2);
    engine.setReducedMotion(true);
    expect(engine.isPlaying()).toBe(false);
    engine.destroy();
  });
});
