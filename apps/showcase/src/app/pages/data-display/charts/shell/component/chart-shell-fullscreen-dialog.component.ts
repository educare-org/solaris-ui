import { Component, computed, inject } from '@angular/core';

import {
  SOLARIS_DIALOG_DATA,
  SolarisChartShellComponent,
  SolarisLineChartComponent,
  SolarisTranslatePipe,
  type SolarisChartSeries,
  type SolarisChartShellTrend,
} from '@solaris-ui/angular';

export interface ChartShellFullscreenData {
  readonly title: string;
  readonly description: string;
  readonly intervalLabel: string;
  readonly heroValue: string;
  readonly heroLabel: string;
  readonly heroDelta: string;
  readonly heroDeltaDirection: SolarisChartShellTrend;
  readonly series: readonly SolarisChartSeries[];
  readonly locale: string;
}

@Component({
  standalone: true,
  selector: 'app-chart-shell-fullscreen-dialog',
  imports: [
    SolarisChartShellComponent,
    SolarisLineChartComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './chart-shell-fullscreen-dialog.component.html',
  styleUrls: ['./chart-shell-fullscreen-dialog.component.scss'],
})
export class ChartShellFullscreenDialogComponent {
  protected readonly data = inject(
    SOLARIS_DIALOG_DATA,
  ) as ChartShellFullscreenData;

  protected readonly totals = computed(() =>
    this.data.series.map((entry) => ({
      id: entry.id,
      label: entry.label,
      total: entry.points.reduce(
        (sum, point) =>
          typeof point.y === 'number' && Number.isFinite(point.y)
            ? sum + point.y
            : sum,
        0,
      ),
    })),
  );
}
