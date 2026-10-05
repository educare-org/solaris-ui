import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisMegaMenuAnchorDirective,
  SolarisMegaMenuComponent,
  SolarisMegaMenuPanelDirective,
  SolarisMegaMenuTriggerDirective,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisMegaMenuAppearance,
  type SolarisMegaMenuPanelWidth,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  MEGA_MENU_SHOWCASE_APPEARANCE_TEXT_CODE,
  MEGA_MENU_SHOWCASE_APPEARANCE_UNDERLINE_CODE,
  MEGA_MENU_SHOWCASE_BASIC_CODE,
  MEGA_MENU_SHOWCASE_BREADCRUMBS,
  MEGA_MENU_SHOWCASE_CONTROLLED_CODE,
  MEGA_MENU_SHOWCASE_HOVER_DELAY_CODE,
  MEGA_MENU_SHOWCASE_IMPORT_CODE,
  MEGA_MENU_SHOWCASE_INSTALL_COMMANDS,
  MEGA_MENU_SHOWCASE_KEYBOARD_CODE,
  MEGA_MENU_SHOWCASE_NEXT,
  MEGA_MENU_SHOWCASE_PERSISTENT_CODE,
  MEGA_MENU_SHOWCASE_PREV,
  MEGA_MENU_SHOWCASE_SLUG,
  MEGA_MENU_SHOWCASE_TOC_ITEMS,
  MEGA_MENU_SHOWCASE_WIDTH_ANCHOR_CODE,
  MEGA_MENU_SHOWCASE_WIDTH_TRIGGER_CODE,
  MEGA_MENU_SHOWCASE_WIDTH_VIEWPORT_CODE,
  MEGA_MENU_TRANSLATION_PREFIX,
} from '../model/mega-menu-showcase.data';

import { BasicMegaMenuExample } from '../examples/basic/component/basic.component';
import { PersistentMegaMenuExample } from '../examples/persistent/component/persistent.component';
import { HoverDelayMegaMenuExample } from '../examples/hover-delay/component/hover-delay.component';
import { ControlledMegaMenuExample } from '../examples/controlled/component/controlled.component';
import { KeyboardMegaMenuExample } from '../examples/keyboard/component/keyboard.component';

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisMegaMenuAnchorDirective,
    SolarisMegaMenuComponent,
    SolarisMegaMenuPanelDirective,
    SolarisMegaMenuTriggerDirective,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicMegaMenuExample,
    PersistentMegaMenuExample,
    HoverDelayMegaMenuExample,
    ControlledMegaMenuExample,
    KeyboardMegaMenuExample,
  ],
  templateUrl: './mega-menu-showcase.component.html',
  styleUrls: ['./mega-menu-showcase.component.scss'],
})
export class MegaMenuShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = MEGA_MENU_SHOWCASE_BREADCRUMBS;
  protected readonly prev = MEGA_MENU_SHOWCASE_PREV;
  protected readonly next = MEGA_MENU_SHOWCASE_NEXT;
  protected readonly tocItems = MEGA_MENU_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = MEGA_MENU_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = MEGA_MENU_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = MEGA_MENU_SHOWCASE_BASIC_CODE;
  protected readonly appearanceUnderlineCode =
    MEGA_MENU_SHOWCASE_APPEARANCE_UNDERLINE_CODE;
  protected readonly appearanceTextCode =
    MEGA_MENU_SHOWCASE_APPEARANCE_TEXT_CODE;
  protected readonly widthTriggerCode = MEGA_MENU_SHOWCASE_WIDTH_TRIGGER_CODE;
  protected readonly widthAnchorCode = MEGA_MENU_SHOWCASE_WIDTH_ANCHOR_CODE;
  protected readonly widthViewportCode = MEGA_MENU_SHOWCASE_WIDTH_VIEWPORT_CODE;
  protected readonly persistentCode = MEGA_MENU_SHOWCASE_PERSISTENT_CODE;
  protected readonly hoverDelayCode = MEGA_MENU_SHOWCASE_HOVER_DELAY_CODE;
  protected readonly controlledCode = MEGA_MENU_SHOWCASE_CONTROLLED_CODE;
  protected readonly keyboardCode = MEGA_MENU_SHOWCASE_KEYBOARD_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: MEGA_MENU_TRANSLATION_PREFIX,
      slug: MEGA_MENU_SHOWCASE_SLUG,
      importCode: MEGA_MENU_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance =
    signal<SolarisMegaMenuAppearance>('underline');
  protected readonly selectedWidth =
    signal<SolarisMegaMenuPanelWidth>('anchor');

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
