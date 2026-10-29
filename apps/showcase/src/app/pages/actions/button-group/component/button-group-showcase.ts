import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisButtonGroupComponent,
  SolarisButtonDirective,
  SolarisIconButtonDirective,
  SolarisCodeBlockComponent,
  SolarisIconComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisButtonGroupDensity,
  type SolarisButtonGroupOrientation,
  type SolarisButtonGroupSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  BUTTON_GROUP_SHOWCASE_BREADCRUMBS,
  BUTTON_GROUP_SHOWCASE_IMPORT_CODE,
  BUTTON_GROUP_SHOWCASE_INSTALL_COMMANDS,
  BUTTON_GROUP_SHOWCASE_MOTION_CODE,
  BUTTON_GROUP_SHOWCASE_NEXT,
  BUTTON_GROUP_SHOWCASE_PREV,
  BUTTON_GROUP_SHOWCASE_SLUG,
  BUTTON_GROUP_SHOWCASE_TOC_ITEMS,
  BUTTON_GROUP_TRANSLATION_PREFIX,
} from '../model/button-group-showcase.data';

@Component({
  standalone: true,
  imports: [
    SolarisButtonGroupComponent,
    SolarisButtonDirective,
    SolarisIconButtonDirective,
    SolarisCodeBlockComponent,
    SolarisIconComponent,
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
  templateUrl: './button-group-showcase.html',
  styleUrls: ['./button-group-showcase.scss'],
})
export class ButtonGroupShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = BUTTON_GROUP_SHOWCASE_BREADCRUMBS;
  protected readonly prev = BUTTON_GROUP_SHOWCASE_PREV;
  protected readonly next = BUTTON_GROUP_SHOWCASE_NEXT;
  protected readonly tocItems = BUTTON_GROUP_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = BUTTON_GROUP_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = BUTTON_GROUP_SHOWCASE_IMPORT_CODE;
  protected readonly motionCode = BUTTON_GROUP_SHOWCASE_MOTION_CODE;

  protected readonly motionLoading = signal(false);

  protected toggleMotionLoading(): void {
    this.motionLoading.update((value) => !value);
  }

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: BUTTON_GROUP_TRANSLATION_PREFIX,
      slug: BUTTON_GROUP_SHOWCASE_SLUG,
      importCode: BUTTON_GROUP_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedSize = signal<SolarisButtonGroupSize>('md');
  protected readonly selectedDensity =
    signal<SolarisButtonGroupDensity>('normal');
  protected readonly selectedOrientation =
    signal<SolarisButtonGroupOrientation>('horizontal');
  protected readonly selectedAttached = signal<'attached' | 'separated'>(
    'attached',
  );

  protected readonly attached = computed(
    () => this.selectedAttached() === 'attached',
  );

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-button-group size="${this.selectedSize()}" density="${this.selectedDensity()}" aria-label="Editor actions">`,
      '  <button solaris-button>Edit</button>',
      '  <button solaris-button>Duplicate</button>',
      '  <button solaris-button>Delete</button>',
      '</solaris-button-group>',
    ].join('\n'),
  );

  protected readonly attachedCode = computed(() =>
    [
      `<solaris-button-group [attached]="${this.attached()}" aria-label="Separated actions">`,
      '  <button solaris-button>Edit</button>',
      '  <button solaris-button>Duplicate</button>',
      '  <button solaris-button [disabled]="true">Delete</button>',
      '</solaris-button-group>',
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
