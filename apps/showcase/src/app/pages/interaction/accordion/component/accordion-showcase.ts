import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisAccordionComponent,
  SolarisCodeBlockComponent,
  SolarisCollapsibleComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisAccordionAppearance,
  type SolarisAccordionDensity,
  type SolarisAccordionSize,
  type SolarisAccordionType,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  ACCORDION_SHOWCASE_BASIC_CODE,
  ACCORDION_SHOWCASE_BREADCRUMBS,
  ACCORDION_SHOWCASE_IMPORT_CODE,
  ACCORDION_SHOWCASE_INSTALL_COMMANDS,
  ACCORDION_SHOWCASE_MULTIPLE_CODE,
  ACCORDION_SHOWCASE_NEXT,
  ACCORDION_SHOWCASE_PREV,
  ACCORDION_SHOWCASE_SLUG,
  ACCORDION_SHOWCASE_TOC_ITEMS,
  ACCORDION_TRANSLATION_PREFIX,
} from '../model/accordion-showcase.data';

@Component({
  standalone: true,
  imports: [
    SolarisAccordionComponent,
    SolarisCodeBlockComponent,
    SolarisCollapsibleComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './accordion-showcase.html',
  styleUrls: ['./accordion-showcase.scss'],
})
export class AccordionShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = ACCORDION_SHOWCASE_BREADCRUMBS;
  protected readonly prev = ACCORDION_SHOWCASE_PREV;
  protected readonly next = ACCORDION_SHOWCASE_NEXT;
  protected readonly tocItems = ACCORDION_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = ACCORDION_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = ACCORDION_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = ACCORDION_SHOWCASE_BASIC_CODE;
  protected readonly multipleCode = ACCORDION_SHOWCASE_MULTIPLE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: ACCORDION_TRANSLATION_PREFIX,
      slug: ACCORDION_SHOWCASE_SLUG,
      importCode: ACCORDION_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly appearances: readonly SolarisAccordionAppearance[] = [
    'boxed',
    'lined',
    'plain',
  ];

  protected singleValue: string | undefined;
  protected multipleValues: string[] = [];

  protected readonly selectedMode = signal<SolarisAccordionType>('single');
  protected readonly selectedAppearance =
    signal<SolarisAccordionAppearance>('boxed');
  protected readonly selectedSize = signal<SolarisAccordionSize>('md');
  protected readonly selectedDensity =
    signal<SolarisAccordionDensity>('normal');

  protected readonly appearanceCode = computed(
    () =>
      `<solaris-accordion appearance="${this.selectedAppearance()}" [(value)]="openValue">\n  <solaris-collapsible value="a" label="Section A">\n    <p>Content A.</p>\n  </solaris-collapsible>\n  <solaris-collapsible value="b" label="Section B">\n    <p>Content B.</p>\n  </solaris-collapsible>\n</solaris-accordion>`,
  );

  protected readonly sizeDensityCode = computed(
    () =>
      `<solaris-accordion size="${this.selectedSize()}" density="${this.selectedDensity()}" [(value)]="openValue">\n  <solaris-collapsible value="a" label="Section A">\n    <p>Content A.</p>\n  </solaris-collapsible>\n  <solaris-collapsible value="b" label="Section B">\n    <p>Content B.</p>\n  </solaris-collapsible>\n</solaris-accordion>`,
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
