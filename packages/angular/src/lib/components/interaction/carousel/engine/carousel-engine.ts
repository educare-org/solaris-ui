import {
  computed,
  signal,
  type Signal,
  type WritableSignal,
} from '@angular/core';

import {
  SOLARIS_CAROUSEL_DEFAULT_DURATION,
  type SolarisCarouselEngineConfig,
  type SolarisCarouselEngineEvents,
} from './carousel-engine.types';

export function clampCarouselIndex(index: number, count: number): number {
  if (count <= 0) {
    return 0;
  }
  if (!Number.isFinite(index)) {
    return 0;
  }
  const floored = Math.floor(index);
  if (floored < 0) {
    return 0;
  }
  if (floored > count - 1) {
    return count - 1;
  }
  return floored;
}

export function wrapCarouselIndex(index: number, count: number): number {
  if (count <= 0) {
    return 0;
  }
  if (!Number.isFinite(index)) {
    return 0;
  }
  const floored = Math.floor(index);
  return ((floored % count) + count) % count;
}

export function resolveCarouselIndex(
  index: number,
  count: number,
  loop: boolean,
): number {
  if (loop) {
    return wrapCarouselIndex(index, count);
  }
  return clampCarouselIndex(index, count);
}

export function nextCarouselIndex(
  current: number,
  count: number,
  loop: boolean,
): number {
  return resolveCarouselIndex(current + 1, count, loop);
}

export function prevCarouselIndex(
  current: number,
  count: number,
  loop: boolean,
): number {
  return resolveCarouselIndex(current - 1, count, loop);
}

export function canGoNext(
  current: number,
  count: number,
  loop: boolean,
): boolean {
  if (count <= 1) {
    return false;
  }
  if (loop) {
    return true;
  }
  return current < count - 1;
}

export function canGoPrev(
  current: number,
  count: number,
  loop: boolean,
): boolean {
  if (count <= 1) {
    return false;
  }
  if (loop) {
    return true;
  }
  return current > 0;
}

export function shouldAutoRun(
  autoplay: boolean,
  duration: number,
  count: number,
  blocked: boolean,
): boolean {
  return autoplay && count > 1 && duration > 0 && !blocked;
}

export class SolarisCarouselEngine {
  readonly activeIndex: WritableSignal<number>;
  readonly isPlaying: Signal<boolean>;

  private readonly slideCount: WritableSignal<number>;
  private readonly loop: WritableSignal<boolean>;
  private readonly autoplay: WritableSignal<boolean>;
  private readonly duration: WritableSignal<number>;
  private readonly reducedMotion: WritableSignal<boolean>;
  private readonly userPaused: WritableSignal<boolean>;
  private readonly hoverPaused: WritableSignal<boolean>;
  private readonly focusPaused: WritableSignal<boolean>;
  private readonly documentHidden: WritableSignal<boolean>;
  private readonly viewportHidden: WritableSignal<boolean>;
  private readonly timerRunning: WritableSignal<boolean>;
  private readonly browser: boolean;
  private readonly events: SolarisCarouselEngineEvents;

  private timer: ReturnType<typeof setInterval> | null = null;
  private userRequestedPlay = false;

  constructor(
    config: SolarisCarouselEngineConfig,
    events: SolarisCarouselEngineEvents = {},
  ) {
    const count = sanitizeCount(config.slideCount);
    const loop = config.loop ?? true;
    this.browser = config.isBrowser ?? detectBrowser();
    this.events = events;
    this.slideCount = signal(count);
    this.loop = signal(loop);
    this.autoplay = signal(config.autoplay ?? false);
    this.duration = signal(
      config.duration ?? SOLARIS_CAROUSEL_DEFAULT_DURATION,
    );
    this.reducedMotion = signal(config.reducedMotion ?? false);
    this.userPaused = signal(false);
    this.hoverPaused = signal(false);
    this.focusPaused = signal(false);
    this.documentHidden = signal(false);
    this.viewportHidden = signal(false);
    this.timerRunning = signal(false);
    this.activeIndex = signal(
      resolveCarouselIndex(config.startIndex ?? 0, count, loop),
    );
    this.isPlaying = computed(() => this.timerRunning());
    this.syncTimer();
  }

  goTo(index: number): void {
    const count = this.slideCount();
    if (count <= 0) {
      return;
    }
    const resolved = resolveCarouselIndex(index, count, this.loop());
    if (resolved !== this.activeIndex()) {
      this.activeIndex.set(resolved);
      this.events.onIndexChange?.(resolved);
    }
  }

  next(): void {
    const count = this.slideCount();
    if (count <= 1) {
      return;
    }
    this.goTo(this.activeIndex() + 1);
  }

  prev(): void {
    const count = this.slideCount();
    if (count <= 1) {
      return;
    }
    this.goTo(this.activeIndex() - 1);
  }

  pause(): void {
    this.userPaused.set(true);
    this.userRequestedPlay = false;
    this.syncTimer();
  }

  resume(): void {
    this.userPaused.set(false);
    this.userRequestedPlay = true;
    this.syncTimer();
  }

  handleVisibilityChange(hidden: boolean): void {
    this.documentHidden.set(hidden);
    this.syncTimer();
  }

  handleHoverChange(hovering: boolean): void {
    this.hoverPaused.set(hovering);
    this.syncTimer();
  }

  handleFocusChange(focused: boolean): void {
    this.focusPaused.set(focused);
    this.syncTimer();
  }

  handleViewportChange(visible: boolean): void {
    this.viewportHidden.set(!visible);
    this.syncTimer();
  }

  setReducedMotion(reduced: boolean): void {
    this.reducedMotion.set(reduced);
    if (reduced) {
      this.userRequestedPlay = false;
    }
    this.syncTimer();
  }

  setSlideCount(count: number): void {
    const next = sanitizeCount(count);
    this.slideCount.set(next);
    if (next <= 0) {
      if (this.activeIndex() !== 0) {
        this.activeIndex.set(0);
      }
      this.syncTimer();
      return;
    }
    const clamped = clampCarouselIndex(this.activeIndex(), next);
    if (clamped !== this.activeIndex()) {
      this.activeIndex.set(clamped);
      this.events.onIndexChange?.(clamped);
    }
    this.syncTimer();
  }

  setLoop(loop: boolean): void {
    this.loop.set(loop);
  }

  setAutoplay(autoplay: boolean): void {
    this.autoplay.set(autoplay);
    this.restartTimer();
  }

  setDuration(duration: number): void {
    this.duration.set(duration);
    this.restartTimer();
  }

  destroy(): void {
    this.stopTimer();
  }

  private syncTimer(): void {
    // SECURITY_EXCEPTION: no window/document access here; browser was resolved once via typeof guards so construction stays SSR-safe; timer only runs in browser.
    if (!this.browser) {
      this.stopTimer();
      return;
    }
    const blocked =
      this.userPaused() ||
      this.hoverPaused() ||
      this.focusPaused() ||
      this.documentHidden() ||
      this.viewportHidden() ||
      (this.reducedMotion() && !this.userRequestedPlay);
    if (
      shouldAutoRun(
        this.autoplay(),
        this.duration(),
        this.slideCount(),
        blocked,
      )
    ) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  private restartTimer(): void {
    this.stopTimer();
    this.syncTimer();
  }

  private startTimer(): void {
    if (this.timer !== null) {
      return;
    }
    const duration = this.duration();
    if (duration <= 0) {
      return;
    }
    this.timer = setInterval(() => {
      this.tick();
    }, duration);
    this.timerRunning.set(true);
  }

  private stopTimer(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.timerRunning()) {
      this.timerRunning.set(false);
    }
  }

  private tick(): void {
    if (this.slideCount() <= 1) {
      return;
    }
    this.next();
  }
}

function sanitizeCount(count: number): number {
  if (!Number.isFinite(count) || count <= 0) {
    return 0;
  }
  return Math.floor(count);
}

function detectBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.setInterval === 'function'
  );
}
