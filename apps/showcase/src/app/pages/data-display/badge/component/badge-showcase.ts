import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisBadgeComponent,
  SolarisBadgeIconDirective,
  SolarisCodeBlockComponent,
  SolarisIconComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisBadgeAppearance,
  type SolarisBadgeColor,
  type SolarisBadgeDensity,
  type SolarisBadgePlacement,
  type SolarisBadgeSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  BADGE_SHOWCASE_APPEARANCES,
  BADGE_SHOWCASE_BASIC_CODE,
  BADGE_SHOWCASE_BREADCRUMBS,
  BADGE_SHOWCASE_COLORS,
  BADGE_SHOWCASE_IMPORT_CODE,
  BADGE_SHOWCASE_INSTALL_COMMANDS,
  BADGE_SHOWCASE_NEXT,
  BADGE_SHOWCASE_PREV,
  BADGE_SHOWCASE_SLUG,
  BADGE_SHOWCASE_TOC_ITEMS,
  BADGE_TRANSLATION_PREFIX,
} from '../model/badge-showcase.data';

import { BasicBadgeExample } from '../examples/basic/component/basic.component';
import { PositionedBadgeExample } from '../examples/positioned/component/positioned.component';

@Component({
  standalone: true,
  imports: [
    SolarisBadgeComponent,
    SolarisBadgeIconDirective,
    SolarisCodeBlockComponent,
    SolarisIconComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicBadgeExample,
    PositionedBadgeExample,
  ],
  templateUrl: './badge-showcase.html',
  styleUrls: ['./badge-showcase.scss'],
})
export class BadgeShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = BADGE_SHOWCASE_BREADCRUMBS;
  protected readonly prev = BADGE_SHOWCASE_PREV;
  protected readonly next = BADGE_SHOWCASE_NEXT;
  protected readonly tocItems = BADGE_SHOWCASE_TOC_ITEMS;

  protected readonly appearances = BADGE_SHOWCASE_APPEARANCES;
  protected readonly colors = BADGE_SHOWCASE_COLORS;

  protected readonly installCommands = BADGE_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = BADGE_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = BADGE_SHOWCASE_BASIC_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: BADGE_TRANSLATION_PREFIX,
      slug: BADGE_SHOWCASE_SLUG,
      importCode: BADGE_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance =
    signal<SolarisBadgeAppearance>('tonal');
  protected readonly selectedColor = signal<SolarisBadgeColor>('primary');
  protected readonly selectedSize = signal<SolarisBadgeSize>('md');
  protected readonly selectedDensity = signal<SolarisBadgeDensity>('normal');
  protected readonly selectedDemoKind = signal<'standard' | 'count'>(
    'standard',
  );
  protected readonly selectedCount = signal<number>(3);
  protected readonly selectedDotMode = signal<'dot' | 'pulse'>('dot');
  protected readonly selectedIcon = signal<string>('active');
  protected readonly selectedPlacement =
    signal<SolarisBadgePlacement>('top-right');

  protected readonly appearanceColorCode = computed(() =>
    [
      `<solaris-badge appearance="${this.selectedAppearance()}" color="${this.selectedColor()}">`,
      '  Badge',
      '</solaris-badge>',
    ].join('\n'),
  );

  protected readonly sizeDensityCode = computed(() => {
    const size = this.selectedSize();
    const density = this.selectedDensity();
    if (this.selectedDemoKind() === 'count') {
      return [
        `<solaris-badge size="${size}" density="${density}" color="primary" [count]="3" />`,
      ].join('\n');
    }
    return [
      `<solaris-badge size="${size}" density="${density}">Badge</solaris-badge>`,
    ].join('\n');
  });

  private getCountColor(count: number): 'success' | 'primary' | 'danger' {
    if (count > 42) {
      return 'success';
    }

    if (count > 3) {
      return 'primary';
    }

    return 'danger';
  }

  protected readonly countCode = computed(() => {
    const count = this.selectedCount();
    const color = this.getCountColor(count);

    return [`<solaris-badge color="${color}" [count]="${count}" />`].join('\n');
  });

  protected readonly dotCode = computed(() => {
    if (this.selectedDotMode() === 'pulse') {
      return [
        '<solaris-badge color="danger" [dot]="true" [pulse]="true" ariaLabel="Live" />',
      ].join('\n');
    }
    return [
      '<solaris-badge color="success" [dot]="true" ariaLabel="Online" />',
    ].join('\n');
  });

  protected readonly iconCode = computed(() => {
    switch (this.selectedIcon()) {
      case 'pending':
        return [
          '<solaris-badge color="warning">',
          '  <solaris-icon solaris-badge-icon name="warning" [decorative]="true" />',
          '  Pending',
          '</solaris-badge>',
        ].join('\n');
      case 'error':
        return [
          '<solaris-badge color="danger">',
          '  <solaris-icon solaris-badge-icon name="danger" [decorative]="true" />',
          '  Error',
          '</solaris-badge>',
        ].join('\n');
      case 'info':
        return [
          '<solaris-badge color="info">',
          '  Info',
          '  <solaris-icon solaris-badge-icon name="info" [decorative]="true" />',
          '</solaris-badge>',
        ].join('\n');
      case 'icon-only':
        return [
          '<solaris-badge color="primary" [iconOnly]="true" ariaLabel="Notifications">',
          '  <solaris-icon solaris-badge-icon name="info" [decorative]="true" />',
          '</solaris-badge>',
        ].join('\n');
      case 'active':
      default:
        return [
          '<solaris-badge color="success">',
          '  <solaris-icon solaris-badge-icon name="check" [decorative]="true" />',
          '  Active',
          '</solaris-badge>',
        ].join('\n');
    }
  });

  protected readonly placementCode = computed(() =>
    [
      '<div class="avatar-anchor">',
      '  <span class="avatar">A</span>',
      '  <solaris-badge',
      '    color="danger"',
      '    [count]="3"',
      `    placement="${this.selectedPlacement()}"`,
      '  />',
      '</div>',
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
