import { CommonModule } from '@angular/common';
import type { WritableSignal } from '@angular/core';
import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
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
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { SolarisFormControl } from '../../form-field/model/form-control.contract';
import { SOLARIS_FORM_FIELD } from '../../form-field';
import { resolveElementId } from '../../../../core';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisRichTextToolbarComponent } from './toolbar/toolbar.component';
import { SolarisRichTextCodePanelComponent } from './code-panel/code-panel.component';
import { SolarisRichTextImagePanelComponent } from './image-panel/image-panel.component';
import { SolarisRichTextEditingEngine } from './rich-text-editor.engine';
import type {
  SolarisRgb,
  SolarisRichTextAlign,
  SolarisRichTextBlockTag,
  SolarisRichTextColor,
  SolarisRichTextHighlight,
  SolarisRichTextHistoryKind,
  SolarisRichTextImageError,
} from '../functions/rich-text-editor.utils';
import {
  accumulateActiveElement,
  blockKindForTag,
  buildBlockHtml,
  buildCodeBlockHtml,
  buildImageFigureHtml,
  buildLinkHtml,
  buildListHtml,
  buildTableHtml,
  buildTaskListHtml,
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
  normalizeCodeLanguage,
  normalizeEditorValue,
  parseCssRgb,
  parseCssRgba,
  removeHighlightSpans,
  RICH_TEXT_ZERO_WIDTH_SPACE,
  shouldCoalesceHistory,
  stripHtmlToText,
  toPlainText,
  trimTrailingWhitespace,
  unwrapInlineFormatting,
  validateImageSelection,
} from '../functions/rich-text-editor.utils';
import {
  closestTag,
  describeFigureWidth,
  expandRangeToInlineAncestors,
  isEmptyMarker,
  sharedInlineAncestor,
  SOLARIS_RICH_TEXT_BLOCK_BOUNDARY_TAG_NAMES,
  SOLARIS_RICH_TEXT_INLINE_TAG_NAMES,
} from '../functions/rich-text-editor.dom';
import type {
  SolarisRichTextActiveMark,
  SolarisRichTextAppearance,
  SolarisRichTextCodeLanguage,
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
    SolarisRichTextToolbarComponent,
    SolarisRichTextCodePanelComponent,
    SolarisRichTextImagePanelComponent,
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
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    super();
    if (typeof window === 'undefined') return;
    const repositionFloatingToolbar = (): void => {
      if (this.floatingVisible()) this.updateFloatingPosition();
    };
    window.addEventListener('scroll', repositionFloatingToolbar, true);
    window.addEventListener('resize', repositionFloatingToolbar);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', repositionFloatingToolbar, true);
      window.removeEventListener('resize', repositionFloatingToolbar);
    });
  }

  private readonly editorRef = viewChild<ElementRef<HTMLElement>>('editor');

  private readonly engine = new SolarisRichTextEditingEngine();

  private readonly toolbarRef = viewChild(SolarisRichTextToolbarComponent);

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
  protected readonly codePanelVisible = signal(false);
  protected readonly codePanelTop = signal(0);
  protected readonly codePanelLeft = signal(0);
  protected readonly codeLanguage = signal<SolarisRichTextCodeLanguage>('auto');
  protected readonly codeLineNumbers = signal(true);
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
    this.normalizeActiveCodeBlock();
  }

  protected onEditorFocus(): void {
    this._focused.set(true);
    this.editorFocused.emit();
  }

  protected onEditorBlur(): void {
    this._focused.set(false);
    this.engine.rememberSelection();
    if (!this.touched()) this.touched.set(true);
    this.onTouched();
    this.editorBlurred.emit();
  }

  ngAfterViewInit(): void {
    this.engine.bind(this.editorRef()?.nativeElement ?? null);
    if (this.autofocus() && !this.isEffectivelyDisabled()) {
      this.focus();
    }
  }

  protected onEditorKeydown(event: KeyboardEvent): void {
    if (this.handleCodeKey(event)) return;
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
    const code = event.code;
    const isStrike = key === 's' || key === '5' || code === 'Digit5';
    const isCode = key === 'm' || key === '9' || code === 'Digit9';
    const isRedo = key === 'z' || code === 'KeyZ';
    if (!isStrike && !isCode && !isRedo) return false;
    event.preventDefault();
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return true;
    if (isStrike) this.toggleInline('s');
    else if (isCode) this.toggleInlineCode();
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
    this.syncCodePanel();
  }

  protected onEditorMousedown(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    const handle = target?.closest?.(
      '.solaris-image-resize-handle',
    ) as HTMLElement | null;
    if (handle) {
      const figure = handle.closest('figure[data-image]') as HTMLElement | null;
      if (figure)
        this.engine.startFigureResize(event, figure, () => this.emitFromDom());
      return;
    }
    if (typeof document === 'undefined') return;
    const editor = this.editorRef();
    if (!editor) return;
    const figure = target?.closest?.(
      'figure[data-image]',
    ) as HTMLElement | null;
    if (!figure || !editor.nativeElement.contains(figure)) {
      this.engine.deselectFigure();
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
      this.engine.deselectFigure();
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
    this.engine.updateFigureSelection(
      this.translateService.translate('solaris.rich-text.imageResize'),
    );
    this.syncImagePanel();
  }

  private resizeFigure(figure: HTMLElement, widthPx: number): void {
    this.engine.resizeFigure(figure, widthPx);
  }

  protected alignSelectedImage(align: SolarisRichTextAlign): void {
    this.setAlign(align);
    this.updateActiveStates();
    this.syncImagePanel();
  }

  protected applyImagePreset(preset: SolarisRichTextImagePreset): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const editor = this.editorRef();
    const figure = this.engine.selectedFigure();
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
    const figure = this.engine.selectedFigure();
    if (!figure) return;
    figure.toggleAttribute('data-bordered');
    this.imageBordered.set(figure.hasAttribute('data-bordered'));
    this.emitFromDom();
    this.syncImagePanel();
  }

  protected removeImage(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const figure = this.engine.selectedFigure();
    if (!figure) return;
    figure.remove();
    this.emitFromDom();
    this.imageRemoved.emit();
    this.syncImagePanel();
  }

  @HostListener('keydown.escape')
  protected closeImagePanel(): void {
    this.engine.deselectFigure();
    this.syncImagePanel();
    this.focus();
  }

  protected focusImageHandle(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const handle = this.engine
      .selectedFigure()
      ?.querySelector<HTMLElement>('.solaris-image-resize-handle');
    handle?.focus();
  }

  protected copySelectedImage(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (typeof document === 'undefined' || typeof navigator === 'undefined')
      return;
    const figure = this.engine.selectedFigure();
    const html = figure?.outerHTML;
    if (!figure || !html || !navigator.clipboard) return;
    void navigator.clipboard.writeText(html).catch(() => {
      if (isDevMode()) console.warn('[SolarisRichText] Image copy failed.');
    });
  }

  private selectedCodeBlock(): HTMLElement | null {
    const editor = this.editorRef();
    if (!editor || typeof document === 'undefined') return null;
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const node = selection.getRangeAt(0).commonAncestorContainer;
    const pre = closestTag(node, 'PRE', editor.nativeElement);
    if (!pre || !editor.nativeElement.contains(pre)) return null;
    return pre as HTMLElement;
  }

  private syncCodePanel(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      this.codePanelVisible.set(false);
      return;
    }
    const editor = this.editorRef();
    if (!editor) {
      this.codePanelVisible.set(false);
      return;
    }
    try {
      const pre = this.selectedCodeBlock();
      if (
        !pre ||
        this.isEffectivelyDisabled() ||
        this.readonlyInput() ||
        this.contentFormat() !== 'rich'
      ) {
        this.codePanelVisible.set(false);
        return;
      }
      const rect = pre.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        this.codePanelVisible.set(false);
        return;
      }
      const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
      const { top, left } = this.engine.panelBelow(hostRect, rect);
      this.codePanelLeft.set(left);
      this.codePanelTop.set(top);
      this.codeLanguage.set(
        normalizeCodeLanguage(pre.getAttribute('data-language')),
      );
      this.codeLineNumbers.set(pre.hasAttribute('data-line-numbers'));
      this.codePanelVisible.set(true);
    } catch {
      this.codePanelVisible.set(false);
    }
  }

  protected setCodeLanguage(language: string): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const pre = this.selectedCodeBlock();
    if (!pre) return;
    const normalized = normalizeCodeLanguage(language);
    pre.setAttribute('data-language', normalized);
    this.codeLanguage.set(normalized);
    this.emitFromDom();
  }

  protected toggleCodeLineNumbers(force?: boolean): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const pre = this.selectedCodeBlock();
    if (!pre) return;
    const show = force ?? !pre.hasAttribute('data-line-numbers');
    if (show) {
      pre.setAttribute('data-line-numbers', '');
    } else {
      pre.removeAttribute('data-line-numbers');
    }
    this.codeLineNumbers.set(show);
    this.emitFromDom();
  }

  protected formatCode(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const pre = this.selectedCodeBlock();
    if (!pre) return;
    const selection = document.getSelection();
    const range =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    const offset = range ? this.engine.codeCaretOffset(pre, range) : null;
    const lines = this.engine
      .codeTextContent(pre)
      .split('\n')
      .map((line) => trimTrailingWhitespace(line));
    this.engine.writeCodeLines(pre, lines, offset);
    this.emitFromDom();
  }

  protected removeCodeBlock(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const pre = this.selectedCodeBlock();
    if (!pre) return;
    const editor = this.editorRef()?.nativeElement;
    const previous = pre.previousElementSibling;
    pre.remove();
    if (editor?.childNodes.length === 0) {
      const paragraph = document.createElement('p');
      paragraph.append(document.createElement('br'));
      editor.append(paragraph);
    }
    try {
      const selection = document.getSelection();
      if (editor && selection) {
        const anchor = previous ?? editor;
        const caret = document.createRange();
        caret.selectNodeContents(anchor);
        caret.collapse(!previous);
        selection.removeAllRanges();
        selection.addRange(caret);
        editor.focus({ preventScroll: true });
      }
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Code remove failed.');
    }
    this.emitFromDom();
    this.syncCodePanel();
  }

  protected copyCode(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (typeof document === 'undefined' || typeof navigator === 'undefined')
      return;
    const pre = this.selectedCodeBlock();
    const text = pre ? this.engine.codeTextContent(pre) : '';
    if (!pre || text.length === 0 || !navigator.clipboard) return;
    void navigator.clipboard.writeText(text).catch(() => {
      if (isDevMode()) console.warn('[SolarisRichText] Code copy failed.');
    });
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
      const { top, left } = this.engine.panelBelow(hostRect, rect);
      this.imagePanelLeft.set(left);
      this.imagePanelTop.set(top);
      this.imageBordered.set(figure.hasAttribute('data-bordered'));
      this.imagePanelVisible.set(true);
    } catch {
      this.imagePanelVisible.set(false);
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
      const host = this.elementRef.nativeElement;
      if (!editor.nativeElement.contains(range.commonAncestorContainer)) {
        this.floatingVisible.set(false);
        return;
      }
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        this.floatingVisible.set(false);
        return;
      }
      const toolbar = host.querySelector<HTMLElement>(
        '.solaris-rich-text-toolbar--floating',
      );
      const { top, left } = this.engine.floatingPlacement(
        rect,
        { width: window.innerWidth, height: window.innerHeight },
        {
          height: toolbar?.offsetHeight || 52,
          width: toolbar?.offsetWidth || 0,
        },
      );
      this.floatingTop.set(top);
      this.floatingLeft.set(left);
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
    this.engine.restoreSelection();
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
        this.engine.collapseAfter(after);
        return;
      }
      this.engine.exitElement(existing);
      return;
    }
    this.engine.insertCaretMarker(
      `<${tag}>${RICH_TEXT_ZERO_WIDTH_SPACE}</${tag}>`,
    );
  }

  protected insertField(field: SolarisRichTextField): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const nextBlocks = insertMention(this.value().blocks, field);
    const pill = `<span data-mention data-field-id="${escapeHtml(field.id)}">${escapeHtml(field.label)}</span>&nbsp;`;
    if (this.engine.insertHtmlAtCaret(pill)) {
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
    this.engine.restoreSelection();
    const selectedText = '';
    try {
      const selected = this.engine.selectionInEditor();
      if (selected && !selected.range.collapsed) {
        this.applyBlockToRange(tag, selected.range, selected.selection);
        return;
      }
      if (selected && this.transformCaretBlock(selected.range, tag)) {
        return;
      }
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Block format failed.');
    }
    if (this.engine.insertHtmlAtCaret(this.blockHtml(tag, selectedText))) {
      this.emitFromDom(
        insertBlockEntry(
          this.value().blocks,
          blockKindForTag(tag),
          selectedText,
        ),
      );
    }
  }

  private blockHtml(tag: SolarisRichTextBlockTag, text: string): string {
    if (tag === 'pre') {
      return buildCodeBlockHtml({
        language: 'auto',
        lineNumbers: true,
        text,
      });
    }
    return buildBlockHtml(tag, text);
  }

  private applyBlockToRange(
    tag: SolarisRichTextBlockTag,
    range: Range,
    selection: Selection,
  ): void {
    const selectedText = stripHtmlToText(range.toString());
    range.deleteContents();
    const wrapper = document.createElement('div');
    // SECURITY_EXCEPTION: block wrapper holds only builder-escaped HTML (buildBlockHtml/buildCodeBlockHtml); no raw consumer HTML.
    wrapper.innerHTML = this.blockHtml(tag, selectedText);
    const node = wrapper.firstChild;
    if (node) {
      range.insertNode(node);
      selection.removeAllRanges();
    }
    this.emitFromDom(
      insertBlockEntry(this.value().blocks, blockKindForTag(tag), selectedText),
    );
  }

  private transformCaretBlock(
    range: Range,
    tag: SolarisRichTextBlockTag,
  ): boolean {
    const editor = this.editorRef()?.nativeElement;
    if (!editor) return false;
    let el =
      range.startContainer instanceof Element
        ? range.startContainer
        : range.startContainer.parentElement;
    while (
      el &&
      el !== editor &&
      !/^(P|H1|H2|H3|BLOCKQUOTE|PRE)$/.test(el.tagName)
    ) {
      el = el.parentElement;
    }
    if (!el || el === editor) return false;
    if (el.tagName === tag.toUpperCase()) return true;
    if (tag === 'pre') {
      return this.transformToCodeBlock(el, range);
    }
    const anchorNode = range.startContainer;
    const anchorOffset = range.startOffset;
    const replacement = document.createElement(tag);
    while (el.firstChild) replacement.appendChild(el.firstChild);
    if (!replacement.hasChildNodes()) {
      replacement.appendChild(document.createElement('br'));
    }
    el.replaceWith(replacement);
    this.engine.restoreCaretToNode(
      anchorNode === el ? replacement : anchorNode,
      anchorOffset,
    );
    this.emitFromDom(
      insertBlockEntry(
        this.value().blocks,
        blockKindForTag(tag),
        replacement.textContent ?? '',
      ),
    );
    return true;
  }

  private normalizeActiveCodeBlock(): void {
    if (typeof document === 'undefined') return;
    const pre = this.selectedCodeBlock();
    if (!pre || this.engine.isCodeBlockClean(pre)) return;
    const selection = document.getSelection();
    const range =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    const offset = range ? this.engine.codeCaretOffset(pre, range) : null;
    this.engine.writeCodeLines(
      pre,
      this.engine.codeTextContent(pre).split('\n'),
      offset,
    );
    this.emitFromDom();
  }

  private handleCodeKey(event: KeyboardEvent): boolean {
    if (event.ctrlKey || event.metaKey) return false;
    if (event.key !== 'Enter' && event.key !== 'Tab') return false;
    if (typeof document === 'undefined') return false;
    const editor = this.editorRef();
    const selection = document.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) return false;
    const range = selection.getRangeAt(0);
    const pre = closestTag(range.startContainer, 'PRE', editor.nativeElement);
    if (!pre || !editor.nativeElement.contains(pre)) return false;
    event.preventDefault();
    const code = pre as HTMLElement;
    if (event.key === 'Tab') {
      this.insertCodeText(code, range, '  ');
      return true;
    }
    const offset = this.engine.codeCaretOffset(code, range);
    const text = this.engine.codeTextContent(code);
    const lineStart = text.lastIndexOf('\n', offset - 1) + 1;
    const indent = /^[ \t]*/.exec(text.slice(lineStart, offset))?.[0] ?? '';
    const next = `${text.slice(0, offset)}\n${indent}${text.slice(offset)}`;
    this.engine.writeCodeLines(
      code,
      next.split('\n'),
      offset + 1 + indent.length,
    );
    this.emitFromDom();
    return true;
  }

  private insertCodeText(
    pre: HTMLElement,
    range: Range,
    insertion: string,
  ): void {
    const offset = this.engine.codeCaretOffset(pre, range);
    const text = this.engine.codeTextContent(pre);
    const next = `${text.slice(0, offset)}${insertion}${text.slice(offset)}`;
    this.engine.writeCodeLines(
      pre,
      next.split('\n'),
      offset + insertion.length,
    );
    this.emitFromDom();
  }

  private transformToCodeBlock(el: Element, range: Range): boolean {
    const caret = document.createRange();
    caret.selectNodeContents(el);
    try {
      caret.setEnd(range.startContainer, range.startOffset);
    } catch {
      return false;
    }
    const offset = this.engine.codeTextContent(caret.cloneContents()).length;
    const text = this.engine.codeTextContent(el);
    const pre = document.createElement('pre');
    pre.setAttribute('data-language', 'auto');
    pre.setAttribute('data-line-numbers', '');
    el.replaceWith(pre);
    this.engine.writeCodeLines(
      pre,
      text.length > 0 ? text.split('\n') : [''],
      offset,
    );
    this.emitFromDom(insertBlockEntry(this.value().blocks, 'code', text));
    return true;
  }

  protected insertList(kind: 'ul' | 'ol'): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    this.engine.restoreSelection();
    const items = this.takeSelectedLines() ?? [''];
    const html = buildListHtml(kind, items);
    if (this.engine.insertHtmlAtCaret(html)) {
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
    this.engine.restoreSelection();
    const items = this.takeSelectedLines() ?? [''];
    const html = buildTaskListHtml(items);
    if (this.engine.insertHtmlAtCaret(html)) {
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
    this.engine.restoreSelection();
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
    const existing = this.engine.findLinkAtCaret();
    if (existing) {
      this.linkUrl.set(existing.href);
      this.linkText.set(existing.text);
      return;
    }
    this.linkUrl.set('');
    this.linkText.set(this.engine.readSelectedText());
  }

  protected openLinkPopover(): void {
    if (this.contentFormat() !== 'rich') return;
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    this.prepareLinkPopover();
    this.toolbarRef()?.openLinkPanel();
  }

  protected applyLink(url = this.linkUrl(), text = this.linkText()): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    this.engine.restoreSelection();
    const safeUrl = url.trim();
    if (!isSafeHttpUrl(safeUrl)) return;
    const label = text.trim();
    if (this.applyLinkToSelection(safeUrl, label)) return;
    const fallbackLabel = label || safeUrl;
    if (this.engine.insertHtmlAtCaret(buildLinkHtml(safeUrl, fallbackLabel)))
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
    this.toolbarRef()?.closeLinkPanel();
    this.refocusEditorAfterOverlayClose();
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
    this.engine.restoreSelection();
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
    this.engine.restoreSelection();
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
    this.expandRangeToFullySelectedWrappers(range, host);
    const fragment = range.extractContents();
    const container = document.createElement('div');
    container.appendChild(fragment);
    for (const node of Array.from(container.childNodes)) {
      if (
        node.nodeType === Node.TEXT_NODE &&
        (node.textContent ?? '').replace(/[\u200b\s]/g, '').length === 0
      ) {
        node.remove();
      }
    }
    const hasVisible =
      (container.textContent ?? '').replace(/\u200b/g, '').trim().length > 0 ||
      container.querySelector('img, figure, table, input, br') !== null;
    if (!hasVisible) {
      range.insertNode(container);
      container.replaceWith(...Array.from(container.childNodes));
      return true;
    }
    this.applyDataAttrToContainer(container, attr, String(color));
    const out = document.createDocumentFragment();
    while (container.firstChild) out.appendChild(container.firstChild);
    const first = out.firstChild;
    const last = out.lastChild;
    range.insertNode(out);
    if (first && last) {
      const select = document.createRange();
      if (first === last && first instanceof Element) {
        select.selectNodeContents(first);
      } else {
        select.setStartBefore(first);
        select.setEndAfter(last);
      }
      selection.removeAllRanges();
      selection.addRange(select);
    }
    this.emitFromDom();
    if (attr === 'data-color') {
      this.activeColor.set(color as SolarisRichTextColor);
    } else {
      this.activeHighlight.set(color as SolarisRichTextHighlight);
    }
    this.engine.rememberSelection();
    return true;
  }

  private expandRangeToFullySelectedWrappers(
    range: Range,
    host: HTMLElement,
  ): void {
    // Outermost first so a fully covered outer wrapper grows the range to
    // include everything at once.
    for (const el of this.collectInlineWrapperCandidates(range, host)) {
      if (!host.contains(el)) continue;
      if (!this.rangeFullyCoversElement(range, el)) continue;
      try {
        range.setStartBefore(el);
        range.setEndAfter(el);
      } catch {
        if (isDevMode())
          console.warn('[SolarisRichText] Span range expand failed.');
      }
    }
  }

  private collectInlineWrapperCandidates(
    range: Range,
    host: HTMLElement,
  ): Element[] {
    const candidates = new Set<Element>();
    for (const node of [range.startContainer, range.endContainer]) {
      this.collectWrapperAncestors(node, host, candidates);
    }
    return [...candidates].sort(
      (a, b) => this.depthWithin(a, host) - this.depthWithin(b, host),
    );
  }

  private collectWrapperAncestors(
    node: Node | null,
    host: HTMLElement,
    out: Set<Element>,
  ): void {
    let el = node instanceof Element ? node : (node?.parentElement ?? null);
    while (el && el !== host) {
      if (
        el.tagName === 'SPAN' ||
        SOLARIS_RICH_TEXT_INLINE_TAG_NAMES.has(el.tagName)
      ) {
        out.add(el);
      }
      const parent = el.parentElement;
      if (
        !parent ||
        parent === host ||
        SOLARIS_RICH_TEXT_BLOCK_BOUNDARY_TAG_NAMES.has(parent.tagName)
      ) {
        break;
      }
      el = parent;
    }
  }

  private depthWithin(el: Element, host: HTMLElement): number {
    let depth = 0;
    let current: Element | null = el;
    while (current && current !== host) {
      depth += 1;
      current = current.parentElement;
    }
    return depth;
  }

  private rangeFullyCoversElement(range: Range, el: Element): boolean {
    if (!el.firstChild) return true;
    try {
      let first: Node = el;
      while (first.firstChild) first = first.firstChild;
      let last: Node = el;
      while (last.lastChild) last = last.lastChild;
      const lastOffset =
        last.nodeType === Node.TEXT_NODE
          ? (last.textContent?.length ?? 0)
          : last.childNodes.length;
      const startProbe = document.createRange();
      startProbe.setStart(first, 0);
      startProbe.collapse(true);
      const endProbe = document.createRange();
      endProbe.setStart(last, lastOffset);
      endProbe.collapse(true);
      return (
        range.compareBoundaryPoints(Range.START_TO_START, startProbe) <= 0 &&
        range.compareBoundaryPoints(Range.END_TO_END, endProbe) >= 0
      );
    } catch {
      return false;
    }
  }

  private applyDataAttrToContainer(
    container: HTMLElement,
    attr: 'data-color' | 'data-highlight',
    color: string,
  ): void {
    if (color === 'default') {
      container.querySelectorAll(`span[${attr}]`).forEach((span) => {
        span.removeAttribute(attr);
        if (
          !span.hasAttribute('data-color') &&
          !span.hasAttribute('data-highlight')
        ) {
          span.replaceWith(...Array.from(span.childNodes));
        }
      });
      return;
    }
    for (const span of Array.from(
      container.querySelectorAll(`span[${attr}]`),
    )) {
      span.setAttribute(attr, color);
    }
    this.wrapBareInlineRuns(container, attr, color);
    for (const block of Array.from(
      container.querySelectorAll(
        'p, h1, h2, h3, blockquote, li, pre, td, th, figcaption',
      ),
    )) {
      if (container.contains(block)) {
        this.wrapBareInlineRuns(block, attr, color);
      }
    }
  }

  private wrapBareInlineRuns(
    parent: Element,
    attr: 'data-color' | 'data-highlight',
    color: string,
  ): void {
    const nodes = Array.from(parent.childNodes);
    let run: Node[] = [];
    const flush = (): void => {
      if (run.length === 0) return;
      const pending = run;
      run = [];
      const hasVisible = pending.some((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return (node.textContent ?? '').trim().length > 0;
        }
        return node.nodeName !== 'BR';
      });
      if (!hasVisible) return;
      if (
        pending.length === 1 &&
        pending[0] instanceof Element &&
        (pending[0] as Element).tagName === 'SPAN' &&
        !(pending[0] as Element).hasAttribute(attr)
      ) {
        (pending[0] as Element).setAttribute(attr, color);
        return;
      }
      const outer = document.createElement('span');
      outer.setAttribute(attr, color);
      parent.insertBefore(outer, pending[0]);
      for (const node of pending) outer.appendChild(node);
      this.mergeSingleNestedSpan(outer, attr);
    };
    for (const node of nodes) {
      if (
        node instanceof Element &&
        SOLARIS_RICH_TEXT_BLOCK_BOUNDARY_TAG_NAMES.has(node.tagName)
      ) {
        flush();
        continue;
      }
      if (
        node instanceof Element &&
        node.tagName === 'SPAN' &&
        node.getAttribute(attr) === color &&
        node.parentNode === parent
      ) {
        flush();
        continue;
      }
      run.push(node);
    }
    flush();
  }

  private mergeSingleNestedSpan(
    outer: Element,
    attr: 'data-color' | 'data-highlight',
  ): void {
    const only = Array.from(outer.childNodes).filter(
      (node) =>
        !(
          node.nodeType === Node.TEXT_NODE &&
          (node.textContent ?? '').trim().length === 0
        ),
    );
    if (only.length !== 1) return;
    const inner = only[0];
    if (!(inner instanceof Element) || inner.tagName !== 'SPAN') return;
    const other: 'data-color' | 'data-highlight' =
      attr === 'data-color' ? 'data-highlight' : 'data-color';
    if (
      !outer.hasAttribute(other) &&
      inner.hasAttribute(other) &&
      !inner.hasAttribute(attr) &&
      inner.childNodes.length > 0
    ) {
      outer.setAttribute(other, inner.getAttribute(other) ?? '');
      outer.append(...Array.from(inner.childNodes));
      inner.remove();
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
    this.insertCaretDataSpan(attr, color, active);
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
      this.engine.exitElement(span);
      active.set('default' as T);
      return true;
    }
    span.setAttribute(attr, color);
    active.set(color);
    return true;
  }

  private insertCaretDataSpan<T extends string>(
    attr: 'data-color' | 'data-highlight',
    color: T,
    active: WritableSignal<T>,
  ): void {
    if (color === 'default') return;
    active.set(color);
    this.engine.insertCaretMarker(
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
    if (this.engine.insertHtmlAtCaret(html)) {
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
    if (this.engine.insertHtmlAtCaret(figure)) {
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

  protected colorContrast(): { level: 'ok' | 'partial' | 'fail' } | null {
    if (typeof document === 'undefined') return null;
    try {
      const foreground = this.readProbeForeground();
      const background = this.readProbeBackground();
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

  private readProbeForeground(): SolarisRgb | null {
    if (typeof document === 'undefined') return null;
    // Why a probe inside the editing area: content color rules are scoped
    // to `.solaris-rich-text-editor-area`, and the popover renders in a CDK
    // overlay. Measuring here yields exactly what the editor renders, in
    // the current theme.
    const area = this.editorRef()?.nativeElement ?? null;
    if (!area) return null;
    const probe = document.createElement('span');
    const color = this.activeColor();
    if (color !== 'default') probe.setAttribute('data-color', color);
    return this.readProbeColor(area, probe);
  }

  private readProbeBackground(): SolarisRgb | null {
    if (typeof document === 'undefined') return null;
    const area = this.editorRef()?.nativeElement ?? null;
    if (!area) return null;
    const highlight = this.activeHighlight();
    if (highlight !== 'default') {
      const probe = document.createElement('span');
      probe.setAttribute('data-highlight', highlight);
      const tinted = this.readProbeBackgroundColor(area, probe);
      if (tinted) return tinted;
    }
    return this.readCanvasBackground();
  }

  private readProbeColor(
    area: HTMLElement,
    probe: HTMLElement,
  ): SolarisRgb | null {
    probe.textContent = 'A';
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    probe.setAttribute('aria-hidden', 'true');
    area.appendChild(probe);
    try {
      return parseCssRgb(getComputedStyle(probe).color);
    } finally {
      probe.remove();
    }
  }

  private readProbeBackgroundColor(
    area: HTMLElement,
    probe: HTMLElement,
  ): SolarisRgb | null {
    probe.textContent = 'A';
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    probe.setAttribute('aria-hidden', 'true');
    area.appendChild(probe);
    try {
      const parsed = parseCssRgba(getComputedStyle(probe).backgroundColor);
      return parsed && parsed.alpha >= 1 ? parsed.color : null;
    } finally {
      probe.remove();
    }
  }

  private readCanvasBackground(): SolarisRgb | null {
    // The verdict must reflect the editing canvas in the current theme,
    // not whatever surface happens to host the popover.
    let current: Element | null = this.editorRef()?.nativeElement ?? null;
    let hops = 0;
    while (current && hops < 20) {
      const parsed = parseCssRgba(getComputedStyle(current).backgroundColor);
      if (parsed && parsed.alpha >= 1) return parsed.color;
      current = current.parentElement;
      hops += 1;
    }
    return null;
  }

  protected pickTextColor(color: SolarisRichTextColor): void {
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
    this.engine.restoreSelection();
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
    let el = this.engine.selectionAnchorElement();
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

  private refocusEditorAfterOverlayClose(): void {
    if (typeof document === 'undefined') return;
    setTimeout(() => this.focus(), 0);
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
