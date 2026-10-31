import { Directive, computed, input, HostListener } from '@angular/core';

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
    '[attr.data-color]': 'resolvedColor()',
    '[attr.data-shape]': 'resolvedShape()',
    '[attr.data-radius]': 'resolvedRadius()',
    '[attr.data-size]': 'effectiveSize()',
    '[attr.data-appearance]': 'resolvedAppearance()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-group]': 'groupPlacement()',
    '[attr.data-loading]': 'effectiveLoading() || undefined',
    '[attr.aria-pressed]': 'computedAriaPressed()',
    '[attr.data-pressed]': 'pressed() || undefined',
    '[attr.aria-busy]': 'effectiveLoading() ? "true" : null',
    '[attr.data-chromeless]': 'chromeless() || undefined',
    '[tabindex]': 'isAnchor && isEffectivelyDisabled() ? "-1" : null',
    '[attr.aria-disabled]': 'isEffectivelyDisabled() ? "true" : null',
    '[attr.disabled]': 'isButton && isEffectivelyDisabled() ? "" : null',
  },
})
export class SolarisIconButtonDirective extends SolarisButtonHostBase {
  readonly density = input<SolarisIconButtonDensity | undefined>(undefined);
  readonly appearance = input<SolarisIconButtonAppearance>('solid');
  readonly pressed = input<boolean | undefined>(undefined);
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

  protected readonly computedAriaPressed = computed<string | null>(() => {
    const pressed = this.pressed();
    if (pressed == null) {
      return null;
    }
    return pressed ? 'true' : 'false';
  });

  constructor() {
    super();
    this.setupButtonHost();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.handleActionClick(event);
  }
}
