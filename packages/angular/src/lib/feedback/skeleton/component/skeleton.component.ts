import { Component, input, computed } from '@angular/core';

import type {
  SolarisSkeletonVariant,
  SolarisSkeletonAnimation,
  SolarisSkeletonSize,
  SolarisSkeletonRadius,
  SolarisSkeletonDensity,
} from '../model/skeleton.types';

@Component({
  selector: 'solaris-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  host: {
    'aria-hidden': 'true',
    '[attr.data-variant]': 'variant()',
    '[attr.data-animation]': 'animation()',
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'effectiveRadius()',
    '[attr.data-density]': 'density()',
    '[style.width]': 'width() || null',
    '[style.height]': 'height() || null',
  },
})
export class SolarisSkeletonComponent {
  readonly variant = input<SolarisSkeletonVariant>('text');
  readonly animation = input<SolarisSkeletonAnimation>('pulse');
  readonly size = input<SolarisSkeletonSize>('md');
  readonly radius = input<SolarisSkeletonRadius>('text');
  readonly density = input<SolarisSkeletonDensity>();
  readonly width = input<string>();
  readonly height = input<string>();

  readonly effectiveRadius = computed<SolarisSkeletonRadius>(() => {
    const r = this.radius();
    if (r !== 'text') {
      return r;
    }
    const v = this.variant();
    if (v === 'rectangular') {
      return 'md';
    }
    if (v === 'circular') {
      return 'full';
    }
    return 'sm';
  });
}
