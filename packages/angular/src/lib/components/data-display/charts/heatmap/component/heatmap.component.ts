// SECURITY_EXCEPTION_FILE: nativeElement is used only as a scoped query
// root to move focus between SVG cells. No innerHTML is used; style writes
// target only presentation attributes of the component's own SVG.
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { SolarisThemeService } from '../../../../../services/theme';
import { SolarisTranslateService } from '../../../../../services/translation';
import { resolveChartFallback } from '../../model/strings/chart-strings';
import {
  SOLARIS_HEATMAP_GAP,
  SOLARIS_HEATMAP_CELL_SIZE,
  SOLARIS_HEATMAP_HEADER_HEIGHT,
  buildHeatmapFrame,
  clampHeatmapPercent,
  heatmapAnchorPoint,
  heatmapCellFill,
  heatmapCellKey,
  heatmapEnterDelayMs,
} from '../model/chart-heatmap.utils';
import type {
  SolarisHeatmapCellEvent,
  SolarisHeatmapDensity,
  SolarisHeatmapRow,
  SolarisHeatmapSize,
  SolarisHeatmapValueFormatter,
} from '../model/chart-heatmap.types';

interface SolarisHeatmapFocusMark {
  readonly rowId: string;
  readonly columnIndex: number;
  readonly position: number;
}

interface SolarisHeatmapHoverMark {
  readonly rowId: string;
  readonly columnIndex: number;
}

function sameMark(
  left: SolarisHeatmapHoverMark | null,
  right: SolarisHeatmapHoverMark | null,
): boolean {
  if (left === null || right === null) return left === right;
  return left.rowId === right.rowId && left.columnIndex === right.columnIndex;
}

@Component({
  selector: 'solaris-heatmap',
  standalone: true,
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-heatmap',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
  },
})
export class SolarisHeatmapComponent {
  readonly rows = input.required<readonly SolarisHeatmapRow[]>();
  readonly columns = input.required<readonly string[]>();
  readonly locale = input.required<string>();
  readonly max = input<number | undefined>(undefined);
  readonly valueFormat = input<SolarisHeatmapValueFormatter | undefined>(
    undefined,
  );
  readonly size = input<SolarisHeatmapSize>('md');
  readonly density = input<SolarisHeatmapDensity | undefined>(undefined);
  readonly showScale = input(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly cellSelect = output<SolarisHeatmapCellEvent>();

  private readonly elementRef = inject(ElementRef);
  protected readonly themeService = inject(SolarisThemeService);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  private readonly hoveredCell = signal<SolarisHeatmapHoverMark | null>(null);
  private readonly selectedCell = signal<SolarisHeatmapHoverMark | null>(null);
  private readonly focusedCell = signal<SolarisHeatmapHoverMark | null>(null);

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly frame = computed(() =>
    buildHeatmapFrame(this.rows(), this.columns(), { max: this.max() }),
  );

  protected readonly hasValue = computed(() =>
    this.frame().cells.some((cell) => cell.value !== null),
  );

  protected readonly isEmpty = computed(
    () => this.frame().cells.length === 0 || !this.hasValue(),
  );

  protected readonly focusMarks = computed<SolarisHeatmapFocusMark[]>(() =>
    this.frame().cells.map((cell, position) => ({
      rowId: cell.rowId,
      columnIndex: cell.columnIndex,
      position,
    })),
  );

  protected readonly resolvedValueFormat = computed(() => {
    const custom = this.valueFormat();
    if (custom !== undefined) return custom;
    const formatter = new Intl.NumberFormat(this.locale(), {
      maximumFractionDigits: 1,
    });
    return (value: number): string => formatter.format(value);
  });

  protected formatCellValue(value: number | null): string {
    if (value === null) return '—';
    return this.resolvedValueFormat()(value);
  }

  protected readonly summary = computed(() => {
    if (this.ariaLabel() !== undefined) return this.ariaLabel();
    if (this.ariaLabelKey() !== undefined) {
      return this.translate(this.ariaLabelKey() as string, {});
    }
    const frame = this.frame();
    const peak = this.formatCellValue(frame.max);
    return `Heatmap ${frame.rowCount} × ${frame.columnCount}, ${this.translate('solaris.chart.total', {})}: ${peak}`;
  });

  protected readonly tooltip = computed(() => {
    const mark = this.hoveredCell() ?? this.focusedCell();
    if (mark === null || this.isEmpty()) return null;
    const cell = this.frame().cells.find(
      (entry) =>
        entry.rowId === mark.rowId && entry.columnIndex === mark.columnIndex,
    );
    if (!cell) return null;
    const frame = this.frame();
    const anchor = heatmapAnchorPoint(cell, {
      x: frame.width / 2,
      y: frame.height / 2,
    });
    return {
      rowLabel: cell.rowLabel,
      columnLabel: cell.columnLabel,
      formattedValue:
        cell.value === null ? null : this.resolvedValueFormat()(cell.value),
      leftPercent: clampHeatmapPercent((anchor.x / frame.width) * 100),
      topPercent: clampHeatmapPercent((anchor.y / frame.height) * 100),
      side: anchor.side,
    };
  });

  protected readonly scaleSegments = computed(() => {
    const frame = this.frame();
    return Array.from({ length: 5 }, (_, index) => {
      const value = (frame.max * (index + 1)) / 5;
      return {
        value,
        fill: heatmapCellFill(value, frame.max),
      };
    });
  });

  protected readonly scaleTicks = computed(() => {
    const max = this.frame().max;
    const format = this.resolvedValueFormat();
    return Array.from({ length: 6 }, (_, index) => format((max * index) / 5));
  });

  protected readonly tableRows = computed(
    (): readonly { readonly label: string; readonly values: string[] }[] => {
      const grouped = new Map<string, { label: string; values: string[] }>();
      for (const cell of this.frame().cells) {
        let row = grouped.get(cell.rowId);
        if (!row) {
          row = { label: cell.rowLabel, values: [] };
          grouped.set(cell.rowId, row);
        }
        row.values[cell.columnIndex] = this.formatCellValue(cell.value);
      }
      return [...grouped.values()];
    },
  );

  protected cellKey(rowId: string, columnIndex: number): string {
    return heatmapCellKey(rowId, columnIndex);
  }

  protected cellFill(rowId: string, columnIndex: number): string {
    const cell = this.frame().cells.find(
      (entry) => entry.rowId === rowId && entry.columnIndex === columnIndex,
    );
    return heatmapCellFill(cell?.value ?? null, this.frame().max);
  }

  protected columnCenter(columnIndex: number): number {
    return (
      SOLARIS_HEATMAP_GAP +
      columnIndex * (SOLARIS_HEATMAP_CELL_SIZE + SOLARIS_HEATMAP_GAP) +
      SOLARIS_HEATMAP_CELL_SIZE / 2
    );
  }

  protected columnBaseline(): number {
    return SOLARIS_HEATMAP_HEADER_HEIGHT / 2 + 4;
  }

  protected enterDelay(position: number): number {
    return heatmapEnterDelayMs(position);
  }

  protected markTabIndex(rowId: string, columnIndex: number): number {
    const focused = this.focusedCell();
    if (focused === null) {
      const first = this.focusMarks()[0];
      return first?.rowId === rowId && first.columnIndex === columnIndex
        ? 0
        : -1;
    }
    return focused.rowId === rowId && focused.columnIndex === columnIndex
      ? 0
      : -1;
  }

  protected isMarkActive(rowId: string, columnIndex: number): boolean {
    const candidate = { rowId, columnIndex };
    const hovered = this.hoveredCell();
    if (hovered !== null) return sameMark(hovered, candidate);
    const selected = this.selectedCell();
    if (selected !== null) return sameMark(selected, candidate);
    return sameMark(this.focusedCell(), candidate);
  }

  protected cellAriaLabel(rowId: string, columnIndex: number): string {
    const cell = this.frame().cells.find(
      (entry) => entry.rowId === rowId && entry.columnIndex === columnIndex,
    );
    if (!cell) return rowId;
    return `${cell.rowLabel}, ${cell.columnLabel}: ${this.formatCellValue(cell.value)}`;
  }

  protected onCellHover(rowId: string, columnIndex: number): void {
    this.hoveredCell.set({ rowId, columnIndex });
  }

  protected onCellsLeave(): void {
    this.hoveredCell.set(null);
  }

  protected onCellFocus(rowId: string, columnIndex: number): void {
    this.focusedCell.set({ rowId, columnIndex });
    this.hoveredCell.set({ rowId, columnIndex });
  }

  protected onCellBlur(): void {
    this.focusedCell.set(null);
    this.hoveredCell.set(null);
  }

  protected onCellActivate(rowId: string, columnIndex: number): void {
    this.selectedCell.set({ rowId, columnIndex });
    this.cellSelect.emit({ rowId, columnIndex });
  }

  protected onCellKeydown(
    event: KeyboardEvent,
    rowId: string,
    columnIndex: number,
  ): void {
    const marks = this.focusMarks();
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onCellActivate(rowId, columnIndex);
      return;
    }
    const columnCount = this.frame().columnCount;
    if (columnCount <= 0) return;
    const position = marks.findIndex(
      (mark) => mark.rowId === rowId && mark.columnIndex === columnIndex,
    );
    if (position === -1) return;
    const row = Math.floor(position / columnCount);
    const column = position % columnCount;
    const rowCount = this.frame().rowCount;
    let nextRow = row;
    let nextColumn = column;
    if (event.key === 'ArrowRight') {
      nextColumn = Math.min(column + 1, columnCount - 1);
    } else if (event.key === 'ArrowLeft') {
      nextColumn = Math.max(column - 1, 0);
    } else if (event.key === 'ArrowDown') {
      nextRow = Math.min(row + 1, rowCount - 1);
    } else if (event.key === 'ArrowUp') {
      nextRow = Math.max(row - 1, 0);
    } else if (event.key === 'Home') {
      nextColumn = 0;
    } else if (event.key === 'End') {
      nextColumn = columnCount - 1;
    } else {
      return;
    }
    if (nextRow === row && nextColumn === column) return;
    const target = marks[nextRow * columnCount + nextColumn];
    if (!target) return;
    event.preventDefault();
    this.focusedCell.set({
      rowId: target.rowId,
      columnIndex: target.columnIndex,
    });
    this.hoveredCell.set({
      rowId: target.rowId,
      columnIndex: target.columnIndex,
    });
    const native = this.elementRef.nativeElement as HTMLElement;
    native
      .querySelector<SVGGraphicsElement>(
        `[data-cell="${heatmapCellKey(target.rowId, target.columnIndex)}"]`,
      )
      ?.focus();
  }

  protected emptyTitle(): string {
    return this.translate('solaris.chart.emptyTitle', {});
  }

  protected emptyMessage(): string {
    return this.translate('solaris.chart.emptyMessage', {});
  }

  private translate(key: string, params: Record<string, string>): string {
    const service = this.translateService;
    if (service) return service.translate(key, params);
    return resolveChartFallback(this.locale(), key, params);
  }
}
