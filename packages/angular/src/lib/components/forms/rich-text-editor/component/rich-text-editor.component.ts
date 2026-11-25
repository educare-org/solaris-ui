import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  booleanAttribute,
  ChangeDetectionStrategy,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  isDevMode,
  model,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import {
  SOLARIS_FORM_FIELD,
  SolarisFormFieldComponent,
} from '../../form-field';
import { resolveElementId } from '../../../../core';
import { SolarisThemeService } from '../../../../services/theme';
import {
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '../../../../services/translation';
import { SolarisIconComponent } from '../../../icon';
import { SolarisTooltipDirective } from '../../../interaction/tooltip';
import {
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
} from '../../../interaction/popover';
import { SolarisInputDirective } from '../../input';
import { SolarisButtonDirective } from '../../../actions/button';
import { SolarisButtonGroupComponent } from '../../../actions/button-group';
import { SolarisIconButtonDirective } from '../../../actions/icon-button';
import {
  SolarisDropdownMenuComponent,
  SolarisDropdownMenuItemComponent,
  SolarisDropdownMenuTriggerDirective,
} from '../../../interaction/dropdown-menu';
import { SolarisDividerComponent } from '../../../data-display/divider';
import { SolarisSelectComponent } from '../../select';
import { SolarisOptionComponent } from '../../option';
import {
  accumulateActiveElement,
  buildBlockHtml,
  buildDataSpanHtml,
  buildImageFigureHtml,
  buildLinkHtml,
  buildListHtml,
  buildTableHtml,
  buildTaskListHtml,
  clampImageWidth,
  clampTableDimension,
  cleanCommittedHtml,
  contrastRatio,
  createActiveScan,
  createEmptyValue,
  escapeHtml,
  filterFields,
  getCharCount,
  insertBlockEntry,
  insertMention,
  insertTableBlock,
  isEmptyValue,
  isSafeHttpUrl,
  normalizeEditorValue,
  parseCssRgb,
  parseCssRgba,
  RICH_TEXT_ZERO_WIDTH_SPACE,
  removeHighlightSpans,
  shouldCoalesceHistory,
  stripHtmlToText,
  toPlainText,
  unwrapInlineFormatting,
  validateImageSelection,
} from '../functions/rich-text-editor.utils';
import {
  anchorOf,
  closestTag,
  describeFigureWidth,
  expandRangeToInlineAncestors,
  isEmptyMarker,
  sharedInlineAncestor,
} from '../functions/rich-text-editor.dom';

import type { WritableSignal } from '@angular/core';
import type {
  SolarisRichTextActiveMark,
  SolarisRichTextAppearance,
  SolarisRichTextContentFormat,
  SolarisRichTextDensity,
  SolarisRichTextField,
  SolarisRichTextImageOptions,
  SolarisRichTextImagePreset,
  SolarisRichTextInlineTag,
  SolarisRichTextRadius,
  SolarisRichTextSize,
  SolarisRichTextSubmitTrigger,
  SolarisRichTextToolbarDisplay,
  SolarisRichTextToolbarPreset,
  SolarisRichTextValue,
  SolarisRichTextVariant,
} from '../model/rich-text-editor.types';

import type {
  SolarisRgb,
  SolarisRichTextImageError,
  SolarisRichTextHistoryKind,
  SolarisRichTextAlign,
  SolarisRichTextBlockTag,
  SolarisRichTextColor,
  SolarisRichTextHighlight,
} from '../functions/rich-text-editor.utils';
import {
  SOLARIS_RICH_TEXT_CONTRAST_AA_LARGE_RATIO,
  SOLARIS_RICH_TEXT_CONTRAST_AA_RATIO,
  SOLARIS_RICH_TEXT_FORMAT_SWITCH_DURATION_MS,
  SOLARIS_RICH_TEXT_FORMAT_SWITCH_EASING,
  SOLARIS_RICH_TEXT_HISTORY_IDLE_MS,
  SOLARIS_RICH_TEXT_IMAGE_PRESET_WIDTHS,
  SOLARIS_RICH_TEXT_INLINE_TAG_SHORTCUTS,
  SOLARIS_RICH_TEXT_MAX_HISTORY,
} from '../model/rich-text-editor.defaults';

type RichTextEditorValueInput =
  | SolarisRichTextValue
  | string
  | null
  | undefined;

@Component({
  selector: 'solaris-rich-text-editor',
  standalone: true,
  imports: [
    CommonModule,
    SolarisIconComponent,
    SolarisTooltipDirective,
    SolarisPopoverTriggerDirective,
    SolarisPopoverDirective,
    SolarisFormFieldComponent,
    SolarisInputDirective,
    SolarisButtonDirective,
    SolarisButtonGroupComponent,
    SolarisIconButtonDirective,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuTriggerDirective,
    SolarisDropdownMenuItemComponent,
    SolarisDividerComponent,
    SolarisSelectComponent,
    SolarisOptionComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolarisRichTextEditorComponent),
      multi: true,
    },
    {
      provide: SolarisFormControl,
      useExisting: forwardRef(() => SolarisRichTextEditorComponent),
    },
  ],
  host: {
    class: 'solaris-rich-text-editor',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'effectiveSize()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-format]': 'contentFormat()',
    '[attr.data-focused]': '_focused() ? "" : null',
    '[attr.data-invalid]': 'isEffectivelyInvalid() ? "" : null',
    '[attr.data-in-field]': 'inFormField() ? "" : null',
    '[attr.aria-invalid]': 'isEffectivelyInvalid() ? "true" : null',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
  },
})
export class SolarisRichTextEditorComponent
  extends SolarisFormControl
  implements ControlValueAccessor, AfterViewInit
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);
  private readonly themeService = inject(SolarisThemeService);
  private readonly formField = inject(SOLARIS_FORM_FIELD, { optional: true });

  private readonly editorRef = viewChild<ElementRef<HTMLElement>>('editor');

  private readonly toolbarTooltips = viewChildren(SolarisTooltipDirective);

  private readonly linkPopoverTrigger = viewChild('linkTrigger', {
    read: SolarisPopoverTriggerDirective,
  });

  protected readonly colorPanelOpen = signal(false);

  readonly value = model<SolarisRichTextValue>(createEmptyValue());
  readonly variant = input<SolarisRichTextVariant>('document');
  readonly appearance = input<SolarisRichTextAppearance>('outline');
  readonly size = input<SolarisRichTextSize>('md');
  readonly density = input<SolarisRichTextDensity>();
  readonly radius = input<SolarisRichTextRadius>('md');
  readonly placeholder = input<string>();
  readonly placeholderKey = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelKey = input<string>();
  readonly disabledInput = input<boolean, boolean | string>(false, {
    alias: 'disabled',
    transform: booleanAttribute,
  });
  readonly readonlyInput = input<boolean, boolean | string>(false, {
    alias: 'readonly',
    transform: booleanAttribute,
  });
  readonly requiredInput = input<boolean, boolean | string>(false, {
    alias: 'required',
    transform: booleanAttribute,
  });
  readonly manualInvalid = input<boolean | undefined>(undefined, {
    alias: 'invalid',
  });
  readonly maxLength = input<number>();
  readonly showCharCount = input<boolean>();
  readonly toolbarDisplay = input<SolarisRichTextToolbarDisplay>();
  readonly toolbarPreset = input<SolarisRichTextToolbarPreset>();
  readonly contentFormat = model<SolarisRichTextContentFormat>('rich');
  readonly submitTrigger = input<SolarisRichTextSubmitTrigger>();
  readonly fields = input<readonly SolarisRichTextField[]>([]);
  readonly fieldTrigger = input<'{' | '@'>('{');
  readonly autofocus = input<boolean>(false);
  readonly imageUpload = input<SolarisRichTextImageOptions>();

  readonly htmlChange = output<string>();
  readonly editorFocused = output<void>();
  readonly editorBlurred = output<void>();
  readonly selectionChange = output<void>();
  readonly submitted = output<SolarisRichTextValue>();
  readonly mentionInserted = output<SolarisRichTextField>();
  readonly imageAdded = output<{ url: string; fileName: string }>();
  readonly imageRejected = output<{
    fileName: string;
    error: SolarisRichTextImageError;
  }>();
  readonly imageRemoved = output<void>();
  readonly tableInserted = output<{ rows: number; cols: number }>();

  protected readonly internalDisabled = signal(false);
  protected readonly _focused = signal(false);
  protected readonly touched = signal(false);
  protected readonly dirty = signal(false);
  protected readonly fieldQuery = signal('');
  protected readonly mentionOpen = signal(false);
  protected readonly mentionIndex = signal(0);
  protected readonly linkUrl = signal('');
  protected readonly linkText = signal('');
  protected readonly floatingTop = signal(0);
  protected readonly floatingLeft = signal(0);
  protected readonly floatingVisible = signal(false);
  protected readonly activeMarks = signal<
    Record<SolarisRichTextActiveMark, boolean>
  >({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    link: false,
    bulletList: false,
    orderedList: false,
  });
  protected readonly blockTag = signal<SolarisRichTextBlockTag>('p');
  protected readonly paletteColors: readonly SolarisRichTextColor[] = [
    'default',
    'primaryLight',
    'successLight',
    'warningLight',
    'dangerLight',
    'infoLight',
    'accentLight',
    'cyanLight',
    'pinkLight',
    'violetLight',
    'muted',
    'primary',
    'success',
    'warning',
    'danger',
    'info',
    'accent',
    'cyan',
    'pink',
    'violet',
    'neutralDark',
    'primaryDark',
    'successDark',
    'warningDark',
    'dangerDark',
    'infoDark',
    'accentDark',
    'cyanDark',
    'pinkDark',
    'violetDark',
  ];

  protected readonly highlightColors: readonly SolarisRichTextHighlight[] = [
    'primary',
    'success',
    'warning',
    'danger',
    'info',
    'accent',
    'violet',
    'neutral',
  ];
  protected readonly activeAlign = signal<SolarisRichTextAlign>('left');
  protected readonly activeColor = signal<SolarisRichTextColor>('default');
  protected readonly activeHighlight =
    signal<SolarisRichTextHighlight>('default');
  private readonly historyPast = signal<readonly SolarisRichTextValue[]>([]);
  private readonly historyFuture = signal<readonly SolarisRichTextValue[]>([]);
  private lastHistoryAt: number | null = null;
  private lastHistoryKind: SolarisRichTextHistoryKind | null = null;
  protected readonly imagePanelVisible = signal(false);
  protected readonly imagePanelTop = signal(0);
  protected readonly imagePanelLeft = signal(0);
  protected readonly imageBordered = signal(false);
  private lastRichValue: SolarisRichTextValue | null = null;
  private readonly objectUrls: string[] = [];

  protected readonly effectiveSize = computed<SolarisRichTextSize>(() => {
    const fromField = this.formField?.size() as SolarisRichTextSize | undefined;
    return this.size() ?? fromField ?? 'md';
  });

  protected readonly effectiveDensity = computed<SolarisRichTextDensity>(() => {
    const fromField = this.formField?.effectiveDensity() as
      | SolarisRichTextDensity
      | undefined;
    return this.density() ?? fromField ?? this.themeService.density;
  });

  protected readonly effectiveToolbarDisplay =
    computed<SolarisRichTextToolbarDisplay>(() => {
      const explicit = this.toolbarDisplay();
      if (explicit) return explicit;
      return this.variant() === 'composer' ? 'floating' : 'fixed';
    });

  protected readonly effectiveSubmitTrigger =
    computed<SolarisRichTextSubmitTrigger>(() => {
      const explicit = this.submitTrigger();
      if (explicit) return explicit;
      return this.variant() === 'composer' ? 'enter' : 'ctrl-enter';
    });

  protected readonly showToolbar = computed(
    () => this.effectiveToolbarDisplay() !== 'hidden',
  );

  protected readonly isFloatingToolbar = computed(
    () =>
      this.effectiveToolbarDisplay() === 'floating' ||
      this.effectiveToolbarDisplay() === 'both',
  );

  protected readonly showFloatingToolbar = computed(
    () =>
      this.isFloatingToolbar() &&
      this.contentFormat() === 'rich' &&
      this.floatingVisible() &&
      !this.isEffectivelyDisabled() &&
      !this.readonlyInput(),
  );

  protected readonly placeholderText = computed(() => {
    const key = this.placeholderKey();
    if (key) {
      const translated = this.translateService.translate(key);
      if (translated !== key) return translated;
    }
    return this.placeholder() ?? '';
  });

  protected readonly editorAriaLabel = computed(() => {
    const key = this.ariaLabelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      if (translated !== key) return translated;
    }
    return this.ariaLabel() ?? this.placeholderText() ?? 'Rich text editor';
  });

  protected readonly charCount = computed(() => getCharCount(this.value()));

  protected readonly canUndo = computed(() => this.historyPast().length > 0);

  protected readonly canRedo = computed(() => this.historyFuture().length > 0);

  protected readonly showCount = computed(() => {
    if (this.showCharCount() !== undefined) return this.showCharCount();
    return this.maxLength() !== undefined;
  });

  protected readonly isEffectivelyDisabled = computed(
    () => this.disabledInput() || this.internalDisabled(),
  );

  protected readonly isEffectivelyInvalid = computed(() => {
    const manual = this.manualInvalid();
    if (manual !== undefined) return manual;
    if (this._focused()) return false;
    return (this.touched() || this.dirty()) && this.internalInvalid();
  });

  protected readonly inFormField = computed(() => this.formField !== null);

  private readonly _describedByIds = signal<string[]>([]);

  protected readonly ariaDescribedBy = computed(() => {
    const ids = this._describedByIds();
    return ids.length > 0 ? ids.join(' ') : null;
  });

  protected readonly filteredFields = computed(() =>
    filterFields(this.fields(), this.fieldQuery()),
  );

  protected readonly isEmpty = computed(() => isEmptyValue(this.value()));

  protected readonly internalInvalid = computed(
    () => this.requiredInput() && this.isEmpty(),
  );

  get id(): string {
    return resolveElementId(this.elementRef, 'solaris-rich-text');
  }

  get focused(): boolean {
    return this._focused();
  }

  get disabled(): boolean {
    return this.isEffectivelyDisabled();
  }

  get readonly(): boolean {
    return this.readonlyInput();
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
    const editor = this.editorRef();
    if (editor) {
      editor.nativeElement.focus();
    }
  }

  protected focusToolbar(): void {
    const host = this.elementRef.nativeElement;
    const first = host.querySelector(
      '.solaris-rich-text-toolbar button:not([disabled]), .solaris-rich-text-toolbar select:not([disabled])',
    ) as HTMLElement | null;
    if (first) {
      first.focus();
    }
  }

  @HostListener('click')
  protected dismissToolbarTooltips(): void {
    for (const tooltip of this.toolbarTooltips()) tooltip.close();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: SolarisRichTextValue) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  writeValue(input: RichTextEditorValueInput): void {
    this.value.set(normalizeEditorValue(input));
    this.syncEditorDom();
  }

  submit(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    this.submitted.emit(this.value());
  }

  registerOnChange(fn: (value: SolarisRichTextValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }

  protected onEditorInput(event: Event): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const target = event.target as HTMLElement;
    // SECURITY_EXCEPTION: reading edited HTML requires the native property; same pattern as Angular CDK form controls. Read-only.
    const rawHtml = target.innerHTML ?? '';
    if (this.contentFormat() === 'plain') {
      const text = stripHtmlToText(rawHtml);
      const expected = text.length > 0 ? `<p>${escapeHtml(text)}</p>` : '';
      if (rawHtml !== expected) {
        // SECURITY_EXCEPTION: plain mode normalizes pasted rich HTML to escaped paragraphs; write-only, prevents tag injection.
        target.innerHTML = expected;
      }
      const max = this.maxLength();
      if (max !== undefined && Array.from(text).length > max) return;
      const next: SolarisRichTextValue = {
        html: expected,
        text,
        blocks: this.value().blocks,
        version: 1,
      };
      this.commitValue(next, true, true);
      return;
    }
    const text = stripHtmlToText(rawHtml);
    const max = this.maxLength();
    if (max !== undefined && Array.from(text).length > max) return;
    const next: SolarisRichTextValue = {
      html: rawHtml,
      text,
      blocks: this.value().blocks,
      version: 1,
    };
    this.commitValue(next, true, true);
    this.detectFieldTrigger(text);
  }

  protected onEditorFocus(): void {
    this._focused.set(true);
    this.editorFocused.emit();
  }

  protected onEditorBlur(): void {
    this._focused.set(false);
    this.rememberSelection();
    if (!this.touched()) this.touched.set(true);
    this.onTouched();
    this.editorBlurred.emit();
  }

  ngAfterViewInit(): void {
    if (this.autofocus() && !this.isEffectivelyDisabled()) {
      this.focus();
    }
  }

  protected onEditorKeydown(event: KeyboardEvent): void {
    if (this.handleResizeHandleKey(event)) return;
    if (this.handleLinkShortcut(event)) return;
    if (this.handleListShortcuts(event)) return;
    if (this.handleInlineShortcuts(event)) return;
    if (this.handleToolbarFocusShortcut(event)) return;
    if (this.handleMentionKeys(event)) return;
    if (this.handleSubmitKey(event)) return;
    if (event.key === 'Escape' && this.mentionOpen()) {
      this.mentionOpen.set(false);
    }
  }

  private handleResizeHandleKey(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement | null;
    if (
      target?.closest?.('.solaris-image-resize-handle') &&
      (event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'Escape')
    ) {
      this.onResizeHandleKeydown(event);
      return true;
    }
    return false;
  }

  private handleLinkShortcut(event: KeyboardEvent): boolean {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (!this.isEffectivelyDisabled() && !this.readonlyInput())
        this.openLinkPopover();
      return true;
    }
    return false;
  }

  private handleListShortcuts(event: KeyboardEvent): boolean {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return false;
    if (
      event.code !== 'Digit8' &&
      event.code !== 'Digit7' &&
      event.code !== 'Digit6'
    )
      return false;
    event.preventDefault();
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return true;
    if (event.code === 'Digit8') this.insertList('ul');
    else if (event.code === 'Digit7') this.insertList('ol');
    else this.insertTaskList();
    return true;
  }

  private handleInlineShortcuts(event: KeyboardEvent): boolean {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return false;
    const key = event.key.toLowerCase();
    if (!event.shiftKey) return this.handlePlainShortcuts(event, key);
    if (key !== 's' && key !== 'm' && key !== 'z') return false;
    event.preventDefault();
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return true;
    if (key === 's') this.toggleInline('s');
    else if (key === 'm') this.toggleInlineCode();
    else this.redo();
    return true;
  }

  private handlePlainShortcuts(event: KeyboardEvent, key: string): boolean {
    const tag = SOLARIS_RICH_TEXT_INLINE_TAG_SHORTCUTS[key];
    if (tag === undefined && key !== 'z' && key !== 'y' && key !== '\\')
      return false;
    event.preventDefault();
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return true;
    if (tag !== undefined) this.toggleInline(tag);
    else if (key === 'z') this.undo();
    else if (key === 'y') this.redo();
    else this.clearFormatting();
    return true;
  }

  private handleToolbarFocusShortcut(event: KeyboardEvent): boolean {
    if (event.altKey && event.key === 'F10') {
      event.preventDefault();
      this.focusToolbar();
      return true;
    }
    return false;
  }

  private handleMentionKeys(event: KeyboardEvent): boolean {
    if (!this.mentionOpen() || this.filteredFields().length === 0) return false;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const count = this.filteredFields().length;
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      this.mentionIndex.set((this.mentionIndex() + delta + count) % count);
      return true;
    }
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      const selected = this.filteredFields()[this.mentionIndex()];
      if (selected) {
        event.preventDefault();
        this.insertField(selected);
        return true;
      }
    }
    return false;
  }

  private handleSubmitKey(event: KeyboardEvent): boolean {
    const trigger = this.effectiveSubmitTrigger();
    const isEnter = event.key === 'Enter';
    const withMod = event.ctrlKey || event.metaKey;
    const shouldSubmit =
      (trigger === 'enter' && isEnter && !event.shiftKey) ||
      (trigger === 'ctrl-enter' && isEnter && withMod) ||
      (trigger === 'both' && isEnter && (withMod || !event.shiftKey));
    if (!shouldSubmit) return false;
    event.preventDefault();
    this.submitted.emit(this.value());
    return true;
  }

  protected onEditorKeyup(): void {
    this.refreshSelectionState();
  }

  protected onEditorMouseup(): void {
    this.refreshSelectionState();
  }

  private refreshSelectionState(): void {
    this.selectionChange.emit();
    this.updateActiveStates();
    this.updateFloatingPosition();
    this.syncFigureSelection();
  }

  protected onEditorMousedown(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    const handle = target?.closest?.(
      '.solaris-image-resize-handle',
    ) as HTMLElement | null;
    if (handle) {
      const figure = handle.closest('figure[data-image]') as HTMLElement | null;
      if (figure) this.startFigureResize(event, figure);
      return;
    }
    if (typeof document === 'undefined') return;
    const editor = this.editorRef();
    if (!editor) return;
    const figure = target?.closest?.(
      'figure[data-image]',
    ) as HTMLElement | null;
    if (!figure || !editor.nativeElement.contains(figure)) {
      this.deselectFigure();
      this.syncImagePanel();
      return;
    }
    try {
      event.preventDefault();
      const selection = document.getSelection();
      if (!selection) return;
      const range = document.createRange();
      range.selectNodeContents(figure);
      selection.removeAllRanges();
      selection.addRange(range);
      this.syncFigureSelection();
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Figure select failed.');
    }
  }

  protected onResizeHandleKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const handle = target?.closest?.(
      '.solaris-image-resize-handle',
    ) as HTMLElement | null;
    if (!handle) return;
    const figure = handle.closest('figure[data-image]') as HTMLElement | null;
    if (!figure) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.deselectFigure();
      this.focus();
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    event.stopPropagation();
    const delta =
      (event.shiftKey ? 50 : 10) * (event.key === 'ArrowRight' ? 1 : -1);
    const current =
      figure.getBoundingClientRect().width ||
      Number.parseFloat(figure.style.width) ||
      0;
    this.resizeFigure(figure, current + delta);
    this.emitFromDom();
  }

  private syncFigureSelection(): void {
    if (typeof document === 'undefined') return;
    const editor = this.editorRef();
    if (!editor) return;
    try {
      const target = this.findFigureFromSelection(editor.nativeElement);
      const selected = editor.nativeElement.querySelector(
        'figure[data-image][data-selected]',
      );
      if (selected && selected !== target) {
        selected.removeAttribute('data-selected');
        selected.querySelector('.solaris-image-resize-handle')?.remove();
      }
      if (target && !target.hasAttribute('data-selected')) {
        target.setAttribute('data-selected', '');
        this.attachResizeHandle(target);
      }
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Figure selection failed.');
    }
    this.syncImagePanel();
  }

  private findFigureFromSelection(host: HTMLElement): HTMLElement | null {
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const anchor = selection.anchorNode;
    const el =
      anchor instanceof Element ? anchor : (anchor?.parentElement ?? null);
    const figure = el?.closest?.('figure[data-image]') as HTMLElement | null;
    return figure && host.contains(figure) ? figure : null;
  }

  private attachResizeHandle(target: HTMLElement): void {
    const handle = document.createElement('span');
    handle.className = 'solaris-image-resize-handle';
    handle.setAttribute('contenteditable', 'false');
    handle.setAttribute('role', 'slider');
    handle.setAttribute('tabindex', '0');
    handle.setAttribute(
      'aria-label',
      this.translateService.translate('solaris.rich-text.imageResize'),
    );
    handle.setAttribute('aria-valuemin', '44');
    target.appendChild(handle);
    this.resizeFigure(target, target.getBoundingClientRect().width);
  }

  private deselectFigure(): void {
    const editor = this.editorRef();
    if (!editor || typeof document === 'undefined') return;
    const selected = editor.nativeElement.querySelector(
      'figure[data-image][data-selected]',
    );
    if (selected) {
      selected.removeAttribute('data-selected');
      selected.querySelector('.solaris-image-resize-handle')?.remove();
    }
    try {
      const selection = document.getSelection();
      const range =
        selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const container =
        range?.commonAncestorContainer instanceof Element
          ? range.commonAncestorContainer
          : (range?.commonAncestorContainer.parentElement ?? null);
      const rangedFigure = container?.closest?.('figure[data-image]');
      if (
        range &&
        rangedFigure &&
        editor.nativeElement.contains(rangedFigure)
      ) {
        range.setStartAfter(rangedFigure);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      if (
        this.lastRange &&
        rangedFigure?.contains(this.lastRange.commonAncestorContainer)
      ) {
        this.lastRange = null;
      }
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Figure deselect failed.');
    }
  }

  private resizeFigure(figure: HTMLElement, widthPx: number): void {
    const editor = this.editorRef();
    if (!editor) return;
    const max = Math.max(44, editor.nativeElement.clientWidth - 2);
    const width = clampImageWidth(Math.round(widthPx), 44, max);
    figure.style.width = `${width}px`;
    describeFigureWidth(figure, width, max);
  }

  private selectedFigure(): HTMLElement | null {
    const editor = this.editorRef();
    if (!editor || typeof document === 'undefined') return null;
    return editor.nativeElement.querySelector(
      'figure[data-image][data-selected]',
    );
  }

  protected alignSelectedImage(align: SolarisRichTextAlign): void {
    this.setAlign(align);
    this.updateActiveStates();
    this.syncImagePanel();
  }

  protected applyImagePreset(preset: SolarisRichTextImagePreset): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const editor = this.editorRef();
    const figure = this.selectedFigure();
    if (!editor || !figure) return;
    if (preset === 'original') {
      figure.style.removeProperty('width');
      describeFigureWidth(
        figure,
        Math.round(figure.getBoundingClientRect().width),
        Math.max(44, editor.nativeElement.clientWidth - 2),
      );
    } else {
      this.resizeFigure(
        figure,
        editor.nativeElement.clientWidth *
          SOLARIS_RICH_TEXT_IMAGE_PRESET_WIDTHS[preset],
      );
    }
    this.emitFromDom();
    this.syncImagePanel();
  }

  protected toggleSelectedImageBorder(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const figure = this.selectedFigure();
    if (!figure) return;
    figure.toggleAttribute('data-bordered');
    this.imageBordered.set(figure.hasAttribute('data-bordered'));
    this.emitFromDom();
    this.syncImagePanel();
  }

  protected removeImage(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const figure = this.selectedFigure();
    if (!figure) return;
    figure.remove();
    this.emitFromDom();
    this.imageRemoved.emit();
    this.syncImagePanel();
  }

  @HostListener('keydown.escape')
  protected closeImagePanel(): void {
    this.deselectFigure();
    this.syncImagePanel();
    this.focus();
  }

  protected focusImageHandle(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const handle = this.selectedFigure()?.querySelector<HTMLElement>(
      '.solaris-image-resize-handle',
    );
    handle?.focus();
  }

  protected copySelectedImage(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (typeof document === 'undefined' || typeof navigator === 'undefined')
      return;
    const figure = this.selectedFigure();
    const html = figure?.outerHTML;
    if (!figure || !html || !navigator.clipboard) return;
    try {
      navigator.clipboard.writeText(html).catch(() => {
        if (isDevMode()) console.warn('[SolarisRichText] Image copy failed.');
      });
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Image copy failed.');
    }
  }

  private syncImagePanel(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      this.imagePanelVisible.set(false);
      return;
    }
    const editor = this.editorRef();
    if (!editor) {
      this.imagePanelVisible.set(false);
      return;
    }
    try {
      const figure = editor.nativeElement.querySelector(
        'figure[data-image][data-selected]',
      );
      if (!figure) {
        this.imagePanelVisible.set(false);
        return;
      }
      const rect = figure.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        this.imagePanelVisible.set(false);
        return;
      }
      const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
      this.imagePanelLeft.set(Math.max(0, rect.left - hostRect.left));
      this.imagePanelTop.set(rect.bottom - hostRect.top + 8);
      this.imageBordered.set(figure.hasAttribute('data-bordered'));
      this.imagePanelVisible.set(true);
    } catch {
      this.imagePanelVisible.set(false);
    }
  }

  private startFigureResize(event: MouseEvent, figure: HTMLElement): void {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth =
      figure.getBoundingClientRect().width ||
      Number.parseFloat(figure.style.width) ||
      0;
    const move = (e: PointerEvent): void => {
      this.resizeFigure(figure, startWidth + (e.clientX - startX));
    };
    const up = (): void => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      this.emitFromDom();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    }
  }

  private updateFloatingPosition(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      this.floatingVisible.set(false);
      return;
    }
    if (!this.isFloatingToolbar() || this.contentFormat() !== 'rich') {
      this.floatingVisible.set(false);
      return;
    }
    try {
      const selection = document.getSelection();
      const editor = this.editorRef();
      if (
        !selection ||
        selection.rangeCount === 0 ||
        selection.isCollapsed ||
        !editor
      ) {
        this.floatingVisible.set(false);
        return;
      }
      const range = selection.getRangeAt(0);
      if (!editor.nativeElement.contains(range.commonAncestorContainer)) {
        this.floatingVisible.set(false);
        return;
      }
      const rect = range.getBoundingClientRect();
      const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        this.floatingVisible.set(false);
        return;
      }
      this.floatingLeft.set(Math.max(8, rect.left - hostRect.left));
      this.floatingTop.set(Math.max(0, rect.top - hostRect.top - 52));
      this.floatingVisible.set(true);
    } catch {
      this.floatingVisible.set(false);
    }
  }

  protected toggleInline(tag: SolarisRichTextInlineTag): void {
    if (typeof document === 'undefined') return;
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    const editor = this.editorRef();
    if (!editor) return;
    this.restoreSelection();
    try {
      const selection = document.getSelection();
      if (
        selection &&
        selection.rangeCount > 0 &&
        !selection.isCollapsed &&
        editor.nativeElement.contains(
          selection.getRangeAt(0).commonAncestorContainer,
        )
      ) {
        this.toggleRangeInline(
          selection.getRangeAt(0),
          tag,
          selection,
          editor.nativeElement,
        );
        this.emitFromDom();
        return;
      }
      this.toggleCaretInline(editor.nativeElement, tag);
      this.emitFromDom();
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Inline format failed.');
    }
  }

  private toggleRangeInline(
    range: Range,
    tag: SolarisRichTextInlineTag,
    selection: Selection,
    host: HTMLElement,
  ): void {
    const same = sharedInlineAncestor(
      range.startContainer,
      range.endContainer,
      tag,
      host,
    );
    if (same) {
      same.replaceWith(...Array.from(same.childNodes));
      selection.removeAllRanges();
      return;
    }
    const el = document.createElement(tag);
    el.appendChild(range.extractContents());
    range.insertNode(el);
    selection.removeAllRanges();
  }

  private toggleCaretInline(
    host: HTMLElement,
    tag: SolarisRichTextInlineTag,
  ): void {
    const selection = document.getSelection();
    const caretNode =
      selection && selection.rangeCount > 0
        ? selection.getRangeAt(0).commonAncestorContainer
        : null;
    const existing = closestTag(caretNode, tag.toUpperCase(), host);
    if (existing && host.contains(existing)) {
      if (isEmptyMarker(existing)) {
        const parent = existing.parentNode;
        const after = document.createTextNode(RICH_TEXT_ZERO_WIDTH_SPACE);
        parent?.insertBefore(after, existing.nextSibling);
        existing.remove();
        this.collapseAfter(after);
        return;
      }
      this.exitElement(existing);
      return;
    }
    this.insertCaretMarker(
      host,
      `<${tag}>${RICH_TEXT_ZERO_WIDTH_SPACE}</${tag}>`,
    );
  }

  private exitElement(el: Element): void {
    const after = document.createTextNode(RICH_TEXT_ZERO_WIDTH_SPACE);
    el.parentNode?.insertBefore(after, el.nextSibling);
    this.collapseAfter(after);
  }

  private collapseAfter(node: Node): void {
    const selection = document.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  private insertCaretMarker(host: HTMLElement, html: string): void {
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      try {
        if (
          this.placeMarkerAtRange(
            host,
            selection.getRangeAt(0),
            selection,
            html,
          )
        )
          return;
      } catch {
        if (isDevMode())
          console.warn('[SolarisRichText] Caret marker insert failed.');
      }
    }
    if (this.insertHtmlAtCaret(html)) {
      this.updateCaretToMarker(host);
    }
  }

  private placeMarkerAtRange(
    host: HTMLElement,
    range: Range,
    selection: Selection,
    html: string,
  ): boolean {
    if (!host.contains(range.commonAncestorContainer)) return false;
    range.deleteContents();
    const wrapper = document.createElement('div');
    // SECURITY_EXCEPTION: caret marker is a builder-known tag wrapping a zero-width space; no consumer HTML.
    wrapper.innerHTML = html;
    const node = wrapper.firstChild;
    if (!node) return false;
    const marker = node.firstChild;
    range.insertNode(node);
    const inner = document.createRange();
    if (marker) {
      inner.setStartAfter(marker);
    } else {
      inner.selectNodeContents(node);
    }
    inner.collapse(true);
    selection.removeAllRanges();
    selection.addRange(inner);
    host.focus();
    return true;
  }

  private updateCaretToMarker(host: HTMLElement): void {
    try {
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      if (!host.contains(range.commonAncestorContainer)) return;
      const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
      let last: Text | null = null;
      let current = walker.nextNode() as Text | null;
      while (current) {
        if (current.nodeValue?.includes(RICH_TEXT_ZERO_WIDTH_SPACE))
          last = current;
        current = walker.nextNode() as Text | null;
      }
      if (last) {
        range.setStart(
          last,
          last.nodeValue?.indexOf(RICH_TEXT_ZERO_WIDTH_SPACE) ?? 0,
        );
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Caret restore failed.');
    }
  }

  protected insertField(field: SolarisRichTextField): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const nextBlocks = insertMention(this.value().blocks, field);
    const pill = `<span data-mention data-field-id="${escapeHtml(field.id)}">${escapeHtml(field.label)}</span>&nbsp;`;
    if (this.insertHtmlAtCaret(pill)) {
      this.emitFromDom(nextBlocks);
    } else {
      const next: SolarisRichTextValue = {
        html: `${this.value().html}${pill}`,
        text: `${this.value().text} ${field.label}`.trim(),
        blocks: nextBlocks,
        version: 1,
      };
      this.commitValue(next);
    }
    this.mentionOpen.set(false);
    this.fieldQuery.set('');
    this.mentionIndex.set(0);
    this.mentionInserted.emit(field);
  }

  protected toggleContentFormat(): void {
    this.setContentFormat(this.contentFormat() === 'rich' ? 'plain' : 'rich');
  }

  protected formatBlock(tag: SolarisRichTextBlockTag): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    if (typeof document === 'undefined') return;
    this.restoreSelection();
    let selectedText = '';
    try {
      const selection = document.getSelection();
      const editor = this.editorRef();
      if (
        selection &&
        selection.rangeCount > 0 &&
        !selection.isCollapsed &&
        editor?.nativeElement.contains(
          selection.getRangeAt(0).commonAncestorContainer,
        )
      ) {
        const range = selection.getRangeAt(0);
        selectedText = stripHtmlToText(range.toString());
        range.deleteContents();
        const wrapper = document.createElement('div');
        // SECURITY_EXCEPTION: block wrapper holds only builder-escaped HTML (buildBlockHtml); no raw consumer HTML.
        wrapper.innerHTML = buildBlockHtml(tag, selectedText);
        const node = wrapper.firstChild;
        if (node) {
          range.insertNode(node);
          selection.removeAllRanges();
        }
        this.emitFromDom(
          insertBlockEntry(this.value().blocks, 'paragraph', selectedText),
        );
        return;
      }
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Block format failed.');
    }
    if (this.insertHtmlAtCaret(buildBlockHtml(tag, selectedText))) {
      this.emitFromDom(
        insertBlockEntry(this.value().blocks, 'paragraph', selectedText),
      );
    }
  }

  protected insertList(kind: 'ul' | 'ol'): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    this.restoreSelection();
    const items = this.takeSelectedLines() ?? [''];
    const html = buildListHtml(kind, items);
    if (this.insertHtmlAtCaret(html)) {
      this.emitFromDom(
        insertBlockEntry(
          this.value().blocks,
          kind === 'ul' ? 'bullet-list' : 'ordered-list',
          items.join(' '),
        ),
      );
    }
  }

  protected insertTaskList(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    this.restoreSelection();
    const items = this.takeSelectedLines() ?? [''];
    const html = buildTaskListHtml(items);
    if (this.insertHtmlAtCaret(html)) {
      this.emitFromDom(
        insertBlockEntry(this.value().blocks, 'bullet-list', items.join(' ')),
      );
    }
    this.refocusEditorAfterOverlayClose();
  }

  private takeSelectedLines(): readonly string[] | null {
    if (typeof document === 'undefined') return null;
    try {
      const selection = document.getSelection();
      const editor = this.editorRef();
      if (
        selection &&
        selection.rangeCount > 0 &&
        !selection.isCollapsed &&
        editor
      ) {
        const range = selection.getRangeAt(0);
        if (editor.nativeElement.contains(range.commonAncestorContainer)) {
          const text = stripHtmlToText(range.toString());
          const lines = text
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
          range.deleteContents();
          return lines.length > 0 ? lines : [''];
        }
      }
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] List selection read failed.');
    }
    return null;
  }

  protected setAlign(align: SolarisRichTextAlign): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    const editor = this.editorRef();
    if (!editor || typeof document === 'undefined') return;
    this.restoreSelection();
    try {
      const selection = document.getSelection();
      const node: Node | null =
        selection && selection.rangeCount > 0
          ? selection.getRangeAt(0).commonAncestorContainer
          : editor.nativeElement.firstChild;
      let el = node instanceof Element ? node : (node?.parentElement ?? null);
      while (
        el &&
        el !== editor.nativeElement &&
        !/^(P|H1|H2|H3|BLOCKQUOTE|PRE|LI|FIGURE)$/.test(el.tagName)
      ) {
        el = el.parentElement;
      }
      if (!el || el === editor.nativeElement) return;
      if (align === 'left') {
        el.removeAttribute('data-align');
      } else {
        el.setAttribute('data-align', align);
      }
      this.emitFromDom();
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Align failed.');
    }
    this.refocusEditorAfterOverlayClose();
  }

  protected prepareLinkPopover(): void {
    if (this.contentFormat() !== 'rich') return;
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const existing = this.findLinkAtCaret();
    if (existing) {
      this.linkUrl.set(existing.href);
      this.linkText.set(existing.text);
      return;
    }
    this.linkUrl.set('');
    this.linkText.set(this.readSelectedText());
  }

  protected openLinkPopover(): void {
    if (this.contentFormat() !== 'rich') return;
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    this.prepareLinkPopover();
    try {
      this.linkPopoverTrigger()?.open();
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Link popover open failed.');
    }
  }

  protected applyLink(url = this.linkUrl(), text = this.linkText()): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    this.restoreSelection();
    const safeUrl = url.trim();
    if (!isSafeHttpUrl(safeUrl)) return;
    const label = text.trim();
    if (this.applyLinkToSelection(safeUrl, label)) return;
    const fallbackLabel = label || safeUrl;
    if (this.insertHtmlAtCaret(buildLinkHtml(safeUrl, fallbackLabel)))
      this.emitFromDom();
    this.clearLinkPanel();
  }

  private applyLinkToSelection(safeUrl: string, label: string): boolean {
    if (typeof document === 'undefined') return false;
    try {
      const selection = document.getSelection();
      const editor = this.editorRef();
      if (
        !selection ||
        selection.rangeCount === 0 ||
        selection.isCollapsed ||
        !editor
      )
        return false;
      const range = selection.getRangeAt(0);
      if (!editor.nativeElement.contains(range.commonAncestorContainer))
        return false;
      const text = label || stripHtmlToText(range.toString());
      range.deleteContents();
      const wrapper = document.createElement('div');
      // SECURITY_EXCEPTION: link wrapper holds only builder-escaped HTML (buildLinkHtml, URL-validated); no raw consumer HTML.
      wrapper.innerHTML = buildLinkHtml(safeUrl, text || safeUrl);
      const node = wrapper.firstChild;
      if (node) {
        range.insertNode(node);
        selection.removeAllRanges();
      }
      this.emitFromDom();
      this.clearLinkPanel();
      return true;
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Link selection read failed.');
    }
    return false;
  }

  private clearLinkPanel(): void {
    this.linkUrl.set('');
    this.linkText.set('');
    try {
      this.linkPopoverTrigger()?.close();
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Link popover close failed.');
    }
    this.refocusEditorAfterOverlayClose();
  }

  private editorRangeForLink(): Range | null {
    if (typeof document === 'undefined') return null;
    try {
      const selection = document.getSelection();
      const editor = this.editorRef();
      if (!editor) return null;
      if (
        selection &&
        selection.rangeCount > 0 &&
        editor.nativeElement.contains(
          selection.getRangeAt(0).commonAncestorContainer,
        )
      ) {
        return selection.getRangeAt(0);
      }
      if (
        this.lastRange &&
        editor.nativeElement.contains(this.lastRange.commonAncestorContainer)
      ) {
        return this.lastRange.cloneRange();
      }
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Link range read failed.');
    }
    return null;
  }

  private findLinkAtCaret(): { href: string; text: string } | null {
    const range = this.editorRangeForLink();
    if (!range) return null;
    const editor = this.editorRef();
    if (!editor) return null;
    const anchor =
      anchorOf(range.startContainer) ?? anchorOf(range.endContainer);
    if (!anchor || !editor.nativeElement.contains(anchor)) return null;
    return {
      href: anchor.getAttribute('href') ?? '',
      text: anchor.textContent ?? '',
    };
  }

  private readSelectedText(): string {
    const range = this.editorRangeForLink();
    if (!range || range.collapsed) return '';
    return stripHtmlToText(range.toString());
  }

  protected toggleInlineCode(): void {
    this.toggleInline('code');
    this.refocusEditorAfterOverlayClose();
  }

  protected toggleSubscript(): void {
    this.toggleInline('sub');
    this.refocusEditorAfterOverlayClose();
  }

  protected toggleSuperscript(): void {
    this.toggleInline('sup');
    this.refocusEditorAfterOverlayClose();
  }

  protected clearFormatting(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    if (typeof document === 'undefined') return;
    const editor = this.editorRef();
    if (!editor) return;
    this.restoreSelection();
    try {
      const selection = document.getSelection();
      if (
        !selection ||
        selection.rangeCount === 0 ||
        selection.isCollapsed ||
        !editor.nativeElement.contains(
          selection.getRangeAt(0).commonAncestorContainer,
        )
      ) {
        return;
      }
      const range = selection.getRangeAt(0);
      expandRangeToInlineAncestors(range, editor.nativeElement);
      const probe = document.createElement('div');
      probe.appendChild(range.cloneContents());
      // SECURITY_EXCEPTION: serialization feeds the pure unwrap helper; write-only below, no consumer HTML.
      const plain = unwrapInlineFormatting(probe.innerHTML);
      range.deleteContents();
      const fragment = range.createContextualFragment(plain);
      const last = fragment.lastChild;
      range.insertNode(fragment);
      if (last) {
        range.setStartAfter(last);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      this.emitFromDom();
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Clear formatting failed.');
    }
    this.refocusEditorAfterOverlayClose();
  }

  protected setColor(color: SolarisRichTextColor): void {
    this.setDataSpan('data-color', color);
  }

  protected setHighlight(color: SolarisRichTextHighlight): void {
    this.setDataSpan('data-highlight', color);
  }

  private setDataSpan(
    attr: 'data-color' | 'data-highlight',
    color: SolarisRichTextColor | SolarisRichTextHighlight,
  ): void {
    const host = this.dataSpanHost();
    if (!host) return;
    this.restoreSelection();
    try {
      if (this.tryApplyDataSpanToRange(attr, color, host)) return;
      this.applyDataSpanToCaret(host, attr, color);
      this.emitFromDom();
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Span color failed.');
    }
  }

  private dataSpanHost(): HTMLElement | null {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return null;
    if (this.contentFormat() !== 'rich') return null;
    if (typeof document === 'undefined') return null;
    return this.editorRef()?.nativeElement ?? null;
  }

  private readDataSpanSelection(
    host: HTMLElement,
  ): { range: Range; selection: Selection } | null {
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed)
      return null;
    const range = selection.getRangeAt(0);
    if (!host.contains(range.commonAncestorContainer)) return null;
    return { range, selection };
  }

  private tryApplyDataSpanToRange(
    attr: 'data-color' | 'data-highlight',
    color: SolarisRichTextColor | SolarisRichTextHighlight,
    host: HTMLElement,
  ): boolean {
    const selected = this.readDataSpanSelection(host);
    if (!selected) return false;
    const { range, selection } = selected;
    expandRangeToInlineAncestors(range, host);
    const text = stripHtmlToText(range.toString());
    if (text.length === 0) return true;
    const probe = document.createElement('div');
    probe.appendChild(range.cloneContents());
    const existingColor =
      probe.querySelector('[data-color]')?.getAttribute('data-color') ??
      'default';
    const existingHighlight =
      probe.querySelector('[data-highlight]')?.getAttribute('data-highlight') ??
      'default';
    const nextColor = attr === 'data-color' ? color : existingColor;
    const nextHighlight = attr === 'data-highlight' ? color : existingHighlight;
    const merged = buildDataSpanHtml({
      color: nextColor as SolarisRichTextColor,
      highlight: nextHighlight as SolarisRichTextHighlight,
      text,
    });
    this.insertMergedSpan(range, selection, merged);
    this.emitFromDom();
    this.activeColor.set(nextColor as SolarisRichTextColor);
    this.activeHighlight.set(nextHighlight as SolarisRichTextHighlight);
    this.rememberSelectionRange(selection);
    return true;
  }

  private rememberSelectionRange(selection: Selection): void {
    try {
      this.lastRange = selection.rangeCount
        ? selection.getRangeAt(0).cloneRange()
        : null;
    } catch {
      this.lastRange = null;
    }
  }

  private applyDataSpanToCaret(
    host: HTMLElement,
    attr: 'data-color' | 'data-highlight',
    color: SolarisRichTextColor | SolarisRichTextHighlight,
  ): void {
    if (attr === 'data-color') {
      this.toggleCaretDataSpan(
        host,
        attr,
        color as SolarisRichTextColor,
        this.activeColor,
      );
      return;
    }
    this.toggleCaretDataSpan(
      host,
      attr,
      color as SolarisRichTextHighlight,
      this.activeHighlight,
    );
  }

  private insertMergedSpan(
    range: Range,
    selection: Selection,
    html: string,
  ): void {
    range.deleteContents();
    const fragment = range.createContextualFragment(html);
    const node = fragment.firstChild;
    if (!node) {
      const fallback = document.createTextNode('');
      range.insertNode(fallback);
      selection.removeAllRanges();
      return;
    }
    range.insertNode(fragment);
    const select = document.createRange();
    select.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(select);
  }

  private toggleCaretDataSpan<T extends string>(
    host: HTMLElement,
    attr: 'data-color' | 'data-highlight',
    color: T,
    active: WritableSignal<T>,
  ): void {
    const caretNode = this.caretContainerNode();
    const anySpan = this.closestDataSpan(
      caretNode,
      'span[data-color],span[data-highlight]',
    );
    if (this.tryUpdateEmptyAnySpan(host, anySpan, attr, color, active)) return;
    const span = this.closestDataSpan(caretNode, `span[${attr}]`);
    if (this.tryUpdateAttrSpan(host, span, attr, color, active)) return;
    this.insertCaretDataSpan(host, attr, color, active);
  }

  private caretContainerNode(): Node | null {
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    return selection.getRangeAt(0).commonAncestorContainer;
  }

  private closestDataSpan(node: Node | null, selector: string): Element | null {
    if (!node) return null;
    if (node instanceof Element) return node.closest(selector);
    return node.parentElement?.closest(selector) ?? null;
  }

  private tryUpdateEmptyAnySpan<T extends string>(
    host: HTMLElement,
    anySpan: Element | null,
    attr: 'data-color' | 'data-highlight',
    color: T,
    active: WritableSignal<T>,
  ): boolean {
    if (!anySpan || !host.contains(anySpan) || !isEmptyMarker(anySpan))
      return false;
    if (color === 'default' || anySpan.getAttribute(attr) === color) {
      this.clearDataSpanAttr(anySpan, attr);
      active.set('default' as T);
      return true;
    }
    anySpan.setAttribute(attr, color);
    active.set(color);
    return true;
  }

  private clearDataSpanAttr(
    span: Element,
    attr: 'data-color' | 'data-highlight',
  ): void {
    span.removeAttribute(attr);
    if (
      !span.hasAttribute('data-color') &&
      !span.hasAttribute('data-highlight')
    ) {
      span.remove();
    }
  }

  private tryUpdateAttrSpan<T extends string>(
    host: HTMLElement,
    span: Element | null,
    attr: 'data-color' | 'data-highlight',
    color: T,
    active: WritableSignal<T>,
  ): boolean {
    if (!span || !host.contains(span)) return false;
    if (isEmptyMarker(span)) {
      span.remove();
      active.set('default' as T);
      return true;
    }
    if (color === 'default' || span.getAttribute(attr) === color) {
      this.exitElement(span);
      active.set('default' as T);
      return true;
    }
    span.setAttribute(attr, color);
    active.set(color);
    return true;
  }

  private insertCaretDataSpan<T extends string>(
    host: HTMLElement,
    attr: 'data-color' | 'data-highlight',
    color: T,
    active: WritableSignal<T>,
  ): void {
    if (color === 'default') return;
    active.set(color);
    this.insertCaretMarker(
      host,
      `<span ${attr}="${color}">${RICH_TEXT_ZERO_WIDTH_SPACE}</span>`,
    );
  }

  protected insertTable(rows = 3, cols = 3, headerRow = true): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    const safeRows = clampTableDimension(rows, 3);
    const safeCols = clampTableDimension(cols, 3);
    const html = buildTableHtml({ rows: safeRows, cols: safeCols, headerRow });
    const nextBlocks = insertTableBlock(this.value().blocks, {
      rows: safeRows,
      cols: safeCols,
      headerRow,
    });
    if (this.insertHtmlAtCaret(html)) {
      this.emitFromDom(nextBlocks);
    } else {
      this.commitValue({
        html: `${this.value().html}${html}`,
        text: this.value().text,
        blocks: nextBlocks,
        version: 1,
      });
    }
    this.tableInserted.emit({ rows: safeRows, cols: safeCols });
  }

  protected insertImageUrl(url: string, alt: string, fileName: string): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    if (alt.trim().length === 0) {
      this.imageRejected.emit({ fileName, error: 'missing-alt' });
      return;
    }
    const figure = buildImageFigureHtml({ url, alt });
    if (figure.length === 0) {
      this.imageRejected.emit({ fileName, error: 'missing-alt' });
      return;
    }
    if (this.insertHtmlAtCaret(figure)) {
      this.emitFromDom();
    } else {
      this.commitValue({
        html: `${this.value().html}${figure}`,
        text: this.value().text,
        blocks: this.value().blocks,
        version: 1,
      });
    }
    this.imageAdded.emit({ url, fileName });
  }

  protected onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const options = this.imageUpload() ?? {};
    const error = validateImageSelection(options, {
      name: file.name,
      size: file.size,
      mime: file.type,
    });
    if (error) {
      this.imageRejected.emit({ fileName: file.name, error });
      input.value = '';
      return;
    }
    if (
      typeof URL !== 'undefined' &&
      typeof URL.createObjectURL === 'function'
    ) {
      const url = URL.createObjectURL(file);
      this.objectUrls.push(url);
      this.insertImageUrl(url, file.name.replace(/\.[^.]+$/, ''), file.name);
    } else {
      this.imageRejected.emit({
        fileName: file.name,
        error: 'type-not-allowed',
      });
    }
    input.value = '';
  }

  private insertHtmlAtCaret(html: string): boolean {
    const editor = this.editorRef();
    if (!editor || typeof document === 'undefined') return false;
    try {
      const selection = document.getSelection();
      const host = editor.nativeElement;
      if (!selection || selection.rangeCount === 0) {
        // SECURITY_EXCEPTION: appending sanitized editor HTML requires native innerHTML; content comes from sanitizeRichTextHtml/built-in builders only.
        host.innerHTML += html;
        return true;
      }
      const range = selection.getRangeAt(0);
      if (!host.contains(range.commonAncestorContainer)) {
        // SECURITY_EXCEPTION: appending sanitized editor HTML requires native innerHTML; content comes from sanitizeRichTextHtml/built-in builders only.
        host.innerHTML += html;
        return true;
      }
      range.deleteContents();
      const fragment = range.createContextualFragment(html);
      const last = fragment.lastChild;
      range.insertNode(fragment);
      if (last) {
        range.setStartAfter(last);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      host.focus();
      return true;
    } catch {
      if (isDevMode())
        console.warn(
          '[SolarisRichText] Caret insert failed; appended instead.',
        );
      try {
        // SECURITY_EXCEPTION: fallback caret insert appends sanitized editor HTML; same sanitized sources as above, no raw consumer HTML.
        editor.nativeElement.innerHTML += html;
        return true;
      } catch {
        return false;
      }
    }
  }

  protected undo(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const past = this.historyPast();
    const previous = past.at(-1);
    if (previous === undefined) return;
    this.historyPast.set(past.slice(0, -1));
    this.historyFuture.update((future) => [...future, this.value()]);
    this.lastHistoryKind = 'action';
    this.restoreValue(previous);
  }

  protected redo(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const future = this.historyFuture();
    const next = future.at(-1);
    if (next === undefined) return;
    this.historyFuture.set(future.slice(0, -1));
    this.historyPast.update((past) => {
      const nextPast = [...past, this.value()];
      return nextPast.length > SOLARIS_RICH_TEXT_MAX_HISTORY
        ? nextPast.slice(nextPast.length - SOLARIS_RICH_TEXT_MAX_HISTORY)
        : nextPast;
    });
    this.lastHistoryKind = 'action';
    this.restoreValue(next);
  }

  private restoreValue(snapshot: SolarisRichTextValue): void {
    const html = cleanCommittedHtml(snapshot.html);
    const clean: SolarisRichTextValue = {
      html,
      text: stripHtmlToText(html),
      blocks: snapshot.blocks,
      version: 1,
    };
    this.value.set(clean);
    this.onChange(clean);
    this.htmlChange.emit(clean.html);
    this.syncEditorDom();
    this.updateActiveStates();
  }

  protected setContentFormat(format: SolarisRichTextContentFormat): void {
    if (format === this.contentFormat()) return;
    this.lastHistoryKind = 'action';
    if (format === 'plain') {
      this.lastRichValue = this.value();
      this.commitValue(
        {
          html: `<p>${escapeHtml(toPlainText(this.value()))}</p>`,
          text: toPlainText(this.value()),
          blocks: this.value().blocks,
          version: 1,
        },
        false,
      );
    } else if (this.lastRichValue) {
      this.commitValue(this.lastRichValue, false);
      this.lastRichValue = null;
    }
    this.contentFormat.set(format);
    this.syncEditorDom();
    this.animateContentFormatSwitch();
  }

  private animateContentFormatSwitch(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined')
      return;
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const host = this.elementRef.nativeElement;
    if (host?.closest?.('[data-reduced-motion="true"]')) return;
    const toolbar = host.querySelector('.solaris-rich-text-toolbar');
    if (toolbar && typeof toolbar.animate === 'function') {
      toolbar.animate(
        [
          { opacity: '0.55', transform: 'translateY(4px)' },
          { opacity: '1', transform: 'translateY(0)' },
        ],
        {
          duration: SOLARIS_RICH_TEXT_FORMAT_SWITCH_DURATION_MS,
          easing: SOLARIS_RICH_TEXT_FORMAT_SWITCH_EASING,
        },
      );
    }
    const area = this.editorRef()?.nativeElement;
    if (area && typeof area.animate === 'function') {
      area.animate([{ opacity: '0.35' }, { opacity: '1' }], {
        duration: SOLARIS_RICH_TEXT_FORMAT_SWITCH_DURATION_MS,
        easing: SOLARIS_RICH_TEXT_FORMAT_SWITCH_EASING,
      });
    }
  }

  protected onBlockSelect(tag: unknown): void {
    if (typeof tag !== 'string') return;
    const allowed: readonly SolarisRichTextBlockTag[] = [
      'p',
      'h1',
      'h2',
      'h3',
      'blockquote',
      'pre',
    ];
    if ((allowed as readonly string[]).includes(tag)) {
      this.formatBlock(tag as SolarisRichTextBlockTag);
      this.refocusEditorAfterOverlayClose();
    }
  }

  protected colorSwatchLabel(color: string): string {
    const capitalized = color.charAt(0).toUpperCase() + color.slice(1);
    const key = `solaris.rich-text.color${capitalized}`;
    const translated = this.translateService.translate(key);
    return translated !== key ? translated : color;
  }

  protected colorContrast(): { level: 'ok' | 'partial' | 'fail' } | null {
    if (typeof document === 'undefined') return null;
    try {
      const preview = this.elementRef.nativeElement.querySelector(
        '.solaris-rich-text-color-preview',
      );
      if (!preview) return null;
      const foreground = parseCssRgb(getComputedStyle(preview).color);
      const background = this.previewBackground(preview);
      if (!foreground || !background) return null;
      const ratio = contrastRatio(foreground, background);
      if (ratio >= SOLARIS_RICH_TEXT_CONTRAST_AA_RATIO) return { level: 'ok' };
      if (ratio >= SOLARIS_RICH_TEXT_CONTRAST_AA_LARGE_RATIO)
        return { level: 'partial' };
      return { level: 'fail' };
    } catch {
      return null;
    }
  }

  private previewBackground(element: Element): SolarisRgb | null {
    let current: Element | null = element;
    let hops = 0;
    while (current && hops < 6) {
      // Why: skip the toolbar trigger itself (its pressed tint is chrome, not
      // canvas) so the verdict reflects readability on the editing surface.
      if (current.tagName !== 'BUTTON') {
        const parsed = parseCssRgba(getComputedStyle(current).backgroundColor);
        if (parsed && parsed.alpha >= 1) return parsed.color;
      }
      current = current.parentElement;
      hops += 1;
    }
    return null;
  }

  protected pickTextColor(color: SolarisRichTextColor): void {
    // Why: the panel stays open so text color and highlight can be chained
    // without reopening; the popover directive itself closes on outside
    // interaction or Escape.
    this.setColor(color);
  }

  protected pickHighlightColor(color: SolarisRichTextHighlight): void {
    this.setHighlight(color);
  }

  protected clearHighlight(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    if (typeof document === 'undefined') return;
    const editor = this.editorRef();
    if (!editor) return;
    this.restoreSelection();
    try {
      const selection = document.getSelection();
      if (
        selection &&
        selection.rangeCount > 0 &&
        !selection.isCollapsed &&
        editor.nativeElement.contains(
          selection.getRangeAt(0).commonAncestorContainer,
        )
      ) {
        const range = selection.getRangeAt(0);
        expandRangeToInlineAncestors(range, editor.nativeElement);
        const probe = document.createElement('div');
        probe.appendChild(range.cloneContents());
        // SECURITY_EXCEPTION: serialization feeds the pure unwrap helper; write-only below, no consumer HTML.
        const plain = removeHighlightSpans(probe.innerHTML);
        range.deleteContents();
        const fragment = range.createContextualFragment(plain);
        const last = fragment.lastChild;
        range.insertNode(fragment);
        if (last) {
          range.setStartAfter(last);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        this.emitFromDom();
      }
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Clear highlight failed.');
    }
  }

  protected updateActiveStates(): void {
    const scan = createActiveScan();
    const host = this.editorRef()?.nativeElement ?? null;
    let el = this.selectionAnchorElement();
    while (el && host && el !== host) {
      accumulateActiveElement(el, scan);
      el = el.parentElement;
    }
    this.activeMarks.set(scan.marks);
    this.blockTag.set(scan.block);
    this.activeAlign.set(scan.align);
    this.activeColor.set(scan.color);
    this.activeHighlight.set(scan.highlight);
  }

  private selectionAnchorElement(): Element | null {
    if (typeof document === 'undefined') return null;
    try {
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return null;
      const node = selection.getRangeAt(0).commonAncestorContainer;
      return node instanceof Element ? node : node.parentElement;
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Active state read failed.');
      return null;
    }
  }

  private lastRange: Range | null = null;

  private refocusEditorAfterOverlayClose(): void {
    if (typeof document === 'undefined') return;
    setTimeout(() => this.focus(), 0);
  }

  private rememberSelection(): void {
    if (typeof document === 'undefined') return;
    try {
      const selection = document.getSelection();
      const editor = this.editorRef();
      if (
        selection &&
        selection.rangeCount > 0 &&
        editor?.nativeElement.contains(
          selection.getRangeAt(0).commonAncestorContainer,
        )
      ) {
        this.lastRange = selection.getRangeAt(0).cloneRange();
      }
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Selection remember failed.');
    }
  }

  private restoreSelection(): boolean {
    if (typeof document === 'undefined') return false;
    try {
      const selection = document.getSelection();
      const editor = this.editorRef();
      if (!selection || !editor) return false;
      if (
        selection.rangeCount > 0 &&
        editor.nativeElement.contains(
          selection.getRangeAt(0).commonAncestorContainer,
        )
      ) {
        return true;
      }
      if (
        this.lastRange &&
        editor.nativeElement.contains(this.lastRange.commonAncestorContainer)
      ) {
        editor.nativeElement.focus({ preventScroll: true });
        selection.removeAllRanges();
        selection.addRange(this.lastRange.cloneRange());
        return true;
      }
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Selection restore failed.');
    }
    return false;
  }

  private detectFieldTrigger(text: string): void {
    if (this.fields().length === 0) return;
    const trigger = this.fieldTrigger();
    const last = text.slice(-32);
    const idx = last.lastIndexOf(trigger);
    if (idx >= 0) {
      this.fieldQuery.set(last.slice(idx + 1));
      this.mentionOpen.set(true);
      this.mentionIndex.set(0);
    } else if (!text.includes(trigger)) {
      this.mentionOpen.set(false);
      this.fieldQuery.set('');
      this.mentionIndex.set(0);
    }
  }

  private emitFromDom(blocks = this.value().blocks): void {
    const editor = this.editorRef();
    if (!editor) return;
    // SECURITY_EXCEPTION: reading edited HTML requires the native property. Read-only.
    const rawHtml = editor.nativeElement.innerHTML ?? '';
    const html = cleanCommittedHtml(rawHtml);
    const text = stripHtmlToText(html);
    this.commitValue({ html, text, blocks, version: 1 });
    this.updateActiveStates();
  }

  private commitValue(
    next: SolarisRichTextValue,
    pushHistory = true,
    coalesce = false,
  ): void {
    if (!this.dirty()) this.dirty.set(true);
    const html = cleanCommittedHtml(next.html);
    const clean: SolarisRichTextValue = {
      html,
      text: stripHtmlToText(html),
      blocks: next.blocks,
      version: 1,
    };
    if (pushHistory) {
      const now = Date.now();
      const kind: SolarisRichTextHistoryKind = coalesce ? 'typing' : 'action';
      const merge =
        coalesce &&
        shouldCoalesceHistory(
          this.lastHistoryAt,
          now,
          this.lastHistoryKind,
          kind,
          SOLARIS_RICH_TEXT_HISTORY_IDLE_MS,
        );
      if (!merge) {
        this.historyPast.update((past) => {
          const nextPast = [...past, this.value()];
          return nextPast.length > SOLARIS_RICH_TEXT_MAX_HISTORY
            ? nextPast.slice(nextPast.length - SOLARIS_RICH_TEXT_MAX_HISTORY)
            : nextPast;
        });
      }
      this.historyFuture.set([]);
      this.lastHistoryAt = now;
      this.lastHistoryKind = kind;
    }
    this.value.set(clean);
    this.onChange(clean);
    this.htmlChange.emit(clean.html);
  }

  private syncEditorDom(): void {
    const editor = this.editorRef();
    if (!editor || typeof document === 'undefined') return;
    // SECURITY_EXCEPTION: syncing external form values requires writing native innerHTML; binding alone cannot preserve caret-adjacent pills. Write-only.
    const current = editor.nativeElement.innerHTML ?? '';
    const next = this.value().html;
    if (current !== next) editor.nativeElement.innerHTML = next;
  }
}
