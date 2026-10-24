import {
  Component,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { SolarisThemeService } from '../../../../services/theme';

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
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-multiline]': 'isMultiLine() || undefined',
    '[attr.data-pending]': 'isPending() || undefined',
    '[style.width]': 'width() || null',
    '[style.height]': 'height() || null',
    '[style.aspect-ratio]': 'aspectRatio() || null',
    '[style.--solaris-skeleton-animation-duration]': 'duration() || null',
  },
})
export class SolarisSkeletonComponent {
  readonly variant = input<SolarisSkeletonVariant>('text');
  readonly animation = input<SolarisSkeletonAnimation>('pulse');
  readonly size = input<SolarisSkeletonSize>('md');
  readonly radius = input<SolarisSkeletonRadius>('text');
  readonly density = input<SolarisSkeletonDensity | undefined>(undefined);
  readonly width = input<string>();
  readonly height = input<string>();
  readonly aspectRatio = input<string>();
  readonly lines = input<number>(1);
  readonly lastLineWidth = input<string>('68%');
  readonly delay = input<number>(0);
  readonly duration = input<string>();

  protected readonly themeService = inject(SolarisThemeService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

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

  protected readonly visible = signal(true);

  readonly isPending = computed(() => !this.visible());

  readonly lineWidths = computed<string[]>(() => {
    const count = Math.max(0, Math.floor(this.lines()));
    if (count <= 1) {
      return [];
    }
    const customWidth = this.width();
    const lastWidth = this.lastLineWidth();
    const middleWidths = [
      '92%',
      '85%',
      '78%',
      '70%',
      '95%',
      '88%',
      '82%',
      '75%',
      '70%',
    ];
    return Array.from({ length: count }, (_, i) => {
      if (i === 0) {
        return customWidth ?? '100%';
      }
      if (i === count - 1) {
        return lastWidth;
      }
      return middleWidths[(i - 1) % middleWidths.length];
    });
  });

  constructor() {
    effect((onCleanup) => {
      const ms = Math.max(0, this.delay() ?? 0);
      if (ms <= 0 || !isPlatformBrowser(this.platformId)) {
        this.visible.set(true);
        return;
      }
      this.visible.set(false);
      const timer = setTimeout(() => this.visible.set(true), ms);
      onCleanup(() => clearTimeout(timer));
    });
  }
}
