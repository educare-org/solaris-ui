import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisBreadcrumbComponent,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisBreadcrumbDensity,
  type SolarisBreadcrumbItem,
  type SolarisBreadcrumbOverflowPosition,
  type SolarisBreadcrumbSeparator,
  type SolarisBreadcrumbSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  BREADCRUMB_SHOWCASE_BREADCRUMBS,
  BREADCRUMB_SHOWCASE_BASIC_CODE,
  BREADCRUMB_SHOWCASE_ICONS_CODE,
  BREADCRUMB_SHOWCASE_IMPORT_CODE,
  BREADCRUMB_SHOWCASE_INSTALL_COMMANDS,
  BREADCRUMB_SHOWCASE_NAVIGATION_CODE,
  BREADCRUMB_SHOWCASE_NEXT,
  BREADCRUMB_SHOWCASE_OVERFLOW_END_CODE,
  BREADCRUMB_SHOWCASE_OVERFLOW_MIDDLE_CODE,
  BREADCRUMB_SHOWCASE_OVERFLOW_START_CODE,
  BREADCRUMB_SHOWCASE_PREV,
  BREADCRUMB_SHOWCASE_SEPARATOR_CHEVRON_CODE,
  BREADCRUMB_SHOWCASE_SEPARATOR_DOT_CODE,
  BREADCRUMB_SHOWCASE_SEPARATOR_SLASH_CODE,
  BREADCRUMB_SHOWCASE_SLUG,
  BREADCRUMB_SHOWCASE_TOC_ITEMS,
  BREADCRUMB_SHOWCASE_TRUNCATION_CODE,
  BREADCRUMB_TRANSLATION_PREFIX,
} from '../model/breadcrumb-showcase.data';

import { BasicBreadcrumbExample } from '../examples/basic/component/basic.component';
import { IconsBreadcrumbExample } from '../examples/icons/component/icons.component';
import { TruncationBreadcrumbExample } from '../examples/truncation/component/truncation.component';
import { NavigationBreadcrumbExample } from '../examples/navigation/component/navigation.component';

@Component({
  standalone: true,
  imports: [
    SolarisBreadcrumbComponent,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicBreadcrumbExample,
    IconsBreadcrumbExample,
    TruncationBreadcrumbExample,
    NavigationBreadcrumbExample,
  ],
  templateUrl: './breadcrumb-showcase.html',
  styleUrls: ['./breadcrumb-showcase.scss'],
})
export class BreadcrumbShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = BREADCRUMB_SHOWCASE_BREADCRUMBS;
  protected readonly prev = BREADCRUMB_SHOWCASE_PREV;
  protected readonly next = BREADCRUMB_SHOWCASE_NEXT;
  protected readonly tocItems = BREADCRUMB_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = BREADCRUMB_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = BREADCRUMB_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = BREADCRUMB_SHOWCASE_BASIC_CODE;
  protected readonly iconsCode = BREADCRUMB_SHOWCASE_ICONS_CODE;
  protected readonly separatorSlashCode =
    BREADCRUMB_SHOWCASE_SEPARATOR_SLASH_CODE;
  protected readonly separatorChevronCode =
    BREADCRUMB_SHOWCASE_SEPARATOR_CHEVRON_CODE;
  protected readonly separatorDotCode = BREADCRUMB_SHOWCASE_SEPARATOR_DOT_CODE;
  protected readonly overflowStartCode =
    BREADCRUMB_SHOWCASE_OVERFLOW_START_CODE;
  protected readonly overflowMiddleCode =
    BREADCRUMB_SHOWCASE_OVERFLOW_MIDDLE_CODE;
  protected readonly overflowEndCode = BREADCRUMB_SHOWCASE_OVERFLOW_END_CODE;
  protected readonly truncationCode = BREADCRUMB_SHOWCASE_TRUNCATION_CODE;
  protected readonly navigationCode = BREADCRUMB_SHOWCASE_NAVIGATION_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: BREADCRUMB_TRANSLATION_PREFIX,
      slug: BREADCRUMB_SHOWCASE_SLUG,
      importCode: BREADCRUMB_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly basicItems: SolarisBreadcrumbItem[] = [
    { labelKey: 'breadcrumb.home', icon: 'home', href: '/' },
    { labelKey: 'breadcrumb.products', href: '/products' },
    { labelKey: 'breadcrumb.analytics', current: true },
  ];

  protected readonly longItems: SolarisBreadcrumbItem[] = [
    { labelKey: 'breadcrumb.home', icon: 'home', href: '/' },
    { labelKey: 'breadcrumb.organization', href: '/organization' },
    { labelKey: 'breadcrumb.campuses', href: '/organization/campuses' },
    {
      labelKey: 'breadcrumb.students',
      href: '/organization/campuses/students',
    },
    {
      labelKey: 'breadcrumb.enrollment',
      href: '/organization/campuses/students/enrollment',
    },
    { labelKey: 'breadcrumb.current', current: true },
  ];

  protected readonly selectedSeparator =
    signal<SolarisBreadcrumbSeparator>('slash');
  protected readonly selectedOverflow =
    signal<SolarisBreadcrumbOverflowPosition>('middle');
  protected readonly selectedSize = signal<SolarisBreadcrumbSize>('md');
  protected readonly selectedDensity =
    signal<SolarisBreadcrumbDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      '<solaris-breadcrumb',
      '  [items]="items"',
      `  size="${this.selectedSize()}"`,
      `  density="${this.selectedDensity()}"`,
      '/>',
    ].join('\n'),
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
