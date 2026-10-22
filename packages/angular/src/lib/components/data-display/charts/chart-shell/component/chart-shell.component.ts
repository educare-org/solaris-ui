import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';

import { SolarisThemeService } from '../../../../../services/theme';
import { SolarisTranslateService } from '../../../../../services/translation';
import { SolarisButtonDirective } from '../../../../actions/button';
import { SolarisIconButtonDirective } from '../../../../actions/icon-button';
import {
  SolarisCardComponent,
  SolarisCardContentDirective,
  SolarisCardDescriptionDirective,
  SolarisCardHeaderDirective,
  SolarisCardTitleDirective,
} from '../../../card';
import {
  SolarisBadgeComponent,
  SolarisBadgeIconDirective,
} from '../../../badge';
import { SolarisIconComponent } from '../../../../icon';
import {
  SolarisDropdownMenuComponent,
  SolarisDropdownMenuItemComponent,
  SolarisDropdownMenuTriggerDirective,
} from '../../../../interaction/dropdown-menu';
import {
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
} from '../../../../navigation/segmented-control';
import { SolarisOptionComponent } from '../../../../forms/option';
import { SolarisSelectComponent } from '../../../../forms/select';
import { SolarisSkeletonComponent } from '../../../../feedback/skeleton';
import {
  isChartSeriesEmpty,
  visibleChartSeries,
} from '../../model/chart-scale.utils';
import { resolveChartSeriesColor } from '../../model/chart-palette';
import { resolveChartFallback } from '../../model/strings/chart-strings';
import type {
  SolarisChartDisplayMode,
  SolarisChartPeriod,
  SolarisChartSeries,
  SolarisChartView,
} from '../../model/chart.types';

import {
  DEFAULT_SHELL_ACTIONS,
  DEFAULT_SHELL_DISPLAY_MODES,
  DEFAULT_SHELL_PERIODS,
  DEFAULT_SHELL_VIEWS,
  SHELL_ACTION_LABEL_KEYS,
  SHELL_DISPLAY_LABEL_KEYS,
  SHELL_PERIOD_LABEL_KEYS,
  SHELL_VIEW_LABEL_KEYS,
} from '../model/chart-shell.defaults';
import {
  isChartDisplayMode,
  isChartPeriod,
  isChartView,
} from '../model/chart-shell.utils';
import type {
  SolarisChartShellActionOption,
  SolarisChartShellDensity,
  SolarisChartShellDisplayModeOption,
  SolarisChartShellPeriodOption,
  SolarisChartShellSize,
  SolarisChartShellTrend,
  SolarisChartShellViewOption,
} from '../model/chart-shell.types';

@Component({
  selector: 'solaris-chart-shell',
  standalone: true,
  imports: [
    SolarisBadgeComponent,
    SolarisBadgeIconDirective,
    SolarisButtonDirective,
    SolarisCardComponent,
    SolarisCardHeaderDirective,
    SolarisCardTitleDirective,
    SolarisCardDescriptionDirective,
    SolarisCardContentDirective,
    SolarisSegmentedControlComponent,
    SolarisSegmentedItemComponent,
    SolarisSelectComponent,
    SolarisOptionComponent,
    SolarisSkeletonComponent,
    SolarisIconButtonDirective,
    SolarisIconComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
    SolarisDropdownMenuTriggerDirective,
  ],
  templateUrl: './chart-shell.component.html',
  styleUrls: ['./chart-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-chart-shell',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-view]': 'view()',
    '[attr.data-loading]': 'loading() || undefined',
    '[attr.data-empty]': 'isEmpty() || undefined',
    '[attr.data-display-mode]': 'displayMode()',
  },
})
export class SolarisChartShellComponent {
  readonly title = input<string | undefined>(undefined);
  readonly titleKey = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly descriptionKey = input<string | undefined>(undefined);
  readonly heroValue = input<string | undefined>(undefined);
  readonly heroLabel = input<string | undefined>(undefined);
  readonly heroLabelKey = input<string | undefined>(undefined);
  readonly heroDelta = input<string | undefined>(undefined);
  readonly heroDeltaDirection = input<SolarisChartShellTrend | undefined>(
    undefined,
  );
  readonly intervalLabel = input<string | undefined>(undefined);
  readonly intervalLabelKey = input<string | undefined>(undefined);

  readonly series = input.required<readonly SolarisChartSeries[]>();

  readonly view = model<SolarisChartView>('line');
  readonly period = model<SolarisChartPeriod>('7D');
  readonly displayMode = model<SolarisChartDisplayMode>('timeline');

  readonly availableViews =
    input<readonly SolarisChartShellViewOption[]>(DEFAULT_SHELL_VIEWS);
  readonly availablePeriods = input<readonly SolarisChartShellPeriodOption[]>(
    DEFAULT_SHELL_PERIODS,
  );
  readonly availableDisplayModes = input<
    readonly SolarisChartShellDisplayModeOption[]
  >(DEFAULT_SHELL_DISPLAY_MODES);
  readonly actions = input<readonly SolarisChartShellActionOption[]>(
    DEFAULT_SHELL_ACTIONS,
  );

  readonly showViewSwitcher = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly showPeriodFilter = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly showDisplaySwitcher = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly showLegend = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly showActions = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });

  readonly loading = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly error = input<string | undefined>(undefined);
  readonly errorKey = input<string | undefined>(undefined);

  readonly size = input<SolarisChartShellSize>('md');
  readonly density = input<SolarisChartShellDensity | undefined>(undefined);
  readonly locale = input.required<string>();
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly seriesToggle = output<string>();
  readonly actionRequest = output<string>();
  readonly retry = output<void>();
  readonly viewChange = output<SolarisChartView>();
  readonly periodChange = output<SolarisChartPeriod>();
  readonly displayModeChange = output<SolarisChartDisplayMode>();

  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  protected readonly themeService = inject(SolarisThemeService);

  protected readonly announcement = signal('');

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly resolvedTitle = computed(() => {
    if (this.title() !== undefined) return this.title();
    return this.translateKey(this.titleKey());
  });

  protected readonly resolvedDescription = computed(() => {
    if (this.description() !== undefined) return this.description();
    return this.translateKey(this.descriptionKey());
  });

  protected readonly resolvedHeroLabel = computed(() => {
    if (this.heroLabel() !== undefined) return this.heroLabel();
    return this.translateKey(this.heroLabelKey());
  });

  protected readonly resolvedInterval = computed(() => {
    if (this.intervalLabel() !== undefined) return this.intervalLabel();
    return this.translateKey(this.intervalLabelKey());
  });

  protected readonly resolvedError = computed(() => {
    if (this.error() !== undefined) return this.error();
    return this.translateKey(this.errorKey());
  });

  protected readonly hostAriaLabel = computed(() => {
    if (this.ariaLabel() !== undefined) return this.ariaLabel();
    return this.translateKey(this.ariaLabelKey());
  });

  protected readonly isEmpty = computed(() => {
    const entries = this.series();
    if (entries.length === 0 || isChartSeriesEmpty(entries)) return true;
    return visibleChartSeries(entries).length === 0;
  });

  protected readonly hasLegend = computed(() => {
    return this.showLegend() && this.series().length > 0;
  });

  protected readonly fullscreenAction = computed(() =>
    this.actions().find((action) => action.value === 'fullscreen'),
  );

  protected readonly menuActions = computed(() =>
    this.actions().filter((action) => action.value !== 'fullscreen'),
  );

  protected readonly hasDisplaySwitcher = computed(() => {
    return (
      this.showDisplaySwitcher() && this.availableDisplayModes().length > 1
    );
  });

  protected readonly trendBadgeColor = computed(() => {
    switch (this.heroDeltaDirection()) {
      case 'up':
        return 'success';
      case 'down':
        return 'danger';
      default:
        return 'neutral';
    }
  });

  protected readonly trendIcon = computed(() => {
    switch (this.heroDeltaDirection()) {
      case 'up':
        return 'caret-up';
      case 'down':
        return 'caret-down';
      default:
        return null;
    }
  });

  protected readonly trendAriaLabel = computed(() => {
    const delta = this.heroDelta();
    if (delta === undefined) return undefined;
    const direction = this.heroDeltaDirection();
    const key =
      direction === 'up'
        ? 'solaris.chart.trendUp'
        : direction === 'down'
          ? 'solaris.chart.trendDown'
          : 'solaris.chart.trendFlat';
    return `${this.translate(key, {})}: ${delta}`;
  });

  protected readonly chartSummary = computed(() => {
    const parts = visibleChartSeries(this.series()).map((entry) => {
      const plottable = entry.points.filter(
        (point) => typeof point.y === 'number' && Number.isFinite(point.y),
      );
      const peak =
        plottable.length === 0
          ? 0
          : Math.max(...plottable.map((point) => point.y as number));
      return this.translate('solaris.chart.seriesSummary', {
        label: entry.label,
        count: String(plottable.length),
        max: String(peak),
      });
    });
    return parts.join('; ');
  });

  protected seriesColor(entry: SolarisChartSeries, index: number): string {
    return resolveChartSeriesColor(index, entry.color);
  }

  protected viewOptionLabel(option: SolarisChartShellViewOption): string {
    if (option.label !== undefined) return option.label;
    if (option.labelKey !== undefined)
      return this.translate(option.labelKey, {});
    return this.translate(SHELL_VIEW_LABEL_KEYS[option.value], {});
  }

  protected periodOptionLabel(option: SolarisChartShellPeriodOption): string {
    if (option.label !== undefined) return option.label;
    if (option.labelKey !== undefined)
      return this.translate(option.labelKey, {});
    return this.translate(SHELL_PERIOD_LABEL_KEYS[option.value], {});
  }

  protected displayModeOptionLabel(
    option: SolarisChartShellDisplayModeOption,
  ): string {
    if (option.label !== undefined) return option.label;
    if (option.labelKey !== undefined)
      return this.translate(option.labelKey, {});
    return this.translate(SHELL_DISPLAY_LABEL_KEYS[option.value], {});
  }

  protected actionOptionLabel(option: SolarisChartShellActionOption): string {
    if (option.label !== undefined) return option.label;
    if (option.labelKey !== undefined)
      return this.translate(option.labelKey, {});
    return this.translate(
      SHELL_ACTION_LABEL_KEYS[option.value] ?? option.value,
      {},
    );
  }

  protected onViewSelect(value: unknown): void {
    if (!isChartView(value)) return;
    if (!this.availableViews().some((option) => option.value === value)) return;
    this.view.set(value);
    this.viewChange.emit(value);
    this.announcement.set(this.viewOptionLabel({ value }));
  }

  protected onPeriodSelect(value: unknown): void {
    if (!isChartPeriod(value)) return;
    if (!this.availablePeriods().some((option) => option.value === value))
      return;
    this.period.set(value);
    this.periodChange.emit(value);
    this.announcement.set(this.periodOptionLabel({ value }));
  }

  protected onDisplayModeSelect(value: unknown): void {
    if (!isChartDisplayMode(value)) return;
    if (!this.availableDisplayModes().some((option) => option.value === value))
      return;
    this.displayMode.set(value);
    this.displayModeChange.emit(value);
    this.announcement.set(this.displayModeOptionLabel({ value }));
  }

  protected onLegendToggle(entry: SolarisChartSeries): void {
    this.seriesToggle.emit(entry.id);
    this.announcement.set(
      this.translate('solaris.chart.legendToggle', { label: entry.label }),
    );
  }

  protected onActionSelect(value: string): void {
    this.actionRequest.emit(value);
  }

  protected onRetry(): void {
    this.retry.emit();
  }

  private translateKey(key: string | undefined): string | undefined {
    if (key === undefined) return undefined;
    return this.translate(key, {});
  }

  protected translate(key: string, params: Record<string, string>): string {
    const service = this.translateService;
    if (service) return service.translate(key, params);
    return resolveChartFallback(this.locale(), key, params);
  }
}
