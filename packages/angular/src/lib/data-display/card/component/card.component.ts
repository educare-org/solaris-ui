import { Component, input } from '@angular/core';

import type {
  SolarisCardAppearance,
  SolarisCardRadius,
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
    '[attr.data-radius]': 'radius()',
    '[attr.data-density]': 'density()',
    '[attr.data-glass-texture]':
      'appearance() === "glass" && glassTexture() !== "none" ? glassTexture() : null',
  },
})
export class SolarisCardComponent {
  readonly appearance = input<SolarisCardAppearance>('surface');
  readonly radius = input<SolarisCardRadius>('lg');
  readonly density = input<SolarisCardDensity>();
  readonly glassTexture = input<SolarisCardGlassTexture>('none');
}
