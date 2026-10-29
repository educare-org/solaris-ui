import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  booleanAttribute,
  computed,
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

import type { SolarisMediaSlide } from '../model/solaris-media-slide';
import type { SolarisMediaCarouselDotsPosition } from '../model/media-carousel-dots-position';
import type { SolarisMediaCarouselNavigation } from '../model/media-carousel-navigation';
import type { SolarisMediaCarouselObjectFit } from '../model/media-carousel-object-fit';
import type { SolarisMediaCarouselRadius } from '../model/media-carousel-radius';
import type { SolarisMediaCarouselVisibleCount } from '../model/media-carousel-visible-count';
import {
  DEFAULT_MEDIA_CAROUSEL_ACTIVE_INDEX,
  DEFAULT_MEDIA_CAROUSEL_ASPECT_RATIO,
  DEFAULT_MEDIA_CAROUSEL_AUTOPLAY,
  DEFAULT_MEDIA_CAROUSEL_DOTS_POSITION,
  DEFAULT_MEDIA_CAROUSEL_DURATION,
  DEFAULT_MEDIA_CAROUSEL_LOOP,
  DEFAULT_MEDIA_CAROUSEL_NAVIGATION,
  DEFAULT_MEDIA_CAROUSEL_OBJECT_FIT,
  DEFAULT_MEDIA_CAROUSEL_PAUSE_ON_HOVER,
  DEFAULT_MEDIA_CAROUSEL_RADIUS,
  DEFAULT_MEDIA_CAROUSEL_SHOW_ARROWS,
  DEFAULT_MEDIA_CAROUSEL_VISIBLE_COUNT,
  MEDIA_CAROUSEL_EMPTY_TEXT,
  MEDIA_CAROUSEL_EMPTY_TEXT_KEY,
  MEDIA_CAROUSEL_GO_TO_SLIDE_LABEL,
  MEDIA_CAROUSEL_GO_TO_SLIDE_LABEL_KEY,
  MEDIA_CAROUSEL_NEXT_LABEL,
  MEDIA_CAROUSEL_NEXT_LABEL_KEY,
  MEDIA_CAROUSEL_PAUSE_LABEL,
  MEDIA_CAROUSEL_PAUSE_LABEL_KEY,
  MEDIA_CAROUSEL_PLAY_LABEL,
  MEDIA_CAROUSEL_PLAY_LABEL_KEY,
  MEDIA_CAROUSEL_PREV_LABEL,
  MEDIA_CAROUSEL_PREV_LABEL_KEY,
  MEDIA_CAROUSEL_SLIDE_N_OF_M_LABEL,
  MEDIA_CAROUSEL_SLIDE_N_OF_M_LABEL_KEY,
  interpolateCarouselText,
  normalizeMediaCarouselAspectRatio,
  normalizeMediaCarouselRadius,
  normalizeMediaSlides,
  normalizeOptionalString,
} from '../model/media-carousel-defaults';

@Component({
  selector: 'solaris-media-carousel',
  standalone: true,
  imports: [NgTemplateOutlet, SolarisIconComponent],
  templateUrl: './media-carousel.component.html',
  styleUrls: ['./media-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-media-carousel',
    role: 'region',
    '(keydown)': 'handleKeydown($event)',
    '[attr.aria-roledescription]': `'carousel'`,
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[attr.data-navigation]': 'navigation()',
    '[attr.data-visible]': 'visibleCount()',
    '[attr.data-dots-position]': 'dotsPosition()',
    '[attr.data-radius]': 'normalizedRadius()',
  },
})
export class SolarisMediaCarouselComponent {
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

  readonly slides = input<readonly SolarisMediaSlide[]>([]);
  readonly activeIndex = model<number>(DEFAULT_MEDIA_CAROUSEL_ACTIVE_INDEX);
  readonly visibleCount = input<SolarisMediaCarouselVisibleCount>(
    DEFAULT_MEDIA_CAROUSEL_VISIBLE_COUNT,
  );
  readonly navigation = input<SolarisMediaCarouselNavigation>(
    DEFAULT_MEDIA_CAROUSEL_NAVIGATION,
  );
  readonly dotsPosition = input<SolarisMediaCarouselDotsPosition>(
    DEFAULT_MEDIA_CAROUSEL_DOTS_POSITION,
  );
  readonly showArrows = input<boolean, boolean>(
    DEFAULT_MEDIA_CAROUSEL_SHOW_ARROWS,
    { transform: booleanAttribute },
  );
  readonly loop = input<boolean, boolean>(DEFAULT_MEDIA_CAROUSEL_LOOP, {
    transform: booleanAttribute,
  });
  readonly autoplay = input<boolean, boolean>(DEFAULT_MEDIA_CAROUSEL_AUTOPLAY, {
    transform: booleanAttribute,
  });
  readonly duration = input<number>(DEFAULT_MEDIA_CAROUSEL_DURATION);
  readonly showPlayPause = input<boolean | undefined>(undefined);
  readonly pauseOnHover = input<boolean, boolean>(
    DEFAULT_MEDIA_CAROUSEL_PAUSE_ON_HOVER,
    { transform: booleanAttribute },
  );
  readonly aspectRatio = input<string>(DEFAULT_MEDIA_CAROUSEL_ASPECT_RATIO);
  readonly objectFit = input<SolarisMediaCarouselObjectFit>(
    DEFAULT_MEDIA_CAROUSEL_OBJECT_FIT,
  );
  readonly radius = input<SolarisMediaCarouselRadius>(
    DEFAULT_MEDIA_CAROUSEL_RADIUS,
  );
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);
  readonly playLabel = input<string | undefined>(undefined);
  readonly playLabelKey = input<string | undefined>(undefined);
  readonly pauseLabel = input<string | undefined>(undefined);
  readonly pauseLabelKey = input<string | undefined>(undefined);
  readonly emptyText = input<string | undefined>(undefined);
  readonly emptyTextKey = input<string | undefined>(undefined);

  readonly autoplayChange = output<boolean>();

  constructor() {
    const platformId = inject(PLATFORM_ID);
    const browser = isPlatformBrowser(platformId);
    this.engine = new SolarisCarouselEngine(
      {
        slideCount: normalizeMediaSlides(this.slides()).length,
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
      const slideCount = normalizeMediaSlides(this.slides()).length;
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

  protected readonly normalizedSlides = computed(() =>
    normalizeMediaSlides(this.slides()),
  );

  protected readonly slideCount = computed(
    () => this.normalizedSlides().length,
  );

  protected readonly normalizedRadius = computed(() =>
    normalizeMediaCarouselRadius(this.radius()),
  );

  protected readonly normalizedAspectRatio = computed(() =>
    normalizeMediaCarouselAspectRatio(this.aspectRatio()),
  );

  protected readonly normalizedDuration = computed(() => {
    const duration = Math.floor(Number(this.duration()));
    return Number.isFinite(duration) && duration > 0 ? duration : 0;
  });

  protected readonly currentIndex = computed(() =>
    resolveCarouselIndex(this.activeIndex(), this.slideCount(), this.loop()),
  );

  protected readonly isEmpty = computed(() => this.slideCount() === 0);

  protected readonly showControls = computed(() => this.slideCount() > 1);

  protected readonly showDots = computed(
    () => this.navigation() === 'dots' && this.slideCount() > 1,
  );

  protected readonly isDotsOutside = computed(
    () => this.dotsPosition() === 'outside',
  );

  protected readonly showArrowsControl = computed(
    () => this.showArrows() && this.slideCount() > 1,
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
      MEDIA_CAROUSEL_PREV_LABEL_KEY,
      MEDIA_CAROUSEL_PREV_LABEL,
    ),
  );

  protected readonly resolvedNextLabel = computed(() =>
    this.resolveText(
      undefined,
      MEDIA_CAROUSEL_NEXT_LABEL_KEY,
      MEDIA_CAROUSEL_NEXT_LABEL,
    ),
  );

  protected readonly resolvedPlayLabel = computed(() =>
    this.resolveText(
      this.playLabel(),
      this.playLabelKey() ?? MEDIA_CAROUSEL_PLAY_LABEL_KEY,
      MEDIA_CAROUSEL_PLAY_LABEL,
    ),
  );

  protected readonly resolvedPauseLabel = computed(() =>
    this.resolveText(
      this.pauseLabel(),
      this.pauseLabelKey() ?? MEDIA_CAROUSEL_PAUSE_LABEL_KEY,
      MEDIA_CAROUSEL_PAUSE_LABEL,
    ),
  );

  protected readonly resolvedEmptyText = computed(() =>
    this.resolveText(
      this.emptyText(),
      this.emptyTextKey() ?? MEDIA_CAROUSEL_EMPTY_TEXT_KEY,
      MEDIA_CAROUSEL_EMPTY_TEXT,
    ),
  );

  protected dotLabel(index: number): string {
    return interpolateCarouselText(
      this.resolveText(
        undefined,
        MEDIA_CAROUSEL_GO_TO_SLIDE_LABEL_KEY,
        MEDIA_CAROUSEL_GO_TO_SLIDE_LABEL,
      ),
      { index: index + 1, total: this.slideCount() },
    );
  }

  protected slideLabel(index: number): string {
    return interpolateCarouselText(
      this.resolveText(
        undefined,
        MEDIA_CAROUSEL_SLIDE_N_OF_M_LABEL_KEY,
        MEDIA_CAROUSEL_SLIDE_N_OF_M_LABEL,
      ),
      { index: index + 1, total: this.slideCount() },
    );
  }

  protected slideImageSrc(slide: SolarisMediaSlide): string {
    if (slide.type === 'video') {
      return slide.poster ?? slide.src;
    }
    return slide.src;
  }

  protected slideAlt(slide: SolarisMediaSlide): string {
    const direct = normalizeOptionalString(slide.alt);
    if (direct) {
      return direct;
    }
    const key = normalizeOptionalString(slide.altKey);
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
    }
    return '';
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
  ): void {
    if (zone === 'viewport') {
      this.viewportFocused = focused;
    } else {
      this.dotsFocused = focused;
    }
    if (this.pauseOnHover()) {
      this.engine.handleFocusChange(this.viewportFocused || this.dotsFocused);
    }
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
