import {
  Component,
  input,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisThemeService } from '../../../../services/theme';

import type {
  SolarisBadgeAppearance,
  SolarisBadgeColor,
  SolarisBadgeSize,
  SolarisBadgeRadius,
  SolarisBadgeVariant,
  SolarisBadgeDensity,
} from '../model/badge.types';

@Component({
  selector: 'solaris-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-color]': 'color()',
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-density]': 'effectiveDensity()',
  },
})
export class SolarisBadgeComponent {
  readonly appearance = input<SolarisBadgeAppearance>('tonal');
  readonly variant = input<SolarisBadgeVariant>('standard');
  readonly color = input<SolarisBadgeColor>('neutral');
  readonly radius = input<SolarisBadgeRadius>('full');
  readonly density = input<SolarisBadgeDensity>();
  readonly size = input<SolarisBadgeSize>('md');

  protected readonly themeService = inject(SolarisThemeService);

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });
}
