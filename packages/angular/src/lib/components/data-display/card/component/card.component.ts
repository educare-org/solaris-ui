import {
  Component,
  input,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisThemeService } from '../../../../services/theme';

import type {
  SolarisCardAppearance,
  SolarisCardMediaPosition,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-media-position]': 'mediaPosition()',
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
  readonly mediaPosition = input<SolarisCardMediaPosition>('top');

  protected readonly themeService = inject(SolarisThemeService);

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });
}
