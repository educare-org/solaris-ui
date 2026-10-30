import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  untracked,
} from '@angular/core';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';

import { SolarisTranslateService } from '../../../../../services/translation';
import { SolarisAccessibilityService } from '../../../../../services/accessibility';
import { SolarisIconComponent } from '../../../../icon';
import {
  SolarisCarouselEngine,
  canGoNext,
  canGoPrev,
  resolveCarouselIndex,
} from '../../engine/carousel-engine';
import { SolarisCarouselSlideDirective } from '../directives/carousel-slide.directive';

import type { SolarisContentCarouselAlign } from '../model/content-carousel-align';
import type { SolarisContentCarouselNavigation } from '../model/content-carousel-navigation';
import {
  CONTENT_CAROUSEL_EMPTY_TEXT,
  CONTENT_CAROUSEL_EMPTY_TEXT_KEY,
  CONTENT_CAROUSEL_GO_TO_SLIDE_LABEL,
  CONTENT_CAROUSEL_GO_TO_SLIDE_LABEL_KEY,
  CONTENT_CAROUSEL_NEXT_LABEL,
  CONTENT_CAROUSEL_NEXT_LABEL_KEY,
  CONTENT_CAROUSEL_PAUSE_LABEL,
  CONTENT_CAROUSEL_PAUSE_LABEL_KEY,
  CONTENT_CAROUSEL_PLAY_LABEL,
  CONTENT_CAROUSEL_PLAY_LABEL_KEY,
  CONTENT_CAROUSEL_PREV_LABEL,
  CONTENT_CAROUSEL_PREV_LABEL_KEY,
  CONTENT_CAROUSEL_SLIDE_N_OF_M_LABEL,
  CONTENT_CAROUSEL_SLIDE_N_OF_M_LABEL_KEY,
  DEFAULT_CONTENT_CAROUSEL_ACTIVE_INDEX,
  DEFAULT_CONTENT_CAROUSEL_ALIGN,
  DEFAULT_CONTENT_CAROUSEL_AUTOPLAY,
  DEFAULT_CONTENT_CAROUSEL_DURATION,
  DEFAULT_CONTENT_CAROUSEL_LOOP,
  DEFAULT_CONTENT_CAROUSEL_NAVIGATION,
  DEFAULT_CONTENT_CAROUSEL_PAUSE_ON_HOVER,
  DEFAULT_CONTENT_CAROUSEL_SHOW_ARROWS,
  DEFAULT_CONTENT_CAROUSEL_SHOW_DIVIDER,
  interpolateContentCarouselText,
  normalizeContentCarouselAlign,
  normalizeContentCarouselNavigation,
  normalizeOptionalString,
  resolveContentCarouselDividerSide,
  resolveContentSwipeDirection,
} from '../model/content-carousel-defaults';

@Component({
  selector: 'solaris-content-carousel',
  standalone: true,
  imports: [NgTemplateOutlet, SolarisIconComponent],
  templateUrl: './content-carousel.component.html',
  styleUrls: ['./content-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-content-carousel',
    role: 'region',
    '(keydown)': 'handleKeydown($event)',
    '(pointerup)': 'handleSwipeEnd($event)',
    '(pointercancel)': 'handleSwipeCancel()',
    '[attr.aria-roledescription]': `'carousel'`,
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[attr.data-navigation]': 'normalizedNavigation()',
    '[attr.data-fill]': "showFill() ? '' : null",
    '[attr.data-align]': 'normalizedAlign()',
    '[attr.data-divider]': 'dividerSide()',
  },
})
export class SolarisContentCarouselComponent {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly accessibilityService = inject(SolarisAccessibilityService, {
    optional: true,
  });
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly engine: SolarisCarouselEngine;
  private viewportHovering = false;
  private dotsHovering = false;
  private viewportFocused = false;
  private dotsFocused = false;
  private swipeStart: { x: number; y: number } | null = null;

  protected readonly slides = contentChildren(SolarisCarouselSlideDirective);

  readonly activeIndex = model<number>(DEFAULT_CONTENT_CAROUSEL_ACTIVE_INDEX);
  readonly navigation = input<SolarisContentCarouselNavigation>(
    DEFAULT_CONTENT_CAROUSEL_NAVIGATION,
  );
  readonly showArrows = input<boolean, boolean>(
    DEFAULT_CONTENT_CAROUSEL_SHOW_ARROWS,
    { transform: booleanAttribute },
  );
  readonly loop = input<boolean, boolean>(DEFAULT_CONTENT_CAROUSEL_LOOP, {
    transform: booleanAttribute,
  });
  readonly autoplay = input<boolean, boolean>(
    DEFAULT_CONTENT_CAROUSEL_AUTOPLAY,
    { transform: booleanAttribute },
  );
  readonly duration = input<number>(DEFAULT_CONTENT_CAROUSEL_DURATION);
  readonly showPlayPause = input<boolean | undefined>(undefined);
  readonly pauseOnHover = input<boolean, boolean>(
    DEFAULT_CONTENT_CAROUSEL_PAUSE_ON_HOVER,
    { transform: booleanAttribute },
  );
  readonly align = input<SolarisContentCarouselAlign>(
    DEFAULT_CONTENT_CAROUSEL_ALIGN,
  );
  readonly showDivider = input<boolean, boolean>(
    DEFAULT_CONTENT_CAROUSEL_SHOW_DIVIDER,
    { transform: booleanAttribute },
  );
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly autoplayChange = output<boolean>();

  constructor() {
    const platformId = inject(PLATFORM_ID);
    const browser = isPlatformBrowser(platformId);
    this.engine = new SolarisCarouselEngine(
      {
        slideCount: this.slides().length,
        loop: this.loop(),
        autoplay: this.autoplay(),
        duration: this.duration(),
        reducedMotion: this.accessibilityService?.reducedMotionValue ?? false,
        startIndex: this.activeIndex(),
        isBrowser: browser,
      },
      { onIndexChange: (index) => this.activeIndex.set(index) },
    );
    effect(() => {
      const slideCount = this.slides().length;
      untracked(() => this.engine.setSlideCount(slideCount));
    });
    effect(() => {
      const index = this.currentIndex();
      untracked(() => {
        if (index !== this.engine.activeIndex()) {
          this.engine.goTo(index);
        }
      });
    });
    effect(() => {
      const loop = this.loop();
      untracked(() => this.engine.setLoop(loop));
    });
    effect(() => {
      const autoplay = this.autoplay();
      untracked(() => this.engine.setAutoplay(autoplay));
    });
    effect(() => {
      const duration = this.duration();
      untracked(() => this.engine.setDuration(duration));
    });
    effect(() => {
      const reducedMotion = this.accessibilityService?.reducedMotion() ?? false;
      untracked(() => this.engine.setReducedMotion(reducedMotion));
    });
    this.destroyRef.onDestroy(() => this.engine.destroy());
    // SECURITY_EXCEPTION: visibility/viewport observers attach via DOCUMENT defaultView and IntersectionObserver behind an isPlatformBrowser guard with DestroyRef cleanup; no Renderer2 equivalent exists for these APIs; covered by autoplay specs.
    if (browser) {
      const view: Window | null = this.document.defaultView;
      if (view) {
        const observed: Window = view;
        const onVisibility = (): void => {
          this.engine.handleVisibilityChange(observed.document.hidden);
        };
        observed.document.addEventListener('visibilitychange', onVisibility);
        this.destroyRef.onDestroy(() =>
          observed.document.removeEventListener(
            'visibilitychange',
            onVisibility,
          ),
        );
      }
      if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            this.engine.handleViewportChange(entry.isIntersecting);
          }
        });
        observer.observe(this.elementRef.nativeElement);
        this.destroyRef.onDestroy(() => observer.disconnect());
      }
    }
  }

  protected readonly normalizedNavigation = computed(() =>
    normalizeContentCarouselNavigation(this.navigation()),
  );

  protected readonly normalizedAlign = computed(() =>
    normalizeContentCarouselAlign(this.align()),
  );

  protected readonly dividerSide = computed(() =>
    resolveContentCarouselDividerSide(
      this.normalizedAlign(),
      this.showDivider(),
    ),
  );

  protected readonly slideCount = computed(() => this.slides().length);

  protected readonly normalizedDuration = computed(() => {
    const duration = Math.floor(Number(this.duration()));
    return Number.isFinite(duration) && duration > 0 ? duration : 0;
  });

  protected readonly currentIndex = computed(() =>
    resolveCarouselIndex(this.activeIndex(), this.slideCount(), this.loop()),
  );

  protected readonly isEmpty = computed(() => this.slideCount() === 0);

  protected readonly showArrowsControl = computed(
    () => this.showArrows() && this.slideCount() > 1,
  );

  protected readonly showDots = computed(
    () =>
      (this.normalizedNavigation() === 'dots' ||
        this.normalizedNavigation() === 'progress') &&
      this.slideCount() > 1,
  );

  protected readonly showFill = computed(
    () =>
      this.autoplay() && this.normalizedDuration() > 0 && this.slideCount() > 1,
  );

  protected get playing(): boolean {
    return this.engine.isPlaying();
  }

  protected readonly showPlayPauseControl = computed(
    () => (this.showPlayPause() ?? this.autoplay()) && this.slideCount() > 1,
  );

  protected readonly progressDuration = computed(
    () => `${this.normalizedDuration()}ms`,
  );

  protected readonly canPrevious = computed(() =>
    canGoPrev(this.currentIndex(), this.slideCount(), this.loop()),
  );

  protected readonly canNext = computed(() =>
    canGoNext(this.currentIndex(), this.slideCount(), this.loop()),
  );

  protected readonly dotIndices = computed(() =>
    Array.from({ length: this.slideCount() }, (_, index) => index),
  );

  protected readonly trackTransform = computed(
    () => `translateX(-${this.currentIndex() * 100}%)`,
  );

  protected readonly resolvedAriaLabel = computed(() =>
    this.resolveText(this.ariaLabel(), this.ariaLabelKey(), ''),
  );

  protected readonly resolvedPrevLabel = computed(() =>
    this.resolveText(
      undefined,
      CONTENT_CAROUSEL_PREV_LABEL_KEY,
      CONTENT_CAROUSEL_PREV_LABEL,
    ),
  );

  protected readonly resolvedNextLabel = computed(() =>
    this.resolveText(
      undefined,
      CONTENT_CAROUSEL_NEXT_LABEL_KEY,
      CONTENT_CAROUSEL_NEXT_LABEL,
    ),
  );

  protected readonly resolvedPlayLabel = computed(() =>
    this.resolveText(
      undefined,
      CONTENT_CAROUSEL_PLAY_LABEL_KEY,
      CONTENT_CAROUSEL_PLAY_LABEL,
    ),
  );

  protected readonly resolvedPauseLabel = computed(() =>
    this.resolveText(
      undefined,
      CONTENT_CAROUSEL_PAUSE_LABEL_KEY,
      CONTENT_CAROUSEL_PAUSE_LABEL,
    ),
  );

  protected readonly resolvedEmptyText = computed(() =>
    this.resolveText(
      undefined,
      CONTENT_CAROUSEL_EMPTY_TEXT_KEY,
      CONTENT_CAROUSEL_EMPTY_TEXT,
    ),
  );

  protected dotLabel(index: number): string {
    return interpolateContentCarouselText(
      this.resolveText(
        undefined,
        CONTENT_CAROUSEL_GO_TO_SLIDE_LABEL_KEY,
        CONTENT_CAROUSEL_GO_TO_SLIDE_LABEL,
      ),
      { index: index + 1, total: this.slideCount() },
    );
  }

  protected slideLabel(index: number): string {
    return interpolateContentCarouselText(
      this.resolveText(
        undefined,
        CONTENT_CAROUSEL_SLIDE_N_OF_M_LABEL_KEY,
        CONTENT_CAROUSEL_SLIDE_N_OF_M_LABEL,
      ),
      { index: index + 1, total: this.slideCount() },
    );
  }

  protected goTo(index: number): void {
    this.engine.goTo(index);
  }

  protected next(): void {
    this.syncEngineToModel();
    this.engine.next();
  }

  protected prev(): void {
    this.syncEngineToModel();
    this.engine.prev();
  }

  protected handleSwipeStart(event: PointerEvent): void {
    this.swipeStart = { x: event.clientX, y: event.clientY };
  }

  protected handleSwipeEnd(event: PointerEvent): void {
    const start = this.swipeStart;
    this.swipeStart = null;
    if (!start || this.slideCount() <= 1) {
      return;
    }
    const direction = resolveContentSwipeDirection(
      event.clientX - start.x,
      event.clientY - start.y,
    );
    if (direction === 'next') {
      this.next();
    } else if (direction === 'prev') {
      this.prev();
    }
  }

  protected handleSwipeCancel(): void {
    this.swipeStart = null;
  }

  protected toggleAutoplay(): void {
    if (this.engine.isPlaying()) {
      this.engine.pause();
      this.autoplayChange.emit(false);
    } else {
      this.engine.resume();
      this.autoplayChange.emit(true);
    }
  }

  protected handleHover(
    hovering: boolean,
    zone: 'viewport' | 'dots' = 'viewport',
  ): void {
    if (zone === 'viewport') {
      this.viewportHovering = hovering;
    } else {
      this.dotsHovering = hovering;
    }
    if (this.pauseOnHover()) {
      this.engine.handleHoverChange(this.viewportHovering || this.dotsHovering);
    }
  }

  protected handleFocus(
    focused: boolean,
    zone: 'viewport' | 'dots' = 'viewport',
    event?: FocusEvent,
  ): void {
    if (focused && !this.isKeyboardFocus(event)) {
      return;
    }
    if (zone === 'viewport') {
      this.viewportFocused = focused;
    } else {
      this.dotsFocused = focused;
    }
    if (this.pauseOnHover()) {
      this.engine.handleFocusChange(this.viewportFocused || this.dotsFocused);
    }
  }

  private isKeyboardFocus(event: FocusEvent | undefined): boolean {
    const target = event?.target as Element | null | undefined;
    return target?.matches?.(':focus-visible') ?? true;
  }

  private syncEngineToModel(): void {
    const current = this.currentIndex();
    if (current !== this.engine.activeIndex()) {
      this.engine.goTo(current);
    }
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.slideCount() <= 1) {
      return;
    }
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this.next();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.prev();
        break;
      case 'Home':
        event.preventDefault();
        this.goTo(0);
        break;
      case 'End':
        event.preventDefault();
        this.goTo(this.slideCount() - 1);
        break;
    }
  }

  protected resolveText(
    directText?: string | null,
    translationKey?: string | null,
    fallbackText = '',
  ): string {
    const direct = normalizeOptionalString(directText);
    if (direct) {
      return direct;
    }
    const key = normalizeOptionalString(translationKey);
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
    }
    return fallbackText;
  }
}
