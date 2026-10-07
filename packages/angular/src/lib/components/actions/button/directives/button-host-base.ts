// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.tagName is the standard Angular API to differentiate <button> vs <a> for correct disabled/type behavior.
// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.getAttribute/setAttribute/removeAttribute is the standard Angular approach to handle default button type and the loading aria-label (imperatively managed so consumer labels are preserved and restored).
// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.insertBefore required to render the spinner component inside a native button host (directive has no template).
// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.setAttribute required for default <button> type behavior.
// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.setAttribute required to pre-stamp data-* variant attributes in ngOnInit (before host bindings apply on first change detection), so the correct variant styles exist before first paint and no solid-to-ghost background transition flashes. Host bindings remain the source of truth afterwards.
// SECURITY_EXCEPTION_FILE: createComponent required to render the spinner component inside a native button host (directive has no template).
import {
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
    if (!group || !group.attached()) {
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

    this.destroyRef.onDestroy(() => {
      this.detachSpinner();
    });
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
