import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisPreviewCodeComponent,
  SolarisCodeBlockComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisPreviewCodeTab,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  PREVIEW_CODE_SHOWCASE_BASIC_CODE,
  PREVIEW_CODE_SHOWCASE_BREADCRUMBS,
  PREVIEW_CODE_SHOWCASE_BUTTON_FILES,
  PREVIEW_CODE_SHOWCASE_IMPORT_CODE,
  PREVIEW_CODE_SHOWCASE_INSTALL_COMMANDS,
  PREVIEW_CODE_SHOWCASE_LONG_CODE,
  PREVIEW_CODE_SHOWCASE_NEXT,
  PREVIEW_CODE_SHOWCASE_PREV,
  PREVIEW_CODE_SHOWCASE_SLUG,
  PREVIEW_CODE_SHOWCASE_TOC_ITEMS,
  PREVIEW_CODE_TRANSLATION_PREFIX,
} from '../model/preview-code-showcase.data';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisPreviewCodeComponent,
    SolarisCodeBlockComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './preview-code-showcase.html',
  styleUrls: ['./preview-code-showcase.scss'],
})
export class PreviewCodeShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = PREVIEW_CODE_SHOWCASE_BREADCRUMBS;
  protected readonly prev = PREVIEW_CODE_SHOWCASE_PREV;
  protected readonly next = PREVIEW_CODE_SHOWCASE_NEXT;
  protected readonly tocItems = PREVIEW_CODE_SHOWCASE_TOC_ITEMS;

  protected readonly basicCode = PREVIEW_CODE_SHOWCASE_BASIC_CODE;
  protected readonly buttonFiles = PREVIEW_CODE_SHOWCASE_BUTTON_FILES;
  protected readonly installCommands = PREVIEW_CODE_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = PREVIEW_CODE_SHOWCASE_IMPORT_CODE;
  protected readonly longCode = PREVIEW_CODE_SHOWCASE_LONG_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: PREVIEW_CODE_TRANSLATION_PREFIX,
      slug: PREVIEW_CODE_SHOWCASE_SLUG,
      importCode: PREVIEW_CODE_SHOWCASE_IMPORT_CODE,
      basicCode: PREVIEW_CODE_SHOWCASE_BASIC_CODE,
      basicLanguage: 'html',
    },
  );

  protected readonly controlledTab = signal<SolarisPreviewCodeTab>('preview');

  protected readonly selectedAlign = signal<string>('center');
  protected readonly selectedPadding = signal<string>('md');
  protected readonly selectedMinHeight = signal<string>('md');

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
}
