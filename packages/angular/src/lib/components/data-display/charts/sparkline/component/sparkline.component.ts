import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

import { SolarisBadgeComponent } from '../../../badge';
import {
  SolarisCardComponent,
  SolarisCardContentDirective,
  SolarisCardHeaderDirective,
} from '../../../card';
import {
  SOLARIS_SPARKLINE_HEIGHT,
  SOLARIS_SPARKLINE_WIDTH,
  buildSparklineGeometry,
} from '../../model/chart-line.utils';
import type { SolarisChartInterpolation } from '../../model/chart.types';
import type {
  SolarisSparklineAppearance,
  SolarisSparklineDeltaDirection,
  SolarisSparklineDensity,
  SolarisSparklineSize,
} from '../model/sparkline.types';

@Component({
  selector: 'solaris-sparkline',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    SolarisBadgeComponent,
    SolarisCardComponent,
    SolarisCardContentDirective,
    SolarisCardHeaderDirective,
  ],
  templateUrl: './sparkline.component.html',
  styleUrls: ['./sparkline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-sparkline',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-appearance]': 'appearance()',
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
  readonly appearance = input<SolarisSparklineAppearance>('plain');
  readonly title = input<string | undefined>(undefined);
  readonly value = input<string | undefined>(undefined);
  readonly delta = input<string | undefined>(undefined);
  readonly deltaDirection = input<SolarisSparklineDeltaDirection | undefined>(
    undefined,
  );

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

  protected readonly effectiveDeltaDirection =
    computed<SolarisSparklineDeltaDirection>(
      () => this.deltaDirection() ?? this.geometry().trend,
    );

  protected readonly deltaBadgeColor = computed(() => {
    const direction = this.effectiveDeltaDirection();
    if (direction === 'flat') return 'neutral';
    const risingIsGood = this.positiveIsGood();
    const good =
      (direction === 'up' && risingIsGood) ||
      (direction === 'down' && !risingIsGood);
    return good ? 'success' : 'danger';
  });
}
