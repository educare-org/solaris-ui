import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  CODE_BLOCK_SHOWCASE_BASIC_CODE,
  CODE_BLOCK_SHOWCASE_BREADCRUMBS,
  CODE_BLOCK_SHOWCASE_IMPORT_CODE,
  CODE_BLOCK_SHOWCASE_INLINE_CODE,
  CODE_BLOCK_SHOWCASE_INSTALL_COMMANDS,
  CODE_BLOCK_SHOWCASE_JSON_CODE,
  CODE_BLOCK_SHOWCASE_LONG_CODE,
  CODE_BLOCK_SHOWCASE_NEXT,
  CODE_BLOCK_SHOWCASE_PREV,
  CODE_BLOCK_SHOWCASE_SLUG,
  CODE_BLOCK_SHOWCASE_TOC_ITEMS,
  CODE_BLOCK_TRANSLATION_PREFIX,
} from '../model/code-block-showcase.data';

@Component({
  standalone: true,
  imports: [
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
  templateUrl: './code-block-showcase.html',
  styleUrls: ['./code-block-showcase.scss'],
})
export class CodeBlockShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = CODE_BLOCK_SHOWCASE_BREADCRUMBS;
  protected readonly prev = CODE_BLOCK_SHOWCASE_PREV;
  protected readonly next = CODE_BLOCK_SHOWCASE_NEXT;
  protected readonly tocItems = CODE_BLOCK_SHOWCASE_TOC_ITEMS;

  protected readonly basicCode = CODE_BLOCK_SHOWCASE_BASIC_CODE;
  protected readonly inlineCode = CODE_BLOCK_SHOWCASE_INLINE_CODE;
  protected readonly installCommands = CODE_BLOCK_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = CODE_BLOCK_SHOWCASE_IMPORT_CODE;
  protected readonly longCode = CODE_BLOCK_SHOWCASE_LONG_CODE;
  protected readonly jsonCode = CODE_BLOCK_SHOWCASE_JSON_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: CODE_BLOCK_TRANSLATION_PREFIX,
      slug: CODE_BLOCK_SHOWCASE_SLUG,
      importCode: CODE_BLOCK_SHOWCASE_IMPORT_CODE,
      basicCode: CODE_BLOCK_SHOWCASE_BASIC_CODE,
      basicLanguage: 'typescript',
    },
  );

  protected readonly selectedAppearance = signal<string>('surface');
  protected readonly selectedSize = signal<string>('md');
  protected readonly selectedDensity = signal<string>('comfortable');
  protected readonly selectedLayout = signal<string>('inline');

  protected editableCode = 'const answer = 42;';

  protected handleEditableCodeChange(value: string): void {
    this.editableCode = value;
  }

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
