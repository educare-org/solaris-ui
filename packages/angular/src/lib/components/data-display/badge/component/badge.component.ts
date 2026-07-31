import { Component, input, ChangeDetectionStrategy } from '@angular/core';

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
    '[attr.data-density]': 'density()',
  },
})
export class SolarisBadgeComponent {
  readonly appearance = input<SolarisBadgeAppearance>('tonal');
  readonly variant = input<SolarisBadgeVariant>('standard');
  readonly color = input<SolarisBadgeColor>('neutral');
  readonly radius = input<SolarisBadgeRadius>('full');
  readonly density = input<SolarisBadgeDensity>();
  readonly size = input<SolarisBadgeSize>('md');
}
