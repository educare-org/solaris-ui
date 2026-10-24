import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisAlertComponent,
  SolarisAlertTitleDirective,
  SolarisAlertDescriptionDirective,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisAlertAppearance,
  type SolarisAlertDensity,
  type SolarisAlertSize,
  type SolarisAlertVariant,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  ALERT_SHOWCASE_ANATOMY_CODE,
  ALERT_SHOWCASE_ANNOUNCEMENT_BASIC_CODE,
  ALERT_SHOWCASE_ANNOUNCEMENT_IMAGE_BG_CODE,
  ALERT_SHOWCASE_ANNOUNCEMENT_PERSISTENT_CODE,
  ALERT_SHOWCASE_BASIC_CODE,
  ALERT_SHOWCASE_BREADCRUMBS,
  ALERT_SHOWCASE_CLOSABLE_CODE,
  ALERT_SHOWCASE_IMPORT_CODE,
  ALERT_SHOWCASE_INSTALL_COMMANDS,
  ALERT_SHOWCASE_LIVE_CODE,
  ALERT_SHOWCASE_NEXT,
  ALERT_SHOWCASE_PREV,
  ALERT_SHOWCASE_SLUG,
  ALERT_SHOWCASE_TOC_ITEMS,
  ALERT_TRANSLATION_PREFIX,
} from '../model/alert-showcase.data';

import { AnnouncementPersistentExample } from '../examples/announcement-persistent/component/announcement-persistent.component';
import { AnnouncementImageBgExample } from '../examples/announcement-image-bg/component/announcement-image-bg.component';
import { AnnouncementBasicExample } from '../examples/announcement-basic/component/announcement-basic.component';
import { ClosableAlertExample } from '../examples/closable/component/closable.component';
import { AnatomyAlertExample } from '../examples/anatomy/component/anatomy.component';
import { BasicAlertExample } from '../examples/basic/component/basic.component';

@Component({
  standalone: true,
  imports: [
    SolarisAlertComponent,
    SolarisAlertTitleDirective,
    SolarisAlertDescriptionDirective,
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
    BasicAlertExample,
    AnatomyAlertExample,
    ClosableAlertExample,
    AnnouncementBasicExample,
    AnnouncementPersistentExample,
    AnnouncementImageBgExample,
  ],
  templateUrl: './alert-showcase.html',
  styleUrls: ['./alert-showcase.scss'],
})
export class AlertShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = ALERT_SHOWCASE_BREADCRUMBS;
  protected readonly prev = ALERT_SHOWCASE_PREV;
  protected readonly next = ALERT_SHOWCASE_NEXT;
  protected readonly tocItems = ALERT_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = ALERT_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = ALERT_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = ALERT_SHOWCASE_BASIC_CODE;
  protected readonly anatomyCode = ALERT_SHOWCASE_ANATOMY_CODE;
  protected readonly closableCode = ALERT_SHOWCASE_CLOSABLE_CODE;
  protected readonly liveCode = ALERT_SHOWCASE_LIVE_CODE;
  protected readonly announcementBasicCode =
    ALERT_SHOWCASE_ANNOUNCEMENT_BASIC_CODE;
  protected readonly announcementPersistentCode =
    ALERT_SHOWCASE_ANNOUNCEMENT_PERSISTENT_CODE;
  protected readonly announcementImageBgCode =
    ALERT_SHOWCASE_ANNOUNCEMENT_IMAGE_BG_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: ALERT_TRANSLATION_PREFIX,
      slug: ALERT_SHOWCASE_SLUG,
      importCode: ALERT_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly variants: readonly SolarisAlertVariant[] = [
    'neutral',
    'info',
    'success',
    'warning',
    'danger',
    'custom',
  ];

  protected readonly appearances: readonly SolarisAlertAppearance[] = [
    'tonal',
    'outline',
    'surface',
    'solid',
  ];

  protected readonly selectedVariant = signal<SolarisAlertVariant>('info');
  protected readonly selectedAppearance =
    signal<SolarisAlertAppearance>('tonal');
  protected readonly selectedAnnouncement = signal<string>('basic');
  protected readonly selectedSize = signal<SolarisAlertSize>('md');
  protected readonly selectedDensity = signal<SolarisAlertDensity>('normal');

  protected readonly variantAppearanceCode = computed(() => {
    const variant = this.selectedVariant();
    const appearance = this.selectedAppearance();
    return [
      `<solaris-alert variant="${variant}" appearance="${appearance}">`,
      '  Changes are saved automatically.',
      '</solaris-alert>',
    ].join('\n');
  });

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-alert variant="warning" size="${this.selectedSize()}" density="${this.selectedDensity()}" [closable]="true">`,
      '  <h3 solaris-alert-title>Attention</h3>',
      '  <p solaris-alert-description>This configuration may affect active users.</p>',
      '</solaris-alert>',
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
