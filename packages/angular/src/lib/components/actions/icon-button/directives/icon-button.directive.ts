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

import { SolarisThemeService } from '../../../../services/theme';

import type {
  SolarisIconButtonAppearance,
  SolarisIconButtonColor,
  SolarisIconButtonRadius,
  SolarisIconButtonDensity,
  SolarisIconButtonShape,
} from '../model/icon-button.types';

@Directive({
  selector: '[solaris-icon-button]',
  standalone: true,
  host: {
    '[attr.data-color]': 'color()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-loading]': 'loading() ? "" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[tabindex]': 'isAnchor && isEffectivelyDisabled() ? "-1" : null',
    '[attr.aria-disabled]': 'isEffectivelyDisabled() ? "true" : null',
    '[attr.disabled]': 'isButton && isEffectivelyDisabled() ? "" : null',
  },
})
export class SolarisIconButtonDirective {
  readonly appearance = input<SolarisIconButtonAppearance>('solid');
  readonly density = input<SolarisIconButtonDensity>('compact');
  readonly color = input<SolarisIconButtonColor>('neutral');
  readonly shape = input<SolarisIconButtonShape>('normal');
  readonly radius = input<SolarisIconButtonRadius>('md');
  readonly ariaLabelKey = input<string | undefined>();
  readonly ariaLabel = input<string | undefined>();
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);

  protected readonly themeService = inject(SolarisThemeService);

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly isEffectivelyDisabled = computed(
    () => this.disabled() || this.loading(),
  );

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly isButton =
    this.elementRef.nativeElement.tagName === 'BUTTON';
  protected readonly isAnchor = this.elementRef.nativeElement.tagName === 'A';

  constructor() {
    const el = this.elementRef.nativeElement;
    const initialType = el.getAttribute('type');
    if (this.isButton && initialType === null) {
      el.setAttribute('type', 'button');
    }

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
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.isEffectivelyDisabled() && this.isAnchor) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
