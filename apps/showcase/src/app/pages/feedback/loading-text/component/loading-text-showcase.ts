import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisLoadingTextComponent,
  SolarisPreviewCodeComponent,
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
  LOADING_TEXT_SHOWCASE_BASIC_CODE,
  LOADING_TEXT_SHOWCASE_BREADCRUMBS,
  LOADING_TEXT_SHOWCASE_DOTS_CODE,
  LOADING_TEXT_SHOWCASE_IMPORT_CODE,
  LOADING_TEXT_SHOWCASE_INSTALL_COMMANDS,
  LOADING_TEXT_SHOWCASE_NEXT,
  LOADING_TEXT_SHOWCASE_PREV,
  LOADING_TEXT_SHOWCASE_SLUG,
  LOADING_TEXT_SHOWCASE_TOC_ITEMS,
  LOADING_TEXT_TRANSLATION_PREFIX,
  loadingTextClampCode,
  loadingTextColorCode,
  loadingTextSizeDensityCode,
  loadingTextSpeedCode,
} from '../model/loading-text-showcase.data';

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisLoadingTextComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './loading-text-showcase.html',
  styleUrls: ['./loading-text-showcase.scss'],
})
export class LoadingTextShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = LOADING_TEXT_SHOWCASE_BREADCRUMBS;
  protected readonly prev = LOADING_TEXT_SHOWCASE_PREV;
  protected readonly next = LOADING_TEXT_SHOWCASE_NEXT;
  protected readonly tocItems = LOADING_TEXT_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = LOADING_TEXT_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = LOADING_TEXT_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = LOADING_TEXT_SHOWCASE_BASIC_CODE;
  protected readonly dotsCode = LOADING_TEXT_SHOWCASE_DOTS_CODE;

  protected readonly selectedSize = signal<'sm' | 'md' | 'lg' | 'xl'>('md');
  protected readonly selectedDensity = signal<
    'compact' | 'normal' | 'comfortable'
  >('normal');
  protected readonly selectedColor = signal<
    'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'custom'
  >('primary');
  protected readonly selectedClamp = signal<'off' | '2' | '3'>('2');
  protected readonly selectedSpeed = signal<'slow' | 'normal' | 'fast'>(
    'normal',
  );

  protected readonly sizeDensityCode = computed(() =>
    loadingTextSizeDensityCode(this.selectedSize(), this.selectedDensity()),
  );
  protected readonly colorCode = computed(() =>
    loadingTextColorCode(this.selectedColor()),
  );
  protected readonly clampValue = computed(() =>
    this.selectedClamp() === 'off' ? 0 : Number(this.selectedClamp()),
  );
  protected readonly clampCode = computed(() =>
    loadingTextClampCode(
      this.selectedClamp() === 'off' ? '0' : this.selectedClamp(),
    ),
  );
  protected readonly speedCode = computed(() =>
    loadingTextSpeedCode(this.selectedSpeed()),
  );

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      slug: LOADING_TEXT_SHOWCASE_SLUG,
      translationPrefix: LOADING_TEXT_TRANSLATION_PREFIX,
      importCode: LOADING_TEXT_SHOWCASE_IMPORT_CODE,
      basicCode: LOADING_TEXT_SHOWCASE_BASIC_CODE,
      basicLanguage: 'html',
    },
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
}
