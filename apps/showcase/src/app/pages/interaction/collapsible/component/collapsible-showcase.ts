import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisCodeBlockComponent,
  SolarisCollapsibleComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisCollapsibleAppearance,
  type SolarisCollapsibleDensity,
  type SolarisCollapsibleSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  COLLAPSIBLE_SHOWCASE_BASIC_CODE,
  COLLAPSIBLE_SHOWCASE_BREADCRUMBS,
  COLLAPSIBLE_SHOWCASE_CONTROLLED_CODE,
  COLLAPSIBLE_SHOWCASE_IMPORT_CODE,
  COLLAPSIBLE_SHOWCASE_INSTALL_COMMANDS,
  COLLAPSIBLE_SHOWCASE_NEXT,
  COLLAPSIBLE_SHOWCASE_PREV,
  COLLAPSIBLE_SHOWCASE_SLUG,
  COLLAPSIBLE_SHOWCASE_TOC_ITEMS,
  COLLAPSIBLE_TRANSLATION_PREFIX,
} from '../model/collapsible-showcase.data';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
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
  templateUrl: './collapsible-showcase.html',
  styleUrls: ['./collapsible-showcase.scss'],
})
export class CollapsibleShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = COLLAPSIBLE_SHOWCASE_BREADCRUMBS;
  protected readonly prev = COLLAPSIBLE_SHOWCASE_PREV;
  protected readonly next = COLLAPSIBLE_SHOWCASE_NEXT;
  protected readonly tocItems = COLLAPSIBLE_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = COLLAPSIBLE_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = COLLAPSIBLE_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = COLLAPSIBLE_SHOWCASE_BASIC_CODE;
  protected readonly controlledCode = COLLAPSIBLE_SHOWCASE_CONTROLLED_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: COLLAPSIBLE_TRANSLATION_PREFIX,
      slug: COLLAPSIBLE_SHOWCASE_SLUG,
      importCode: COLLAPSIBLE_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly appearances: readonly SolarisCollapsibleAppearance[] = [
    'boxed',
    'lined',
    'plain',
  ];

  protected readonly selectedAppearance =
    signal<SolarisCollapsibleAppearance>('boxed');
  protected readonly selectedSize = signal<SolarisCollapsibleSize>('md');
  protected readonly selectedDensity =
    signal<SolarisCollapsibleDensity>('normal');
  protected readonly controlledOpen = signal(false);

  protected readonly appearanceCode = computed(
    () =>
      `<solaris-collapsible appearance="${this.selectedAppearance()}" label="Account settings">\n  <p>Manage your personal information here.</p>\n</solaris-collapsible>`,
  );

  protected readonly sizeDensityCode = computed(
    () =>
      `<solaris-collapsible size="${this.selectedSize()}" density="${this.selectedDensity()}" label="Account settings">\n  <p>Manage your personal information here.</p>\n</solaris-collapsible>`,
  );

  protected toggleControlled(): void {
    this.controlledOpen.update((open) => !open);
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
