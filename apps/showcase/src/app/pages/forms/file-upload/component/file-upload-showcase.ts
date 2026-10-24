import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SOLARIS_FILE_UPLOAD_DEFAULT_MAX_FILES,
  SOLARIS_FILE_UPLOAD_DEFAULT_MAX_SIZE,
  SolarisCodeBlockComponent,
  SolarisFileUploadComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisToastService,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisFileRejected,
  type SolarisFileUploadDensity,
  type SolarisFileUploadSize,
  type SolarisFileUploadVariant,
  type SolarisImageEditorAspect,
  type SolarisImageEditorShape,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  FILE_UPLOAD_SHOWCASE_BASIC_CODE,
  FILE_UPLOAD_SHOWCASE_BREADCRUMBS,
  FILE_UPLOAD_SHOWCASE_IMPORT_CODE,
  FILE_UPLOAD_SHOWCASE_INSTALL_COMMANDS,
  FILE_UPLOAD_SHOWCASE_NEXT,
  FILE_UPLOAD_SHOWCASE_PREV,
  FILE_UPLOAD_SHOWCASE_SLUG,
  FILE_UPLOAD_SHOWCASE_TOC_ITEMS,
  FILE_UPLOAD_SHOWCASE_UPLOAD_AUTO_CODE,
  FILE_UPLOAD_SHOWCASE_UPLOAD_MANUAL_CODE,
  FILE_UPLOAD_SHOWCASE_URL_CODE,
  FILE_UPLOAD_TRANSLATION_PREFIX,
  fileUploadEditorCode,
  fileUploadModeCode,
} from '../model/file-upload-showcase.data';

import { BasicFileUploadExample } from '../examples/basic/component/basic.component';
import { AvatarFileUploadExample } from '../examples/avatar/component/avatar.component';
import { FileUploadEditorExample } from '../examples/editor/component/editor.component';
import { UploadAutoFileUploadExample } from '../examples/upload-auto/component/upload-auto.component';
import { UploadManualFileUploadExample } from '../examples/upload-manual/component/upload-manual.component';

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisFileUploadComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicFileUploadExample,
    AvatarFileUploadExample,
    FileUploadEditorExample,
    UploadAutoFileUploadExample,
    UploadManualFileUploadExample,
  ],
  templateUrl: './file-upload-showcase.html',
  styleUrls: ['./file-upload-showcase.scss'],
})
export class FileUploadShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly toastService = inject(SolarisToastService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = FILE_UPLOAD_SHOWCASE_BREADCRUMBS;
  protected readonly prev = FILE_UPLOAD_SHOWCASE_PREV;
  protected readonly next = FILE_UPLOAD_SHOWCASE_NEXT;
  protected readonly tocItems = FILE_UPLOAD_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = FILE_UPLOAD_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = FILE_UPLOAD_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = FILE_UPLOAD_SHOWCASE_BASIC_CODE;
  protected readonly urlCode = FILE_UPLOAD_SHOWCASE_URL_CODE;
  protected readonly uploadAutoCode = FILE_UPLOAD_SHOWCASE_UPLOAD_AUTO_CODE;
  protected readonly uploadManualCode = FILE_UPLOAD_SHOWCASE_UPLOAD_MANUAL_CODE;
  protected readonly dropzoneCode = computed(() =>
    fileUploadModeCode('dropzone', this.selectedSize(), this.selectedDensity()),
  );
  protected readonly buttonCode = computed(() =>
    fileUploadModeCode('button', this.selectedSize(), this.selectedDensity()),
  );
  protected readonly avatarCode = computed(() =>
    fileUploadModeCode('avatar', this.selectedSize(), this.selectedDensity()),
  );
  protected readonly fieldCode = computed(() =>
    fileUploadModeCode('field', this.selectedSize(), this.selectedDensity()),
  );

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: FILE_UPLOAD_TRANSLATION_PREFIX,
      slug: FILE_UPLOAD_SHOWCASE_SLUG,
      importCode: FILE_UPLOAD_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedVariant =
    signal<SolarisFileUploadVariant>('dropzone');
  protected readonly selectedSize = signal<SolarisFileUploadSize>('md');
  protected readonly selectedDensity =
    signal<SolarisFileUploadDensity>('normal');
  protected readonly selectedAspect = signal<SolarisImageEditorAspect>('free');
  protected readonly selectedShape = signal<SolarisImageEditorShape>('rect');
  protected readonly selectedUploadMode = signal<'auto' | 'manual'>('auto');

  protected readonly modeCode = computed(() =>
    fileUploadModeCode(
      this.selectedVariant(),
      this.selectedSize(),
      this.selectedDensity(),
    ),
  );

  protected readonly editorCode = computed(() =>
    fileUploadEditorCode(this.selectedShape(), this.selectedAspect()),
  );

  protected copyPageAsMarkdown(): void {
    this.pageActions.copyPageAsMarkdown();
  }

  protected downloadPageAsMarkdown(): void {
    this.pageActions.downloadPageAsMarkdown();
  }

  protected openInChatGpt(): void {
    this.pageActions.openInChatGpt();
  }

  protected openInClaude(): void {
    this.pageActions.openInClaude();
  }

  protected onFileRejected(rejected: readonly SolarisFileRejected[]): void {
    for (const entry of rejected) {
      if (entry.error === 'max-size') {
        this.toastService.warning({
          title: this.translateService.translate(
            'solaris.file-upload.error.max-size',
            { size: this.formatSize(SOLARIS_FILE_UPLOAD_DEFAULT_MAX_SIZE) },
          ),
          description: entry.file.name,
        });
      } else if (entry.error === 'max-files') {
        this.toastService.warning({
          title: this.translateService.translate(
            'solaris.file-upload.error.max-files',
            { count: String(SOLARIS_FILE_UPLOAD_DEFAULT_MAX_FILES) },
          ),
          description: entry.file.name,
        });
      } else {
        this.toastService.warning({
          title: this.translateService.translate(
            'solaris.file-upload.error.type-not-allowed',
          ),
          description: entry.file.name,
        });
      }
    }
  }

  private formatSize(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes < 0) {
      return '0 B';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }
    const rounded = Math.round(value * 10) / 10;
    return `${rounded} ${units[unitIndex]}`;
  }
}
