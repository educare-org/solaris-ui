import {
  afterNextRender,
  computed,
  createComponent,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  input,
  PLATFORM_ID,
  type ComponentRef,
  type Signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { SOLARIS_BUTTON_GROUP_CONTEXT } from '../../button-group/model/button-group-context';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisSpinnerComponent } from '../../../feedback/spinner';

@Directive()
export abstract class SolarisButtonHostBase {
  abstract readonly size: Signal<string>;
  abstract readonly appearance: Signal<string>;
  abstract readonly color: Signal<string>;
  abstract readonly shape: Signal<string>;
  abstract readonly radius: Signal<string>;
  abstract readonly density: Signal<string | undefined>;
  abstract readonly disabled: Signal<boolean>;
  abstract readonly loading: Signal<boolean>;
  abstract readonly loadingLabel: Signal<string | undefined>;
  abstract readonly loadingLabelKey: Signal<string | undefined>;
  abstract readonly ariaLabel: Signal<string | undefined>;
  abstract readonly ariaLabelKey: Signal<string | undefined>;

  protected readonly themeService = inject(SolarisThemeService);

  readonly dataSize = input<string | undefined>(undefined, {
    alias: 'data-size',
  });
  readonly dataDensity = input<string | undefined>(undefined, {
    alias: 'data-density',
  });
  readonly dataAppearance = input<string | undefined>(undefined, {
    alias: 'data-appearance',
  });
  readonly dataColor = input<string | undefined>(undefined, {
    alias: 'data-color',
  });
  readonly dataShape = input<string | undefined>(undefined, {
    alias: 'data-shape',
  });
  readonly dataRadius = input<string | undefined>(undefined, {
    alias: 'data-radius',
  });

  private readonly groupContext = inject(SOLARIS_BUTTON_GROUP_CONTEXT, {
    optional: true,
    skipSelf: true,
  });

  protected readonly resolvedSize = computed(
    () => this.dataSize() ?? this.size(),
  );

  protected readonly resolvedAppearance = computed(
    () => this.dataAppearance() ?? this.appearance(),
  );

  protected readonly resolvedColor = computed(
    () => this.dataColor() ?? this.color(),
  );

  protected readonly resolvedShape = computed(
    () => this.dataShape() ?? this.shape(),
  );

  protected readonly resolvedRadius = computed(
    () => this.dataRadius() ?? this.radius(),
  );

  protected readonly effectiveSize = computed(() => {
    return this.groupContext?.size() ?? this.resolvedSize();
  });

  protected readonly groupPlacement = computed(() => {
    const group = this.groupContext;
    if (!group?.attached()) {
      return null;
    }
    return group.orientation();
  });

  protected readonly effectiveDensity = computed(() => {
    return (
      this.groupContext?.effectiveDensity() ??
      this.dataDensity() ??
      this.density() ??
      this.themeService.density
    );
  });

  protected readonly isEffectivelyDisabled = computed(
    () => this.disabled() || this.loading(),
  );

  protected readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly translate = inject(SolarisTranslateService, {
    optional: true,
  });
  protected readonly environmentInjector = inject(EnvironmentInjector);
  protected readonly platformId = inject(PLATFORM_ID);
  protected readonly destroyRef = inject(DestroyRef);

  private spinnerRef: ComponentRef<SolarisSpinnerComponent> | null = null;

  protected readonly resolvedLoadingLabel = computed(() => {
    const label = this.loadingLabel();
    if (label) {
      return label;
    }

    const key = this.loadingLabelKey();
    if (key && this.translate) {
      return this.translate.translate(key);
    }

    if (this.translate) {
      return this.translate.translate('solaris.button.loading');
    }

    return undefined;
  });

  protected readonly resolvedAriaLabel = computed<string | undefined>(() => {
    const label = this.ariaLabel();
    if (label) {
      return label;
    }

    const key = this.ariaLabelKey();
    if (key && this.translate) {
      return this.translate.translate(key);
    }

    return undefined;
  });

  protected readonly isButton =
    this.elementRef.nativeElement.tagName === 'BUTTON';
  protected readonly isAnchor = this.elementRef.nativeElement.tagName === 'A';

  protected setupButtonHost(): void {
    const el = this.elementRef.nativeElement;
    const initialType = el.getAttribute('type');
    if (this.isButton && initialType === null) {
      el.setAttribute('type', 'button');
    }

    // Post-hydration transition gate (Phase 6 flash fix). `data-hydrated`
    // is stamped browser-only AFTER the first render, so the initial paint
    // (CSR pre-boot, SSR HTML, or density late-resolution) applies variant
    // styles with `transition: none` and never animates from the neutral
    // base. `afterNextRender` never runs on the server, so SSR HTML matches
    // the first client render and hydration never diverges on this marker.
    // SECURITY_EXCEPTION: write-only setAttribute on the own host element for the post-hydration marker; direct DOM is required because host bindings would render on the server and diverge during hydration.
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        this.elementRef.nativeElement.setAttribute('data-hydrated', '');
      });
    }

    effect(() => {
      if (this.loading()) {
        this.attachSpinner();
      } else {
        this.detachSpinner();
      }
    });

    effect(() => {
      this.syncLoadingAriaLabel();
    });

    this.setupWidthMotion();

    this.destroyRef.onDestroy(() => {
      this.detachSpinner();
      this.teardownWidthMotion();
    });
  }

  private widthObserver: ResizeObserver | null = null;
  private contentObserver: MutationObserver | null = null;
  private widthAnimation: Animation | null = null;
  private lastWidth = -1;
  private pendingContentChange = false;

  /**
   * Fluid width for content-driven growth (loader insert, badge slot, label
   * swap). CSS `transition: width` never fires here because the computed
   * `width` stays `auto` — only the used width changes — so the host tracks
   * its own box and interpolates content-driven deltas with WAAPI.
   * Container-driven changes (window resize, font load, density switch) only
   * re-sync the baseline: no MutationObserver flag, no animation.
   * SECURITY_EXCEPTION: observers and WAAPI target the own host element only;
   * same direct-DOM category as the spinner insert/remove below.
   */
  private setupWidthMotion(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (
      typeof ResizeObserver === 'undefined' ||
      typeof MutationObserver === 'undefined'
    ) {
      return;
    }
    const el = this.elementRef.nativeElement;
    this.lastWidth = el.getBoundingClientRect().width;

    this.contentObserver = new MutationObserver(() => {
      this.pendingContentChange = true;
    });
    this.contentObserver.observe(el, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    this.widthObserver = new ResizeObserver(() => {
      const width = el.getBoundingClientRect().width;
      const previous = this.lastWidth;
      this.lastWidth = width;
      if (!this.pendingContentChange) {
        return;
      }
      this.pendingContentChange = false;
      if (previous < 0 || Math.abs(width - previous) < 0.5) {
        return;
      }
      this.animateWidth(el, previous, width);
    });
    this.widthObserver.observe(el);
  }

  private animateWidth(el: HTMLElement, from: number, to: number): void {
    if (el.hasAttribute('data-full-width')) {
      return;
    }
    if (this.prefersReducedMotion(el)) {
      return;
    }
    if (typeof el.animate !== 'function') {
      return;
    }
    this.widthAnimation?.cancel();
    const duration = this.readMotionToken(
      el,
      '--solaris-motion-duration-normal',
      300,
    );
    const easing =
      this.readMotionTokenRaw(el, '--solaris-motion-easing-standard') ||
      'cubic-bezier(0.4, 0, 0.2, 1)';
    const animation = el.animate(
      [{ width: `${from}px` }, { width: `${to}px` }],
      { duration, easing },
    );
    this.widthAnimation = animation;
    const done = () => {
      if (this.widthAnimation === animation) {
        this.widthAnimation = null;
      }
      this.lastWidth = el.getBoundingClientRect().width;
    };
    animation.onfinish = done;
    animation.oncancel = done;
  }

  private prefersReducedMotion(el: HTMLElement): boolean {
    if (el.closest('[data-reduced-motion="true"]')) {
      return true;
    }
    if (typeof matchMedia !== 'undefined') {
      return matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }

  private readMotionToken(
    el: HTMLElement,
    token: string,
    fallback: number,
  ): number {
    const raw = this.readMotionTokenRaw(el, token);
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private readMotionTokenRaw(el: HTMLElement, token: string): string {
    if (typeof getComputedStyle === 'undefined') {
      return '';
    }
    return getComputedStyle(el).getPropertyValue(token).trim();
  }

  private teardownWidthMotion(): void {
    this.widthObserver?.disconnect();
    this.widthObserver = null;
    this.contentObserver?.disconnect();
    this.contentObserver = null;
    this.widthAnimation?.cancel();
    this.widthAnimation = null;
  }

  ngOnInit(): void {
    this.stampInitialDataAttributes();
  }

  private stampInitialDataAttributes(): void {
    const el = this.elementRef.nativeElement;
    if (!el.hasAttribute('data-appearance')) {
      el.setAttribute('data-appearance', this.resolvedAppearance());
    }
    if (!el.hasAttribute('data-color')) {
      el.setAttribute('data-color', this.resolvedColor());
    }
    if (!el.hasAttribute('data-radius')) {
      el.setAttribute('data-radius', this.resolvedRadius());
    }
    if (!el.hasAttribute('data-shape')) {
      el.setAttribute('data-shape', this.resolvedShape());
    }
    if (!el.hasAttribute('data-size')) {
      el.setAttribute('data-size', this.effectiveSize());
    }
    if (!el.hasAttribute('data-density')) {
      const density = this.effectiveDensity();
      if (density !== undefined && density !== null) {
        el.setAttribute('data-density', density);
      }
    }
    const group = this.groupPlacement();
    if (group !== null && !el.hasAttribute('data-group')) {
      el.setAttribute('data-group', group);
    }
  }

  private managedLoadingLabel = false;
  private previousAriaLabel: string | null = null;

  protected syncLoadingAriaLabel(): void {
    const el = this.elementRef.nativeElement;
    if (this.loading()) {
      const label = this.resolvedLoadingLabel() ?? this.resolvedAriaLabel();
      if (label) {
        if (!this.managedLoadingLabel) {
          this.previousAriaLabel = el.getAttribute('aria-label');
          this.managedLoadingLabel = true;
        }
        el.setAttribute('aria-label', label);
      }
      return;
    }
    if (this.managedLoadingLabel) {
      this.managedLoadingLabel = false;
      if (this.previousAriaLabel != null) {
        el.setAttribute('aria-label', this.previousAriaLabel);
      } else {
        el.removeAttribute('aria-label');
      }
      this.previousAriaLabel = null;
    }
    const idleLabel = this.resolvedAriaLabel();
    if (idleLabel) {
      el.setAttribute('aria-label', idleLabel);
    }
  }

  protected attachSpinner(): void {
    if (this.spinnerRef || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const spinnerRef = createComponent(SolarisSpinnerComponent, {
      environmentInjector: this.environmentInjector,
    });
    spinnerRef.setInput('size', 'sm');
    spinnerRef.setInput('color', 'custom');
    spinnerRef.setInput('label', '');
    spinnerRef.setInput('ariaHidden', true);
    spinnerRef.changeDetectorRef.detectChanges();

    const spinnerEl = spinnerRef.location.nativeElement as HTMLElement;
    this.elementRef.nativeElement.insertBefore(
      spinnerEl,
      this.elementRef.nativeElement.firstChild,
    );
    this.spinnerRef = spinnerRef;
  }

  protected detachSpinner(): void {
    if (!this.spinnerRef) {
      return;
    }
    const spinnerEl = this.spinnerRef.location.nativeElement as HTMLElement;
    spinnerEl.remove();
    this.spinnerRef.destroy();
    this.spinnerRef = null;
  }

  protected handleAnchorClick(event: MouseEvent): void {
    if (this.isEffectivelyDisabled() && this.isAnchor) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
