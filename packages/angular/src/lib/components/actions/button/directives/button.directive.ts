// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.tagName is the standard Angular API to differentiate <button> vs <a> for correct disabled/type behavior.
// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.getAttribute/setAttribute is the standard Angular approach to handle default button type.
// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.setAttribute required for default <button> type behavior.
// SECURITY_EXCEPTION_FILE: createComponent/insertBefore/appendChild required to render the spinner and icon components inside a native button host (directive has no template).
import {
  Directive,
  input,
  computed,
  effect,
  inject,
  HostListener,
  ElementRef,
  EnvironmentInjector,
  PLATFORM_ID,
  createComponent,
  DestroyRef,
  type ComponentRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import type {
  SolarisButtonAppearance,
  SolarisButtonColor,
  SolarisButtonRadius,
  SolarisButtonDensity,
  SolarisButtonShape,
  SolarisButtonIconPosition,
} from '../model/button.types';

import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisSpinnerComponent } from '../../../feedback/spinner';
import { SolarisIconComponent } from '../../../icon';

@Directive({
  selector: '[solaris-button]',
  standalone: true,
  host: {
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-color]': 'color()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-loading]': 'loading() ? "" : null',
    '[attr.data-full-width]': 'fullWidth() ? "" : null',
    '[attr.data-icon-position]': 'computedIconPosition()',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.aria-label]': 'loading() ? resolvedLoadingLabel() : null',
    '[attr.aria-disabled]': 'isEffectivelyDisabled() ? "true" : null',
    '[attr.disabled]': 'isButton && isEffectivelyDisabled() ? "" : null',
    '[tabindex]': 'isAnchor && isEffectivelyDisabled() ? "-1" : null',
  },
})
export class SolarisButtonDirective {
  readonly iconPosition = input<SolarisButtonIconPosition>('start');
  readonly appearance = input<SolarisButtonAppearance>('solid');
  readonly color = input<SolarisButtonColor>('neutral');
  readonly shape = input<SolarisButtonShape>('normal');
  readonly radius = input<SolarisButtonRadius>('md');
  readonly density = input<SolarisButtonDensity>();
  readonly fullWidth = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly loadingLabelKey = input<string>();
  readonly loadingLabel = input<string>();
  readonly icon = input<string>();

  protected readonly computedIconPosition = computed<string | null>(() => {
    return this.icon() ? this.iconPosition() : null;
  });

  protected readonly isEffectivelyDisabled = computed(
    () => this.disabled() || this.loading(),
  );

  protected readonly themeService = inject(SolarisThemeService);

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translate = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  private spinnerRef: ComponentRef<SolarisSpinnerComponent> | null = null;
  private iconRef: ComponentRef<SolarisIconComponent> | null = null;

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

  protected readonly isButton =
    this.elementRef.nativeElement.tagName === 'BUTTON';
  protected readonly isAnchor = this.elementRef.nativeElement.tagName === 'A';

  constructor() {
    const el = this.elementRef.nativeElement;
    const initialType = el.getAttribute('type');
    if (this.isButton && initialType === null) {
      el.setAttribute('type', 'button');
    }

    // Preserve SSR attributes during hydration. Angular applies input bindings
    // after directive construction, so writing defaults here would flash them.
    if (!el.hasAttribute('data-appearance')) {
      el.setAttribute('data-appearance', this.appearance());
    }
    if (!el.hasAttribute('data-color')) {
      el.setAttribute('data-color', this.color());
    }
    if (!el.hasAttribute('data-radius')) {
      el.setAttribute('data-radius', this.radius());
    }
    if (!el.hasAttribute('data-shape')) {
      el.setAttribute('data-shape', this.shape());
    }

    effect(() => {
      if (this.loading()) {
        this.attachSpinner();
      } else {
        this.detachSpinner();
      }
    });

    effect(() => {
      this.syncIcon();
    });

    this.destroyRef.onDestroy(() => {
      this.detachSpinner();
      this.detachIcon();
    });
  }

  private attachSpinner(): void {
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

  private detachSpinner(): void {
    if (!this.spinnerRef) {
      return;
    }
    this.spinnerRef.destroy();
    this.spinnerRef = null;
  }

  private syncIcon(): void {
    const name = this.icon();
    if (!name || !isPlatformBrowser(this.platformId)) {
      this.detachIcon();
      return;
    }

    if (this.iconRef) {
      const el = this.iconRef.location.nativeElement as HTMLElement;
      this.placeIcon(el);
      return;
    }

    const iconRef = createComponent(SolarisIconComponent, {
      environmentInjector: this.environmentInjector,
    });
    iconRef.setInput('name', name);
    iconRef.setInput('decorative', true);
    iconRef.changeDetectorRef.detectChanges();

    const iconEl = iconRef.location.nativeElement as HTMLElement;
    iconEl.classList.add('solaris-button-icon');
    this.iconRef = iconRef;
    this.placeIcon(iconEl);
  }

  private placeIcon(iconEl: HTMLElement): void {
    const host = this.elementRef.nativeElement;
    if (this.iconPosition() === 'end') {
      host.appendChild(iconEl);
    } else {
      host.insertBefore(iconEl, host.firstChild);
    }
  }

  private detachIcon(): void {
    if (!this.iconRef) {
      return;
    }
    this.iconRef.destroy();
    this.iconRef = null;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.isEffectivelyDisabled() && this.isAnchor) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
