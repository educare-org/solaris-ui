import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisAvatarComponent,
  SolarisAvatarProfileComponent,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisAvatarRadius,
  type SolarisAvatarSize,
  type SolarisAvatarStatus,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  AVATAR_SHOWCASE_BASIC_CODE,
  AVATAR_SHOWCASE_BREADCRUMBS,
  AVATAR_SHOWCASE_IMPORT_CODE,
  AVATAR_SHOWCASE_INSTALL_COMMANDS,
  AVATAR_SHOWCASE_NEXT,
  AVATAR_SHOWCASE_PREV,
  AVATAR_SHOWCASE_RADII,
  AVATAR_SHOWCASE_SIZES,
  AVATAR_SHOWCASE_SLUG,
  AVATAR_SHOWCASE_STATUSES,
  AVATAR_SHOWCASE_TOC_ITEMS,
  AVATAR_TRANSLATION_PREFIX,
} from '../model/avatar-showcase.data';

import { BasicAvatarExample } from '../examples/basic/component/basic.component';
import { GroupAvatarExample } from '../examples/group/component/group.component';

@Component({
  standalone: true,
  imports: [
    SolarisAvatarComponent,
    SolarisAvatarProfileComponent,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicAvatarExample,
    GroupAvatarExample,
  ],
  templateUrl: './avatar-showcase.html',
  styleUrls: ['./avatar-showcase.scss'],
})
export class AvatarShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = AVATAR_SHOWCASE_BREADCRUMBS;
  protected readonly prev = AVATAR_SHOWCASE_PREV;
  protected readonly next = AVATAR_SHOWCASE_NEXT;
  protected readonly tocItems = AVATAR_SHOWCASE_TOC_ITEMS;

  protected readonly statuses = AVATAR_SHOWCASE_STATUSES;
  protected readonly sizes = AVATAR_SHOWCASE_SIZES;
  protected readonly radii = AVATAR_SHOWCASE_RADII;

  protected readonly installCommands = AVATAR_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = AVATAR_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = AVATAR_SHOWCASE_BASIC_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: AVATAR_TRANSLATION_PREFIX,
      slug: AVATAR_SHOWCASE_SLUG,
      importCode: AVATAR_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedStatus = signal<SolarisAvatarStatus>('online');
  protected readonly offHoursMode = signal<'auto' | 'off'>('auto');
  protected readonly selectedCount = signal<number>(3);
  protected readonly zeroMode = signal<'hide' | 'show'>('hide');
  protected readonly sealMode = signal<'seal' | 'plain'>('seal');
  protected readonly groupMax = signal<number>(4);
  protected readonly profileMode = signal<'full' | 'compact'>('full');
  protected readonly selectedSize = signal<SolarisAvatarSize>('md');
  protected readonly selectedRadius = signal<SolarisAvatarRadius>('full');

  protected readonly forceOffHours = computed(
    () => this.offHoursMode() === 'off',
  );
  protected readonly showZero = computed(() => this.zeroMode() === 'show');
  protected readonly verified = computed(() => this.sealMode() === 'seal');
  protected readonly profileCompact = computed(
    () => this.profileMode() === 'compact',
  );

  protected readonly statusCode = computed(() =>
    [
      '<solaris-avatar',
      '  name="Amelia Davis"',
      `  status="${this.selectedStatus()}"`,
      '  [showStatus]="true"',
      this.forceOffHours() ? '  [offHoursOverride]="true"' : null,
      '/>',
    ]
      .filter((line) => line !== null)
      .join('\n'),
  );

  protected readonly badgeCode = computed(() => {
    const count = this.selectedCount();
    const zero = this.showZero() ? ' [showZero]="true"' : '';
    return `<solaris-avatar name="Amelia Davis" [count]="${count}"${zero} />`;
  });

  protected readonly overlaysCode = computed(() =>
    [
      '<solaris-avatar',
      '  name="Amelia Davis"',
      '  [verified]="true"',
      '  actionAriaLabel="Edit photo"',
      '  (actionClick)="onEditPhoto()"',
      '>',
      '  <span solaris-avatar-organization>G</span>',
      '</solaris-avatar>',
    ].join('\n'),
  );

  protected readonly groupCode = computed(
    () =>
      `<solaris-avatar-group [users]="users" [max]="${this.groupMax()}" (overflowClick)="openList()" />`,
  );

  protected readonly profileCode = computed(() =>
    [
      '<solaris-avatar-profile',
      '  name="Amelia Davis"',
      '  title="Amelia Davis"',
      '  subtitle="davis@example.com"',
      '  badgeText="PRO"',
      '  [verified]="true"',
      this.profileCompact() ? '  [compact]="true"' : null,
      '/>',
    ]
      .filter((line) => line !== null)
      .join('\n'),
  );

  protected readonly sizeRadiusCode = computed(
    () =>
      `<solaris-avatar name="Amelia Davis" size="${this.selectedSize()}" radius="${this.selectedRadius()}" />`,
  );

  protected readonly statesCode = computed(() =>
    [
      '<solaris-avatar name="Amelia Davis" [active]="true" />',
      '<solaris-avatar name="Dominic Price" [loading]="true" />',
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
