import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
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
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
} from '../../../../interaction/popover';
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
import {
  formatSolarisDate,
  todaySolarisDate,
} from '../../../../forms/date/model/date.utils';
import type {
  SolarisDateRange,
  SolarisDateValue,
} from '../../../../forms/date/model/date.types';
import type { SolarisDatePreset } from '../../../../forms/date/model/date.types';
import { SolarisDateRangePickerComponent } from '../../../../forms/date-range-picker/component/date-range-picker.component';
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
  matchChartPeriodForRange,
  resolveChartIntervalEnd,
  resolvePeriodPresetRange,
} from '../model/chart-shell.utils';
import type {
  SolarisChartShellActionOption,
  SolarisChartShellDensity,
  SolarisChartShellDisplayModeOption,
  SolarisChartShellInterval,
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
    SolarisDateRangePickerComponent,
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
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
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
export class SolarisChartShellComponent implements OnDestroy {
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
  readonly intervalStart = model<SolarisDateValue | null>(null);
  readonly intervalEnd = model<SolarisDateValue | null>(null);
  readonly minInterval = input<SolarisDateValue | undefined>(undefined);
  readonly maxInterval = input<SolarisDateValue | undefined>(undefined);
  readonly showIntervalPicker = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  readonly series = input.required<readonly SolarisChartSeries[]>();

  readonly view = model<SolarisChartView>('line');
  readonly period = model<SolarisChartPeriod>('week');
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
  readonly rangeChange = output<SolarisChartShellInterval>();

  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  protected readonly themeService = inject(SolarisThemeService);
  private readonly intervalPicker =
    viewChild<SolarisDateRangePickerComponent>('intervalPicker');
  private readonly intervalPopover = viewChild(SolarisPopoverTriggerDirective);
  private readonly periodsControl = viewChild('periodsControl', {
    read: SolarisSegmentedControlComponent,
  });
  private intervalOpenTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      this.intervalPicker()?.writeValue({
        start: this.intervalStart(),
        end: this.intervalEnd(),
      });
    });
  }

  ngOnDestroy(): void {
    if (this.intervalOpenTimer !== null) {
      clearTimeout(this.intervalOpenTimer);
      this.intervalOpenTimer = null;
    }
  }

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
    if (this.intervalLabelKey() !== undefined)
      return this.translateKey(this.intervalLabelKey());
    const start = this.intervalStart();
    const end = this.intervalEnd();
    if (start === null && end === null) return undefined;
    const locale = this.locale();
    const formattedStart = start ? formatSolarisDate(start, locale) : undefined;
    const formattedEnd = end ? formatSolarisDate(end, locale) : undefined;
    if (formattedStart && formattedEnd)
      return `${formattedStart} → ${formattedEnd}`;
    return formattedStart ?? formattedEnd;
  });

  protected readonly activePeriodOption = computed(() =>
    this.effectivePeriods().find((option) => option.value === this.period()),
  );

  protected readonly effectivePeriods = computed(
    (): readonly SolarisChartShellPeriodOption[] => {
      const options = this.availablePeriods();
      if (!this.isAutoCustom()) return options;
      const iconOption: SolarisChartShellPeriodOption = {
        value: 'custom',
        icon: 'calendar',
      };
      const allIndex = options.findIndex((option) => option.value === 'all');
      if (allIndex === -1) return [...options, iconOption];
      return [
        ...options.slice(0, allIndex),
        iconOption,
        ...options.slice(allIndex),
      ];
    },
  );

  protected readonly leadingPeriods = computed(
    (): readonly SolarisChartShellPeriodOption[] => {
      if (!this.isAutoCustom()) return this.effectivePeriods();
      const options = this.effectivePeriods();
      const customIndex = options.findIndex(
        (option) => option.value === 'custom',
      );
      return customIndex === -1 ? options : options.slice(0, customIndex);
    },
  );

  protected readonly trailingPeriods = computed(
    (): readonly SolarisChartShellPeriodOption[] => {
      if (!this.isAutoCustom()) return [];
      const options = this.effectivePeriods();
      const customIndex = options.findIndex(
        (option) => option.value === 'custom',
      );
      return customIndex === -1 ? [] : options.slice(customIndex + 1);
    },
  );

  protected readonly isAutoCustom = computed(
    () =>
      this.isIntervalInteractive() &&
      !this.availablePeriods().some((option) => option.value === 'custom'),
  );

  protected readonly intervalPresets = computed(
    (): readonly SolarisDatePreset[] => {
      const anchor = this.intervalStart() ?? todaySolarisDate();
      const presets: SolarisDatePreset[] = [];
      for (const option of this.availablePeriods()) {
        const range = resolvePeriodPresetRange(option, anchor);
        if (!range) continue;
        presets.push({
          id: option.value,
          label: this.periodOptionLabel(option),
          range,
        });
      }
      return presets;
    },
  );

  protected readonly isIntervalInteractive = computed(
    () =>
      this.showIntervalPicker() ||
      this.intervalStart() !== null ||
      this.intervalEnd() !== null,
  );

  protected readonly intervalPlaceholder = computed(() =>
    this.translate('solaris.chart.intervalPlaceholder', {}),
  );

  protected readonly intervalOpen = signal(false);

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
    return `${this.translate(this.trendLabelKey(), {})}: ${delta}`;
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
    if (!this.effectivePeriods().some((option) => option.value === value))
      return;
    if (value === 'custom' && this.isAutoCustom()) {
      this.periodsControl()?.value.set(this.period());
      return;
    }
    this.period.set(value);
    this.periodChange.emit(value);
    this.announcement.set(this.periodOptionLabel({ value }));
    const option = this.effectivePeriods().find(
      (entry) => entry.value === value,
    );
    if (!option?.fixedDuration) return;
    if (!this.isIntervalInteractive()) return;
    const anchor = this.intervalStart() ?? todaySolarisDate();
    const end = resolveChartIntervalEnd(anchor, option);
    this.intervalStart.set(anchor);
    this.intervalEnd.set(end);
    this.emitRange();
  }

  protected onIntervalPickerChange(range: SolarisDateRange): void {
    this.intervalStart.set(range.start);
    this.intervalEnd.set(range.end);
    const next =
      matchChartPeriodForRange(
        range.start,
        range.end,
        this.availablePeriods(),
      ) ?? 'custom';
    if (next !== this.period()) {
      this.period.set(next);
      this.periodChange.emit(next);
      this.announcement.set(this.periodOptionLabel({ value: next }));
    }
    this.closeIntervalPicker();
    this.emitRange();
  }

  protected closeIntervalPicker(): void {
    this.intervalOpen.set(false);
    this.intervalPopover()?.close();
  }

  protected toggleIntervalPicker(): void {
    if (this.intervalOpen()) {
      this.intervalPopover()?.close();
      return;
    }
    this.openIntervalPicker();
  }

  protected openIntervalPicker(): void {
    if (this.intervalOpen()) return;
    if (this.intervalOpenTimer !== null) {
      clearTimeout(this.intervalOpenTimer);
    }
    this.intervalOpenTimer = setTimeout(() => {
      this.intervalOpenTimer = null;
      this.intervalPopover()?.open();
    }, 0);
  }

  private emitRange(): void {
    const interval: SolarisChartShellInterval = {
      start: this.intervalStart(),
      end: this.intervalEnd(),
      period: this.period(),
    };
    this.rangeChange.emit(interval);
    const resolved = this.resolvedInterval();
    if (resolved !== undefined) this.announcement.set(resolved);
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

  private trendLabelKey(): string {
    const direction = this.heroDeltaDirection();
    if (direction === 'up') return 'solaris.chart.trendUp';
    if (direction === 'down') return 'solaris.chart.trendDown';
    return 'solaris.chart.trendFlat';
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
