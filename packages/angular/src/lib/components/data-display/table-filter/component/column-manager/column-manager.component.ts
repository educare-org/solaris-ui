import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../../services/translation';
import { SolarisThemeService } from '../../../../../services/theme';
import { SolarisCheckboxComponent } from '../../../../forms/checkbox';
import { SolarisIconComponent } from '../../../../icon';
import { SolarisButtonDirective } from '../../../../actions/button';
import { SolarisIconButtonDirective } from '../../../../actions/icon-button';
import { nextIdFor } from '../../../../../core';

import {
  FILTER_COLUMNS_CANCEL_LABEL,
  FILTER_COLUMNS_CANCEL_LABEL_KEY,
  FILTER_COLUMNS_MOVE_DOWN_LABEL,
  FILTER_COLUMNS_MOVE_DOWN_LABEL_KEY,
  FILTER_COLUMNS_MOVE_UP_LABEL,
  FILTER_COLUMNS_MOVE_UP_LABEL_KEY,
  FILTER_COLUMNS_RESET_LABEL,
  FILTER_COLUMNS_RESET_LABEL_KEY,
  FILTER_COLUMNS_SAVE_LABEL,
  FILTER_COLUMNS_SAVE_LABEL_KEY,
  FILTER_COLUMNS_TITLE,
  FILTER_COLUMNS_TITLE_KEY,
  interpolateFilterText,
  normalizeOptionalString,
} from '../../model/filter.defaults';
import type { SolarisTableFilterableColumn } from '../../model/filter.types';
import {
  insertColumnBefore,
  moveColumnInOrder,
  orderFromColumns,
} from '../../model/filter-state';
import type { SolarisTableDensity } from '../../../table/model/table.types';

export interface SolarisColumnManagerSave {
  readonly order: readonly string[];
  readonly visibility: Readonly<Record<string, boolean>>;
}

@Component({
  selector: 'solaris-column-manager',
  standalone: true,
  imports: [
    SolarisCheckboxComponent,
    SolarisIconComponent,
    SolarisButtonDirective,
    SolarisIconButtonDirective,
  ],
  templateUrl: './column-manager.component.html',
  styleUrls: ['./column-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-density]': 'effectiveDensity()',
  },
})
export class SolarisColumnManagerComponent<T = unknown> implements OnInit {
  protected readonly themeService = inject(SolarisThemeService);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly titleId = nextIdFor('solaris-column-manager');

  readonly columns = input<readonly SolarisTableFilterableColumn<T>[]>([]);
  readonly order = input<readonly string[]>([]);
  readonly visibility = input<Readonly<Record<string, boolean>>>({});
  readonly density = input<SolarisTableDensity | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly titleKey = input<string | undefined>(undefined);

  readonly save = output<SolarisColumnManagerSave>();
  readonly cancelled = output<void>();
  readonly resetRequest = output<void>();

  protected readonly effectiveDensity = computed(
    () => this.density() ?? this.themeService.density,
  );

  protected readonly draftOrder = signal<readonly string[]>([]);
  protected readonly draftVisibility = signal<
    Readonly<Record<string, boolean>>
  >({});
  protected readonly draggedId = signal<string | null>(null);
  protected readonly dropTargetId = signal<string | null>(null);

  protected readonly orderedColumns = computed(() => {
    const byId = new Map(
      this.columns().map((column) => [column.id, column] as const),
    );
    return this.draftOrder()
      .map((id) => byId.get(id))
      .filter((column) => column !== undefined);
  });

  protected readonly isResetDisabled = computed(() => {
    const defaults = orderFromColumns(this.columns());
    const draft = this.draftOrder();
    if (
      draft.length !== defaults.length ||
      !draft.every((id, index) => id === defaults[index])
    ) {
      return false;
    }
    return !Object.values(this.draftVisibility()).some(
      (visible) => visible === false,
    );
  });

  protected readonly isSaveDisabled = computed(() => {
    const applied = this.sanitizedOrder(this.order());
    const draft = this.draftOrder();
    if (
      draft.length !== applied.length ||
      !draft.every((id, index) => id === applied[index])
    ) {
      return false;
    }
    const appliedVisibility = this.visibility();
    const draftVisibility = this.draftVisibility();
    return this.columns().every(
      (column) =>
        (appliedVisibility[column.id] !== false) ===
        (draftVisibility[column.id] !== false),
    );
  });

  ngOnInit(): void {
    this.draftOrder.set(this.sanitizedOrder(this.order()));
    this.draftVisibility.set({ ...this.visibility() });
  }

  private sanitizedOrder(order: readonly string[]): string[] {
    const columns = this.columns();
    const incoming = order.length > 0 ? order : orderFromColumns(columns);
    const ids = new Set(columns.map((column) => column.id));
    const sanitized = incoming.filter((id) => ids.has(id));
    for (const column of columns) {
      if (!sanitized.includes(column.id)) {
        sanitized.push(column.id);
      }
    }
    return sanitized;
  }

  protected resolveTitle(): string {
    return this.resolveText(
      this.title(),
      this.titleKey() ?? FILTER_COLUMNS_TITLE_KEY,
      FILTER_COLUMNS_TITLE,
    ).trim();
  }

  protected resolveColumnLabel(
    column: SolarisTableFilterableColumn<T>,
  ): string {
    return this.resolveText(column.header, column.headerKey, column.id).trim();
  }

  protected isVisible(columnId: string): boolean {
    return this.draftVisibility()[columnId] !== false;
  }

  protected toggleVisibility(columnId: string, visible: boolean): void {
    this.draftVisibility.set({
      ...this.draftVisibility(),
      [columnId]: visible,
    });
  }

  protected moveUp(columnId: string): void {
    this.draftOrder.set(moveColumnInOrder(this.draftOrder(), columnId, -1));
  }

  protected moveDown(columnId: string): void {
    this.draftOrder.set(moveColumnInOrder(this.draftOrder(), columnId, 1));
  }

  protected moveUpLabel(columnId: string): string {
    return interpolateFilterText(
      this.resolveText(
        null,
        FILTER_COLUMNS_MOVE_UP_LABEL_KEY,
        FILTER_COLUMNS_MOVE_UP_LABEL,
      ),
      { column: this.labelOf(columnId) },
    );
  }

  protected moveDownLabel(columnId: string): string {
    return interpolateFilterText(
      this.resolveText(
        null,
        FILTER_COLUMNS_MOVE_DOWN_LABEL_KEY,
        FILTER_COLUMNS_MOVE_DOWN_LABEL,
      ),
      { column: this.labelOf(columnId) },
    );
  }

  protected onDragStart(columnId: string, event: DragEvent): void {
    this.draggedId.set(columnId);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      try {
        event.dataTransfer.setData('text/plain', columnId);
      } catch {
        return;
      }
    }
  }

  protected onDragOver(columnId: string, event: DragEvent): void {
    if (!this.draggedId()) {
      return;
    }
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dropTargetId.set(columnId);
  }

  protected onDrop(columnId: string, event: DragEvent): void {
    event.preventDefault();
    const dragged = this.draggedId();
    this.draggedId.set(null);
    this.dropTargetId.set(null);
    if (!dragged || dragged === columnId) {
      return;
    }
    this.draftOrder.set(
      insertColumnBefore(this.draftOrder(), dragged, columnId),
    );
  }

  protected onDragEnd(): void {
    this.draggedId.set(null);
    this.dropTargetId.set(null);
  }

  protected handleSave(): void {
    this.save.emit({
      order: this.draftOrder(),
      visibility: this.draftVisibility(),
    });
  }

  protected handleCancel(): void {
    this.cancelled.emit();
  }

  protected handleReset(): void {
    this.draftOrder.set(orderFromColumns(this.columns()));
    this.draftVisibility.set({});
    this.resetRequest.emit();
  }

  protected resolveResetLabel(): string {
    return this.resolveText(
      null,
      FILTER_COLUMNS_RESET_LABEL_KEY,
      FILTER_COLUMNS_RESET_LABEL,
    ).trim();
  }

  protected resolveCancelLabel(): string {
    return this.resolveText(
      null,
      FILTER_COLUMNS_CANCEL_LABEL_KEY,
      FILTER_COLUMNS_CANCEL_LABEL,
    ).trim();
  }

  protected resolveSaveLabel(): string {
    return this.resolveText(
      null,
      FILTER_COLUMNS_SAVE_LABEL_KEY,
      FILTER_COLUMNS_SAVE_LABEL,
    ).trim();
  }

  private labelOf(columnId: string): string {
    const column = this.columns().find(
      (candidate) => candidate.id === columnId,
    );
    return column ? this.resolveColumnLabel(column) : columnId;
  }

  private resolveText(
    directText?: string | null,
    translationKey?: string | null,
    fallbackText = '',
    params?: Record<string, string | number>,
  ): string {
    const direct = normalizeOptionalString(directText);
    if (direct) {
      return interpolateFilterText(direct, params ?? {});
    }
    const key = normalizeOptionalString(translationKey);
    if (key && this.translateService) {
      const translated = this.translateService.translate(key, params);
      if (translated !== key) {
        return translated;
      }
    }
    return interpolateFilterText(fallbackText, params ?? {});
  }
}
