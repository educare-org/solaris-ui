import {
  Component,
  ElementRef,
  input,
  output,
  model,
  computed,
  signal,
  viewChild,
  viewChildren,
  inject,
  ChangeDetectionStrategy,
  TemplateRef,
  NgZone,
  effect,
  booleanAttribute,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import {
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTabComponent,
} from '../../tabs';
import {
  SolarisDropdownMenuTriggerDirective,
  SolarisDropdownMenuItemComponent,
  SolarisDropdownMenuComponent,
} from '../../../interaction/dropdown-menu';
import { SolarisDividerComponent } from '../../../data-display/divider';
import { SolarisIconComponent } from '../../../icon';

import type {
  SolarisEditableTabData,
  SolarisEditableTabAction,
  SolarisEditableTabRenameEvent,
  SolarisEditableTabRemoveEvent,
  SolarisEditableTabMoveEvent,
  SolarisEditableTabDefaultChangeEvent,
  SolarisEditableTabActionEvent,
  SolarisEditableTabMoveDirection,
  SolarisEditableTabsOrientation,
  SolarisEditableTabsAppearance,
  SolarisEditableTabsSize,
  SolarisEditableTabsColor,
  SolarisEditableTabsDensity,
  SolarisEditableTabsShape,
  SolarisEditableTabsActivationMode,
  SolarisEditableTabsContentTransition,
  SolarisEditableTabsShowActions,
  SolarisEditableTabsRenameOnBlur,
} from '../model/editable-tabs.types';

@Component({
  selector: 'solaris-editable-tabs',
  standalone: true,
  imports: [
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisIconComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
    SolarisDropdownMenuTriggerDirective,
    SolarisDividerComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './editable-tabs.component.html',
  styleUrls: ['./editable-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-editable-tabs',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-show-actions]': 'showActions()',
  },
})
export class SolarisEditableTabsComponent {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  protected readonly themeService = inject(SolarisThemeService);
  private readonly ngZone = inject(NgZone);

  readonly value = model<unknown>(undefined);
  readonly defaultValue = input<unknown>(undefined);
  readonly orientation = input<SolarisEditableTabsOrientation>('horizontal');
  readonly appearance = input<SolarisEditableTabsAppearance>('underline');
  readonly size = input<SolarisEditableTabsSize>('md');
  readonly color = input<SolarisEditableTabsColor>('primary');
  readonly density = input<SolarisEditableTabsDensity>();
  readonly shape = input<SolarisEditableTabsShape>('normal');
  readonly activationMode =
    input<SolarisEditableTabsActivationMode>('automatic');
  readonly contentTransition =
    input<SolarisEditableTabsContentTransition>('slide');

  readonly tabs = input.required<SolarisEditableTabData[]>();

  readonly editable = input<boolean>(true);
  readonly renamable = input<boolean>(true);
  readonly removable = input<boolean>(true);
  readonly movable = input<boolean>(true);
  readonly dragToReorder = input(false, { transform: booleanAttribute });
  readonly defaultable = input<boolean>(true);
  readonly showActions = input<SolarisEditableTabsShowActions>('focus-hover');
  readonly renameOnBlur = input<SolarisEditableTabsRenameOnBlur>('confirm');
  readonly minTabs = input<number>(1);
  readonly allowEmpty = input<boolean>(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly tabContentMap = input<Record<string, TemplateRef<void>> | undefined>(
    undefined,
  );

  readonly valueChange = output<unknown>();
  readonly tabRenameRequested = output<SolarisEditableTabRenameEvent>();
  readonly tabRename = output<SolarisEditableTabRenameEvent>();
  readonly tabRemoveRequested = output<SolarisEditableTabRemoveEvent>();
  readonly tabRemove = output<SolarisEditableTabRemoveEvent>();
  readonly tabMoveRequested = output<SolarisEditableTabMoveEvent>();
  readonly tabMove = output<SolarisEditableTabMoveEvent>();
  readonly defaultTabChange = output<SolarisEditableTabDefaultChangeEvent>();
  readonly tabAction = output<SolarisEditableTabActionEvent>();

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  readonly menuComponents = viewChildren(SolarisDropdownMenuComponent);
  protected readonly renameInputRef =
    viewChild<ElementRef<HTMLInputElement>>('renameInput');
  readonly tabMenuRefs = computed(() => {
    this.tabs();
    return this.menuComponents();
  });

  protected readonly activeMenuIndex = signal<number | null>(null);
  protected readonly renamingTabId = signal<unknown | null>(null);
  protected readonly renameValue = signal<string>('');
  protected readonly defaultTabValue = signal<unknown>(undefined);
  protected readonly draggingTabIndex = signal<number | null>(null);
  protected readonly dropIndicatorIndex = signal<number | null>(null);

  protected readonly resolvedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const key = this.ariaLabelKey();
    if (key && this.translateService) {
      return this.translateService.translate(key);
    }
    return key ?? 'Editable tabs';
  });

  constructor() {
    effect(() => {
      const defaultValue = this.defaultValue();
      const currentValue = this.value();
      if (currentValue === undefined && defaultValue !== undefined) {
        this.value.set(defaultValue);
      }
    });
  }

  protected onValueChange(newValue: unknown): void {
    this.value.set(newValue);
    this.valueChange.emit(newValue);
  }

  protected hasActions(tab: SolarisEditableTabData): boolean {
    if (!this.editable()) return false;
    if (tab.disabled) return false;
    return (
      this.canRename(tab) ||
      this.canSetDefault(tab) ||
      this.canMoveLeft(tab) ||
      this.canMoveRight(tab) ||
      this.canRemove(tab) ||
      (tab.customActions?.length ?? 0) > 0
    );
  }

  protected canRename(tab: SolarisEditableTabData): boolean {
    if (!this.renamable()) return false;
    if (tab.locked && tab.renamable !== true) return false;
    return tab.renamable !== false;
  }

  protected canRemove(tab: SolarisEditableTabData): boolean {
    if (!this.removable()) return false;
    if (tab.locked && tab.removable !== true) return false;
    if (tab.removable === false) return false;
    if (tab.disabled) return false;
    return !(!this.allowEmpty() && this.tabs().length <= this.minTabs());
  }

  protected canMoveLeft(tab: SolarisEditableTabData): boolean {
    if (!this.movable()) return false;
    if (tab.locked && tab.movable !== true) return false;
    if (tab.movable === false) return false;
    if (tab.disabled) return false;
    const idx = this.tabs().indexOf(tab);
    if (idx <= 0) return false;
    for (let i = idx - 1; i >= 0; i--) {
      if (!this.tabs()[i].locked) return true;
    }
    return false;
  }

  protected canMoveRight(tab: SolarisEditableTabData): boolean {
    if (!this.movable()) return false;
    if (tab.locked && tab.movable !== true) return false;
    if (tab.movable === false) return false;
    if (tab.disabled) return false;
    const idx = this.tabs().indexOf(tab);
    if (idx < 0 || idx >= this.tabs().length - 1) return false;
    for (let i = idx + 1; i < this.tabs().length; i++) {
      if (!this.tabs()[i].locked) return true;
    }
    return false;
  }

  protected canSetDefault(tab: SolarisEditableTabData): boolean {
    if (!this.defaultable()) return false;
    if (tab.locked && tab.defaultable !== true) return false;
    if (tab.defaultable === false) return false;
    return !tab.disabled;
  }

  protected startRename(tab: SolarisEditableTabData): void {
    this.activeMenuIndex.set(null);
    this.renamingTabId.set(tab.value);
    this.renameValue.set(tab.label ?? '');
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        // SECURITY_EXCEPTION: focusing the rename input requires the native method; resolved via viewChild template ref (scoped to this component, no global query).
        const input = this.renameInputRef()?.nativeElement;
        if (input) {
          input.focus();
          input.select();
        }
      });
    });
  }

  protected commitRename(tab: SolarisEditableTabData): void {
    const previousLabel = tab.label ?? '';
    const nextLabel = this.renameValue().trim();

    if (nextLabel === '') {
      this.renamingTabId.set(null);
      return;
    }

    if (nextLabel === previousLabel) {
      this.renamingTabId.set(null);
      return;
    }

    const event: SolarisEditableTabRenameEvent = {
      value: tab.value,
      previousLabel,
      nextLabel,
      source: 'inline',
    };

    this.tabRenameRequested.emit(event);
    this.tabRename.emit(event);
    this.renamingTabId.set(null);
  }

  protected cancelRename(): void {
    this.renamingTabId.set(null);
  }

  protected onRenameKeydown(
    event: KeyboardEvent,
    tab: SolarisEditableTabData,
  ): void {
    event.stopPropagation();
    if (event.key === 'Enter') {
      event.preventDefault();
      this.commitRename(tab);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelRename();
    }
  }

  protected onRenameBlur(tab: SolarisEditableTabData): void {
    if (this.renameOnBlur() === 'confirm') {
      this.commitRename(tab);
    } else {
      this.cancelRename();
    }
  }

  protected confirmRemove(tab: SolarisEditableTabData, index: number): void {
    this.activeMenuIndex.set(null);
    if (!this.canRemove(tab)) return;

    const wasActive = this.value() === tab.value;

    const event: SolarisEditableTabRemoveEvent = {
      value: tab.value,
      index,
      wasActive,
    };

    this.tabRemoveRequested.emit(event);
    this.tabRemove.emit(event);
  }

  protected moveLabel(direction: 'left' | 'right'): string {
    if (this.orientation() === 'vertical') {
      const key =
        direction === 'left'
          ? 'solaris.editableTabs.moveUp'
          : 'solaris.editableTabs.moveDown';
      return (
        this.resolveText(key) ??
        (direction === 'left' ? 'Move up' : 'Move down')
      );
    }
    const key =
      direction === 'left'
        ? 'solaris.editableTabs.moveLeft'
        : 'solaris.editableTabs.moveRight';
    return (
      this.resolveText(key) ??
      (direction === 'left' ? 'Move left' : 'Move right')
    );
  }

  protected moveIcon(direction: 'left' | 'right'): string {
    if (this.orientation() === 'vertical') {
      return direction === 'left' ? 'chevron-up' : 'chevron-down';
    }
    return direction === 'left' ? 'chevron-left' : 'chevron-right';
  }

  protected moveTab(
    tab: SolarisEditableTabData,
    index: number,
    direction: SolarisEditableTabMoveDirection,
  ): void {
    this.activeMenuIndex.set(null);
    const isPrev = direction === 'left' || direction === 'up';
    const nextIndex = isPrev ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= this.tabs().length) return;
    if (!this.canMoveLeft(tab) && isPrev) return;
    if (!this.canMoveRight(tab) && !isPrev) return;

    const event: SolarisEditableTabMoveEvent = {
      value: tab.value,
      previousIndex: index,
      nextIndex,
      direction,
    };

    this.tabMoveRequested.emit(event);
    this.tabMove.emit(event);
  }

  protected isDragReorderEnabled(tab: SolarisEditableTabData): boolean {
    if (!this.dragToReorder()) return false;
    if (!this.editable()) return false;
    if (!this.movable()) return false;
    if (this.isRenaming(tab)) return false;
    if (tab.locked && tab.movable !== true) return false;
    if (tab.movable === false) return false;
    if (tab.disabled) return false;
    return true;
  }

  protected onTabDragStart(
    event: DragEvent,
    tab: SolarisEditableTabData,
    index: number,
  ): void {
    if (!this.isDragReorderEnabled(tab)) {
      event.preventDefault();
      return;
    }
    const target = event.target as HTMLElement | null;
    if (target?.closest?.('button, input, textarea, [contenteditable]')) {
      event.preventDefault();
      return;
    }
    this.activeMenuIndex.set(null);
    this.draggingTabIndex.set(index);
    this.dropIndicatorIndex.set(null);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      try {
        event.dataTransfer.setData('text/plain', String(tab.value));
      } catch {
        // no-op
      }
    }
  }

  protected onTabDragOver(event: DragEvent, index: number): void {
    const draggingIndex = this.draggingTabIndex();
    if (draggingIndex === null) return;
    if (draggingIndex === index && this.tabs().length <= 1) return;
    const draggedTab = this.tabs()[draggingIndex];
    if (!draggedTab || !this.isDragReorderEnabled(draggedTab)) return;
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dropIndicatorIndex.set(this.resolveDropIndicator(event, index));
  }

  protected onTabDragLeave(): void {
    // no-op
  }

  protected onTabDrop(
    event: DragEvent,
    _tab: SolarisEditableTabData,
    index: number,
  ): void {
    const draggingIndex = this.draggingTabIndex();
    if (draggingIndex === null) return;
    event.preventDefault();
    const indicator =
      this.resolveDropIndicator(event, index) ?? this.dropIndicatorIndex();
    this.dropIndicatorIndex.set(null);
    this.draggingTabIndex.set(null);
    if (indicator === null) return;
    let nextIndex = indicator;
    if (indicator > draggingIndex) {
      nextIndex = indicator - 1;
    }
    if (nextIndex < 0 || nextIndex >= this.tabs().length) return;
    if (nextIndex === draggingIndex) return;
    const draggedTab = this.tabs()[draggingIndex];
    if (!draggedTab || !this.isDragReorderEnabled(draggedTab)) return;

    const vertical = this.orientation() === 'vertical';
    const direction: SolarisEditableTabMoveDirection =
      nextIndex > draggingIndex
        ? vertical
          ? 'down'
          : 'right'
        : vertical
          ? 'up'
          : 'left';

    const moveEvent: SolarisEditableTabMoveEvent = {
      value: draggedTab.value,
      previousIndex: draggingIndex,
      nextIndex,
      direction,
    };

    this.tabMoveRequested.emit(moveEvent);
    this.tabMove.emit(moveEvent);
  }

  protected onTabDragEnd(): void {
    this.draggingTabIndex.set(null);
    this.dropIndicatorIndex.set(null);
  }

  private resolveDropIndicator(
    event: DragEvent | { clientX: number; clientY: number },
    index: number,
  ): number | null {
    const draggingIndex = this.draggingTabIndex();
    if (draggingIndex === null) return null;
    const currentTarget = (event as DragEvent).currentTarget as
      | HTMLElement
      | null
      | undefined;
    const rect = currentTarget?.getBoundingClientRect?.();
    if (!rect) {
      return index;
    }
    if (this.orientation() === 'vertical') {
      const midpoint = rect.top + rect.height / 2;
      return event.clientY >= midpoint ? index + 1 : index;
    }
    const midpoint = rect.left + rect.width / 2;
    return event.clientX >= midpoint ? index + 1 : index;
  }

  protected setAsDefault(tab: SolarisEditableTabData): void {
    this.activeMenuIndex.set(null);
    const previousDefaultValue = this.defaultTabValue();
    this.defaultTabValue.set(tab.value);

    const event: SolarisEditableTabDefaultChangeEvent = {
      value: tab.value,
      previousDefaultValue:
        previousDefaultValue !== undefined
          ? (previousDefaultValue as unknown)
          : undefined,
    };

    this.defaultTabChange.emit(event);
  }

  protected handleCustomAction(
    tab: SolarisEditableTabData,
    action: SolarisEditableTabAction,
  ): void {
    this.activeMenuIndex.set(null);
    const event: SolarisEditableTabActionEvent = {
      tabValue: tab.value,
      actionId: action.id,
      action,
    };
    this.tabAction.emit(event);
  }

  protected isRenaming(tab: SolarisEditableTabData): boolean {
    return this.renamingTabId() === tab.value;
  }

  protected getContentTemplate(
    tab: SolarisEditableTabData,
  ): TemplateRef<void> | null {
    const contentMap = this.tabContentMap();
    if (contentMap) {
      const key = String(tab.value);
      return contentMap[key] ?? null;
    }
    return tab.content ?? null;
  }

  protected resolveText(key: string): string | undefined {
    if (this.translateService) {
      const result = this.translateService.translate(key);
      return result !== key ? result : undefined;
    }
    return undefined;
  }
}
