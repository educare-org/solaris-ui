import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  SolarisIconComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../shell/docs-section/docs-section';

import {
  copyShowcaseText,
  downloadShowcaseMarkdown,
  openShowcaseAiAssistant,
} from '../../shared/showcase-page-utils';
import { buildIntroductionMarkdown } from '../functions/introduction-showcase-markdown';
import {
  INTRODUCTION_SHOWCASE_BREADCRUMBS,
  INTRODUCTION_SHOWCASE_CONTRACTS,
  INTRODUCTION_SHOWCASE_NEXT,
  INTRODUCTION_SHOWCASE_NEXT_ITEMS,
  INTRODUCTION_SHOWCASE_PRINCIPLES,
  INTRODUCTION_SHOWCASE_SLUG,
  INTRODUCTION_SHOWCASE_TOC_ITEMS,
  INTRODUCTION_TRANSLATION_PREFIX,
} from '../model/introduction-showcase.data';

@Component({
  standalone: true,
  imports: [
    SolarisIconComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './introduction.html',
  styleUrls: ['./introduction.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntroductionShowcasePage {
  private readonly document = inject(DOCUMENT);
  private readonly translateService = inject(SolarisTranslateService);

  protected readonly breadcrumbs = INTRODUCTION_SHOWCASE_BREADCRUMBS;
  protected readonly next = INTRODUCTION_SHOWCASE_NEXT;
  protected readonly tocItems = INTRODUCTION_SHOWCASE_TOC_ITEMS;

  protected readonly principles = INTRODUCTION_SHOWCASE_PRINCIPLES;
  protected readonly contracts = INTRODUCTION_SHOWCASE_CONTRACTS;
  protected readonly nextItems = INTRODUCTION_SHOWCASE_NEXT_ITEMS;

  protected copyPageAsMarkdown(): void {
    const translate = (key: string): string =>
      this.translateService.translate(key);
    void copyShowcaseText(
      this.document,
      buildIntroductionMarkdown(translate, {
        principles: this.principles,
        contracts: this.contracts,
        next: this.nextItems,
      }),
    );
  }

  protected downloadPageAsMarkdown(): void {
    const translate = (key: string): string =>
      this.translateService.translate(key);
    downloadShowcaseMarkdown(
      this.document,
      INTRODUCTION_SHOWCASE_SLUG,
      buildIntroductionMarkdown(translate, {
        principles: this.principles,
        contracts: this.contracts,
        next: this.nextItems,
      }),
    );
  }

  protected openInChatGpt(): void {
    openShowcaseAiAssistant(
      this.document,
      this.translateService,
      INTRODUCTION_TRANSLATION_PREFIX,
      'https://chatgpt.com/?q=',
    );
  }

  protected openInClaude(): void {
    openShowcaseAiAssistant(
      this.document,
      this.translateService,
      INTRODUCTION_TRANSLATION_PREFIX,
      'https://claude.ai/new?q=',
    );
  }
}
