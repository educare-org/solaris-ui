// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.tagName is the standard Angular API to differentiate <button> vs <a> for correct disabled/type behavior.
// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.getAttribute/setAttribute is the standard Angular approach to handle default button type.
// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.setAttribute required for default <button> type behavior.
import {
  Directive,
  input,
  computed,
  HostListener,
  inject,
  ElementRef,
} from '@angular/core';

import type {
  SolarisButtonAppearance,
  SolarisButtonColor,
  SolarisButtonSize,
  SolarisButtonRadius,
  SolarisButtonDensity,
} from '../model/button.types';

import { SolarisTranslateService } from '../../../../services/translation';

@Directive({
  selector: '[solaris-button]',
  standalone: true,
  host: {
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-color]': 'color()',
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-density]': 'density()',
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
  readonly size = input<SolarisButtonSize>('md');
  readonly density = input<SolarisButtonDensity>();
  readonly loading = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly loadingLabelKey = input<string>();
  readonly loadingLabel = input<string>();

  protected readonly isEffectivelyDisabled = computed(
    () => this.disabled() || this.loading(),
  );

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translate = inject(SolarisTranslateService, {
    optional: true,
  });

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
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.isEffectivelyDisabled() && this.isAnchor) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
