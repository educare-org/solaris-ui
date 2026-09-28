import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisTabsDensity,
  type SolarisTabsSize,
  SolarisTabsAppearance,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  TABS_SHOWCASE_APPEARANCE_ENCLOSED_CODE,
  TABS_SHOWCASE_APPEARANCE_PILLS_CODE,
  TABS_SHOWCASE_APPEARANCE_UNDERLINE_CODE,
  TABS_SHOWCASE_BASIC_CODE,
  TABS_SHOWCASE_BREADCRUMBS,
  TABS_SHOWCASE_COLOR_NEUTRAL_CODE,
  TABS_SHOWCASE_COLOR_PRIMARY_CODE,
  TABS_SHOWCASE_DISABLED_CODE,
  TABS_SHOWCASE_FULL_WIDTH_CODE,
  TABS_SHOWCASE_ICONS_BADGES_CODE,
  TABS_SHOWCASE_IMPORT_CODE,
  TABS_SHOWCASE_INSTALL_COMMANDS,
  TABS_SHOWCASE_MANUAL_ACTIVATION_CODE,
  TABS_SHOWCASE_NEXT,
  TABS_SHOWCASE_PREV,
  TABS_SHOWCASE_SCROLLABLE_CODE,
  TABS_SHOWCASE_SHAPE_CODE,
  TABS_SHOWCASE_SLUG,
  TABS_SHOWCASE_TOC_ITEMS,
  TABS_SHOWCASE_TRANSITION_FADE_CODE,
  TABS_SHOWCASE_TRANSITION_SLIDE_CODE,
  TABS_SHOWCASE_VERTICAL_CODE,
  TABS_SHOWCASE_WITH_PANELS_CODE,
  TABS_TRANSLATION_PREFIX,
} from '../model/tabs-showcase.data';

import { BasicTabsExample } from '../examples/basic/component/basic.component';
import { TabsWithPanelsExample } from '../examples/with-panels/component/with-panels.component';
import { IconsAndBadgesTabsExample } from '../examples/icons-and-badges/component/icons-and-badges.component';
import { DisabledTabsExample } from '../examples/disabled/component/disabled.component';
import { VerticalTabsExample } from '../examples/vertical/component/vertical.component';
import { PillsTabsExample } from '../examples/pills/component/pills.component';
import { ShapeTabsExample } from '../examples/shape/component/shape.component';
import { EnclosedTabsExample } from '../examples/enclosed/component/enclosed.component';
import { FullWidthTabsExample } from '../examples/full-width/component/full-width.component';
import { ScrollableTabsExample } from '../examples/scrollable/component/scrollable.component';
import { ManualActivationTabsExample } from '../examples/manual-activation/component/manual-activation.component';
import { TransitionFadeTabsExample } from '../examples/transition-fade/component/transition-fade.component';
import { TransitionSlideTabsExample } from '../examples/transition-slide/component/transition-slide.component';

@Component({
  standalone: true,
  imports: [
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
    BasicTabsExample,
    TabsWithPanelsExample,
    IconsAndBadgesTabsExample,
    DisabledTabsExample,
    VerticalTabsExample,
    PillsTabsExample,
    ShapeTabsExample,
    EnclosedTabsExample,
    FullWidthTabsExample,
    ScrollableTabsExample,
    ManualActivationTabsExample,
    TransitionFadeTabsExample,
    TransitionSlideTabsExample,
  ],
  templateUrl: './tabs-showcase.html',
  styleUrls: ['./tabs-showcase.scss'],
})
export class TabsShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = TABS_SHOWCASE_BREADCRUMBS;
  protected readonly prev = TABS_SHOWCASE_PREV;
  protected readonly next = TABS_SHOWCASE_NEXT;
  protected readonly tocItems = TABS_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = TABS_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = TABS_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = TABS_SHOWCASE_BASIC_CODE;
  protected readonly appearanceUnderlineCode =
    TABS_SHOWCASE_APPEARANCE_UNDERLINE_CODE;
  protected readonly appearancePillsCode = TABS_SHOWCASE_APPEARANCE_PILLS_CODE;
  protected readonly appearanceEnclosedCode =
    TABS_SHOWCASE_APPEARANCE_ENCLOSED_CODE;
  protected readonly colorPrimaryCode = TABS_SHOWCASE_COLOR_PRIMARY_CODE;
  protected readonly colorNeutralCode = TABS_SHOWCASE_COLOR_NEUTRAL_CODE;
  protected readonly verticalCode = TABS_SHOWCASE_VERTICAL_CODE;
  protected readonly fullWidthCode = TABS_SHOWCASE_FULL_WIDTH_CODE;
  protected readonly scrollableCode = TABS_SHOWCASE_SCROLLABLE_CODE;
  protected readonly shapeCode = TABS_SHOWCASE_SHAPE_CODE;
  protected readonly withPanelsCode = TABS_SHOWCASE_WITH_PANELS_CODE;
  protected readonly iconsAndBadgesCode = TABS_SHOWCASE_ICONS_BADGES_CODE;
  protected readonly disabledCode = TABS_SHOWCASE_DISABLED_CODE;
  protected readonly manualActivationCode =
    TABS_SHOWCASE_MANUAL_ACTIVATION_CODE;
  protected readonly transitionFadeCode = TABS_SHOWCASE_TRANSITION_FADE_CODE;
  protected readonly transitionSlideCode = TABS_SHOWCASE_TRANSITION_SLIDE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: TABS_TRANSLATION_PREFIX,
      slug: TABS_SHOWCASE_SLUG,
      importCode: TABS_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance = signal<string>('underline');
  protected readonly selectedSize = signal<SolarisTabsSize>('md');
  protected readonly selectedDensity = signal<SolarisTabsDensity>('normal');
  protected readonly selectedDemoAppearance =
    signal<SolarisTabsAppearance>('underline');

  protected readonly sizeDensityAppearanceCode = computed(() =>
    [
      `<solaris-tabs size="${this.selectedSize()}" density="${this.selectedDensity()}" appearance="${this.selectedDemoAppearance()}" defaultValue="m" aria-label="Size, density and appearance">`,
      '  <solaris-tab value="s">Small</solaris-tab>',
      '  <solaris-tab value="m">Medium</solaris-tab>',
      '  <solaris-tab value="l">Large</solaris-tab>',
      '</solaris-tabs>',
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
