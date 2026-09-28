import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  EDITABLE_TABS_SHOWCASE_BASIC_CODE,
  EDITABLE_TABS_SHOWCASE_BREADCRUMBS,
  EDITABLE_TABS_SHOWCASE_COMPACT_CODE,
  EDITABLE_TABS_SHOWCASE_CUSTOM_ACTIONS_CODE,
  EDITABLE_TABS_SHOWCASE_DEFAULT_EVENT_CODE,
  EDITABLE_TABS_SHOWCASE_ICONS_BADGES_CODE,
  EDITABLE_TABS_SHOWCASE_IMPORT_CODE,
  EDITABLE_TABS_SHOWCASE_INSTALL_COMMANDS,
  EDITABLE_TABS_SHOWCASE_LOCKED_CODE,
  EDITABLE_TABS_SHOWCASE_MOVE_CODE,
  EDITABLE_TABS_SHOWCASE_NEXT,
  EDITABLE_TABS_SHOWCASE_PREV,
  EDITABLE_TABS_SHOWCASE_REMOVE_CODE,
  EDITABLE_TABS_SHOWCASE_RENAME_CODE,
  EDITABLE_TABS_SHOWCASE_SLUG,
  EDITABLE_TABS_SHOWCASE_TOC_ITEMS,
  EDITABLE_TABS_SHOWCASE_VERTICAL_CODE,
  EDITABLE_TABS_TRANSLATION_PREFIX,
} from '../model/editable-tabs-showcase.data';

import { BasicEditableTabsExample } from '../examples/basic/component/basic.component';
import { EditableTabsIconsBadgesExample } from '../examples/icons-and-badges/component/icons-and-badges.component';
import { EditableTabsLockedExample } from '../examples/locked/component/locked.component';
import { EditableTabsRenameExample } from '../examples/rename/component/rename.component';
import { EditableTabsRemoveExample } from '../examples/remove/component/remove.component';
import { EditableTabsMoveExample } from '../examples/move/component/move.component';
import { EditableTabsDefaultEventExample } from '../examples/default-event/component/default-event.component';
import { EditableTabsCustomActionsExample } from '../examples/custom-actions/component/custom-actions.component';
import { EditableTabsVerticalExample } from '../examples/vertical/component/vertical.component';
import { EditableTabsCompactExample } from '../examples/compact/component/compact.component';

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicEditableTabsExample,
    EditableTabsIconsBadgesExample,
    EditableTabsLockedExample,
    EditableTabsRenameExample,
    EditableTabsRemoveExample,
    EditableTabsMoveExample,
    EditableTabsDefaultEventExample,
    EditableTabsCustomActionsExample,
    EditableTabsVerticalExample,
    EditableTabsCompactExample,
  ],
  templateUrl: './editable-tabs-showcase.html',
  styleUrls: ['./editable-tabs-showcase.scss'],
})
export class EditableTabsShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = EDITABLE_TABS_SHOWCASE_BREADCRUMBS;
  protected readonly prev = EDITABLE_TABS_SHOWCASE_PREV;
  protected readonly next = EDITABLE_TABS_SHOWCASE_NEXT;
  protected readonly tocItems = EDITABLE_TABS_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = EDITABLE_TABS_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = EDITABLE_TABS_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = EDITABLE_TABS_SHOWCASE_BASIC_CODE;
  protected readonly iconsBadgesCode = EDITABLE_TABS_SHOWCASE_ICONS_BADGES_CODE;
  protected readonly lockedCode = EDITABLE_TABS_SHOWCASE_LOCKED_CODE;
  protected readonly renameCode = EDITABLE_TABS_SHOWCASE_RENAME_CODE;
  protected readonly removeCode = EDITABLE_TABS_SHOWCASE_REMOVE_CODE;
  protected readonly moveCode = EDITABLE_TABS_SHOWCASE_MOVE_CODE;
  protected readonly defaultEventCode =
    EDITABLE_TABS_SHOWCASE_DEFAULT_EVENT_CODE;
  protected readonly customActionsCode =
    EDITABLE_TABS_SHOWCASE_CUSTOM_ACTIONS_CODE;
  protected readonly verticalCode = EDITABLE_TABS_SHOWCASE_VERTICAL_CODE;
  protected readonly compactCode = EDITABLE_TABS_SHOWCASE_COMPACT_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: EDITABLE_TABS_TRANSLATION_PREFIX,
      slug: EDITABLE_TABS_SHOWCASE_SLUG,
      importCode: EDITABLE_TABS_SHOWCASE_IMPORT_CODE,
    },
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
