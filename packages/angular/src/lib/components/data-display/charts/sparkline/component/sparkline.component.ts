import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

import {
  SOLARIS_SPARKLINE_HEIGHT,
  SOLARIS_SPARKLINE_WIDTH,
  buildSparklineGeometry,
} from '../../model/chart-line.utils';
import type { SolarisChartInterpolation } from '../../model/chart.types';
import type {
  SolarisSparklineDensity,
  SolarisSparklineSize,
} from '../model/sparkline.types';

@Component({
  selector: 'solaris-sparkline',
  standalone: true,
  templateUrl: './sparkline.component.html',
  styleUrls: ['./sparkline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-sparkline',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-trend]': 'geometry().trend',
  },
})
export class SolarisSparklineComponent {
  readonly points = input.required<readonly (number | null | undefined)[]>();
  readonly interpolation = input<SolarisChartInterpolation>('smooth');
  readonly positiveIsGood = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly ariaLabel = input.required<string>();
  readonly size = input<SolarisSparklineSize>('md');
  readonly density = input<SolarisSparklineDensity | undefined>(undefined);

  protected readonly viewWidth = SOLARIS_SPARKLINE_WIDTH;
  protected readonly viewHeight = SOLARIS_SPARKLINE_HEIGHT;

  protected readonly effectiveDensity = computed(
    () => this.density() ?? 'normal',
  );

  protected readonly geometry = computed(() =>
    buildSparklineGeometry(this.points(), {
      interpolation: this.interpolation(),
    }),
  );

  protected readonly strokeColor = computed(() => {
    const trend = this.geometry().trend;
    if (trend === 'flat') return 'var(--solaris-neutral-text-secondary)';
    const risingIsGood = this.positiveIsGood();
    const good =
      (trend === 'up' && risingIsGood) || (trend === 'down' && !risingIsGood);
    return good
      ? 'var(--solaris-success-solid)'
      : 'var(--solaris-danger-solid)';
  });
}
