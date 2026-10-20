import { isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';

import { SolarisThemeService } from '../../../../services/theme';
import { SolarisTranslateService } from '../../../../services/translation';
import {
  SolarisCodeBlockComponent,
  SolarisCodeBlockCommand,
} from '../../code-block';
import {
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
} from '../../../navigation/segmented-control';
import {
  DEFAULT_PREVIEW_CODE_ALIGN,
  DEFAULT_PREVIEW_CODE_APPEARANCE,
  DEFAULT_PREVIEW_CODE_ARIA_LABEL_KEY,
  DEFAULT_PREVIEW_CODE_ARIA_LABEL_TEXT,
  DEFAULT_PREVIEW_CODE_CODE_LABEL_KEY,
  DEFAULT_PREVIEW_CODE_CODE_LABEL_TEXT,
  DEFAULT_PREVIEW_CODE_COLLAPSED_LINES,
  DEFAULT_PREVIEW_CODE_FILE_SELECTOR_ARIA_LABEL_KEY,
  DEFAULT_PREVIEW_CODE_FILE_SELECTOR_ARIA_LABEL_TEXT,
  DEFAULT_PREVIEW_CODE_MIN_HEIGHT,
  DEFAULT_PREVIEW_CODE_PADDING,
  DEFAULT_PREVIEW_CODE_PREVIEW_LABEL_KEY,
  DEFAULT_PREVIEW_CODE_PREVIEW_LABEL_TEXT,
  DEFAULT_PREVIEW_CODE_SIZE,
  DEFAULT_PREVIEW_CODE_TAB,
  normalizeOptionalPreviewCodeAppearance,
  normalizeOptionalPreviewCodeSize,
  normalizeOptionalPreviewCodeTab,
  normalizePreviewCodeAlign,
  normalizePreviewCodeAppearance,
  normalizePreviewCodeCollapsedLines,
  normalizePreviewCodeMinHeight,
  normalizePreviewCodePadding,
  normalizePreviewCodeRadius,
  normalizePreviewCodeSize,
  normalizePreviewCodeTab,
  PREVIEW_CODE_TAB_HEIGHT_MS,
} from '../model/preview-code.defaults';
import type {
  SolarisPreviewCodeAlign,
  SolarisPreviewCodeAppearance,
  SolarisPreviewCodeDensity,
  SolarisPreviewCodeFile,
  SolarisPreviewCodeMinHeight,
  SolarisPreviewCodePadding,
  SolarisPreviewCodeRadius,
  SolarisPreviewCodeResolvedFile,
  SolarisPreviewCodeSize,
  SolarisPreviewCodeTab,
} from '../model/preview-code.types';

let nextPreviewCodeId = 0;

const FRAME_SIZING_CLASS = 'solaris-preview-code__frame--tab-sizing';
const TAB_BOX_SELECTOR =
  '.solaris-preview-code__preview-surface, .solaris-code-block__frame';

@Component({
  selector: 'solaris-preview-code',
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisSegmentedControlComponent,
    SolarisSegmentedItemComponent,
  ],
  templateUrl: './preview-code.component.html',
  styleUrls: ['./preview-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-preview-code',
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-preview-align]': 'previewAlign()',
    '[attr.data-active-tab]': 'resolvedActiveTab()',
    '[attr.data-preview-padding]': 'previewPadding()',
    '[attr.data-preview-min-height]': 'previewMinHeight()',
  },
})
export class SolarisPreviewCodeComponent implements OnDestroy {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly themeService = inject(SolarisThemeService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private readonly frameRef = viewChild<ElementRef<HTMLElement>>('frame');

  private tabHeightAnimationId = 0;
  private tabHeightTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly activeTabState = signal<SolarisPreviewCodeTab | null>(null);
  private readonly selectedCodeFileIdState = signal<string | null>(null);

  readonly code = input<string | null | undefined>(undefined);
  readonly codeFiles = input<readonly SolarisPreviewCodeFile[]>([]);
  readonly language = input<string | null>(null);
  readonly defaultCodeFile = input<string | null>(null);

  readonly activeTab = input<
    SolarisPreviewCodeTab | null,
    string | null | undefined
  >(null, {
    transform: (value: string | null | undefined) =>
      normalizeOptionalPreviewCodeTab(value),
  });
  readonly defaultTab = input<SolarisPreviewCodeTab, string | null | undefined>(
    DEFAULT_PREVIEW_CODE_TAB,
    {
      transform: (value: string | null | undefined) =>
        normalizePreviewCodeTab(value),
    },
  );

  readonly appearance = input<
    SolarisPreviewCodeAppearance,
    string | null | undefined
  >(DEFAULT_PREVIEW_CODE_APPEARANCE, {
    transform: (value: string | null | undefined) =>
      normalizePreviewCodeAppearance(value),
  });
  readonly size = input<SolarisPreviewCodeSize, string | null | undefined>(
    DEFAULT_PREVIEW_CODE_SIZE,
    {
      transform: (value: string | null | undefined) =>
        normalizePreviewCodeSize(value),
    },
  );
  readonly radius = input<
    SolarisPreviewCodeRadius | null,
    string | null | undefined
  >(null, {
    transform: (value: string | null | undefined) =>
      normalizePreviewCodeRadius(value),
  });
  readonly density = input<SolarisPreviewCodeDensity>('compact');

  readonly previewLabel = input<string | null>(null);
  readonly previewLabelKey = input<string | null>(null);
  readonly codeLabel = input<string | null>(null);
  readonly codeLabelKey = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly ariaLabelKey = input<string | null>(null);
  readonly fileSelectorAriaLabel = input<string | null>(null);
  readonly fileSelectorAriaLabelKey = input<string | null>(null);

  readonly codeBlockAppearance = input<
    SolarisPreviewCodeAppearance | null,
    string | null | undefined
  >(null, {
    transform: (value: string | null | undefined) =>
      normalizeOptionalPreviewCodeAppearance(value),
  });
  readonly codeBlockSize = input<
    SolarisPreviewCodeSize | null,
    string | null | undefined
  >(null, {
    transform: (value: string | null | undefined) =>
      normalizeOptionalPreviewCodeSize(value),
  });
  readonly codeExpandable = input(false, { transform: booleanAttribute });
  readonly codeCollapsedLines = input(DEFAULT_PREVIEW_CODE_COLLAPSED_LINES, {
    transform: (value: number | null | undefined) =>
      normalizePreviewCodeCollapsedLines(value),
  });

  readonly previewAlign = input<
    SolarisPreviewCodeAlign,
    string | null | undefined
  >(DEFAULT_PREVIEW_CODE_ALIGN, {
    transform: (value: string | null | undefined) =>
      normalizePreviewCodeAlign(value),
  });
  readonly previewMinHeight = input<
    SolarisPreviewCodeMinHeight,
    string | null | undefined
  >(DEFAULT_PREVIEW_CODE_MIN_HEIGHT, {
    transform: (value: string | null | undefined) =>
      normalizePreviewCodeMinHeight(value),
  });
  readonly previewPadding = input<
    SolarisPreviewCodePadding,
    string | null | undefined
  >(DEFAULT_PREVIEW_CODE_PADDING, {
    transform: (value: string | null | undefined) =>
      normalizePreviewCodePadding(value),
  });

  readonly activeTabChange = output<SolarisPreviewCodeTab>();

  protected readonly previewPanelId = `solaris-preview-code-panel-preview-${nextPreviewCodeId}`;
  protected readonly codePanelId = `solaris-preview-code-panel-code-${nextPreviewCodeId++}`;

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly resolvedActiveTab = computed(
    (): SolarisPreviewCodeTab =>
      this.activeTab() ?? this.activeTabState() ?? this.defaultTab(),
  );

  protected readonly isPreviewActive = computed(
    () => this.resolvedActiveTab() === 'preview',
  );
  protected readonly isCodeActive = computed(
    () => this.resolvedActiveTab() === 'code',
  );

  protected readonly resolvedPreviewLabel = computed(() =>
    this.resolveText(
      this.previewLabel(),
      this.previewLabelKey() ?? DEFAULT_PREVIEW_CODE_PREVIEW_LABEL_KEY,
      DEFAULT_PREVIEW_CODE_PREVIEW_LABEL_TEXT,
    ),
  );

  protected readonly resolvedCodeLabel = computed(() =>
    this.resolveText(
      this.codeLabel(),
      this.codeLabelKey() ?? DEFAULT_PREVIEW_CODE_CODE_LABEL_KEY,
      DEFAULT_PREVIEW_CODE_CODE_LABEL_TEXT,
    ),
  );

  protected readonly resolvedAriaLabel = computed(() =>
    this.resolveText(
      this.ariaLabel(),
      this.ariaLabelKey() ?? DEFAULT_PREVIEW_CODE_ARIA_LABEL_KEY,
      DEFAULT_PREVIEW_CODE_ARIA_LABEL_TEXT,
    ),
  );

  protected readonly resolvedFileSelectorAriaLabel = computed(() =>
    this.resolveText(
      this.fileSelectorAriaLabel(),
      this.fileSelectorAriaLabelKey() ??
        DEFAULT_PREVIEW_CODE_FILE_SELECTOR_ARIA_LABEL_KEY,
      DEFAULT_PREVIEW_CODE_FILE_SELECTOR_ARIA_LABEL_TEXT,
    ),
  );

  protected readonly resolvedCodeFiles = computed(
    (): readonly SolarisPreviewCodeResolvedFile[] =>
      this.codeFiles().map((file) => ({
        ...file,
        resolvedLabel: this.resolveText(file.label, file.labelKey, file.id),
      })),
  );

  protected readonly resolvedCodeBlockCommands = computed(
    (): readonly SolarisCodeBlockCommand[] =>
      this.resolvedCodeFiles().map((file) => ({
        id: file.id,
        label: file.resolvedLabel,
        ...(file.labelKey ? { labelKey: file.labelKey } : {}),
        ...(file.language ? { language: file.language } : {}),
        code: file.code,
      })),
  );

  protected readonly currentCodeFile = computed(() => {
    const files = this.resolvedCodeFiles();
    if (files.length === 0) {
      return null;
    }
    const selectedId = this.selectedCodeFileIdState();
    return (
      files.find((file) => file.id === selectedId) ??
      files.find((file) => file.id === this.defaultCodeFile()) ??
      files[0]
    );
  });

  protected readonly resolvedCode = computed(
    () => this.currentCodeFile()?.code ?? this.code() ?? '',
  );

  protected readonly resolvedLanguage = computed(
    () => this.currentCodeFile()?.language ?? this.language() ?? null,
  );

  protected readonly resolvedSelectedCodeFileId = computed(
    () => this.currentCodeFile()?.id ?? null,
  );

  protected readonly resolvedCodeBlockAppearance = computed(
    () => this.codeBlockAppearance() ?? this.appearance(),
  );

  protected readonly resolvedCodeBlockSize = computed(
    () => this.codeBlockSize() ?? this.size(),
  );

  protected handleTabChange(value: unknown): void {
    if (typeof value !== 'string') {
      return;
    }
    const nextTab = normalizePreviewCodeTab(value);
    if (nextTab === this.resolvedActiveTab() || this.activeTab() !== null) {
      // Same tab, or controlled mode (the parent owns the state, so the new
      // content arrives in a later cycle and cannot be measured here):
      // keep today's exact behavior — state/outputs only, fade-only visuals.
      if (this.activeTab() === null) {
        this.activeTabState.set(nextTab);
      }
      this.activeTabChange.emit(nextTab);
      return;
    }
    // SECURITY_EXCEPTION: measures the frame owned by this component via viewChild (undefined on the server); no Angular abstraction exposes layout metrics; read-only getBoundingClientRect locked to the tab-switch height tween; covered by preview-code height specs.
    const frameElement = this.frameRef()?.nativeElement ?? null;
    const startHeight = frameElement?.getBoundingClientRect().height ?? 0;
    const startPanelHeight =
      frameElement
        ?.querySelector('.solaris-preview-code__panel')
        ?.getBoundingClientRect().height ?? 0;
    this.activeTabState.set(nextTab);
    this.activeTabChange.emit(nextTab);
    // Render the incoming panel synchronously so the tween below measures
    // the new content (not the outgoing one mid-flight).
    this.changeDetectorRef.detectChanges();
    this.animateTabHeight(startHeight, startPanelHeight);
  }

  /**
   * Tweens the frame height between the outgoing and incoming panels so the
   * tab switch glides instead of jumping, revealing the incoming content
   * collapsible-style with its border complete at every frame (no opacity
   * is animated — any translucency would read as a broken border ring).
   * Locks an explicit pixel height, transitions to the measured end height,
   * then releases back to auto. The bordered box of the incoming panel
   * (preview surface or code frame) is locked in parallel via inline styles
   * so it grows instead of being clipped by the frame. Skipped when heights
   * match, off the browser, or under reduced motion (instant swap).
   */
  private animateTabHeight(
    startHeight: number,
    startPanelHeight: number,
  ): void {
    this.tabHeightAnimationId++;
    this.clearTabHeightTimer();
    const animationId = this.tabHeightAnimationId;
    // SECURITY_EXCEPTION: frame element owned by this component via viewChild (undefined on the server); direct DOM writes (inline height + sizing class) have no Renderer2 path that supports measured FLIP tweens; reverted on finish/destroy; covered by preview-code height specs.
    const frame = this.frameRef()?.nativeElement ?? null;
    if (
      frame === null ||
      !isPlatformBrowser(this.platformId) ||
      this.reducedMotionEnabled() ||
      !(startHeight > 0)
    ) {
      return;
    }
    const endHeight = frame.getBoundingClientRect().height;
    if (!Number.isFinite(endHeight) || Math.abs(endHeight - startHeight) < 1) {
      return;
    }
    const box = frame.querySelector(TAB_BOX_SELECTOR);
    const boxElement = box instanceof HTMLElement ? box : null;
    const endBoxHeight = boxElement?.getBoundingClientRect().height ?? 0;
    const tweenBox =
      boxElement !== null &&
      startPanelHeight > 0 &&
      Number.isFinite(endBoxHeight) &&
      Math.abs(endBoxHeight - startPanelHeight) >= 1;
    frame.style.height = `${startHeight}px`;
    void frame.offsetHeight;
    frame.classList.add(FRAME_SIZING_CLASS);
    frame.style.height = `${endHeight}px`;
    if (tweenBox && boxElement !== null) {
      // Inline styles (not a CSS class): the box may live inside another
      // component's template (code frame), where this stylesheet cannot
      // reach through view encapsulation. Custom properties inherit through
      // the DOM, so the tween stays token-driven. Reverted below.
      // minBlockSize 0: the preview surface enforces a min-height that would
      // otherwise clamp the locked height and kill the transition; boxSizing
      // keeps the measured border-box height exact on boxes without it.
      boxElement.style.height = `${startPanelHeight}px`;
      boxElement.style.minBlockSize = '0px';
      boxElement.style.boxSizing = 'border-box';
      boxElement.style.overflow = 'hidden';
      boxElement.style.transition = `height var(--solaris-motion-duration-normal) var(--solaris-motion-easing-standard)`;
      void boxElement.offsetHeight;
      boxElement.style.height = `${endBoxHeight}px`;
    }
    const finish = (): void => {
      if (this.tabHeightAnimationId !== animationId) {
        return;
      }
      frame.style.height = '';
      frame.classList.remove(FRAME_SIZING_CLASS);
      if (boxElement !== null) {
        boxElement.style.height = '';
        boxElement.style.minBlockSize = '';
        boxElement.style.boxSizing = '';
        boxElement.style.overflow = '';
        boxElement.style.transition = '';
      }
    };
    const onTransitionEnd = (event: TransitionEvent): void => {
      if (event.propertyName !== 'height') {
        return;
      }
      frame.removeEventListener('transitionend', onTransitionEnd);
      this.clearTabHeightTimer();
      finish();
    };
    frame.addEventListener('transitionend', onTransitionEnd);
    this.tabHeightTimer = setTimeout(() => {
      frame.removeEventListener('transitionend', onTransitionEnd);
      finish();
    }, PREVIEW_CODE_TAB_HEIGHT_MS + 100);
  }

  private reducedMotionEnabled(): boolean {
    // SECURITY_EXCEPTION: reads the data-reduced-motion flag via the Angular DOCUMENT token; SSR-safe via injected DOCUMENT and the isPlatformBrowser guard at the call site; no Renderer2 alternative for attribute reads; covered by reduced-motion specs.
    if (
      this.document.documentElement.getAttribute('data-reduced-motion') ===
      'true'
    ) {
      return true;
    }
    // SECURITY_EXCEPTION: reads the OS reduced-motion preference via the Angular DOCUMENT token (defaultView.matchMedia); SSR-safe via the isPlatformBrowser guard at the call site; matchMedia has no Renderer2 alternative; read-only query.
    const view = this.document.defaultView;
    return (
      typeof view?.matchMedia === 'function' &&
      view.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  private clearTabHeightTimer(): void {
    if (this.tabHeightTimer == null) {
      return;
    }
    clearTimeout(this.tabHeightTimer);
    this.tabHeightTimer = null;
  }

  ngOnDestroy(): void {
    this.tabHeightAnimationId++;
    this.clearTabHeightTimer();
    // SECURITY_EXCEPTION: frame element owned by this component via viewChild; cleanup of the inline height + sizing class on destroy; mirrors the finish path above.
    const frame = this.frameRef()?.nativeElement;
    if (frame) {
      frame.style.height = '';
      frame.classList.remove(FRAME_SIZING_CLASS);
      const box = frame.querySelector(TAB_BOX_SELECTOR);
      if (box instanceof HTMLElement) {
        box.style.height = '';
        box.style.minBlockSize = '';
        box.style.boxSizing = '';
        box.style.overflow = '';
        box.style.transition = '';
      }
    }
  }

  protected handleCodeFileChange(value: string | null): void {
    const files = this.resolvedCodeFiles();
    if (files.length === 0 || typeof value !== 'string') {
      return;
    }
    if (files.some((file) => file.id === value)) {
      this.selectedCodeFileIdState.set(value);
    }
  }

  private resolveText(
    direct: string | null | undefined,
    key: string | null | undefined,
    fallback: string,
  ): string {
    if (direct) {
      return direct;
    }
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
      return fallback;
    }
    return fallback;
  }
}
