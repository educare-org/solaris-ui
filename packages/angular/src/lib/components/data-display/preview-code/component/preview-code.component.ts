import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { SolarisThemeService } from '../../../../services/theme';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisCodeBlockComponent } from '../../code-block/component/code-block.component';
import { SolarisSegmentedControlComponent } from '../../../navigation/segmented-control/component/segmented-control.component';
import { SolarisSegmentedItemComponent } from '../../../navigation/segmented-control/item/segmented-item.component';
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
import type { SolarisCodeBlockCommand } from '../../code-block/model/code-block.types';

let nextPreviewCodeId = 0;

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
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-active-tab]': 'resolvedActiveTab()',
    '[attr.data-preview-align]': 'previewAlign()',
    '[attr.data-preview-min-height]': 'previewMinHeight()',
    '[attr.data-preview-padding]': 'previewPadding()',
  },
})
export class SolarisPreviewCodeComponent {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly themeService = inject(SolarisThemeService);

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
  readonly density = input<SolarisPreviewCodeDensity>();

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
    if (this.activeTab() === null) {
      this.activeTabState.set(nextTab);
    }
    this.activeTabChange.emit(nextTab);
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
