import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisFormFieldComponent,
  SolarisPreviewCodeComponent,
  SolarisSwitchComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisSwitchDensity,
  type SolarisSwitchSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  SWITCH_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  SWITCH_SHOWCASE_APPEARANCE_SURFACE_CODE,
  SWITCH_SHOWCASE_BASIC_CODE,
  SWITCH_SHOWCASE_BREADCRUMBS,
  SWITCH_SHOWCASE_COLOR_CUSTOM_CODE,
  SWITCH_SHOWCASE_COLOR_DANGER_CODE,
  SWITCH_SHOWCASE_COLOR_INFO_CODE,
  SWITCH_SHOWCASE_COLOR_NEUTRAL_CODE,
  SWITCH_SHOWCASE_COLOR_PRIMARY_CODE,
  SWITCH_SHOWCASE_COLOR_SUCCESS_CODE,
  SWITCH_SHOWCASE_COLOR_WARNING_CODE,
  SWITCH_SHOWCASE_CUSTOM_CODE,
  SWITCH_SHOWCASE_FORM_FIELD_CODE,
  SWITCH_SHOWCASE_GROUP_CODE,
  SWITCH_SHOWCASE_IMPORT_CODE,
  SWITCH_SHOWCASE_INSTALL_COMMANDS,
  SWITCH_SHOWCASE_NEXT,
  SWITCH_SHOWCASE_PREV,
  SWITCH_SHOWCASE_REACTIVE_CODE,
  SWITCH_SHOWCASE_SLUG,
  SWITCH_SHOWCASE_STATES_CODE,
  SWITCH_SHOWCASE_THUMB_ICON_CODE,
  SWITCH_SHOWCASE_THUMB_NONE_CODE,
  SWITCH_SHOWCASE_THUMB_TEXT_CODE,
  SWITCH_SHOWCASE_TOC_ITEMS,
  SWITCH_TRANSLATION_PREFIX,
} from '../model/switch-showcase.data';

import { BasicSwitchExample } from '../examples/basic/component/basic.component';
import { GroupSwitchExample } from '../examples/group/component/group.component';
import { WithIconSwitchExample } from '../examples/with-icon/component/with-icon.component';
import { WithTextSwitchExample } from '../examples/with-text/component/with-text.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisFormFieldComponent,
    SolarisPreviewCodeComponent,
    SolarisSwitchComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicSwitchExample,
    GroupSwitchExample,
    WithIconSwitchExample,
    WithTextSwitchExample,
  ],
  templateUrl: './switch-showcase.html',
  styleUrls: ['./switch-showcase.scss'],
})
export class SwitchShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = SWITCH_SHOWCASE_BREADCRUMBS;
  protected readonly prev = SWITCH_SHOWCASE_PREV;
  protected readonly next = SWITCH_SHOWCASE_NEXT;
  protected readonly tocItems = SWITCH_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = SWITCH_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = SWITCH_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = SWITCH_SHOWCASE_BASIC_CODE;
  protected readonly appearanceSurfaceCode =
    SWITCH_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceOutlineCode =
    SWITCH_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly colorNeutralCode = SWITCH_SHOWCASE_COLOR_NEUTRAL_CODE;
  protected readonly colorPrimaryCode = SWITCH_SHOWCASE_COLOR_PRIMARY_CODE;
  protected readonly colorSuccessCode = SWITCH_SHOWCASE_COLOR_SUCCESS_CODE;
  protected readonly colorWarningCode = SWITCH_SHOWCASE_COLOR_WARNING_CODE;
  protected readonly colorDangerCode = SWITCH_SHOWCASE_COLOR_DANGER_CODE;
  protected readonly colorInfoCode = SWITCH_SHOWCASE_COLOR_INFO_CODE;
  protected readonly colorCustomCode = SWITCH_SHOWCASE_COLOR_CUSTOM_CODE;
  protected readonly thumbNoneCode = SWITCH_SHOWCASE_THUMB_NONE_CODE;
  protected readonly thumbIconCode = SWITCH_SHOWCASE_THUMB_ICON_CODE;
  protected readonly thumbTextCode = SWITCH_SHOWCASE_THUMB_TEXT_CODE;
  protected readonly groupCode = SWITCH_SHOWCASE_GROUP_CODE;
  protected readonly statesCode = SWITCH_SHOWCASE_STATES_CODE;
  protected readonly formFieldCode = SWITCH_SHOWCASE_FORM_FIELD_CODE;
  protected readonly reactiveCode = SWITCH_SHOWCASE_REACTIVE_CODE;
  protected readonly customCode = SWITCH_SHOWCASE_CUSTOM_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: SWITCH_TRANSLATION_PREFIX,
      slug: SWITCH_SHOWCASE_SLUG,
      importCode: SWITCH_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance = signal<'surface' | 'outline'>(
    'surface',
  );
  protected readonly selectedColor = signal<string>('primary');
  protected readonly selectedThumb = signal<'none' | 'icon' | 'text'>('none');
  protected readonly selectedSize = signal<SolarisSwitchSize>('md');
  protected readonly selectedDensity = signal<SolarisSwitchDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-switch size="${this.selectedSize()}" density="${this.selectedDensity()}">`,
      '  Notifications',
      '</solaris-switch>',
    ].join('\n'),
  );

  protected readonly notificationsControl = new FormControl(
    false,
    Validators.requiredTrue,
  );
  protected readonly enableControl = new FormControl(false);

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
