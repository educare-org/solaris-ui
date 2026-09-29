import { Directive, input, HostListener } from '@angular/core';

import type {
  SolarisIconButtonSize,
  SolarisIconButtonAppearance,
  SolarisIconButtonColor,
  SolarisIconButtonRadius,
  SolarisIconButtonDensity,
  SolarisIconButtonShape,
} from '../model/icon-button.types';

import { SolarisButtonHostBase } from '../../button/directives/button-host-base';

@Directive({
  selector: '[solaris-icon-button]',
  standalone: true,
  host: {
    '[attr.data-color]': 'color()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-size]': 'effectiveSize()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-loading]': 'loading() || undefined',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.data-chromeless]': 'chromeless() || undefined',
    '[tabindex]': 'isAnchor && isEffectivelyDisabled() ? "-1" : null',
    '[attr.aria-disabled]': 'isEffectivelyDisabled() ? "true" : null',
    '[attr.disabled]': 'isButton && isEffectivelyDisabled() ? "" : null',
  },
})
export class SolarisIconButtonDirective extends SolarisButtonHostBase {
  readonly density = input<SolarisIconButtonDensity | undefined>(undefined);
  readonly appearance = input<SolarisIconButtonAppearance>('solid');
  readonly color = input<SolarisIconButtonColor>('neutral');
  readonly shape = input<SolarisIconButtonShape>('normal');
  readonly radius = input<SolarisIconButtonRadius>('md');
  readonly size = input<SolarisIconButtonSize>('md');
  readonly ariaLabelKey = input<string | undefined>();
  readonly ariaLabel = input<string | undefined>();
  readonly chromeless = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly loadingLabelKey = input<string>();
  readonly loadingLabel = input<string>();

  constructor() {
    super();
    this.setupButtonHost();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.handleAnchorClick(event);
  }
}
