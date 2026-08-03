import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[attr.data-variant]': 'variant()',
    '[attr.data-animation]': 'animation()',
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'effectiveRadius()',
    '[attr.data-density]': 'density()',
    '[attr.data-multiline]': 'isMultiLine() ? "" : null',
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
  readonly lines = input<number>(1);

  readonly effectiveRadius = computed<SolarisSkeletonRadius>(() => {
    const r = this.radius();
    if (r !== 'text') {
      return r;
    }
    const v = this.variant();
    if (v === 'rectangular') {
      return 'sm';
    }
    if (v === 'circular') {
      return 'full';
    }
    return 'sm';
  });

  readonly isMultiLine = computed(
    () => this.lines() > 1 && this.variant() === 'text',
  );

  readonly lineWidths = computed<string[]>(() => {
    const count = this.lines();
    if (count <= 1) {
      return [];
    }
    const customWidth = this.width();
    const widths = [
      '100%',
      '92%',
      '85%',
      '78%',
      '70%',
      '95%',
      '88%',
      '82%',
      '75%',
      '68%',
    ];
    return Array.from({ length: count }, (_, i) => {
      if (i === 0 && customWidth) {
        return customWidth;
      }
      return widths[i % widths.length];
    });
  });
}
