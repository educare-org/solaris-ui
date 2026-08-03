// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.tagName is the standard Angular API to differentiate <button> vs <a> for correct disabled/type behavior.
// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.getAttribute/setAttribute is the standard Angular approach to handle default button type.
// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement.setAttribute required for default <button> type behavior.
import {
  Directive,
  HostListener,
  ElementRef,
  inject,
  input,
  computed,
} from '@angular/core';

import type {
  SolarisIconButtonAppearance,
  SolarisIconButtonColor,
  SolarisIconButtonSize,
  SolarisIconButtonRadius,
  SolarisIconButtonDensity,
} from '../model/icon-button.types';

@Directive({
  selector: '[solaris-icon-button]',
  standalone: true,
  host: {
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-color]': 'color()',
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-density]': 'density()',
    '[attr.data-loading]': 'loading() ? "" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.aria-disabled]': 'isEffectivelyDisabled() ? "true" : null',
    '[attr.disabled]': 'isButton && isEffectivelyDisabled() ? "" : null',
    '[tabindex]': 'isAnchor && isEffectivelyDisabled() ? "-1" : null',
  },
})
export class SolarisIconButtonDirective {
  readonly appearance = input<SolarisIconButtonAppearance>('solid');
  readonly color = input<SolarisIconButtonColor>('neutral');
  readonly radius = input<SolarisIconButtonRadius>('md');
  readonly size = input<SolarisIconButtonSize>('md');
  readonly density = input<SolarisIconButtonDensity>();
  readonly ariaLabelKey = input<string | undefined>();
  readonly ariaLabel = input<string | undefined>();
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);

  protected readonly isEffectivelyDisabled = computed(
    () => this.disabled() || this.loading(),
  );

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

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
