import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import type { SolarisAnimatedIconName } from '../model/icon.types';

@Component({
  selector: 'solaris-animated-icon',
  standalone: true,
  templateUrl: './solaris-animated-icon.component.html',
  styleUrls: ['./solaris-animated-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-active]': 'active() ? "" : null',
  },
})
export class SolarisAnimatedIconComponent {
  readonly name = input.required<SolarisAnimatedIconName>();
  readonly active = input(false);
  readonly ariaLabel = input<string>();
  readonly decorative = input(false);

  protected readonly isHidden = computed(() => this.decorative());
  protected readonly accessibleLabel = computed(() => this.ariaLabel() ?? '');
  protected readonly hasSemanticLabel = computed(
    () => !this.decorative() && !!this.ariaLabel(),
  );
}
