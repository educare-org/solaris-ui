import {
  Component,
  input,
  computed,
  signal,
  output,
  effect,
  forwardRef,
  inject,
  contentChild,
  contentChildren,
  viewChild,
  ElementRef,
  AfterContentInit,
  AfterViewInit,
  OnDestroy,
  isDevMode,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import {
  SolarisFormPrefixDirective,
  SolarisFormFieldTriggerDirective,
  SolarisFormFieldComponent,
  SolarisFormSuffixActionDirective,
} from '../../form-field';
import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisOptionGroupComponent } from '../../option-group';
import { SolarisOptionComponent } from '../../option';
import { SOLARIS_OPTION_PARENT } from '../../option/token/option.tokens';
import { SolarisIconComponent } from '../../../icon';
import {
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
} from '../../../interaction/popover';
import { nextIdFor, resolveElementId } from '../../../../core';

import type {
  SolarisSelectAppearance,
  SolarisSelectDensity,
  SolarisSelectRadius,
  SolarisSelectSize,
} from '../model/select.types';
import type { SolarisIconName } from '../../../../services/icon';

@Component({
  selector: 'solaris-select',
  standalone: true,
  imports: [
    SolarisFormFieldComponent,
    SolarisFormFieldTriggerDirective,
    SolarisFormPrefixDirective,
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
    {
      provide: SOLARIS_OPTION_PARENT,
      useExisting: forwardRef(() => SolarisSelectComponent),
    },
  ],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'solaris-select': '',
    '[attr.id]': 'elementId()',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-open]': 'panelOpen() ? "" : null',
    '[attr.aria-label]': 'ariaLabelText() ?? null',
    '[attr.data-has-value]': 'hasValue() ? "" : null',
  },
})
export class SolarisSelectComponent
  extends SolarisFormControl
  implements ControlValueAccessor, AfterContentInit, AfterViewInit, OnDestroy
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  protected readonly parentFormField = inject(SolarisFormFieldComponent, {
    optional: true,
  });

  protected readonly popoverTrigger = viewChild(SolarisPopoverTriggerDirective);

  protected readonly searchInputRef =
    viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected readonly triggerElement =
    viewChild<ElementRef<HTMLElement>>('triggerEl');

  protected readonly options = contentChildren(SolarisOptionComponent, {
    descendants: true,
  });

  protected readonly projectedSuffixAction = contentChild(
    SolarisFormSuffixActionDirective,
    { descendants: true },
  );

  protected readonly optionGroups = contentChildren(
    SolarisOptionGroupComponent,
    {
      descendants: true,
    },
  );

  readonly hint = input<string>();
  readonly prefix = input<SolarisIconName>();
  readonly suffix = input<SolarisIconName>();
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
  readonly clearLabel = input<string>();
  readonly clearLabelKey = input<string>();
  readonly value = input<unknown>(undefined);
  readonly searchable = input<boolean>(false);
  readonly searchPlaceholderKey = input<string>();
  readonly panelMinWidth = input<string | number>();
  readonly panelMaxWidth = input<string | number>();
  readonly density = input<SolarisSelectDensity>();
  readonly size = input<SolarisSelectSize>('md');
  readonly panelMatchTriggerWidth = input<boolean>(true);
  readonly radius = input<SolarisSelectRadius>('sm');
  readonly disabledInput = input(false, { alias: 'disabled' });
  readonly readonlyInput = input(false, { alias: 'readonly' });
  readonly requiredInput = input(false, { alias: 'required' });
  readonly panelMaxHeight = input<string | number>('320px');
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

  protected readonly panelId = nextIdFor('solaris-select-panel');
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
  private optionInteractionSubscriptions: (() => void)[] = [];
  private readonly popoverSubscriptions: (() => void)[] = [];

  protected readonly elementId = computed(() => {
    return resolveElementId(this.elementRef, 'solaris-select');
  });

  protected readonly themeService = inject(SolarisThemeService);

  readonly effectiveDensity = computed<SolarisSelectDensity>(() => {
    return this.density() ?? this.themeService.density;
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

  private getRowLabel(option: SolarisOptionComponent): string {
    const label = option.labelText();
    if (label) return label;
    return this.getOptionNativeText(option);
  }

  protected readonly contentMinWidth = computed(() => {
    const opts = this.options();
    if (!opts || opts.length === 0) return 0;
    let longest = 0;
    for (const opt of opts) {
      longest = Math.max(longest, this.getRowLabel(opt).length);
    }
    if (longest === 0) return 0;
    const charWidth = this.size() === 'sm' ? 8 : this.size() === 'lg' ? 10 : 9;
    return Math.ceil(longest * charWidth * 1.15 + 50);
  });

  protected readonly effectivePanelMinWidth = computed(() => {
    const input = this.panelMinWidth();
    if (input !== undefined) return input;
    const floor = this.contentMinWidth();
    return floor > 0 ? floor : undefined;
  });

  protected readonly selectedOption = computed<
    SolarisOptionComponent | undefined
  >(() => {
    const value = this.internalValue();
    const comp = this.compareWith();
    const opts = this.options();
    if (!opts || value === undefined || value === null) {
      return undefined;
    }
    return opts.find((opt) => comp(opt.value(), value));
  });

  protected readonly displayText = computed(() => {
    const dw = this.displayWith();
    const val = this.internalValue();

    if (dw && val !== undefined && val !== null) {
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
    const key = this.clearLabelKey();
    if (key) {
      return this.translateService.translate(key);
    }
    const text = this.clearLabel();
    if (text) {
      return text;
    }
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
    const opts = this.options();
    if (!opts) return [];
    if (!this.panelOpen()) return [];
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return opts;
    return opts.filter((opt) => {
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
    const opts = this.options();
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
    const triggerEl = this.triggerElement();
    if (triggerEl) {
      // SECURITY_EXCEPTION: programmatic focus requires the native method; no declarative alternative exists.
      triggerEl.nativeElement.focus();
    } else {
      // SECURITY_EXCEPTION: fallback focus on the host requires the native method.
      this.elementRef.nativeElement.focus();
    }
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
      this.options();
      this.optionGroups();
      this.setOptionsSelectedState();
      this.setOptionGroupDisabledState();
      this.syncVisibility();
      this.subscribeToOptionInteractions();
    });
  }

  ngAfterContentInit(): void {
    this.optionsInitialized.set(true);
    this.setOptionsSelectedState();
    this.setOptionGroupDisabledState();
    this.syncActiveOptionToSelected();
    this.syncActiveStates();
    this.syncVisibility();
    this.subscribeToOptionInteractions();

    if (isDevMode() && this.parentFormField) {
      console.warn(
        'SolarisSelectComponent already includes SolarisFormField internally. ' +
          'Do not wrap it with <solaris-form-field>; pass label, hint, error, prefix and suffix directly to <solaris-select>.',
      );
    }
  }

  ngAfterViewInit(): void {
    const trigger = this.popoverTrigger();
    if (trigger) {
      const openedSub = trigger.solarisPopoverOpened.subscribe(() => {
        this.onPanelOpened();
      });
      const closedSub = trigger.solarisPopoverClosed.subscribe(() => {
        this.onPanelClosed();
      });
      this.popoverSubscriptions.push(
        () => openedSub.unsubscribe(),
        () => closedSub.unsubscribe(),
      );
    }
  }

  ngOnDestroy(): void {
    this.optionInteractionSubscriptions.forEach((fn) => fn());
    this.popoverSubscriptions.forEach((fn) => fn());
  }

  protected onPanelOpened(): void {
    this.searchQuery.set('');
    this.panelOpen.set(true);
    this.setOptionsSelectedState();
    this.syncActiveOptionToSelected();
    this.syncActiveStates();
    this.syncVisibility();
    this.opened.emit();
    this.openChange.emit(true);

    if (this.searchable()) {
      requestAnimationFrame(() => {
        // SECURITY_EXCEPTION: focusing the search input when the panel opens requires the native method.
        this.searchInputRef()?.nativeElement.focus();
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
  }

  protected selectOption(option: SolarisOptionComponent): void {
    if (option.isEffectivelyDisabled()) return;
    const newValue = option.value();
    this.internalValue.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
    this.selectionChange.emit(option);
    this.setOptionsSelectedState();
    this.popoverTrigger()?.close();
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
      this.popoverTrigger()?.open();
    }
  }

  private handleArrow(direction: 1 | -1): void {
    if (this.panelOpen()) {
      this.focusNextOption(direction);
    } else {
      this.popoverTrigger()?.open();
      requestAnimationFrame(() => this.focusNextOption(direction));
    }
  }

  private maybeClosePanel(event: KeyboardEvent): boolean {
    if (!this.panelOpen()) return false;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.popoverTrigger()?.close();
      return true;
    }
    if (event.key === 'Tab') {
      this.popoverTrigger()?.close();
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
          this.popoverTrigger()?.close();
        }
        break;
      case 'Tab':
        this.popoverTrigger()?.close();
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
        this.popoverTrigger()?.close();
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
    this.options().forEach((opt) => {
      const sub = opt.optionInteraction.subscribe(({ option }) => {
        this.selectOption(option);
      });
      this.optionInteractionSubscriptions.push(() => sub.unsubscribe());
    });
  }

  protected setOptionsSelectedState(): void {
    const value = this.internalValue();
    const comp = this.compareWith();
    this.options().forEach((opt) => {
      const isSelected = comp(opt.value(), value);
      opt.setSelected(isSelected);
    });
  }

  private setOptionGroupDisabledState(): void {
    this.optionGroups().forEach((group) => {
      group.options().forEach((opt) => {
        opt.setGroupDisabledState(group.isEffectivelyDisabled());
      });
    });
  }

  private syncActiveStates(): void {
    const idx = this.activeOptionIndex();
    const opts = this.visibleOptions();
    this.options().forEach((opt) => opt.setActive(false));
    if (idx >= 0 && idx < opts.length) {
      opts[idx].setActive(true);
    }
  }

  private syncVisibility(): void {
    const query = this.searchQuery().trim();
    if (!query) {
      this.options().forEach((o) => o.setHidden(false));
      this.optionGroups().forEach((g) => g.setHidden(false));
      return;
    }
    const visible = new Set(this.visibleOptions());
    this.options().forEach((o) => o.setHidden(!visible.has(o)));
    this.optionGroups().forEach((g) => {
      const anyVisible = g.options().some((o) => visible.has(o));
      g.setHidden(!anyVisible);
    });
  }

  private syncActiveOptionToSelected(): void {
    const selected = this.selectedOption();
    if (selected) {
      const opts = this.options();
      const idx = opts.indexOf(selected);
      this.activeOptionIndex.set(idx >= 0 ? idx : -1);
    } else {
      this.activeOptionIndex.set(-1);
    }
    this.syncActiveStates();
  }

  private getOptionNativeText(option: SolarisOptionComponent): string {
    const nativeEl = (
      option as unknown as { elementRef: ElementRef<HTMLElement> }
    ).elementRef;
    // SECURITY_EXCEPTION: reading projected option text for search filtering requires the native textContent. Read-only.
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
