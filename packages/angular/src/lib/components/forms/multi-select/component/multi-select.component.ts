import {
  Component,
  input,
  computed,
  signal,
  output,
  effect,
  forwardRef,
  inject,
  ContentChildren,
  QueryList,
  ElementRef,
  ViewChild,
  AfterContentInit,
  AfterViewInit,
  DestroyRef,
  isDevMode,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import {
  SolarisFormFieldTriggerDirective,
  SolarisFormPrefixDirective,
  SolarisFormFieldComponent,
} from '../../form-field';
import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisOptionGroupComponent } from '../../option-group';
import { SolarisOptionComponent } from '../../option';
import { SolarisIconComponent } from '../../../icon';
import {
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
} from '../../../interaction/popover';
import { SolarisTooltipDirective } from '../../../interaction/tooltip';

import type {
  SolarisMultiSelectAppearance,
  SolarisMultiSelectSize,
  SolarisMultiSelectDensity,
  SolarisMultiSelectRadius,
  SolarisMultiSelectDisplayMode,
} from '../model/multi-select.types';

let nextId = 0;

function generateId(): string {
  return `solaris-multi-select-${++nextId}`;
}

function normalizeArray(value: unknown): unknown[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value;
  return [];
}

@Component({
  selector: 'solaris-multi-select',
  standalone: true,
  imports: [
    SolarisFormFieldComponent,
    SolarisFormFieldTriggerDirective,
    SolarisFormPrefixDirective,
    SolarisIconComponent,
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
    SolarisTooltipDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisMultiSelectComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisMultiSelectComponent),
    },
  ],
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  host: {
    'solaris-multi-select': '',
    '[attr.id]': 'elementId()',
    '[attr.data-size]': 'size()',
    '[attr.data-open]': 'panelOpen() ? "" : null',
    '[attr.aria-label]': 'ariaLabelText() ?? null',
    '[attr.data-has-value]': 'hasValue() ? "" : null',
  },
})
export class SolarisMultiSelectComponent
  extends SolarisFormControl
  implements ControlValueAccessor, AfterContentInit, AfterViewInit
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  protected readonly parentFormField = inject(SolarisFormFieldComponent, {
    optional: true,
  });

  @ViewChild(SolarisPopoverTriggerDirective)
  protected popoverTrigger?: SolarisPopoverTriggerDirective;

  @ViewChild('searchInput', { read: ElementRef })
  protected searchInputRef?: ElementRef<HTMLInputElement>;

  @ViewChild('triggerEl', { read: ElementRef })
  protected triggerElement?: ElementRef<HTMLElement>;

  @ViewChild('formFieldRef', { read: ElementRef })
  protected formFieldElement?: ElementRef<HTMLElement>;

  @ContentChildren(SolarisOptionComponent, { descendants: true })
  protected options!: QueryList<SolarisOptionComponent>;

  @ContentChildren(SolarisOptionGroupComponent, { descendants: true })
  protected optionGroups!: QueryList<SolarisOptionGroupComponent>;

  readonly hint = input<string>();
  readonly label = input<string>();
  readonly error = input<string>();
  readonly hintKey = input<string>();
  readonly labelKey = input<string>();
  readonly errorKey = input<string>();
  readonly emptyText = input<string>();
  readonly ariaLabel = input<string>();
  readonly placeholder = input<string>();
  readonly loadingText = input<string>();
  readonly emptyTextKey = input<string>();
  readonly ariaLabelKey = input<string>();
  readonly placeholderKey = input<string>();
  readonly loadingTextKey = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly loading = input<boolean>(false);
  readonly searchPlaceholder = input<string>();
  readonly clearable = input<boolean>(false);
  readonly clearLabel = input<string>();
  readonly clearLabelKey = input<string>();
  readonly removeChipLabel = input<string>();
  readonly removeChipLabelKey = input<string>();
  readonly noResultsText = input<string>();
  readonly noResultsTextKey = input<string>();
  readonly value = input<unknown[]>([]);
  readonly searchable = input<boolean>(false);
  readonly searchPlaceholderKey = input<string>();
  readonly panelMinWidth = input<string | number>();
  readonly panelMaxWidth = input<string | number>();
  readonly density = input<SolarisMultiSelectDensity>();
  readonly size = input<SolarisMultiSelectSize>('md');
  readonly panelMatchTriggerWidth = input<boolean>(true);
  readonly radius = input<SolarisMultiSelectRadius>('md');
  readonly disabledInput = input(false, { alias: 'disabled' });
  readonly readonlyInput = input(false, { alias: 'readonly' });
  readonly requiredInput = input(false, { alias: 'required' });
  readonly panelMaxHeight = input<string | number>('20rem');
  readonly icon = input<string>();
  readonly displayWith = input<(value: unknown) => string | undefined>();
  readonly appearance = input<SolarisMultiSelectAppearance>('outline');
  readonly compareWith = input<(a: unknown, b: unknown) => boolean>(Object.is);
  readonly manualInvalid = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });
  readonly selectAll = input<boolean>(false);
  readonly selectAllLabel = input<string>();
  readonly selectAllLabelKey = input<string>();
  readonly displayMode = input<SolarisMultiSelectDisplayMode>('auto');
  readonly maxVisibleChips = input<number>(3);
  readonly selectedCountLabel = input<string>();
  readonly selectedCountLabelKey = input<string>();
  readonly overflowLabel = input<string>();
  readonly overflowLabelKey = input<string>();
  readonly minSelected = input<number | undefined>(undefined);
  readonly maxSelected = input<number | undefined>(undefined);
  readonly showSelectionTooltip = input<boolean>(false);
  readonly name = input<string>();

  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly cleared = output<void>();
  readonly openChange = output<boolean>();
  readonly searchChange = output<string>();
  readonly valueChange = output<unknown[]>();
  readonly selectionChange = output<SolarisOptionComponent>();

  protected readonly panelId = `solaris-multi-select-panel-${generateId()}`;
  protected readonly panelOpen = signal(false);
  protected readonly internalValue = signal<unknown[]>([]);
  protected readonly internalFocused = signal(false);
  protected readonly internalDisabled = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly activeOptionIndex = signal(-1);
  protected readonly touched = signal(false);
  protected readonly optionsInitialized = signal(false);

  @ViewChild('triggerContent', { read: ElementRef })
  protected triggerContentRef?: ElementRef<HTMLElement>;

  private onChange: (value: unknown[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private optionsSubscription: (() => void) | undefined;
  private optionInteractionSubscriptions: (() => void)[] = [];
  private readonly popoverSubscriptions: (() => void)[] = [];
  private readonly triggerWidth = signal(0);
  private resizeObserver: ResizeObserver | null = null;
  private readonly destroyRef = inject(DestroyRef);

  protected readonly elementId = computed(() => {
    // SECURITY_EXCEPTION: nativeElement.getAttribute('id') is standard DOM API to check existing ID before generating one. Same approach used by Solaris Select and Option.
    const existing = this.elementRef.nativeElement.getAttribute('id');
    return existing ?? generateId();
  });

  protected readonly effectiveDensity = computed<SolarisMultiSelectDensity>(
    () => {
      return this.density() ?? 'comfortable';
    },
  );

  protected readonly isEffectivelyDisabled = computed(() => {
    return this.disabledInput() || this.internalDisabled();
  });

  protected readonly isEffectivelyReadonly = computed(() => {
    return this.readonlyInput();
  });

  protected readonly isEffectivelyInvalid = computed(() => {
    const manual = this.manualInvalid();
    if (manual !== undefined) {
      return manual;
    }
    if (this.touched()) {
      const min = this.minSelected();
      const max = this.maxSelected();
      const count = this.internalValue().length;
      if (min !== undefined && count < min) return true;
      if (max !== undefined && count > max) return true;
      if (this.requiredInput() && !this.hasValue()) return true;
    }
    return false;
  });

  protected readonly popoverAppearance = computed(() => {
    const a = this.appearance();
    return a === 'filled' ? 'surface' : a;
  });

  protected readonly canOpen = computed(() => {
    return !this.isEffectivelyDisabled() && !this.isEffectivelyReadonly();
  });

  protected readonly hasValue = computed(() => {
    return this.internalValue().length > 0;
  });

  protected readonly canClear = computed(() => {
    return (
      this.clearable() &&
      this.hasValue() &&
      !this.isEffectivelyDisabled() &&
      !this.isEffectivelyReadonly()
    );
  });

  protected readonly selectedOptions = computed<SolarisOptionComponent[]>(
    () => {
      const value = this.internalValue();
      const comp = this.compareWith();
      const opts = this.options;
      if (!opts || value.length === 0) {
        return [];
      }
      return opts.filter((opt) => value.some((v) => comp(opt.value(), v)));
    },
  );

  protected readonly selectedCount = computed(() => {
    return this.internalValue().length;
  });

  protected readonly selectedLabels = computed(() => {
    const dw = this.displayWith();
    const selected = this.selectedOptions();
    return selected
      .map((opt) => {
        if (dw) {
          const result = dw(opt.value());
          if (result !== undefined) return result;
        }
        const label = opt.labelText();
        if (label) return label;
        const native = this.getOptionNativeText(opt);
        if (native) return native;
        return '';
      })
      .filter(Boolean);
  });

  protected readonly summaryText = computed(() => {
    const count = this.selectedCount();
    if (count === 0) return '';

    const key = this.selectedCountLabelKey();
    if (key) {
      return this.translateService.translate(key, { count: String(count) });
    }
    const text = this.selectedCountLabel();
    if (text) return text;

    if (count === 1) {
      return this.translateService.translate(
        'solaris.multiSelect.selectedCount.singular',
        { count: '1' },
      );
    }
    return this.translateService.translate(
      'solaris.multiSelect.selectedCount.plural',
      { count: String(count) },
    );
  });

  private readonly availableContentWidth = computed(() => {
    const tw = this.triggerWidth();
    if (tw <= 0) return 0;
    const searchWidth = this.searchable() && this.panelOpen() ? 80 : 0;
    return Math.max(0, tw - searchWidth);
  });

  protected readonly autoChipCount = computed(() => {
    if (this.displayMode() !== 'auto') return 0;
    const selected = this.selectedOptions();
    if (selected.length === 0) return 0;
    const avail = this.availableContentWidth();
    if (avail <= 0) return 0;
    let remaining = avail;
    let count = 0;
    for (const opt of selected) {
      const label = this.getOptionDisplayLabel(opt);
      const canRemove =
        !this.isEffectivelyDisabled() && !this.isEffectivelyReadonly();
      const labelWidth = label.length * 9;
      const chipPaddingX = 16;
      const removeWidth = canRemove ? 20 : 0;
      const chipWidth = labelWidth + chipPaddingX + removeWidth + 4;
      if (chipWidth <= remaining) {
        remaining -= chipWidth;
        count++;
      } else {
        break;
      }
    }
    return count;
  });

  protected readonly autoOverflowCount = computed(() => {
    return Math.max(0, this.selectedOptions().length - this.autoChipCount());
  });

  protected readonly autoShowOverflow = computed(() => {
    return this.autoOverflowCount() > 0;
  });

  protected readonly showCountOnly = computed(() => {
    return (
      this.displayMode() === 'auto' &&
      this.autoChipCount() === 0 &&
      this.selectedCount() > 0
    );
  });

  protected readonly autoVisibleChips = computed(() => {
    return this.selectedOptions().slice(0, this.autoChipCount());
  });

  protected readonly autoOverflowTooltipText = computed(() => {
    const selected = this.selectedOptions();
    const count = this.autoChipCount();
    return selected
      .slice(count)
      .map((opt) => this.getOptionDisplayLabel(opt))
      .join(', ');
  });

  protected readonly countTooltipText = computed(() => {
    return this.selectedLabels().join(', ');
  });

  protected readonly overflowCount = computed(() => {
    return Math.max(0, this.selectedOptions().length - this.maxVisibleChips());
  });

  protected readonly overflowText = computed(() => {
    const count = this.overflowCount();
    if (count <= 0) return '';

    const key = this.overflowLabelKey();
    if (key) {
      return this.translateService.translate(key, { count: String(count) });
    }
    const text = this.overflowLabel();
    if (text) return text;

    return `+${count}`;
  });

  protected readonly commaText = computed(() => {
    return this.selectedLabels().join(', ');
  });

  protected readonly placeholderText = computed(() => {
    const key = this.placeholderKey();
    if (key) {
      return this.translateService.translate(key) || this.placeholder() || '';
    }
    return this.placeholder() ?? '';
  });

  protected readonly searchPlaceholderText = computed(() => {
    const key = this.searchPlaceholderKey();
    if (key) {
      return this.translateService.translate(key);
    }
    const text = this.searchPlaceholder();
    if (text) {
      return text;
    }
    return this.translateService.translate(
      'solaris.multiSelect.search.placeholder',
    );
  });

  protected readonly loadingTextValue = computed(() => {
    const key = this.loadingTextKey();
    if (key) {
      return this.translateService.translate(key);
    }
    const text = this.loadingText();
    if (text) {
      return text;
    }
    return this.translateService.translate('solaris.multiSelect.loading');
  });

  protected readonly emptyTextValue = computed(() => {
    const key = this.emptyTextKey();
    if (key) {
      return this.translateService.translate(key);
    }
    const text = this.emptyText();
    if (text) {
      return text;
    }
    return this.translateService.translate('solaris.multiSelect.empty');
  });

  protected readonly noResultsTextValue = computed(() => {
    const key = this.noResultsTextKey();
    if (key) {
      return this.translateService.translate(key);
    }
    const text = this.noResultsText();
    if (text) {
      return text;
    }
    return this.translateService.translate('solaris.multiSelect.noResults');
  });

  protected readonly clearAriaLabel = computed(() => {
    const key = this.clearLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    const text = this.clearLabel();
    if (text) {
      return text;
    }
    return this.translateService.translate('solaris.multiSelect.clear');
  });

  protected readonly selectAllLabelText = computed(() => {
    const key = this.selectAllLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    const text = this.selectAllLabel();
    if (text) {
      return text;
    }
    return this.translateService.translate('solaris.multiSelect.selectAll');
  });

  protected readonly removeChipAriaLabel = computed(() => {
    const key = this.removeChipLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    const text = this.removeChipLabel();
    if (text) {
      return text;
    }
    return this.translateService.translate('solaris.multiSelect.removeChip');
  });

  protected readonly ariaLabelText = computed(() => {
    const key = this.ariaLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    return this.ariaLabel();
  });

  protected readonly ariaLabelledbyText = computed(() => {
    return this.ariaLabelledby();
  });

  protected readonly labelText = computed(() => {
    const key = this.labelKey();
    if (key) {
      return this.translateService.translate(key) || this.label() || '';
    }
    return this.label() ?? '';
  });

  protected readonly hintText = computed(() => {
    const key = this.hintKey();
    if (key) {
      return this.translateService.translate(key) || this.hint() || '';
    }
    return this.hint() ?? '';
  });

  protected readonly errorText = computed(() => {
    const key = this.errorKey();
    if (key) {
      return this.translateService.translate(key) || this.error() || '';
    }
    return this.error() ?? '';
  });

  protected readonly activeDescendantId = computed(() => {
    if (!this.panelOpen()) return null;
    const idx = this.activeOptionIndex();
    const opts = this.visibleOptions();
    if (idx >= 0 && idx < opts.length) {
      return (opts[idx] as unknown as { elementId: () => string }).elementId();
    }
    return null;
  });

  protected readonly _describedByIds = signal<string[]>([]);

  protected readonly ariaDescribedBy = computed(() => {
    const ids = this._describedByIds();
    return ids.length > 0 ? ids.join(' ') : null;
  });

  protected readonly visibleOptions = computed(() => {
    const opts = this.options;
    if (!opts) return [];
    if (!this.panelOpen()) return [];
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return opts.toArray();
    return opts.toArray().filter((opt) => {
      if (opt.isEffectivelyDisabled()) return false;
      return this.optionMatchesSearch(opt, query);
    });
  });

  protected readonly showNoResults = computed(() => {
    return (
      this.searchQuery().trim().length > 0 &&
      this.visibleOptions().length === 0 &&
      !this.loading()
    );
  });

  protected readonly showEmpty = computed(() => {
    const opts = this.options;
    return (
      (!opts || opts.length === 0) &&
      !this.loading() &&
      this.searchQuery().trim().length === 0
    );
  });

  protected readonly allSelectedCount = computed(() => {
    const value = this.internalValue();
    const comp = this.compareWith();
    const opts = this.selectableOptions();
    return opts.filter((opt) => value.some((v) => comp(opt.value(), v))).length;
  });

  protected readonly selectableOptions = computed(() => {
    const opts = this.options;
    if (!opts) return [];
    const query = this.searchQuery().trim();
    let filtered: SolarisOptionComponent[];
    if (query) {
      filtered = opts
        .toArray()
        .filter(
          (o) =>
            !o.isEffectivelyDisabled() && this.optionMatchesSearch(o, query),
        );
    } else {
      filtered = opts.toArray().filter((o) => !o.isEffectivelyDisabled());
    }
    return filtered;
  });

  protected readonly isAllSelected = computed(() => {
    const selectable = this.selectableOptions();
    if (selectable.length === 0) return false;
    return this.allSelectedCount() === selectable.length;
  });

  protected readonly isPartialSelected = computed(() => {
    const selectable = this.selectableOptions();
    if (selectable.length === 0) return false;
    return (
      this.allSelectedCount() > 0 && this.allSelectedCount() < selectable.length
    );
  });

  get id(): string {
    return this.elementId();
  }

  get focused(): boolean {
    return this.internalFocused();
  }

  get disabled(): boolean {
    return this.isEffectivelyDisabled();
  }

  get readonly(): boolean {
    return this.isEffectivelyReadonly();
  }

  get invalid(): boolean {
    return this.isEffectivelyInvalid();
  }

  get required(): boolean {
    return this.requiredInput();
  }

  get describedByIds(): string[] {
    return this._describedByIds();
  }

  setDescribedByIds(ids: string[]): void {
    this._describedByIds.set([...ids]);
  }

  focus(): void {
    // SECURITY_EXCEPTION: nativeElement.focus() required to programmatically focus the multi-select trigger. Standard DOM method used by Angular CDK.
    if (this.triggerElement) {
      this.triggerElement.nativeElement.focus();
    } else {
      // SECURITY_EXCEPTION: nativeElement.focus() required as fallback when no triggerElement ref. Standard DOM method.
      this.elementRef.nativeElement.focus();
    }
  }

  writeValue(safe: unknown): void {
    const arr = normalizeArray(safe);
    this.internalValue.set([...arr]);
  }

  registerOnChange(fn: (value: unknown[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }

  constructor() {
    super();
    effect(() => {
      if (!this.optionsInitialized()) return;
      this.internalValue();
      this.setOptionsSelectedState();
    });
    this.destroyRef.onDestroy(() => {
      this.optionsSubscription?.();
      this.optionInteractionSubscriptions.forEach((fn) => fn());
      this.popoverSubscriptions.forEach((fn) => fn());
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
    });
  }

  ngAfterContentInit(): void {
    this.optionsInitialized.set(true);
    this.setOptionsMultiSelectMode();
    this.setOptionsSelectedState();
    this.setOptionGroupDisabledState();
    this.syncActiveStates();
    this.syncVisibility();
    this.subscribeToOptionInteractions();

    const optionsSub = this.options.changes.subscribe(() => {
      this.setOptionsMultiSelectMode();
      this.setOptionsSelectedState();
      this.setOptionGroupDisabledState();
      this.syncVisibility();
      this.subscribeToOptionInteractions();
    });
    this.optionsSubscription = () => optionsSub.unsubscribe();

    if (isDevMode() && this.parentFormField) {
      console.warn(
        'SolarisMultiSelectComponent already includes SolarisFormField internally. ' +
          'Do not wrap it with <solaris-form-field>; pass label, hint, error, prefix and suffix directly to <solaris-multi-select>.',
      );
    }
  }

  ngAfterViewInit(): void {
    if (this.popoverTrigger) {
      const openedSub = this.popoverTrigger.solarisPopoverOpened.subscribe(
        () => {
          this.onPanelOpened();
        },
      );
      const closedSub = this.popoverTrigger.solarisPopoverClosed.subscribe(
        () => {
          this.onPanelClosed();
        },
      );
      this.popoverSubscriptions.push(
        () => openedSub.unsubscribe(),
        () => closedSub.unsubscribe(),
      );
    }
    this.setupResizeObserver();
  }

  private setupResizeObserver(): void {
    // SECURITY_EXCEPTION: nativeElement access needed to measure trigger content width for auto display mode. ResizeObserver is SSR-safe (guarded by typeof check). offsetWidth is read-only, no XSS risk.
    const el = this.triggerContentRef?.nativeElement;
    if (!el) return;

    this.triggerWidth.set(el.offsetWidth);

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver?.disconnect();
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.triggerWidth.set(entry.contentRect.width);
        }
      });
      this.resizeObserver.observe(el);
    }
  }

  protected onPanelOpened(): void {
    this.searchQuery.set('');
    this.panelOpen.set(true);
    this.setOptionsSelectedState();
    this.syncActiveStates();
    this.syncVisibility();
    this.opened.emit();
    this.openChange.emit(true);
    this.setConnectedSide('bottom');

    if (this.searchable()) {
      requestAnimationFrame(() => {
        // SECURITY_EXCEPTION: nativeElement.focus() required to focus search input when panel opens. Standard DOM method.
        this.searchInputRef?.nativeElement.focus();
      });
    }
  }

  protected onPanelClosed(): void {
    this.panelOpen.set(false);
    this.searchQuery.set('');
    this.syncVisibility();
    this.closed.emit();
    this.openChange.emit(false);
    this.markAsTouched();
    this.clearConnectedSide();
  }

  private setConnectedSide(side: 'bottom' | 'top'): void {
    // SECURITY_EXCEPTION: nativeElement required to access form-field DOM for connected-side sync. ElementRef SSR-safe.
    const el = this.formFieldElement?.nativeElement;
    if (el) {
      // SECURITY_EXCEPTION: nativeElement.querySelector required to find control-wrapper for connected-side sync.
      const wrapper = el.querySelector<HTMLElement>(
        '.solaris-form-field__control-wrapper',
      );
      if (wrapper) {
        wrapper.dataset['connectedSide'] = side;
      }
    }
  }

  private clearConnectedSide(): void {
    // SECURITY_EXCEPTION: nativeElement required to access form-field DOM for connected-side cleanup. ElementRef SSR-safe.
    const el = this.formFieldElement?.nativeElement;
    if (el) {
      const wrapper = el.querySelector<HTMLElement>(
        '.solaris-form-field__control-wrapper',
      );
      if (wrapper) {
        delete wrapper.dataset['connectedSide'];
      }
    }
  }

  protected toggleOption(option: SolarisOptionComponent): void {
    if (option.isEffectivelyDisabled()) return;

    const value = this.internalValue();
    const optValue = option.value();
    const comp = this.compareWith();
    const idx = value.findIndex((v) => comp(v, optValue));

    let newValue: unknown[];
    if (idx >= 0) {
      newValue = [...value.slice(0, idx), ...value.slice(idx + 1)];
    } else {
      newValue = [...value, optValue];
    }

    this.internalValue.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
    this.selectionChange.emit(option);
    this.setOptionsSelectedState();

    if (this.searchable() && this.panelOpen()) {
      requestAnimationFrame(() => {
        // SECURITY_EXCEPTION: nativeElement.focus() required to restore focus to search input after selection. ElementRef SSR-safe.
        this.searchInputRef?.nativeElement.focus();
      });
    }
  }

  protected clearValue(): void {
    this.internalValue.set([]);
    this.onChange([]);
    this.valueChange.emit([]);
    this.selectionChange.emit(undefined as unknown as SolarisOptionComponent);
    this.cleared.emit();
    this.setOptionsSelectedState();
    this.markAsTouched();
  }

  protected handleSelectAll(): void {
    if (this.isEffectivelyReadonly() || this.isEffectivelyDisabled()) return;
    const selectable = this.selectableOptions();
    if (selectable.length === 0) return;

    const value = this.internalValue();
    const comp = this.compareWith();

    if (this.isAllSelected()) {
      const selectableValues = new Set(selectable.map((o) => o.value()));
      const newValue = value.filter((v) => {
        for (const sv of selectableValues) {
          if (comp(v, sv)) return false;
        }
        return true;
      });
      this.internalValue.set(newValue);
      this.onChange(newValue);
      this.valueChange.emit(newValue);
    } else {
      const existingValues = new Set(value);
      const newValues: unknown[] = [...value];
      selectable.forEach((opt) => {
        const ov = opt.value();
        let found = false;
        for (const ev of existingValues) {
          if (comp(ev, ov)) {
            found = true;
            break;
          }
        }
        if (!found) {
          newValues.push(ov);
        }
      });
      this.internalValue.set(newValues);
      this.onChange(newValues);
      this.valueChange.emit(newValues);
    }

    this.setOptionsSelectedState();
  }

  protected removeChip(option: SolarisOptionComponent, event: Event): void {
    event.stopPropagation();
    this.toggleOption(option);
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (!this.canOpen()) {
      event.preventDefault();
      return;
    }

    if (this.maybeClosePanel(event)) return;
    if (this.maybeNavigateToBound(event)) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.handleToggleOpen();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.handleArrow(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.handleArrow(-1);
        break;
    }
  }

  private handleToggleOpen(): void {
    if (this.panelOpen()) {
      this.selectActiveOption();
    } else {
      this.popoverTrigger?.open();
    }
  }

  private handleArrow(direction: 1 | -1): void {
    if (this.panelOpen()) {
      this.focusNextOption(direction);
    } else {
      this.popoverTrigger?.open();
      requestAnimationFrame(() => this.focusNextOption(direction));
    }
  }

  private maybeClosePanel(event: KeyboardEvent): boolean {
    if (!this.panelOpen()) return false;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.popoverTrigger?.close();
      return true;
    }
    if (event.key === 'Tab') {
      this.popoverTrigger?.close();
      return true;
    }
    return false;
  }

  private maybeNavigateToBound(event: KeyboardEvent): boolean {
    if (!this.panelOpen()) return false;
    if (event.key === 'Home') {
      event.preventDefault();
      this.activeOptionIndex.set(this.getFirstEnabledOptionIndex());
      this.syncActiveStates();
      return true;
    }
    if (event.key === 'End') {
      event.preventDefault();
      this.activeOptionIndex.set(this.getLastEnabledOptionIndex());
      this.syncActiveStates();
      return true;
    }
    return false;
  }

  protected onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.searchQuery.set(value);
    this.searchChange.emit(value);
    this.activeOptionIndex.set(-1);
    this.syncActiveStates();
    this.syncVisibility();
  }

  protected onSearchKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        this.focusNextOption(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        this.focusNextOption(-1);
        break;
      case 'Enter':
        event.preventDefault();
        event.stopPropagation();
        this.selectActiveOption();
        break;
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        if (this.searchQuery()) {
          this.searchQuery.set('');
          this.searchChange.emit('');
          this.syncVisibility();
          this.syncActiveStates();
        } else {
          this.popoverTrigger?.close();
        }
        break;
      case 'Tab':
        this.popoverTrigger?.close();
        break;
      case 'Backspace':
        if (
          !this.searchQuery() &&
          !this.isEffectivelyDisabled() &&
          !this.isEffectivelyReadonly()
        ) {
          event.preventDefault();
          const selected = this.selectedOptions();
          if (selected.length > 0) {
            this.toggleOption(selected[selected.length - 1]);
          }
        }
        break;
    }
  }

  protected onPanelClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  protected onPanelKeydown(event: KeyboardEvent): void {
    event.stopPropagation();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextOption(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusNextOption(-1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectActiveOption();
        break;
      case 'Escape':
        event.preventDefault();
        this.popoverTrigger?.close();
        break;
      case 'Home':
        event.preventDefault();
        this.activeOptionIndex.set(this.getFirstEnabledOptionIndex());
        break;
      case 'End':
        event.preventDefault();
        this.activeOptionIndex.set(this.getLastEnabledOptionIndex());
        break;
    }
  }

  protected onTriggerFocus(): void {
    this.internalFocused.set(true);
  }

  protected onTriggerBlur(): void {
    this.internalFocused.set(false);
  }

  private subscribeToOptionInteractions(): void {
    this.optionInteractionSubscriptions.forEach((fn) => fn());
    this.optionInteractionSubscriptions = [];
    this.options.forEach((opt) => {
      const sub = opt.optionInteraction.subscribe(({ option }) => {
        this.toggleOption(option);
      });
      this.optionInteractionSubscriptions.push(() => sub.unsubscribe());
    });
  }

  protected setOptionsMultiSelectMode(): void {
    this.options.forEach((opt) => {
      opt.setSelectionMode('multiple');
      opt.setShowSelectionIndicator(true);
    });
  }

  protected setOptionsSelectedState(): void {
    const value = this.internalValue();
    const comp = this.compareWith();
    this.options.forEach((opt) => {
      const isSelected = value.some((v) => comp(opt.value(), v));
      opt.setSelected(isSelected);
    });
  }

  private setOptionGroupDisabledState(): void {
    this.optionGroups.forEach((group) => {
      group.options.forEach((opt) => {
        opt.setGroupDisabledState(group.isEffectivelyDisabled());
      });
    });
  }

  private syncActiveStates(): void {
    const idx = this.activeOptionIndex();
    const opts = this.visibleOptions();
    this.options.forEach((opt) => opt.setActive(false));
    if (idx >= 0 && idx < opts.length) {
      opts[idx].setActive(true);
    }
  }

  private syncVisibility(): void {
    const query = this.searchQuery().trim();
    if (!query) {
      this.options.forEach((o) => o.setHidden(false));
      this.optionGroups.forEach((g) => g.setHidden(false));
      return;
    }
    const visible = new Set(this.visibleOptions());
    this.options.forEach((o) => o.setHidden(!visible.has(o)));
    this.optionGroups.forEach((g) => {
      const anyVisible = g.options.some((o) => visible.has(o));
      g.setHidden(!anyVisible);
    });
  }

  protected getOptionDisplayLabel(option: SolarisOptionComponent): string {
    const dw = this.displayWith();
    if (dw) {
      const result = dw(option.value());
      if (result !== undefined) return result;
    }
    const label = option.labelText();
    if (label) return label;
    const native = this.getOptionNativeText(option);
    if (native) return native;
    return '';
  }

  private getOptionNativeText(option: SolarisOptionComponent): string {
    const nativeEl = (
      option as unknown as { elementRef: ElementRef<HTMLElement> }
    ).elementRef;
    // SECURITY_EXCEPTION: nativeElement access needed to read option text for search filtering. Read-only, SSR-safe.
    if (nativeEl?.nativeElement) {
      // SECURITY_EXCEPTION: nativeElement.textContent needed to read option text for search filtering. Read-only, SSR-safe.
      return nativeEl.nativeElement.textContent?.trim() || '';
    }
    return '';
  }

  protected optionMatchesSearch(
    option: SolarisOptionComponent,
    query: string,
  ): boolean {
    const label = (option.labelText() || '').toLowerCase();
    const desc = (option.descriptionText() || '').toLowerCase();
    const native = this.getOptionNativeText(option).toLowerCase();
    const normalizedQuery = query
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const normalizedLabel = label
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const normalizedDesc = desc
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const normalizedNative = native
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return (
      normalizedLabel.includes(normalizedQuery) ||
      normalizedDesc.includes(normalizedQuery) ||
      normalizedNative.includes(normalizedQuery)
    );
  }

  private markAsTouched(): void {
    if (!this.touched()) {
      this.touched.set(true);
      this.onTouched();
    }
  }

  private selectActiveOption(): void {
    const idx = this.activeOptionIndex();
    const opts = this.visibleOptions();
    if (idx >= 0 && idx < opts.length) {
      this.toggleOption(opts[idx]);
    }
  }

  private focusNextOption(direction: 1 | -1): void {
    const opts = this.visibleOptions();
    if (opts.length === 0) return;

    let current = this.activeOptionIndex();

    if (current < 0 || current >= opts.length) {
      current = direction === 1 ? -1 : opts.length;
    }

    let next = current + direction;

    while (next >= 0 && next < opts.length) {
      if (!opts[next].isEffectivelyDisabled()) {
        this.activeOptionIndex.set(next);
        this.syncActiveStates();
        return;
      }
      next += direction;
    }

    if (direction === 1 && next >= opts.length) {
      this.activeOptionIndex.set(this.getFirstEnabledOptionIndex());
      this.syncActiveStates();
    } else if (direction === -1 && next < 0) {
      this.activeOptionIndex.set(this.getLastEnabledOptionIndex());
      this.syncActiveStates();
    }
  }

  private getFirstEnabledOptionIndex(): number {
    const opts = this.visibleOptions();
    for (let i = 0; i < opts.length; i++) {
      if (!opts[i].isEffectivelyDisabled()) return i;
    }
    return -1;
  }

  private getLastEnabledOptionIndex(): number {
    const opts = this.visibleOptions();
    for (let i = opts.length - 1; i >= 0; i--) {
      if (!opts[i].isEffectivelyDisabled()) return i;
    }
    return -1;
  }
}
