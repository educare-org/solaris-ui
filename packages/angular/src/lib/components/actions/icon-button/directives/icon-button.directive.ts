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
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-color]': 'color()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-shape]': 'shape()',
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
  readonly density = input<SolarisIconButtonDensity>();
  readonly shape = input<SolarisIconButtonShape>('normal');
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
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.isEffectivelyDisabled() && this.isAnchor) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
