// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.tagName is the standard Angular API to differentiate <button> vs <a> for correct disabled/type behavior.
// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.getAttribute/setAttribute is the standard Angular approach to handle default button type.
// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.setAttribute required for default <button> type behavior.
// SECURITY_EXCEPTION_FILE: createComponent/insertBefore required to render the spinner component inside a native button host (directive has no template).
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
} from '../model/button.types';

import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisSpinnerComponent } from '../../../feedback/spinner';

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
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.aria-label]': 'loading() ? resolvedLoadingLabel() : null',
    '[attr.aria-disabled]': 'isEffectivelyDisabled() ? "true" : null',
    '[attr.disabled]': 'isButton && isEffectivelyDisabled() ? "" : null',
    '[tabindex]': 'isAnchor && isEffectivelyDisabled() ? "-1" : null',
  },
})
export class SolarisButtonDirective {
  readonly appearance = input<SolarisButtonAppearance>('solid');
  readonly color = input<SolarisButtonColor>('neutral');
  readonly radius = input<SolarisButtonRadius>('md');
  readonly density = input<SolarisButtonDensity>();
  readonly shape = input<SolarisButtonShape>('normal');
  readonly loading = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly loadingLabelKey = input<string>();
  readonly loadingLabel = input<string>();

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
    const initialType = this.elementRef.nativeElement.getAttribute('type');
    if (this.isButton && initialType === null) {
      this.elementRef.nativeElement.setAttribute('type', 'button');
    }

    effect(() => {
      if (this.loading()) {
        this.attachSpinner();
      } else {
        this.detachSpinner();
      }
    });

    this.destroyRef.onDestroy(() => this.detachSpinner());
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

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.isEffectivelyDisabled() && this.isAnchor) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
