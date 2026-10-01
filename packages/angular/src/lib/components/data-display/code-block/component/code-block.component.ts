// SECURITY_EXCEPTION_FILE: document.documentElement.getAttribute required to read the data-theme flag for Shiki theme selection. SSR-safe via injected DOCUMENT token and isPlatformBrowser guard.
// SECURITY_EXCEPTION_FILE: window.matchMedia required to resolve the system color scheme for Shiki theme selection. SSR-safe via isPlatformBrowser and typeof guards.
// SECURITY_EXCEPTION_FILE: window.navigator.clipboard required for copy-to-clipboard; no Angular abstraction exists. SSR-safe via isPlatformBrowser guard with try/catch and graceful failure when unavailable.
// SECURITY_EXCEPTION_FILE: nativeElement access required to measure viewport heights for the expand/collapse animation and to move focus into the editor and back; no Angular abstraction exposes layout metrics. SSR-safe via viewChild (undefined on the server) and isPlatformBrowser guards.
import { isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

import { SolarisIconComponent } from '../../../icon';
import { SolarisVisuallyHiddenDirective } from '../../../../services/accessibility';
import { SolarisIconRegistryService } from '../../../../services/icon';
import {
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
} from '../../../navigation/segmented-control';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisTranslateService } from '../../../../services/translation';
import { SOLARIS_CODE_HIGHLIGHTER } from '../model/code-block.tokens';
import type {
  SolarisCodeBlockAppearance,
  SolarisCodeBlockCommand,
  SolarisCodeBlockDensity,
  SolarisCodeBlockLanguage,
  SolarisCodeBlockLayout,
  SolarisCodeBlockRadius,
  SolarisCodeBlockResolvedCommand,
  SolarisCodeBlockSize,
  SolarisCodeBlockVariant,
  SolarisCodeHighlightContext,
  SolarisCodeHighlightResult,
} from '../model/code-block.types';
import {
  countLines,
  createFallbackHighlight,
  createHighlightContext,
  DEFAULT_CODE_HIGHLIGHTER,
  getLanguageBadgeText,
  getLanguageDisplayLabel,
  isPromiseLike,
  normalizeCodeBlockLanguage,
} from '../runtime/code-block-highlighting';
import {
  DEFAULT_CODE_BLOCK_COLLAPSED_LINES,
  DEFAULT_CODE_BLOCK_COPIED_DURATION,
} from '../model/code-block.defaults';
import {
  isActivationKey,
  normalizeAppearance,
  normalizeLayout,
  normalizeMinOneInt,
  normalizePositiveInt,
  normalizeRadius,
  normalizeSize,
  normalizeVariant,
  resolveSelectedCommandId,
  runHighlight,
} from '../helper/code-block.functions';

let nextCodeBlockId = 0;

const VIEWPORT_ANIMATING_CLASS = 'solaris-code-block__viewport--animating';

@Component({
  selector: 'solaris-code-block',
  standalone: true,
  imports: [
    SolarisIconComponent,
    SolarisSegmentedControlComponent,
    SolarisSegmentedItemComponent,
    SolarisVisuallyHiddenDirective,
  ],
  templateUrl: './code-block.component.html',
  styleUrls: ['./code-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-code-block',
    '[attr.data-size]': 'size()',
    '[attr.data-layout]': 'layout()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-empty]': 'isEmpty() ? "true" : "false"',
    '[attr.data-expanded]': 'resolvedExpanded() ? "true" : "false"',
    '[attr.data-editing]': 'isEditing() ? "true" : "false"',
    '[style.--solaris-code-block-collapsed-lines]': 'collapsedLines()',
    '[attr.data-collapsible]': 'shouldShowExpandToggle() ? "true" : "false"',
  },
})
export class SolarisCodeBlockComponent implements OnDestroy {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly customHighlighter = inject(SOLARIS_CODE_HIGHLIGHTER, {
    optional: true,
  });
  private readonly iconRegistry = inject(SolarisIconRegistryService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly themeService = inject(SolarisThemeService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  private readonly highlightState = signal<SolarisCodeHighlightResult>(
    createFallbackHighlight('', 'text'),
  );
  private readonly selectedCommandState = signal<string | null>(null);
  private readonly liveAnnouncementState = signal('');
  private readonly expandedState = signal(false);
  private readonly editingState = signal(false);
  private readonly draftState = signal('');
  protected readonly copiedState = signal(false);

  private readonly editorRef =
    viewChild<ElementRef<HTMLTextAreaElement>>('editor');
  private readonly editToggleRef =
    viewChild<ElementRef<HTMLButtonElement>>('editToggle');
  private readonly viewportRef = viewChild<ElementRef<HTMLElement>>('viewport');

  private copyResetTimer: ReturnType<typeof setTimeout> | null = null;
  private viewportAnimationTimer: ReturnType<typeof setTimeout> | null = null;
  private viewportAnimationId = 0;
  private highlightVersion = 0;

  readonly variant = input<SolarisCodeBlockVariant, string | null | undefined>(
    'code',
    { transform: (value) => normalizeVariant(value) },
  );

  readonly layout = input<SolarisCodeBlockLayout, string | null | undefined>(
    'block',
    { transform: (value) => normalizeLayout(value) },
  );

  readonly size = input<SolarisCodeBlockSize, string | null | undefined>('md', {
    transform: (value) => normalizeSize(value),
  });

  readonly radius = input<
    SolarisCodeBlockRadius | null,
    string | null | undefined
  >('sm', { transform: (value) => normalizeRadius(value) });

  readonly appearance = input<
    SolarisCodeBlockAppearance,
    string | null | undefined
  >('surface', { transform: (value) => normalizeAppearance(value) });

  readonly copiedDuration = input(DEFAULT_CODE_BLOCK_COPIED_DURATION, {
    transform: (value: number | null | undefined) =>
      normalizePositiveInt(value, DEFAULT_CODE_BLOCK_COPIED_DURATION),
  });
  readonly collapsedLines = input(DEFAULT_CODE_BLOCK_COLLAPSED_LINES, {
    transform: (value: number | null | undefined) =>
      normalizeMinOneInt(value, DEFAULT_CODE_BLOCK_COLLAPSED_LINES),
  });

  readonly expandable = input(false, { transform: booleanAttribute });
  readonly expanded = input(false, { transform: booleanAttribute });
  readonly copyable = input(true, { transform: booleanAttribute });
  readonly editable = input(false, { transform: booleanAttribute });
  readonly commands = input<readonly SolarisCodeBlockCommand[]>([]);
  readonly code = input<string | null | undefined>(undefined);
  readonly commandSelectorAriaLabelKey = input<string | null>(null);
  readonly language = input<SolarisCodeBlockLanguage | null>(null);
  readonly commandSelectorAriaLabel = input<string | null>(null);
  readonly density = input<SolarisCodeBlockDensity>();
  readonly collapseLabelKey = input<string | null>(null);
  readonly identityLabelKey = input<string | null>(null);
  readonly selectedCommand = input<string | null>(null);
  readonly expandLabelKey = input<string | null>(null);
  readonly copiedLabelKey = input<string | null>(null);
  readonly collapseLabel = input<string | null>(null);
  readonly identityLabel = input<string | null>(null);
  readonly copyLabelKey = input<string | null>(null);
  readonly ariaLabelKey = input<string | null>(null);
  readonly copiedLabel = input<string | null>(null);
  readonly expandLabel = input<string | null>(null);
  readonly editLabel = input<string | null>(null);
  readonly saveLabel = input<string | null>(null);
  readonly cancelLabel = input<string | null>(null);
  readonly editLabelKey = input<string | null>(null);
  readonly saveLabelKey = input<string | null>(null);
  readonly cancelLabelKey = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly copyLabel = input<string | null>(null);

  readonly copied = output<string>();
  readonly codeChange = output<string>();
  readonly editingChange = output<boolean>();
  readonly expandedChange = output<boolean>();
  readonly selectedCommandChange = output<string | null>();

  protected readonly viewportId = `solaris-code-block-${nextCodeBlockId++}`;

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly resolvedCommands = computed<
    readonly SolarisCodeBlockResolvedCommand[]
  >(() =>
    this.commands().map((command) => ({
      ...command,
      resolvedLabel: this.resolveText(
        command.label,
        command.labelKey,
        command.id,
      ),
    })),
  );

  protected readonly currentCommand =
    computed<SolarisCodeBlockResolvedCommand | null>(() => {
      const commands = this.resolvedCommands();
      const selectedId = this.selectedCommandState();
      return (
        commands.find((command) => command.id === selectedId) ??
        commands[0] ??
        null
      );
    });

  protected readonly visibleCode = computed(() => {
    return this.currentCommand()?.code ?? this.code() ?? '';
  });

  protected readonly visibleLanguage =
    computed<SolarisCodeBlockLanguage | null>(() =>
      normalizeCodeBlockLanguage(
        this.currentCommand()?.language ??
          this.language() ??
          (this.variant() === 'command' ? 'shell' : 'text'),
      ),
    );

  protected readonly lines = computed(() => this.highlightState().lines);

  protected readonly isEmpty = computed(() => this.visibleCode().length === 0);

  protected readonly showCommandSelector = computed(
    () => this.resolvedCommands().length > 1,
  );

  protected readonly visibleLineCount = computed(() =>
    countLines(this.visibleCode()),
  );

  protected readonly shouldShowExpandToggle = computed(
    () =>
      this.layout() === 'block' &&
      this.expandable() &&
      this.visibleLineCount() > this.collapsedLines(),
  );

  protected readonly isEditing = computed(() => this.editingState());

  protected readonly draft = computed(() => this.draftState());

  protected readonly resolvedExpanded = computed(
    () =>
      this.editingState() ||
      !this.shouldShowExpandToggle() ||
      this.expandedState(),
  );

  protected readonly showCollapsedFade = computed(
    () => this.shouldShowExpandToggle() && !this.resolvedExpanded(),
  );

  protected readonly resolvedAriaLabel = computed(() =>
    this.resolveText(
      this.ariaLabel(),
      this.ariaLabelKey() ?? 'solaris.codeBlock.ariaLabel',
      'Code block',
    ),
  );

  protected readonly resolvedCommandSelectorAriaLabel = computed(() =>
    this.resolveText(
      this.commandSelectorAriaLabel(),
      this.commandSelectorAriaLabelKey() ??
        'solaris.codeBlock.commandSelector.ariaLabel',
      'Command selector',
    ),
  );

  protected readonly resolvedCopyLabel = computed(() =>
    this.resolveText(
      this.copyLabel(),
      this.copyLabelKey() ?? 'solaris.codeBlock.copy',
      'Copy code',
    ),
  );

  protected readonly resolvedCopiedLabel = computed(() =>
    this.resolveText(
      this.copiedLabel(),
      this.copiedLabelKey() ?? 'solaris.codeBlock.copied',
      'Code copied',
    ),
  );

  protected readonly resolvedExpandLabel = computed(() =>
    this.resolveText(
      this.expandLabel(),
      this.expandLabelKey() ?? 'solaris.codeBlock.expand',
      'Expand code',
    ),
  );

  protected readonly resolvedCollapseLabel = computed(() =>
    this.resolveText(
      this.collapseLabel(),
      this.collapseLabelKey() ?? 'solaris.codeBlock.collapse',
      'Collapse code',
    ),
  );

  protected readonly resolvedEditLabel = computed(() =>
    this.resolveText(
      this.editLabel(),
      this.editLabelKey() ?? 'solaris.codeBlock.edit',
      'Edit code',
    ),
  );

  protected readonly resolvedSaveLabel = computed(() =>
    this.resolveText(
      this.saveLabel(),
      this.saveLabelKey() ?? 'solaris.codeBlock.save',
      'Save changes',
    ),
  );

  protected readonly resolvedCancelLabel = computed(() =>
    this.resolveText(
      this.cancelLabel(),
      this.cancelLabelKey() ?? 'solaris.codeBlock.cancel',
      'Cancel editing',
    ),
  );

  protected readonly editToggleButtonLabel = computed(() =>
    this.editingState() ? this.resolvedSaveLabel() : this.resolvedEditLabel(),
  );

  protected readonly showEditToggle = computed(
    () => this.layout() === 'block' && this.editable(),
  );

  protected readonly copyButtonLabel = computed(() =>
    this.copiedState() ? this.resolvedCopiedLabel() : this.resolvedCopyLabel(),
  );

  protected readonly liveAnnouncement = computed(() =>
    this.liveAnnouncementState(),
  );

  protected readonly identityLabelText = computed(() => {
    const override = this.resolveText(
      this.identityLabel(),
      this.identityLabelKey(),
      undefined,
    );
    if (override) {
      return override;
    }
    const command = this.currentCommand();
    if (command) {
      return command.resolvedLabel;
    }
    return getLanguageDisplayLabel(this.visibleLanguage());
  });

  protected readonly identityBadgeText = computed(() => {
    const command = this.currentCommand();
    return getLanguageBadgeText(
      this.identityLabel() ??
        command?.icon ??
        command?.language ??
        this.visibleLanguage(),
    );
  });

  protected readonly identityIconName = computed(() => {
    if (this.identityLabel()) {
      return null;
    }
    const command = this.currentCommand();
    const key = normalizeCodeBlockLanguage(
      command?.icon ?? command?.language ?? this.visibleLanguage(),
    );
    return this.iconRegistry.hasIcon(key) ? key : null;
  });

  constructor() {
    effect(() => {
      const commands = this.resolvedCommands();
      const selected = this.selectedCommand();
      const current = untracked(() => this.selectedCommandState());
      this.selectedCommandState.set(
        resolveSelectedCommandId(commands, selected, current),
      );
    });

    effect(() => {
      this.expandedState.set(this.expanded());
    });

    effect((onCleanup) => {
      const code = this.visibleCode();
      const language = this.visibleLanguage();
      const highlighter = this.customHighlighter ?? DEFAULT_CODE_HIGHLIGHTER;
      const fallback = createFallbackHighlight(code, language);
      const version = ++this.highlightVersion;
      const result = runHighlight(
        highlighter,
        code,
        language,
        createHighlightContext(this.resolveColorScheme()),
        fallback,
      );
      if (!isPromiseLike(result)) {
        this.highlightState.set(result);
        return;
      }
      this.highlightState.set(fallback);
      let cancelled = false;
      onCleanup(() => {
        cancelled = true;
      });
      void result.then((resolved) => {
        if (cancelled || version !== this.highlightVersion) {
          return;
        }
        this.highlightState.set(resolved);
        this.changeDetectorRef.markForCheck();
      });
    });
  }

  ngOnDestroy(): void {
    this.clearCopyTimer();
    this.cancelViewportAnimation();
  }

  protected handleCommandChange(value: unknown): void {
    if (typeof value !== 'string' || value.length === 0) {
      return;
    }
    if (this.editingState()) {
      this.cancelEditing();
    }
    this.selectedCommandState.set(value);
    this.selectedCommandChange.emit(value);
  }

  protected async handleCopy(): Promise<void> {
    const code = this.visibleCode();
    const ok = await this.copyToClipboard(code);
    if (!ok) {
      this.copiedState.set(false);
      this.liveAnnouncementState.set('');
      return;
    }
    this.copiedState.set(true);
    this.liveAnnouncementState.set(this.resolvedCopiedLabel());
    this.copied.emit(code);
    this.queueCopyReset();
    this.changeDetectorRef.detectChanges();
  }

  protected handleExpandToggle(): void {
    if (!this.shouldShowExpandToggle() || this.isEditing()) {
      return;
    }
    const next = !this.expandedState();
    const viewport = this.viewportRef()?.nativeElement ?? null;
    const startHeight = viewport?.getBoundingClientRect().height ?? 0;
    if (viewport && !next) {
      viewport.style.maxHeight = `${viewport.scrollHeight}px`;
    }
    this.expandedState.set(next);
    this.expandedChange.emit(next);
    this.animateViewportHeight(viewport, next, startHeight);
  }

  /**
   * Animates the viewport between its collapsed `max-height` and the full
   * content height with explicit pixel values. A pure CSS `max-height`
   * transition cannot interpolate to `none`, so an inline pixel `max-height`
   * stays present from the first paint until the finish cleanup — both
   * directions therefore interpolate length-to-length and glide instead of
   * jumping.
   */
  private animateViewportHeight(
    viewport: HTMLElement | null,
    expanded: boolean,
    startHeight: number,
  ): void {
    this.viewportAnimationId++;
    this.clearViewportAnimationTimer();
    const animationId = this.viewportAnimationId;
    if (
      !viewport ||
      !isPlatformBrowser(this.platformId) ||
      this.reducedMotionEnabled()
    ) {
      if (viewport) {
        this.resetViewportAnimation(viewport);
      }
      return;
    }
    this.changeDetectorRef.detectChanges();
    let endHeight: number;
    if (expanded) {
      endHeight = viewport.scrollHeight;
      if (endHeight <= startHeight + 1) {
        this.resetViewportAnimation(viewport);
        return;
      }
    } else {
      endHeight = this.collapsedViewportHeight(viewport);
      if (!Number.isFinite(endHeight) || endHeight >= startHeight - 1) {
        this.resetViewportAnimation(viewport);
        return;
      }
    }
    viewport.style.maxHeight = `${startHeight}px`;
    void viewport.offsetHeight;
    viewport.classList.add(VIEWPORT_ANIMATING_CLASS);
    const finish = (): void => {
      if (this.viewportAnimationId !== animationId) {
        return;
      }
      this.resetViewportAnimation(viewport);
    };
    const onTransitionEnd = (event: TransitionEvent): void => {
      if (event.propertyName !== 'max-height') {
        return;
      }
      viewport.removeEventListener('transitionend', onTransitionEnd);
      this.clearViewportAnimationTimer();
      finish();
    };
    viewport.addEventListener('transitionend', onTransitionEnd);
    this.viewportAnimationTimer = setTimeout(() => {
      viewport.removeEventListener('transitionend', onTransitionEnd);
      this.viewportAnimationTimer = null;
      finish();
    }, 400);
    this.requestNextFrame(() => {
      if (this.viewportAnimationId !== animationId) {
        return;
      }
      viewport.style.maxHeight = `${endHeight}px`;
    });
  }

  /**
   * Mirrors `--solaris-code-block-collapsed-max-height` in pixels without
   * clearing the inline lock, so the collapse animation never routes through
   * `max-height: none` (which is what made collapsing jump while expanding
   * glided).
   */
  private collapsedViewportHeight(viewport: HTMLElement): number {
    const style = getComputedStyle(viewport);
    const lineHeight = Number.parseFloat(style.lineHeight);
    const paddingTop = Number.parseFloat(style.paddingTop);
    const paddingBottom = Number.parseFloat(style.paddingBottom);
    if (
      !Number.isFinite(lineHeight) ||
      !Number.isFinite(paddingTop) ||
      !Number.isFinite(paddingBottom)
    ) {
      return Number.NaN;
    }
    return this.collapsedLines() * lineHeight + paddingTop + paddingBottom;
  }

  private resetViewportAnimation(viewport: HTMLElement): void {
    viewport.style.maxHeight = '';
    viewport.classList.remove(VIEWPORT_ANIMATING_CLASS);
  }

  private requestNextFrame(callback: () => void): void {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => callback());
      return;
    }
    setTimeout(() => callback(), 0);
  }

  private reducedMotionEnabled(): boolean {
    if (
      this.document.documentElement.getAttribute('data-reduced-motion') ===
      'true'
    ) {
      return true;
    }
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  private clearViewportAnimationTimer(): void {
    if (this.viewportAnimationTimer == null) {
      return;
    }
    clearTimeout(this.viewportAnimationTimer);
    this.viewportAnimationTimer = null;
  }

  private cancelViewportAnimation(): void {
    this.viewportAnimationId++;
    this.clearViewportAnimationTimer();
    const viewport = this.viewportRef()?.nativeElement;
    if (viewport) {
      this.resetViewportAnimation(viewport);
    }
  }

  protected handleEditToggle(): void {
    if (!this.editable() || this.layout() !== 'block') {
      return;
    }
    if (this.editingState()) {
      this.saveEditing();
      return;
    }
    this.draftState.set(this.visibleCode());
    this.editingState.set(true);
    this.editingChange.emit(true);
    this.focusEditor();
  }

  protected handleEditCancel(): void {
    if (!this.editingState()) {
      return;
    }
    this.cancelEditing();
    this.focusEditToggle();
  }

  protected handleDraftInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement | null;
    if (!target) {
      return;
    }
    this.draftState.set(target.value);
  }

  protected handleEditorKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEditing();
      this.focusEditToggle();
      return;
    }
    if (
      event.key === 'Enter' &&
      (event.ctrlKey || event.metaKey) &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      this.saveEditing();
      this.focusEditToggle();
    }
  }

  protected handleActionKeydown(
    event: KeyboardEvent,
    action: 'copy' | 'expand' | 'edit' | 'cancel',
  ): void {
    if (!isActivationKey(event)) {
      return;
    }
    event.preventDefault();
    if (action === 'copy') {
      void this.handleCopy();
      return;
    }
    if (action === 'edit') {
      this.handleEditToggle();
      return;
    }
    if (action === 'cancel') {
      this.handleEditCancel();
      return;
    }
    this.handleExpandToggle();
  }

  private saveEditing(): void {
    const draft = this.draftState();
    this.editingState.set(false);
    this.editingChange.emit(false);
    this.liveAnnouncementState.set(this.resolvedSaveLabel());
    this.codeChange.emit(draft);
  }

  private cancelEditing(): void {
    this.draftState.set('');
    this.editingState.set(false);
    this.editingChange.emit(false);
  }

  private focusEditor(): void {
    queueMicrotask(() => {
      this.editorRef()?.nativeElement.focus();
    });
  }

  private focusEditToggle(): void {
    queueMicrotask(() => {
      this.editToggleRef()?.nativeElement.focus();
    });
  }

  private resolveColorScheme(): SolarisCodeHighlightContext['colorScheme'] {
    const configured = this.themeService.colorScheme;
    if (configured === 'dark') {
      return 'dark';
    }
    if (configured === 'light') {
      return 'light';
    }
    if (isPlatformBrowser(this.platformId)) {
      const flagged = this.document.documentElement.getAttribute('data-theme');
      if (flagged === 'dark') {
        return 'dark';
      }
      if (flagged === 'light' || flagged === 'high-contrast') {
        return 'light';
      }
      if (
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return 'dark';
      }
    }
    return 'light';
  }

  private resolveText(
    direct: string | null | undefined,
    key: string | null | undefined,
    fallback: string | undefined,
  ): string {
    if (direct) {
      return direct;
    }
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
      if (fallback !== undefined) {
        return fallback;
      }
      return key;
    }
    return fallback ?? key ?? '';
  }

  private async copyToClipboard(value: string): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    try {
      const clipboard = window.navigator.clipboard;
      if (!clipboard?.writeText) {
        return false;
      }
      await clipboard.writeText(value);
      return true;
    } catch {
      return false;
    }
  }

  private queueCopyReset(): void {
    this.clearCopyTimer();
    this.copyResetTimer = setTimeout(() => {
      this.copiedState.set(false);
      this.liveAnnouncementState.set('');
      this.copyResetTimer = null;
      this.changeDetectorRef.detectChanges();
    }, this.copiedDuration());
  }

  private clearCopyTimer(): void {
    if (this.copyResetTimer == null) {
      return;
    }
    clearTimeout(this.copyResetTimer);
    this.copyResetTimer = null;
  }
}
