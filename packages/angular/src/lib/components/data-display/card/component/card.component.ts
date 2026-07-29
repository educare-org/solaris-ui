import { Component, input } from '@angular/core';

import type {
  SolarisCardAppearance,
  SolarisCardRadius,
  SolarisCardSize,
  SolarisCardDensity,
  SolarisCardGlassTexture,
} from '../model/card.types';

@Component({
  selector: 'solaris-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  host: {
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-density]': 'density()',
    '[attr.data-glass-texture]':
      'appearance() === "glass" && glassTexture() !== "none" ? glassTexture() : null',
  },
})
export class SolarisCardComponent {
  readonly appearance = input<SolarisCardAppearance>('surface');
  readonly radius = input<SolarisCardRadius>('lg');
  readonly size = input<SolarisCardSize>('md');
  readonly density = input<SolarisCardDensity>();
  readonly glassTexture = input<SolarisCardGlassTexture>('none');
}
