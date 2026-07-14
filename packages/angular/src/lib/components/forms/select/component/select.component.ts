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
  OnDestroy,
  isDevMode,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisOptionComponent } from '../../option';
import { SolarisOptionGroupComponent } from '../../option-group';
import { SolarisIconComponent } from '../../../icon';
import {
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
} from '../../../interaction/popover';

import type {
  SolarisSelectAppearance,
  SolarisSelectSize,
  SolarisSelectDensity,
  SolarisSelectRadius,
} from '../model/select.types';

let nextId = 0;

function generateId(): string {
  return `solaris-select-${++nextId}`;
}

@Component({
  selector: 'solaris-select',
  standalone: true,
  imports: [
    SolarisIconComponent,
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisSelectComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisSelectComponent),
    },
  ],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  host: {
    role: 'combobox',
    'solaris-select': '',
    '[attr.id]': 'elementId()',
    '(blur)': 'onTriggerBlur()',
    '(focus)': 'onTriggerFocus()',
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'radius()',
    '[attr.aria-haspopup]': '"listbox"',
    '(keydown)': 'onTriggerKeydown($event)',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-open]': 'panelOpen() ? "" : null',
    '[attr.aria-label]': 'ariaLabelText() ?? null',
    '[attr.data-has-value]': 'hasValue() ? "" : null',
    '[tabindex]': 'isEffectivelyDisabled() ? "-1" : "0"',
    '[attr.aria-activedescendant]': 'activeDescendantId()',
    '[attr.aria-controls]': 'panelOpen() ? panelId : null',
    '[attr.aria-labelledby]': 'ariaLabelledbyText() ?? null',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.aria-expanded]': 'panelOpen() ? "true" : "false"',
    '[attr.data-invalid]': 'isEffectivelyInvalid() ? "" : null',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[attr.data-readonly]': 'isEffectivelyReadonly() ? "" : null',
  },
})
export class SolarisSelectComponent
  extends SolarisFormControl
  implements ControlValueAccessor, AfterContentInit, AfterViewInit, OnDestroy
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);

  @ViewChild(SolarisPopoverTriggerDirective)
  protected popoverTrigger?: SolarisPopoverTriggerDirective;

  @ViewChild('searchInput', { read: ElementRef })
  protected searchInputRef?: ElementRef<HTMLInputElement>;

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
  readonly noResultsText = input<string>();
  readonly placeholderKey = input<string>();
  readonly loadingTextKey = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly noResultsTextKey = input<string>();
  readonly loading = input<boolean>(false);
  readonly searchPlaceholder = input<string>();
  readonly clearable = input<boolean>(false);
  readonly value = input<unknown>(undefined);
  readonly searchable = input<boolean>(false);
  readonly searchPlaceholderKey = input<string>();
  readonly panelMinWidth = input<string | number>();
  readonly panelMaxWidth = input<string | number>();
  readonly density = input<SolarisSelectDensity>();
  readonly size = input<SolarisSelectSize>('md');
  readonly panelMatchTriggerWidth = input<boolean>(true);
  readonly radius = input<SolarisSelectRadius>('md');
  readonly disabledInput = input(false, { alias: 'disabled' });
  readonly readonlyInput = input(false, { alias: 'readonly' });
  readonly requiredInput = input(false, { alias: 'required' });
  readonly panelMaxHeight = input<string | number>('20rem');
  readonly displayWith = input<(value: unknown) => string | undefined>();
  readonly appearance = input<SolarisSelectAppearance>('outline');
  readonly compareWith = input<(a: unknown, b: unknown) => boolean>(Object.is);
  readonly manualInvalid = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });

  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly cleared = output<void>();
  readonly openChange = output<boolean>();
  readonly searchChange = output<string>();
  readonly valueChange = output<unknown>();
  readonly selectionChange = output<SolarisOptionComponent | undefined>();

  protected readonly panelId = `solaris-select-panel-${generateId()}`;
  protected readonly panelOpen = signal(false);
  protected readonly internalValue = signal<unknown>(undefined);
  protected readonly internalFocused = signal(false);
  protected readonly internalDisabled = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly activeOptionIndex = signal(-1);
  protected readonly touched = signal(false);
  protected readonly optionsInitialized = signal(false);

  private onChange: (value: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private optionsSubscription: (() => void) | undefined;
  private optionInteractionSubscriptions: (() => void)[] = [];
  private readonly popoverSubscriptions: (() => void)[] = [];

  protected readonly elementId = computed(() => {
    const existing = this.elementRef.nativeElement.getAttribute('id');
    return existing ?? generateId();
  });

  protected readonly effectiveDensity = computed<SolarisSelectDensity>(() => {
    return this.density() ?? 'comfortable';
  });

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
    return this.requiredInput() && this.touched() && !this.hasValue();
  });

  protected readonly popoverAppearance = computed(() => {
    const a = this.appearance();
    return a === 'filled' ? 'surface' : a;
  });

  protected readonly canOpen = computed(() => {
    return !this.isEffectivelyDisabled() && !this.isEffectivelyReadonly();
  });

  protected readonly hasValue = computed(() => {
    return this.internalValue() !== undefined && this.internalValue() !== null;
  });

  protected readonly canClear = computed(() => {
    return (
      this.clearable() &&
      this.hasValue() &&
      !this.isEffectivelyDisabled() &&
      !this.isEffectivelyReadonly()
    );
  });

  protected readonly selectedOption = computed<
    SolarisOptionComponent | undefined
  >(() => {
    const value = this.internalValue();
    const comp = this.compareWith();
    const opts = this.options;
    if (!opts || value === undefined || value === null) {
      return undefined;
    }
    return opts.find((opt) => comp(opt.value(), value));
  });

  protected readonly displayText = computed(() => {
    const dw = this.displayWith();
    const val = this.internalValue();

    if (dw) {
      const result = dw(val);
      if (result !== undefined) {
        return result;
      }
    }

    const selected = this.selectedOption();
    if (selected) {
      const label = selected.labelText();
      if (label) {
        return label;
      }
      const nativeText = this.getOptionNativeText(selected);
      if (nativeText) {
        return nativeText;
      }
    }

    if (val !== undefined && val !== null) {
      const str = String(val);
      if (str !== '[object Object]') {
        return str;
      }
      if (isDevMode()) {
        console.warn(
          `[SolarisSelect] No displayWith provided for object value. Use displayWith input to show a readable label.`,
        );
      }
    }

    return '';
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
    return this.translateService.translate('solaris.select.search.placeholder');
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
    return this.translateService.translate('solaris.select.loading');
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
    return this.translateService.translate('solaris.select.empty');
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
    return this.translateService.translate('solaris.select.noResults');
  });

  protected readonly clearAriaLabel = computed(() => {
    return this.translateService.translate('solaris.select.clear');
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
    this.elementRef.nativeElement.focus();
  }

  writeValue(safe: unknown): void {
    this.internalValue.set(safe);
  }

  registerOnChange(fn: (value: unknown) => void): void {
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
  }

  ngAfterContentInit(): void {
    this.optionsInitialized.set(true);
    this.setOptionsSelectedState();
    this.setOptionGroupDisabledState();
    this.syncActiveOptionToSelected();
    this.subscribeToOptionInteractions();

    const optionsSub = this.options.changes.subscribe(() => {
      this.setOptionsSelectedState();
      this.setOptionGroupDisabledState();
      this.subscribeToOptionInteractions();
    });
    this.optionsSubscription = () => optionsSub.unsubscribe();
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
  }

  ngOnDestroy(): void {
    this.optionsSubscription?.();
    this.optionInteractionSubscriptions.forEach((fn) => fn());
    this.popoverSubscriptions.forEach((fn) => fn());
  }

  protected onPanelOpened(): void {
    this.searchQuery.set('');
    this.panelOpen.set(true);
    this.setOptionsSelectedState();
    this.syncActiveOptionToSelected();
    this.opened.emit();
    this.openChange.emit(true);

    if (this.searchable()) {
      requestAnimationFrame(() => {
        this.searchInputRef?.nativeElement.focus();
      });
    }
  }

  protected onPanelClosed(): void {
    this.panelOpen.set(false);
    this.searchQuery.set('');
    this.closed.emit();
    this.openChange.emit(false);
    this.markAsTouched();
  }

  protected selectOption(option: SolarisOptionComponent): void {
    if (option.isEffectivelyDisabled()) return;
    const newValue = option.value();
    this.internalValue.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
    this.selectionChange.emit(option);
    this.setOptionsSelectedState();
    this.popoverTrigger?.close();
  }

  protected clearValue(): void {
    this.internalValue.set(null);
    this.onChange(null);
    this.valueChange.emit(null);
    this.selectionChange.emit(undefined);
    this.cleared.emit();
    this.setOptionsSelectedState();
    this.markAsTouched();
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
      return true;
    }
    if (event.key === 'End') {
      event.preventDefault();
      this.activeOptionIndex.set(this.getLastEnabledOptionIndex());
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
        } else {
          this.popoverTrigger?.close();
        }
        break;
      case 'Tab':
        this.popoverTrigger?.close();
        break;
    }
  }

  protected onPanelClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  protected onPanelKeydown(event: KeyboardEvent): void {
    event.stopPropagation();
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
        this.selectOption(option);
      });
      this.optionInteractionSubscriptions.push(() => sub.unsubscribe());
    });
  }

  protected setOptionsSelectedState(): void {
    const value = this.internalValue();
    const comp = this.compareWith();
    this.options.forEach((opt) => {
      const isSelected = comp(opt.value(), value);
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

  private syncActiveOptionToSelected(): void {
    const selected = this.selectedOption();
    if (selected) {
      const opts = this.options.toArray();
      const idx = opts.indexOf(selected);
      this.activeOptionIndex.set(idx >= 0 ? idx : -1);
    } else {
      this.activeOptionIndex.set(-1);
    }
  }

  private getOptionNativeText(option: SolarisOptionComponent): string {
    const nativeEl = (
      option as unknown as { elementRef: ElementRef<HTMLElement> }
    ).elementRef;
    if (nativeEl?.nativeElement) {
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
      this.selectOption(opts[idx]);
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
        return;
      }
      next += direction;
    }

    if (direction === 1 && next >= opts.length) {
      this.activeOptionIndex.set(this.getFirstEnabledOptionIndex());
    } else if (direction === -1 && next < 0) {
      this.activeOptionIndex.set(this.getLastEnabledOptionIndex());
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
