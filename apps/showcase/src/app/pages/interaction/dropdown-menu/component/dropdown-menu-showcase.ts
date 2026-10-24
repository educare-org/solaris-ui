import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisCodeBlockComponent,
  SolarisDividerComponent,
  SolarisDropdownMenuComponent,
  SolarisDropdownMenuGroupComponent,
  SolarisDropdownMenuItemComponent,
  SolarisDropdownMenuLabelComponent,
  SolarisDropdownMenuTriggerDirective,
  SolarisDropdownSubmenuComponent,
  SolarisDropdownSubmenuTriggerComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  DROPDOWN_MENU_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  DROPDOWN_MENU_SHOWCASE_APPEARANCE_SURFACE_CODE,
  DROPDOWN_MENU_SHOWCASE_BASIC_CODE,
  DROPDOWN_MENU_SHOWCASE_BREADCRUMBS,
  DROPDOWN_MENU_SHOWCASE_CHECKBOX_CODE,
  DROPDOWN_MENU_SHOWCASE_DANGEROUS_CODE,
  DROPDOWN_MENU_SHOWCASE_DISABLED_CODE,
  DROPDOWN_MENU_SHOWCASE_DIVIDER_CODE,
  DROPDOWN_MENU_SHOWCASE_GROUPS_CODE,
  DROPDOWN_MENU_SHOWCASE_IMPORT_CODE,
  DROPDOWN_MENU_SHOWCASE_INSTALL_COMMANDS,
  DROPDOWN_MENU_SHOWCASE_NEXT,
  DROPDOWN_MENU_SHOWCASE_PREV,
  DROPDOWN_MENU_SHOWCASE_RADIO_CODE,
  DROPDOWN_MENU_SHOWCASE_SHORTCUTS_CODE,
  DROPDOWN_MENU_SHOWCASE_SLUG,
  DROPDOWN_MENU_SHOWCASE_SUBMENU_BASIC_CODE,
  DROPDOWN_MENU_SHOWCASE_SUBMENU_DISABLED_CODE,
  DROPDOWN_MENU_SHOWCASE_SUBMENU_ICONS_CODE,
  DROPDOWN_MENU_SHOWCASE_SUBMENU_NESTED_CODE,
  DROPDOWN_MENU_SHOWCASE_TOC_ITEMS,
  DROPDOWN_MENU_SHOWCASE_WITH_ICONS_CODE,
  DROPDOWN_MENU_TRANSLATION_PREFIX,
} from '../model/dropdown-menu-showcase.data';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisCodeBlockComponent,
    SolarisDividerComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuGroupComponent,
    SolarisDropdownMenuItemComponent,
    SolarisDropdownMenuLabelComponent,
    SolarisDropdownMenuTriggerDirective,
    SolarisDropdownSubmenuComponent,
    SolarisDropdownSubmenuTriggerComponent,
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
  templateUrl: './dropdown-menu-showcase.html',
  styleUrls: ['./dropdown-menu-showcase.scss'],
})
export class DropdownMenuShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = DROPDOWN_MENU_SHOWCASE_BREADCRUMBS;
  protected readonly prev = DROPDOWN_MENU_SHOWCASE_PREV;
  protected readonly next = DROPDOWN_MENU_SHOWCASE_NEXT;
  protected readonly tocItems = DROPDOWN_MENU_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = DROPDOWN_MENU_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = DROPDOWN_MENU_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = DROPDOWN_MENU_SHOWCASE_BASIC_CODE;
  protected readonly withIconsCode = DROPDOWN_MENU_SHOWCASE_WITH_ICONS_CODE;
  protected readonly shortcutsCode = DROPDOWN_MENU_SHOWCASE_SHORTCUTS_CODE;
  protected readonly dividerCode = DROPDOWN_MENU_SHOWCASE_DIVIDER_CODE;
  protected readonly groupsCode = DROPDOWN_MENU_SHOWCASE_GROUPS_CODE;
  protected readonly dangerousCode = DROPDOWN_MENU_SHOWCASE_DANGEROUS_CODE;
  protected readonly disabledCode = DROPDOWN_MENU_SHOWCASE_DISABLED_CODE;
  protected readonly checkboxCode = DROPDOWN_MENU_SHOWCASE_CHECKBOX_CODE;
  protected readonly radioCode = DROPDOWN_MENU_SHOWCASE_RADIO_CODE;
  protected readonly appearanceSurfaceCode =
    DROPDOWN_MENU_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceOutlineCode =
    DROPDOWN_MENU_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly submenuBasicCode =
    DROPDOWN_MENU_SHOWCASE_SUBMENU_BASIC_CODE;
  protected readonly submenuNestedCode =
    DROPDOWN_MENU_SHOWCASE_SUBMENU_NESTED_CODE;
  protected readonly submenuIconsCode =
    DROPDOWN_MENU_SHOWCASE_SUBMENU_ICONS_CODE;
  protected readonly submenuDisabledCode =
    DROPDOWN_MENU_SHOWCASE_SUBMENU_DISABLED_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: DROPDOWN_MENU_TRANSLATION_PREFIX,
      slug: DROPDOWN_MENU_SHOWCASE_SLUG,
      importCode: DROPDOWN_MENU_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly sortBy = signal<string>('name');
  protected readonly toolbarVisible = signal<boolean>(true);
  protected readonly sidebarVisible = signal<boolean>(true);
  protected readonly statusBarVisible = signal<boolean>(false);

  protected readonly selectedContent = signal<string>('icons');
  protected readonly selectedGroups = signal<string>('divider');
  protected readonly selectedStates = signal<string>('dangerous');
  protected readonly selectedAppearance = signal<string>('surface');
  protected readonly selectedSubmenus = signal<string>('basic');

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
