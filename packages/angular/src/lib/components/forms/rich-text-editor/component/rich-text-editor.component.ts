import { CommonModule } from '@angular/common';
import type { WritableSignal } from '@angular/core';
import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
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
  buildTaskItemHtml,
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
  sanitizeRichTextHtml,
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
  SolarisRichTextEditorValueInput,
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
  SOLARIS_RICH_TEXT_BLOCK_DRAG_ACTIVATE_PX,
  SOLARIS_RICH_TEXT_BLOCK_DRAG_OUTSIDE_TOLERANCE_PX,
  SOLARIS_RICH_TEXT_CONTRAST_AA_LARGE_RATIO,
  SOLARIS_RICH_TEXT_CONTRAST_AA_RATIO,
  SOLARIS_RICH_TEXT_FORMAT_SWITCH_DURATION_MS,
  SOLARIS_RICH_TEXT_FORMAT_SWITCH_EASING,
  SOLARIS_RICH_TEXT_FORMAT_SLIDE_DURATION_MS,
  SOLARIS_RICH_TEXT_FORMAT_SLIDE_STAGGER_MS,
  SOLARIS_RICH_TEXT_HISTORY_IDLE_MS,
  SOLARIS_RICH_TEXT_IMAGE_PRESET_WIDTHS,
  SOLARIS_RICH_TEXT_INLINE_TAG_SHORTCUTS,
  SOLARIS_RICH_TEXT_MAX_HISTORY,
} from '../model/rich-text-editor.defaults';

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
      this.revokeAllObjectUrls();
    });
    effect(() => {
      const next = this.value();
      const editor = this.editorRef()?.nativeElement ?? null;
      if (!editor || typeof document === 'undefined') return;
      if (this._focused()) return;
      // SECURITY_EXCEPTION: reading edited HTML to compare with the model;
      const current = editor.innerHTML ?? '';
      if (current === next.html) return;
      if (cleanCommittedHtml(current) === next.html) return;
      // SECURITY_EXCEPTION: syncing external/programmatic values (e.g. an
      // initial [(value)] without ControlValueAccessor) requires writing
      // native innerHTML; same pattern as writeValue below. Write-only.
      editor.innerHTML = next.html;
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
  readonly clearOnSubmit = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
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
  protected readonly activeAlign = signal<SolarisRichTextAlign | 'mixed'>(
    'left',
  );
  protected readonly activeColor = signal<SolarisRichTextColor>('default');
  protected readonly activeHighlight =
    signal<SolarisRichTextHighlight>('default');
  private readonly historyPast = signal<readonly SolarisRichTextValue[]>([]);
  private readonly historyFuture = signal<readonly SolarisRichTextValue[]>([]);
  private lastHistoryAt: number | null = null;
  private lastHistoryKind: SolarisRichTextHistoryKind | null = null;
  private pendingBlockDrag: {
    block: HTMLElement;
    pointerId: number;
    startX: number;
    startY: number;
    active: boolean;
  } | null = null;
  private suppressClickAfterBlockDrag = false;
  private draggingBlock: HTMLElement | null = null;
  private dropTarget: HTMLElement | null = null;
  private dropValid = false;
  protected readonly imagePanelVisible = signal(false);
  protected readonly imagePanelTop = signal(0);
  protected readonly imagePanelLeft = signal(0);
  protected readonly imageBordered = signal(false);
  protected readonly imageLinkUrl = signal('');
  protected readonly imageWidth = signal(0);
  protected readonly imageHeight = signal(0);
  protected readonly imageResizing = signal(false);
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

  writeValue(input: SolarisRichTextEditorValueInput): void {
    this.value.set(normalizeEditorValue(input));
    this.syncEditorDom();
  }

  submit(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    this.emitSubmitted();
  }

  private emitSubmitted(): void {
    this.submitted.emit(this.value());
    if (!this.clearOnSubmit()) return;
    this.commitValue(createEmptyValue(), false);
    this.syncEditorDom();
    this.updateActiveStates();
    this.focus();
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
    const origin = event.target as HTMLElement | null;
    if (origin?.closest?.('input[data-task-checkbox]')) return;
    this.normalizeTaskCheckboxesInDom();
    const host = this.editorRef()?.nativeElement ?? null;
    if (!host) return;
    this.removeEmptyFigures(host);
    // SECURITY_EXCEPTION: reading edited HTML requires the native property; same pattern as Angular CDK form controls. Read-only.
    const rawHtml = host.innerHTML ?? '';
    if (this.contentFormat() === 'plain') {
      const text = stripHtmlToText(rawHtml);
      const expected = text.length > 0 ? `<p>${escapeHtml(text)}</p>` : '';
      const max = this.maxLength();
      if (max !== undefined && Array.from(text).length > max) {
        // SECURITY_EXCEPTION: reverting over-limit input to the last committed HTML; write-only.
        host.innerHTML = this.value().html;
        this.placeCaretAtEnd(host);
        return;
      }
      if (rawHtml !== expected) {
        // SECURITY_EXCEPTION: plain mode normalizes pasted rich HTML to escaped paragraphs; write-only, prevents tag injection.
        host.innerHTML = expected;
      }
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
    if (max !== undefined && Array.from(text).length > max) {
      // SECURITY_EXCEPTION: reverting over-limit input to the last committed HTML; write-only.
      host.innerHTML = this.value().html;
      this.placeCaretAtEnd(host);
      return;
    }
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

  protected onEditorBeforeinput(event: Event): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (typeof document === 'undefined') return;
    const context = this.figureBeforeinputContext(event);
    if (!context) return;
    event.preventDefault();
    if (context.input.inputType.startsWith('delete')) {
      this.handleFigureDeleteInput(context);
      return;
    }
    this.moveCaretAfterFigure(context);
    this.dispatchFigureInput(context);
  }

  private figureBeforeinputContext(event: Event): {
    input: InputEvent;
    figure: HTMLElement;
    editor: HTMLElement;
  } | null {
    const input = event as InputEvent;
    if (input.inputType.startsWith('history')) return null;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor) return null;
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return null;
    const figure =
      this.figureOf(range.commonAncestorContainer) ??
      this.figureOf(range.startContainer) ??
      this.figureOf(range.endContainer);
    if (!figure || !editor.contains(figure)) return null;
    return { input, figure, editor };
  }

  private handleFigureDeleteInput(context: {
    input: InputEvent;
    figure: HTMLElement;
  }): void {
    if (context.input.inputType === 'deleteByCut') {
      this.copyFigureMarkup(context.figure);
    }
    this.removeFigureNode(context.figure);
  }

  private moveCaretAfterFigure(context: { figure: HTMLElement }): void {
    this.engine.deselectFigure();
    this.syncImagePanel();
    const selection = document.getSelection();
    if (!selection) return;
    const after = document.createRange();
    after.setStartAfter(context.figure);
    after.collapse(true);
    selection.removeAllRanges();
    selection.addRange(after);
  }

  private dispatchFigureInput(context: {
    input: InputEvent;
    figure: HTMLElement;
  }): void {
    const { input, figure } = context;
    if (
      input.inputType === 'insertParagraph' ||
      input.inputType === 'insertLineBreak'
    ) {
      this.insertParagraphAfterFigure(figure, input.inputType);
      this.updateActiveStates();
      this.emitFromDom();
      return;
    }
    if (
      input.inputType === 'insertText' ||
      input.inputType === 'insertCompositionText' ||
      input.inputType === 'insertFromYank'
    ) {
      const native = this.insertTextAfterFigure(input.data ?? '');
      this.updateActiveStates();
      if (!native) this.emitFromDom();
      return;
    }
    if (
      input.inputType === 'insertFromPaste' ||
      input.inputType === 'insertFromDrop'
    ) {
      this.pasteAfterFigure(input);
      this.updateActiveStates();
      this.emitFromDom();
      return;
    }
    this.updateActiveStates();
  }

  private figureOf(node: Node | null): HTMLElement | null {
    const el = node instanceof Element ? node : (node?.parentElement ?? null);
    return (el?.closest?.('figure[data-image]') as HTMLElement | null) ?? null;
  }

  private copyFigureMarkup(figure: HTMLElement): void {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    const html = figure.outerHTML;
    if (!html) return;
    void navigator.clipboard.writeText(html).catch(() => {
      if (isDevMode()) console.warn('[SolarisRichText] Image cut failed.');
    });
  }

  private removeFigureNode(figure: HTMLElement): void {
    if (typeof document === 'undefined') return;
    try {
      this.engine.deselectFigure();
      const selection = document.getSelection();
      const after = document.createRange();
      after.setStartAfter(figure);
      after.collapse(true);
      this.revokeFigureObjectUrl(figure);
      figure.remove();
      selection?.removeAllRanges();
      selection?.addRange(after);
    } catch {
      this.revokeFigureObjectUrl(figure);
      figure.remove();
    }
    this.imageRemoved.emit();
    this.updateActiveStates();
    this.emitFromDom();
    this.syncImagePanel();
  }

  private insertTextAfterFigure(data: string): boolean {
    if (data.length === 0 || typeof document === 'undefined') return true;
    try {
      if (document.execCommand('insertText', false, data)) return true;
    } catch {
      // Fall through to the manual text-node insert below.
    }
    const selection = document.getSelection();
    const range =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    if (!range) return true;
    const text = document.createTextNode(data);
    range.insertNode(text);
    range.setStartAfter(text);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
    return false;
  }

  private insertParagraphAfterFigure(
    figure: HTMLElement,
    kind: 'insertParagraph' | 'insertLineBreak',
  ): void {
    if (typeof document === 'undefined') return;
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (kind === 'insertLineBreak') {
      const br = document.createElement('br');
      range.insertNode(br);
      range.setStartAfter(br);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
    const paragraph = document.createElement('p');
    paragraph.append(document.createElement('br'));
    figure.after(paragraph);
    const caret = document.createRange();
    caret.selectNodeContents(paragraph);
    caret.collapse(true);
    selection.removeAllRanges();
    selection.addRange(caret);
  }

  private pasteAfterFigure(input: InputEvent): void {
    if (typeof document === 'undefined') return;
    const transfer = input.dataTransfer;
    const html = transfer?.getData('text/html');
    if (html && html.trim().length > 0) {
      this.engine.insertHtmlAtCaret(sanitizeRichTextHtml(html));
      return;
    }
    const text =
      transfer?.getData('text/plain') ?? (input as InputEvent).data ?? '';
    if (text.length > 0) this.insertTextAfterFigure(text);
  }

  private removeEmptyFigures(host: HTMLElement): void {
    for (const figure of Array.from(
      host.querySelectorAll('figure[data-image]'),
    )) {
      if (!figure.querySelector('img')) {
        figure.remove();
      }
    }
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
    this.normalizeTaskCheckboxesInDom();
    if (this.autofocus() && !this.isEffectivelyDisabled()) {
      this.focus();
    }
  }

  protected onEditorKeydown(event: KeyboardEvent): void {
    if (this.handleCodeKey(event)) return;
    if (this.handleResizeHandleKey(event)) return;
    if (this.handleLinkShortcut(event)) return;
    if (this.handleAlignShortcuts(event)) return;
    if (this.handleListShortcuts(event)) return;
    if (this.handleTaskListEnter(event)) return;
    if (this.handleWrapExitEnter(event)) return;
    if (this.handleBlockMoveKey(event)) return;
    if (this.handleTableTab(event)) return;
    if (this.handleListTab(event)) return;
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

  private handleAlignShortcuts(event: KeyboardEvent): boolean {
    if (!(event.ctrlKey || event.metaKey) || !event.shiftKey || event.altKey) {
      return false;
    }
    const alignForCode: Record<string, SolarisRichTextAlign> = {
      KeyL: 'left',
      KeyC: 'center',
      KeyR: 'right',
      KeyJ: 'justify',
    };
    const align = alignForCode[event.code];
    if (!align) return false;
    event.preventDefault();
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return true;
    this.setAlign(align);
    return true;
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
    this.emitSubmitted();
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
    if (target?.closest?.('.solaris-block-grip')) return;
    if (target?.closest?.('input[data-task-checkbox]')) return;
    const handle = target?.closest?.(
      '.solaris-image-resize-handle',
    ) as HTMLElement | null;
    if (handle) {
      const figure = handle.closest('figure[data-image]') as HTMLElement | null;
      if (figure) {
        const direction = (handle.getAttribute('data-direction') ??
          'southeast') as 'west' | 'east' | 'southeast';
        this.imageResizing.set(true);
        this.engine.startFigureResize(
          event,
          figure,
          () => {
            this.imageResizing.set(false);
            this.emitFromDom();
            this.syncImagePanel();
          },
          direction,
          (width) => {
            this.imageWidth.set(Math.round(width));
            const img = figure.querySelector('img');
            if (img) {
              const imgRect = img.getBoundingClientRect();
              if (imgRect.height > 0) {
                this.imageHeight.set(Math.round(imgRect.height));
              }
            }
          },
        );
      }
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

  protected onEditorMouseover(event: MouseEvent): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (typeof document === 'undefined') return;
    if (this.contentFormat() !== 'rich') return;
    const target = event.target as HTMLElement | null;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor) return;
    if (!this.draggingBlock && !this.pendingBlockDrag) {
      const block =
        target && editor.contains(target)
          ? this.movableBlockOf(target, editor)
          : null;
      if (block) this.engine.attachBlockGrip(block);
    }
    const figure = target?.closest?.(
      'figure[data-image]',
    ) as HTMLElement | null;
    if (!figure || !editor?.contains(figure)) return;
    if (figure.hasAttribute('data-selected')) return;
    this.engine.attachHoverHandle(
      figure,
      this.translateService.translate('solaris.rich-text.imageResize'),
    );
  }

  protected onEditorMouseout(event: MouseEvent): void {
    if (typeof document === 'undefined') return;
    const target = event.target as HTMLElement | null;
    this.maybeClearBlockGrip(target, event.relatedTarget as HTMLElement | null);
    this.maybeClearFigureHover(
      target,
      event.relatedTarget as HTMLElement | null,
    );
  }

  private maybeClearBlockGrip(
    target: HTMLElement | null,
    related: HTMLElement | null,
  ): void {
    if (this.draggingBlock || this.pendingBlockDrag) return;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor || !target || !editor.contains(target)) {
      this.engine.clearBlockGrip();
      return;
    }
    const block = this.movableBlockOf(target, editor);
    const relatedInside = !!related && editor.contains(related);
    const relatedBlock = relatedInside
      ? this.movableBlockOf(related as HTMLElement, editor)
      : null;
    const leftEditor = !related || !relatedInside;
    const movedToOther =
      relatedBlock !== null &&
      relatedBlock !== block &&
      (block === null ||
        (!relatedBlock.contains(block) && !block.contains(relatedBlock)));
    if (block && (leftEditor || movedToOther)) {
      this.engine.clearBlockGrip();
    }
  }

  private maybeClearFigureHover(
    target: HTMLElement | null,
    related: HTMLElement | null,
  ): void {
    const figure = target?.closest?.(
      'figure[data-image]',
    ) as HTMLElement | null;
    if (!figure) return;
    const relatedFigure = (related as HTMLElement | null)?.closest?.(
      'figure[data-image]',
    ) as HTMLElement | null;
    if (relatedFigure === figure) return;
    this.engine.clearHoverHandle(figure);
  }

  private movableBlockOf(
    node: Node | null,
    editor: HTMLElement,
  ): HTMLElement | null {
    let el = node instanceof Element ? node : (node?.parentElement ?? null);
    while (el && el !== editor) {
      if (el.tagName === 'LI' && this.engine.isMovableBlock(el)) {
        return el as HTMLElement;
      }
      if (el.parentElement === editor) break;
      el = el.parentElement;
    }
    return el && el !== editor && this.engine.isMovableBlock(el)
      ? (el as HTMLElement)
      : null;
  }

  private handleBlockMoveKey(event: KeyboardEvent): boolean {
    if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return false;
    }
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return false;
    if (typeof document === 'undefined') return false;
    if (this.contentFormat() !== 'rich') return false;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor) return false;
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) return false;
    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return false;
    const block = this.movableBlockOf(range.commonAncestorContainer, editor);
    if (!block?.parentElement) return false;
    event.preventDefault();
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return true;
    const parent = block.parentElement;
    const sibling =
      event.key === 'ArrowUp'
        ? block.previousElementSibling
        : block.nextElementSibling;
    if (
      !(sibling instanceof HTMLElement) ||
      sibling.parentElement !== parent ||
      !this.engine.isMovableBlock(sibling)
    ) {
      return true;
    }
    if (event.key === 'ArrowUp') {
      sibling.before(block);
    } else {
      parent.insertBefore(block, sibling.nextSibling);
    }
    this.emitFromDom();
    this.updateActiveStates();
    this.syncImagePanel();
    this.syncCodePanel();
    return true;
  }

  protected onEditorPointerdown(event: PointerEvent): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    if (event.button !== 0 || event.isPrimary === false) return;
    if (typeof document === 'undefined') return;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor) return;
    const target = event.target as HTMLElement | null;
    const grip = target?.closest?.('.solaris-block-grip') as HTMLElement | null;
    const block = grip?.parentElement ?? null;
    if (
      !grip ||
      !block ||
      !editor.contains(block) ||
      !this.engine.isMovableBlock(block)
    ) {
      return;
    }
    event.preventDefault();
    try {
      if (typeof editor.setPointerCapture === 'function') {
        editor.setPointerCapture(event.pointerId);
      }
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Block drag failed.');
    }
    this.pendingBlockDrag = {
      block,
      pointerId: event.pointerId ?? 0,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
    };
  }

  protected onEditorPointermove(event: PointerEvent): void {
    const pending = this.pendingBlockDrag;
    if ((event.pointerId ?? 0) !== pending?.pointerId) return;
    if (typeof document === 'undefined') return;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor?.contains(pending.block)) {
      this.cancelBlockDrag();
      return;
    }
    if (!pending.active) {
      const moved = Math.max(
        Math.abs(event.clientX - pending.startX),
        Math.abs(event.clientY - pending.startY),
      );
      if (moved <= SOLARIS_RICH_TEXT_BLOCK_DRAG_ACTIVATE_PX) return;
      pending.active = true;
      pending.block.setAttribute('data-dragging', '');
      this.draggingBlock = pending.block;
      this.dropTarget = null;
      this.dropValid = false;
    }
    this.updateBlockDropIndicator(event.clientY);
  }

  protected onEditorPointerup(event: PointerEvent): void {
    const pending = this.pendingBlockDrag;
    if ((event.pointerId ?? 0) !== pending?.pointerId) return;
    const dragged = pending.block;
    const wasActive = pending.active;
    const editor = this.editorRef()?.nativeElement ?? null;
    const ref = this.resolveDropReference(editor, wasActive);
    const valid = wasActive && this.dropValid;
    this.teardownBlockDrag(editor, event.pointerId);
    if (!editor?.contains(dragged)) return;
    dragged.removeAttribute('data-dragging');
    if (!wasActive) return;
    this.suppressClickAfterBlockDrag = true;
    if (!valid || this.isIdentityDrop(dragged, ref)) return;
    this.engine.moveBlockBefore(dragged, ref);
    this.placeCaretInDroppedBlock(editor, dragged);
    this.emitFromDom();
    this.updateActiveStates();
    this.syncImagePanel();
  }

  private resolveDropReference(
    editor: HTMLElement | null,
    wasActive: boolean,
  ): HTMLElement | null {
    if (!wasActive || !this.dropValid || !this.dropTarget) return null;
    if (!editor?.contains(this.dropTarget)) return null;
    return this.dropTarget;
  }

  private teardownBlockDrag(
    editor: HTMLElement | null,
    pointerId: number,
  ): void {
    this.releaseBlockDragPointer(editor, pointerId);
    this.pendingBlockDrag = null;
    this.draggingBlock = null;
    this.dropTarget = null;
    this.dropValid = false;
    this.engine.clearBlockDropLine();
  }

  private isIdentityDrop(
    dragged: HTMLElement,
    ref: HTMLElement | null,
  ): boolean {
    if (ref === dragged) return true;
    const next = this.nextMovableSibling(dragged);
    if (ref === next) return true;
    return !ref && next === null;
  }

  private nextMovableSibling(block: HTMLElement): HTMLElement | null {
    for (
      let sibling = block.nextElementSibling;
      sibling !== null;
      sibling = sibling.nextElementSibling
    ) {
      if (
        sibling instanceof HTMLElement &&
        this.engine.isMovableBlock(sibling)
      ) {
        return sibling;
      }
    }
    return null;
  }

  private placeCaretInDroppedBlock(
    editor: HTMLElement,
    dragged: HTMLElement,
  ): void {
    try {
      const selection = document.getSelection();
      const caret = document.createRange();
      caret.selectNodeContents(dragged);
      caret.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(caret);
      editor.focus({ preventScroll: true });
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Block drop failed.');
    }
  }

  protected onEditorPointercancel(event: PointerEvent): void {
    const pending = this.pendingBlockDrag;
    if ((event.pointerId ?? 0) !== pending?.pointerId) return;
    this.releaseBlockDragPointer(
      this.editorRef()?.nativeElement ?? null,
      event.pointerId,
    );
    this.cancelBlockDrag();
  }

  private releaseBlockDragPointer(
    editor: HTMLElement | null,
    pointerId: number,
  ): void {
    try {
      if (
        editor &&
        typeof editor.releasePointerCapture === 'function' &&
        editor.hasPointerCapture?.(pointerId)
      ) {
        editor.releasePointerCapture(pointerId);
      }
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Block drag failed.');
    }
  }

  private cancelBlockDrag(): void {
    this.pendingBlockDrag?.block.removeAttribute?.('data-dragging');
    this.pendingBlockDrag = null;
    this.draggingBlock = null;
    this.dropTarget = null;
    this.dropValid = false;
    this.engine.clearBlockDropLine();
  }

  private clearBlockDropState(): void {
    this.dropTarget = null;
    this.dropValid = false;
    this.engine.clearBlockDropLine();
  }

  private updateBlockDropIndicator(clientY: number): void {
    const dragged = this.draggingBlock;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!dragged || !editor?.contains(dragged)) {
      this.clearBlockDropState();
      return;
    }
    const editorRect = editor.getBoundingClientRect();
    if (
      clientY <
        editorRect.top - SOLARIS_RICH_TEXT_BLOCK_DRAG_OUTSIDE_TOLERANCE_PX ||
      clientY >
        editorRect.bottom + SOLARIS_RICH_TEXT_BLOCK_DRAG_OUTSIDE_TOLERANCE_PX
    ) {
      this.clearBlockDropState();
      return;
    }
    const parent = dragged.parentElement;
    const blocks: HTMLElement[] =
      parent === null
        ? []
        : Array.from(parent.children).filter((child): child is HTMLElement =>
            this.engine.isMovableBlock(child),
          );
    const selfIndex = blocks.indexOf(dragged);
    let insertion = blocks.length;
    for (let index = 0; index < blocks.length; index += 1) {
      const rect = blocks[index].getBoundingClientRect();
      if (clientY <= rect.top + rect.height / 2) {
        insertion = index;
        break;
      }
    }
    const isSelfSlot =
      selfIndex !== -1 &&
      (insertion === selfIndex || insertion === selfIndex + 1);
    if (
      isSelfSlot ||
      (insertion === blocks.length && !this.dropEndValid(dragged, clientY))
    ) {
      this.clearBlockDropState();
      return;
    }
    const ref = insertion < blocks.length ? blocks[insertion] : null;
    this.dropTarget = ref;
    this.dropValid = true;
    if (ref) {
      const rect = ref.getBoundingClientRect();
      this.engine.showBlockDropLine(
        rect.top - editorRect.top + editor.scrollTop,
      );
      return;
    }
    const container = parent ?? editor;
    const containerRect =
      container === editor ? editorRect : container.getBoundingClientRect();
    this.engine.showBlockDropLine(
      Math.min(
        editor.scrollHeight,
        containerRect.bottom - editorRect.top + editor.scrollTop,
      ),
    );
  }

  private dropEndValid(dragged: HTMLElement, clientY: number): boolean {
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor) return false;
    if (dragged.parentElement === editor) return true;
    const container = dragged.parentElement;
    if (!(container instanceof HTMLElement)) return false;
    const rect = container.getBoundingClientRect();
    return clientY >= rect.top - 8 && clientY <= rect.bottom + 32;
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
    this.syncImagePanel();
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
    const figure = this.engine.selectedFigure();
    let changed = false;
    if (figure && (align === 'start-wrap' || align === 'end-wrap')) {
      const editor = this.editorRef()?.nativeElement ?? null;
      if (editor) {
        const half = Math.max(44, Math.round((editor.clientWidth - 2) / 2));
        const current =
          figure.getBoundingClientRect().width ||
          Number.parseFloat(figure.style.width) ||
          0;
        if (current > half) {
          this.resizeFigure(figure, half);
          changed = true;
        }
      }
      if (!figure.nextElementSibling && typeof document !== 'undefined') {
        const paragraph = document.createElement('p');
        paragraph.append(document.createElement('br'));
        figure.after(paragraph);
        changed = true;
      }
    }
    this.updateActiveStates();
    if (changed) this.emitFromDom();
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
    this.revokeFigureObjectUrl(figure);
    figure.remove();
    this.emitFromDom();
    this.imageRemoved.emit();
    this.syncImagePanel();
  }

  private revokeFigureObjectUrl(figure: HTMLElement): void {
    const src = figure.querySelector('img')?.getAttribute('src') ?? '';
    if (!src.startsWith('blob:')) return;
    const index = this.objectUrls.indexOf(src);
    if (index !== -1) this.objectUrls.splice(index, 1);
    try {
      URL.revokeObjectURL(src);
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Image revoke failed.');
    }
  }

  private revokeAllObjectUrls(): void {
    for (const url of this.objectUrls.splice(0)) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        if (isDevMode()) console.warn('[SolarisRichText] Image revoke failed.');
      }
    }
  }

  @HostListener('keydown.escape')
  protected closeImagePanel(): void {
    this.engine.deselectFigure();
    this.syncImagePanel();
    this.focus();
  }

  protected focusImageHandle(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const figure = this.engine.selectedFigure();
    const handle =
      figure?.querySelector<HTMLElement>(
        '.solaris-image-resize-handle--east',
      ) ?? figure?.querySelector<HTMLElement>('.solaris-image-resize-handle');
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

  protected prepareImageDialog(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    this.engine.restoreSelection();
    this.imageLinkUrl.set('');
  }

  protected insertImageLink(url: string): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const safe = url.trim();
    if (!isSafeHttpUrl(safe)) {
      this.imageRejected.emit({ fileName: safe, error: 'type-not-allowed' });
      return;
    }
    const fileName = safe.split('?')[0].split('/').pop() || 'image';
    const alt = decodeURIComponent(fileName).replace(/\.[^.]+$/, '') || 'image';
    this.insertImageUrl(safe, alt, fileName);
    this.imageLinkUrl.set('');
  }

  protected updateImageAlt(alt: string): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const figure = this.engine.selectedFigure();
    const img = figure?.querySelector('img');
    if (!figure || !img) return;
    const next = alt.trim();
    if (next.length === 0) {
      this.imageRejected.emit({
        fileName: img.getAttribute('src') ?? '',
        error: 'missing-alt',
      });
      return;
    }
    img.setAttribute('alt', next);
    this.emitFromDom();
    this.syncImagePanel();
  }

  protected toggleImageLink(url: string): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    const figure = this.engine.selectedFigure();
    const img = figure?.querySelector('img');
    if (!figure || !img) return;
    const existing = figure.querySelector('a');
    if (existing) {
      existing.replaceWith(...Array.from(existing.childNodes));
      this.emitFromDom();
      this.syncImagePanel();
      return;
    }
    const safe = url.trim();
    if (!isSafeHttpUrl(safe)) {
      this.imageRejected.emit({ fileName: safe, error: 'type-not-allowed' });
      return;
    }
    const anchor = document.createElement('a');
    anchor.setAttribute('href', safe);
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener');
    img.replaceWith(anchor);
    anchor.appendChild(img);
    this.emitFromDom();
    this.syncImagePanel();
  }

  protected promptImageAlt(): void {
    if (typeof window === 'undefined') return;
    const figure = this.engine.selectedFigure();
    const current = figure?.querySelector('img')?.getAttribute('alt') ?? '';
    const next = window.prompt(
      this.translateService.translate('solaris.rich-text.imageAltLabel'),
      current,
    );
    if (next === null) return;
    this.updateImageAlt(next);
  }

  protected promptImageLink(): void {
    if (typeof window === 'undefined') return;
    const figure = this.engine.selectedFigure();
    const current = figure?.querySelector('a')?.getAttribute('href') ?? '';
    const next = window.prompt(
      this.translateService.translate('solaris.rich-text.imageLinkLabel'),
      current,
    );
    if (next === null) return;
    if (next.trim().length === 0) {
      this.toggleImageLinkRemove();
      return;
    }
    this.toggleImageLink(next);
  }

  private toggleImageLinkRemove(): void {
    const figure = this.engine.selectedFigure();
    const existing = figure?.querySelector('a');
    if (!figure || !existing) return;
    existing.replaceWith(...Array.from(existing.childNodes));
    this.emitFromDom();
    this.syncImagePanel();
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
      ) as HTMLElement | null;
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
      this.imageWidth.set(Math.round(rect.width));
      const img = figure.querySelector('img');
      if (img) {
        const imgRect = img.getBoundingClientRect();
        this.imageHeight.set(Math.round(imgRect.height));
      } else {
        this.imageHeight.set(Math.round(rect.height));
      }
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
    if (!this.isFloatingToolbar()) {
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
    if (this.engine.insertListAtCaret(html)) {
      this.emitFromDom(
        insertBlockEntry(
          this.value().blocks,
          kind === 'ul' ? 'bullet-list' : 'ordered-list',
          items.join(' '),
        ),
      );
    }
    this.refocusEditorAfterOverlayClose();
  }

  protected insertTaskList(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    this.engine.restoreSelection();
    const items = this.takeSelectedLines() ?? [''];
    const html = buildTaskListHtml(items);
    if (this.engine.insertListAtCaret(html)) {
      this.emitFromDom(
        insertBlockEntry(this.value().blocks, 'bullet-list', items.join(' ')),
      );
    }
    this.refocusEditorAfterOverlayClose();
  }

  private handleTaskListEnter(event: KeyboardEvent): boolean {
    if (event.key !== 'Enter') return false;
    if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey)
      return false;
    if (typeof document === 'undefined') return false;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor) return false;
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.isCollapsed)
      return false;
    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return false;
    const host =
      range.startContainer instanceof Element
        ? range.startContainer
        : (range.startContainer.parentElement ?? null);
    const li = host?.closest?.('li') as HTMLElement | null;
    if (!li || !editor.contains(li)) return false;
    const list = li.parentElement;
    if (list?.tagName !== 'UL' || !list.hasAttribute('data-task-list'))
      return false;
    event.preventDefault();
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return true;
    const text = (li.textContent ?? '').replace(/[\u200b\u00a0]/g, '').trim();
    if (text.length === 0) {
      this.exitTaskList(li, list);
    } else {
      this.splitTaskListItem(li);
    }
    return true;
  }

  private handleWrapExitEnter(event: KeyboardEvent): boolean {
    if (event.key !== 'Enter') return false;
    if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey)
      return false;
    if (typeof document === 'undefined') return false;
    if (this.contentFormat() !== 'rich') return false;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor) return false;
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.isCollapsed)
      return false;
    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return false;
    const block = this.wrapExitBlockOf(range.startContainer, editor);
    if (!block || !this.isEmptyBlock(block)) return false;
    const figure = this.nearestWrapFigureBefore(block);
    if (!figure || !editor.contains(figure)) return false;
    try {
      const figureRect = figure.getBoundingClientRect();
      const blockRect = block.getBoundingClientRect();
      if (figureRect.bottom <= blockRect.top + 4) return false;
    } catch {
      return false;
    }
    event.preventDefault();
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return true;
    this.exitWrapBelow(figure, block);
    return true;
  }

  private wrapExitBlockOf(
    node: Node | null,
    editor: HTMLElement,
  ): HTMLElement | null {
    let el = node instanceof Element ? node : (node?.parentElement ?? null);
    while (
      el &&
      el !== editor &&
      !/^(P|H1|H2|H3|BLOCKQUOTE|DIV)$/.test(el.tagName)
    ) {
      el = el.parentElement;
    }
    return el && el !== editor ? (el as HTMLElement) : null;
  }

  private isEmptyBlock(block: HTMLElement): boolean {
    const text = (block.textContent ?? '').replace(/[\u200b\u00a0\s]/g, '');
    if (text.length > 0) return false;
    return !block.querySelector('img, table, figure, input, [data-mention]');
  }

  private nearestWrapFigureBefore(block: HTMLElement): HTMLElement | null {
    let sibling = block.previousElementSibling;
    while (sibling) {
      if (
        sibling instanceof HTMLElement &&
        sibling.tagName === 'FIGURE' &&
        sibling.hasAttribute('data-image')
      ) {
        const align = sibling.getAttribute('data-align');
        if (align === 'start-wrap' || align === 'end-wrap') return sibling;
        return null;
      }
      sibling = sibling.previousElementSibling;
    }
    return null;
  }

  private exitWrapBelow(
    figure: HTMLElement,
    currentBlock: HTMLElement | null,
  ): void {
    if (typeof document === 'undefined') return;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor) return;
    let target: HTMLElement | null = null;
    if (
      currentBlock?.parentElement === figure.parentElement &&
      currentBlock !== figure &&
      this.isEmptyBlock(currentBlock) &&
      Boolean(
        figure.compareDocumentPosition(currentBlock) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      )
    ) {
      target = currentBlock;
    } else {
      target = this.exitTargetAfterFigure(figure);
    }
    target.setAttribute('data-clear', 'both');
    this.engine.deselectFigure();
    this.updateActiveStates();
    this.emitFromDom();
    this.syncImagePanel();
    editor.focus({ preventScroll: true });
    try {
      const selection = document.getSelection();
      const caret = document.createRange();
      caret.selectNodeContents(target);
      caret.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(caret);
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Wrap exit failed.');
    }
  }

  /**
   * Finds the exit paragraph after a figure without moving existing content:
   * reuses a trailing empty paragraph, otherwise appends a new one after the
   * run of text blocks that follows the figure.
   */
  private exitTargetAfterFigure(figure: HTMLElement): HTMLElement {
    let last: HTMLElement | null = null;
    let sibling = figure.nextElementSibling;
    while (
      sibling instanceof HTMLElement &&
      /^(P|H1|H2|H3|BLOCKQUOTE)$/.test(sibling.tagName)
    ) {
      last = sibling;
      sibling = sibling.nextElementSibling;
    }
    if (last && this.isEmptyBlock(last)) return last;
    const paragraph = document.createElement('p');
    paragraph.append(document.createElement('br'));
    (last ?? figure).after(paragraph);
    return paragraph;
  }

  protected jumpCaretBelowImage(): void {
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return;
    if (this.contentFormat() !== 'rich') return;
    const figure = this.engine.selectedFigure();
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!figure || !editor?.contains(figure)) return;
    this.exitWrapBelow(figure, null);
    this.refocusEditorAfterOverlayClose();
  }

  private splitTaskListItem(current: HTMLElement): void {
    if (typeof document === 'undefined') return;
    const next = document.createElement('li');
    // SECURITY_EXCEPTION: new task item uses the builder-escaped helper; no raw consumer HTML.
    next.innerHTML = buildTaskItemHtml('').replace(/^<li>|<\/li>$/g, '');
    current.after(next);
    this.engine.collapseCaretInListItem(next);
    this.editorRef()?.nativeElement.focus({ preventScroll: true });
    this.emitFromDom();
  }

  private exitTaskList(li: HTMLElement, list: HTMLElement): void {
    if (typeof document === 'undefined') return;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor) return;
    const paragraph = document.createElement('p');
    paragraph.append(document.createElement('br'));
    if (list.querySelectorAll('li').length <= 1) {
      list.replaceWith(paragraph);
    } else {
      li.remove();
      list.after(paragraph);
    }
    try {
      const selection = document.getSelection();
      const range = document.createRange();
      range.selectNodeContents(paragraph);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
      editor.focus({ preventScroll: true });
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Task list exit failed.');
    }
    this.emitFromDom();
  }

  protected onEditorClick(event: MouseEvent): void {
    if (this.suppressClickAfterBlockDrag) {
      this.suppressClickAfterBlockDrag = false;
      return;
    }
    const target = event.target as HTMLElement | null;
    this.normalizeTaskCheckboxesInDom();
    const checkbox = target?.closest?.(
      'input[data-task-checkbox]',
    ) as HTMLInputElement | null;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!checkbox || !editor?.contains(checkbox)) return;
    if (this.isEffectivelyDisabled() || this.readonlyInput()) {
      event.preventDefault();
      return;
    }
    if (checkbox.checked) {
      checkbox.setAttribute('checked', '');
    } else {
      checkbox.removeAttribute('checked');
    }
    this.emitFromDom();
  }

  private handleTableTab(event: KeyboardEvent): boolean {
    if (event.key !== 'Tab') return false;
    if (event.ctrlKey || event.metaKey || event.altKey) return false;
    if (typeof document === 'undefined') return false;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor) return false;
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.isCollapsed)
      return false;
    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return false;
    const cell = this.closestTableCell(range.startContainer, editor);
    if (!cell || !editor.contains(cell)) return false;
    event.preventDefault();
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return true;
    this.moveTableCaret(editor, cell, !event.shiftKey);
    this.updateActiveStates();
    return true;
  }

  private closestTableCell(
    node: Node | null,
    editor: HTMLElement,
  ): HTMLElement | null {
    let el = node instanceof Element ? node : (node?.parentElement ?? null);
    while (el && el !== editor) {
      if (el.tagName === 'TD' || el.tagName === 'TH') {
        return el as HTMLElement;
      }
      el = el.parentElement;
    }
    return null;
  }

  private moveTableCaret(
    editor: HTMLElement,
    cell: HTMLElement,
    forward: boolean,
  ): void {
    const table = cell.closest('table');
    if (!table || !editor.contains(table)) return;
    const cells = Array.from(table.querySelectorAll('th, td')).filter(
      (candidate): candidate is HTMLElement =>
        candidate instanceof HTMLElement ? editor.contains(candidate) : false,
    );
    const index = cells.indexOf(cell);
    if (index === -1) return;
    const target = forward ? cells[index + 1] : cells[index - 1];
    if (target) {
      this.collapseCaretInCell(target, forward);
      return;
    }
    if (forward) {
      this.focusParagraphAfterTable(editor, table);
    } else {
      this.focusEndOfPreviousBlock(editor, table, cell);
    }
  }

  private collapseCaretInCell(cell: HTMLElement, atStart: boolean): void {
    try {
      const selection = document.getSelection();
      if (!selection) return;
      const caret = document.createRange();
      caret.selectNodeContents(cell);
      caret.collapse(atStart);
      selection.removeAllRanges();
      selection.addRange(caret);
      this.editorRef()?.nativeElement.focus({ preventScroll: true });
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Table caret failed.');
    }
  }

  private focusParagraphAfterTable(editor: HTMLElement, table: Element): void {
    let next = table.nextElementSibling;
    while (next && !(next instanceof HTMLElement)) {
      next = next.nextElementSibling;
    }
    let paragraph =
      next instanceof HTMLElement &&
      /^(P|H1|H2|H3|BLOCKQUOTE)$/.test(next.tagName)
        ? next
        : null;
    if (!paragraph) {
      paragraph = document.createElement('p');
      paragraph.append(document.createElement('br'));
      table.after(paragraph);
      this.emitFromDom();
    }
    this.collapseCaretInCell(paragraph, true);
  }

  private focusEndOfPreviousBlock(
    editor: HTMLElement,
    table: Element,
    cell: HTMLElement,
  ): void {
    const previous = table.previousElementSibling;
    if (previous instanceof HTMLElement && editor.contains(previous)) {
      this.collapseCaretInCell(previous, false);
      return;
    }
    this.collapseCaretInCell(cell, false);
  }

  private handleListTab(event: KeyboardEvent): boolean {
    if (event.key !== 'Tab') return false;
    if (event.ctrlKey || event.metaKey || event.altKey) return false;
    if (typeof document === 'undefined') return false;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor) return false;
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.isCollapsed)
      return false;
    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return false;
    const host =
      range.startContainer instanceof Element
        ? range.startContainer
        : (range.startContainer.parentElement ?? null);
    const li = host?.closest?.('li') as HTMLElement | null;
    if (!li || !editor.contains(li)) return false;
    const list = li.parentElement;
    if (
      !list ||
      (list.tagName !== 'UL' && list.tagName !== 'OL') ||
      !editor.contains(list)
    )
      return false;
    event.preventDefault();
    if (this.isEffectivelyDisabled() || this.readonlyInput()) return true;
    if (event.shiftKey) {
      this.outdentListItem(li, list);
    } else {
      this.indentListItem(li, list);
    }
    return true;
  }

  private nestedListFor(
    parent: HTMLElement,
    reference: HTMLElement,
  ): HTMLElement {
    const tag = reference.tagName === 'OL' ? 'ol' : 'ul';
    const nested = document.createElement(tag);
    if (reference.hasAttribute('data-task-list')) {
      nested.setAttribute('data-task-list', '');
    }
    parent.append(nested);
    return nested;
  }

  private indentListItem(li: HTMLElement, list: HTMLElement): void {
    const previous = li.previousElementSibling as HTMLElement | null;
    if (previous?.tagName !== 'LI') return;
    let nested = previous.lastElementChild as HTMLElement | null;
    const sameKind =
      nested?.tagName === list.tagName &&
      nested.hasAttribute('data-task-list') ===
        list.hasAttribute('data-task-list');
    if (!sameKind) {
      nested = this.nestedListFor(previous, list);
    }
    if (nested == null) return;
    nested.append(li);
    this.keepOrPlaceCaretInItem(li);
    this.editorRef()?.nativeElement.focus({ preventScroll: true });
    this.emitFromDom();
  }

  private outdentListItem(li: HTMLElement, list: HTMLElement): void {
    const parentLi = list.parentElement;
    if (parentLi?.tagName !== 'LI') {
      this.exitListToParagraph(li, list);
      return;
    }
    const grandList = parentLi.parentElement;
    if (!grandList) return;
    if (li.nextElementSibling) {
      const remainder = this.nestedListFor(li, list);
      while (li.nextElementSibling) {
        remainder.append(li.nextElementSibling);
      }
      if (remainder.querySelectorAll('li').length === 0) {
        remainder.remove();
      }
    }
    parentLi.after(li);
    if (list.querySelectorAll('li').length === 0) {
      list.remove();
    }
    this.keepOrPlaceCaretInItem(li);
    this.editorRef()?.nativeElement.focus({ preventScroll: true });
    this.emitFromDom();
  }

  private keepOrPlaceCaretInItem(li: HTMLElement): void {
    if (typeof document === 'undefined') {
      this.engine.collapseCaretInListItem(li);
      return;
    }
    try {
      const selection = document.getSelection();
      const range =
        selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      if (
        range &&
        li.contains(range.commonAncestorContainer) &&
        this.editorRef()?.nativeElement.contains(range.commonAncestorContainer)
      ) {
        return;
      }
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Caret keep failed.');
    }
    this.engine.collapseCaretInListItem(li);
  }

  private normalizeTaskCheckboxesInDom(): void {
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor || typeof document === 'undefined') return;
    const stale = editor.querySelectorAll(
      'ul[data-task-list] input[type="checkbox"][contenteditable], ul[data-task-list] input[type="checkbox"][disabled]',
    );
    if (stale.length === 0) return;
    stale.forEach((node) => {
      const input = node as HTMLInputElement;
      input.removeAttribute('contenteditable');
      input.removeAttribute('disabled');
      if (!input.hasAttribute('data-task-checkbox')) {
        input.setAttribute('data-task-checkbox', '');
      }
      if (!input.hasAttribute('tabindex')) {
        input.setAttribute('tabindex', '-1');
      }
    });
    this.emitFromDom();
  }

  private exitListToParagraph(li: HTMLElement, list: HTMLElement): void {
    if (typeof document === 'undefined') return;
    const editor = this.editorRef()?.nativeElement ?? null;
    if (!editor) return;
    const paragraph = document.createElement('p');
    const text = (li.textContent ?? '').replace(/[\u200b\u00a0]/g, '').trim();
    if (li.querySelector('input[data-task-checkbox]')) {
      paragraph.textContent = text;
    } else if (text.length > 0) {
      paragraph.textContent = text;
    } else {
      paragraph.append(document.createElement('br'));
    }
    if (list.querySelectorAll('li').length <= 1) {
      list.replaceWith(paragraph);
    } else if (li === list.firstElementChild) {
      list.before(paragraph);
      li.remove();
    } else {
      list.after(paragraph);
      li.remove();
    }
    try {
      const selection = document.getSelection();
      const range = document.createRange();
      range.selectNodeContents(paragraph);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
      editor.focus({ preventScroll: true });
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] List exit failed.');
    }
    this.emitFromDom();
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
      const range =
        selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const host = editor.nativeElement;
      if (!range || !host.contains(range.commonAncestorContainer)) return;
      const targets = this.collectAlignTargets(host, range);
      if (targets.length === 0) return;
      for (const target of targets) {
        if (align === 'left') {
          target.removeAttribute('data-align');
        } else {
          target.setAttribute('data-align', align);
        }
      }
      this.emitFromDom();
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Align failed.');
    }
    this.refocusEditorAfterOverlayClose();
  }

  private collectAlignTargets(host: HTMLElement, range: Range): HTMLElement[] {
    const selector = 'p,h1,h2,h3,blockquote,pre,li,figure,td,th,div';
    const candidates = Array.from(host.querySelectorAll(selector));
    const hits: HTMLElement[] = [];
    for (const candidate of candidates) {
      if (!(candidate instanceof HTMLElement)) continue;
      if (!host.contains(candidate)) continue;
      try {
        if (typeof range.intersectsNode === 'function') {
          if (range.intersectsNode(candidate)) hits.push(candidate);
        } else if (
          range.commonAncestorContainer === candidate ||
          candidate.contains(range.commonAncestorContainer)
        ) {
          hits.push(candidate);
        }
      } catch {
        // Ignore unmeasurable nodes and keep scanning the rest.
      }
    }
    if (hits.length > 0) {
      return hits.filter(
        (candidate) =>
          !hits.some(
            (other) => other !== candidate && candidate.contains(other),
          ),
      );
    }
    return this.wrapBareAlignTarget(host, range);
  }

  private wrapBareAlignTarget(host: HTMLElement, range: Range): HTMLElement[] {
    const ancestor = this.alignableAncestorOf(
      range.commonAncestorContainer,
      host,
    );
    if (ancestor) return [ancestor];
    try {
      const paragraph = document.createElement('p');
      const extracted = range.extractContents();
      const hasVisible =
        (extracted.textContent ?? '').replace(/[\u200b\s]/g, '').length > 0 ||
        extracted.querySelector?.('img, table, figure, input, br') !== null;
      paragraph.appendChild(extracted);
      if (!hasVisible) paragraph.appendChild(document.createElement('br'));
      range.insertNode(paragraph);
      const caret = document.createRange();
      caret.selectNodeContents(paragraph);
      caret.collapse(false);
      document.getSelection()?.removeAllRanges();
      document.getSelection()?.addRange(caret);
      return [paragraph];
    } catch {
      return [];
    }
  }

  private alignableAncestorOf(
    node: Node | null,
    host: HTMLElement,
  ): HTMLElement | null {
    let el = node instanceof Element ? node : (node?.parentElement ?? null);
    while (
      el &&
      el !== host &&
      !/^(P|H1|H2|H3|BLOCKQUOTE|PRE|LI|FIGURE|TD|TH|DIV)$/.test(el.tagName)
    ) {
      el = el.parentElement;
    }
    return el && el !== host ? (el as HTMLElement) : null;
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
    if (!isSafeHttpUrl(safeUrl)) {
      this.clearLinkPanel();
      return;
    }
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
      this.runClearFormatting(editor.nativeElement);
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Clear formatting failed.');
    }
    this.refocusEditorAfterOverlayClose();
  }

  private runClearFormatting(host: HTMLElement): void {
    const selection = document.getSelection();
    const range = this.inEditorRange(selection, host);
    if (!range || !selection) return;
    if (selection.isCollapsed) {
      if (this.clearAlignAttributes(this.peekAlignTargets(host, range))) {
        this.emitFromDom();
      }
      return;
    }
    this.unwrapInlineRange(host, range, selection);
    this.clearAlignAttributes(this.peekAlignTargets(host, range));
    this.emitFromDom();
  }

  private inEditorRange(
    selection: Selection | null,
    host: HTMLElement,
  ): Range | null {
    if (
      !selection ||
      selection.rangeCount === 0 ||
      !host.contains(selection.getRangeAt(0).commonAncestorContainer)
    ) {
      return null;
    }
    return selection.getRangeAt(0);
  }

  private clearAlignAttributes(targets: readonly HTMLElement[]): boolean {
    if (targets.length === 0) return false;
    for (const target of targets) {
      target.removeAttribute('data-align');
    }
    return true;
  }

  private unwrapInlineRange(
    host: HTMLElement,
    range: Range,
    selection: Selection,
  ): void {
    expandRangeToInlineAncestors(range, host);
    const probe = document.createElement('div');
    probe.appendChild(range.cloneContents());
    // SECURITY_EXCEPTION: serialization feeds the pure unwrap helper; write-only below, no consumer HTML.
    const plain = unwrapInlineFormatting(probe.innerHTML);
    range.deleteContents();
    const fragment = range.createContextualFragment(plain);
    const last = fragment.lastChild;
    range.insertNode(fragment);
    if (!last) return;
    range.setStartAfter(last);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
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
    if (this.engine.insertTableAtCaret(html)) {
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
    if (this.engine.insertFigureAtCaret(figure)) {
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
    const fromFormat = this.contentFormat();
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
      const currentText = toPlainText(this.value());
      const savedText = toPlainText(this.lastRichValue);
      if (currentText !== savedText) {
        this.commitValue(
          {
            html: `<p>${escapeHtml(currentText)}</p>`,
            text: currentText,
            blocks: this.lastRichValue.blocks,
            version: 1,
          },
          false,
        );
      } else {
        this.commitValue(this.lastRichValue, false);
      }
      this.lastRichValue = null;
    }
    this.contentFormat.set(format);
    this.syncEditorDom();
    this.animateContentFormatSwitch(fromFormat);
  }

  private animateContentFormatSwitch(
    fromFormat: SolarisRichTextContentFormat,
  ): void {
    if (typeof document === 'undefined' || typeof window === 'undefined')
      return;
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const host = this.elementRef.nativeElement;
    if (host?.closest?.('[data-reduced-motion="true"]')) return;
    if (typeof window.requestAnimationFrame !== 'function') {
      this.playFormatSlide(fromFormat);
      return;
    }
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        this.playFormatSlide(fromFormat);
      });
    });
  }

  private playFormatSlide(fromFormat: SolarisRichTextContentFormat): void {
    const direction = fromFormat === 'rich' ? -1 : 1;
    const toolbar = this.elementRef.nativeElement.querySelector(
      '.solaris-rich-text-toolbar',
    ) as HTMLElement | null;
    if (toolbar) {
      const sliding = Array.from(toolbar.children).slice(1);
      sliding.forEach((child, index) => {
        if (!(child instanceof HTMLElement)) return;
        if (typeof child.animate !== 'function') return;
        child.animate(
          [
            {
              opacity: '0.35',
              transform: `translateX(${12 * direction}px)`,
            },
            { opacity: '1', transform: 'translateX(0)' },
          ],
          {
            duration: SOLARIS_RICH_TEXT_FORMAT_SLIDE_DURATION_MS,
            delay: index * SOLARIS_RICH_TEXT_FORMAT_SLIDE_STAGGER_MS,
            easing: SOLARIS_RICH_TEXT_FORMAT_SWITCH_EASING,
            fill: 'backwards',
          },
        );
      });
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
    this.activeAlign.set(this.readCommonAlign(host, scan.align));
    this.activeColor.set(scan.color);
    this.activeHighlight.set(scan.highlight);
  }

  private readCommonAlign(
    host: HTMLElement | null,
    fallback: SolarisRichTextAlign,
  ): SolarisRichTextAlign | 'mixed' {
    if (!host || typeof document === 'undefined') return fallback;
    try {
      const selection = document.getSelection();
      const range =
        selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      if (!range || !host.contains(range.commonAncestorContainer)) {
        return fallback;
      }
      const targets = this.peekAlignTargets(host, range);
      if (targets.length === 0) return fallback;
      const values = targets.map(
        (target) =>
          (target.getAttribute('data-align') as SolarisRichTextAlign | null) ??
          'left',
      );
      const first = values[0];
      return values.every((value) => value === first) ? first : 'mixed';
    } catch {
      return fallback;
    }
  }

  private peekAlignTargets(host: HTMLElement, range: Range): HTMLElement[] {
    const selector = 'p,h1,h2,h3,blockquote,pre,li,figure,td,th,div';
    const candidates = Array.from(host.querySelectorAll(selector));
    const hits: HTMLElement[] = [];
    for (const candidate of candidates) {
      if (!(candidate instanceof HTMLElement)) continue;
      try {
        if (typeof range.intersectsNode === 'function') {
          if (range.intersectsNode(candidate)) hits.push(candidate);
        } else if (
          range.commonAncestorContainer === candidate ||
          candidate.contains(range.commonAncestorContainer)
        ) {
          hits.push(candidate);
        }
      } catch {
        // Ignore unmeasurable nodes and keep scanning the rest.
      }
    }
    if (hits.length > 0) {
      return hits.filter(
        (candidate) =>
          !hits.some(
            (other) => other !== candidate && candidate.contains(other),
          ),
      );
    }
    const single = this.alignableAncestorOf(
      range.commonAncestorContainer,
      host,
    );
    return single ? [single] : [];
  }

  private refocusEditorAfterOverlayClose(): void {
    if (typeof document === 'undefined') return;
    setTimeout(() => this.focus(), 0);
  }

  private placeCaretAtEnd(host: HTMLElement): void {
    if (typeof document === 'undefined') return;
    try {
      const selection = document.getSelection();
      if (!selection) return;
      const caret = document.createRange();
      caret.selectNodeContents(host);
      caret.collapse(false);
      selection.removeAllRanges();
      selection.addRange(caret);
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Caret restore failed.');
    }
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
