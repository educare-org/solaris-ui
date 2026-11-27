import { Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisButtonDirective,
  SolarisCodeBlockComponent,
  SolarisFormFieldComponent,
  SolarisPreviewCodeComponent,
  SolarisRichTextEditorComponent,
  SolarisRichTextViewComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisRichTextField,
  type SolarisRichTextValue,
} from '@solaris-ui/angular';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  RICH_TEXT_EDITOR_SHOWCASE_APPEARANCE_FILLED_CODE,
  RICH_TEXT_EDITOR_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  RICH_TEXT_EDITOR_SHOWCASE_APPEARANCE_SURFACE_CODE,
  RICH_TEXT_EDITOR_SHOWCASE_BASIC_CODE,
  RICH_TEXT_EDITOR_SHOWCASE_BREADCRUMBS,
  RICH_TEXT_EDITOR_SHOWCASE_COMPOSER_CODE,
  RICH_TEXT_EDITOR_SHOWCASE_FIELDS_CODE,
  RICH_TEXT_EDITOR_SHOWCASE_IMPORT_CODE,
  RICH_TEXT_EDITOR_SHOWCASE_INSTALL_COMMANDS,
  RICH_TEXT_EDITOR_SHOWCASE_NEXT,
  RICH_TEXT_EDITOR_SHOWCASE_PREV,
  RICH_TEXT_EDITOR_SHOWCASE_PREVIEW_CODE,
  RICH_TEXT_EDITOR_SHOWCASE_PREVIEW_HTML,
  RICH_TEXT_EDITOR_SHOWCASE_PREVIEW_TEXT,
  RICH_TEXT_EDITOR_SHOWCASE_REACTIVE_CODE,
  RICH_TEXT_EDITOR_SHOWCASE_SLUG,
  RICH_TEXT_EDITOR_SHOWCASE_STATES_CODE,
  RICH_TEXT_EDITOR_SHOWCASE_TOC_ITEMS,
  RICH_TEXT_EDITOR_TRANSLATION_PREFIX,
} from '../model/rich-text-editor-showcase.data';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisButtonDirective,
    SolarisCodeBlockComponent,
    SolarisFormFieldComponent,
    SolarisPreviewCodeComponent,
    SolarisRichTextEditorComponent,
    SolarisRichTextViewComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './rich-text-editor-showcase.html',
  styleUrls: ['./rich-text-editor-showcase.scss'],
})
export class RichTextEditorShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = RICH_TEXT_EDITOR_SHOWCASE_BREADCRUMBS;
  protected readonly prev = RICH_TEXT_EDITOR_SHOWCASE_PREV;
  protected readonly next = RICH_TEXT_EDITOR_SHOWCASE_NEXT;
  protected readonly tocItems = RICH_TEXT_EDITOR_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands =
    RICH_TEXT_EDITOR_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = RICH_TEXT_EDITOR_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = RICH_TEXT_EDITOR_SHOWCASE_BASIC_CODE;
  protected readonly fieldsCode = RICH_TEXT_EDITOR_SHOWCASE_FIELDS_CODE;
  protected readonly composerCode = RICH_TEXT_EDITOR_SHOWCASE_COMPOSER_CODE;
  protected readonly appearanceOutlineCode =
    RICH_TEXT_EDITOR_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly appearanceSurfaceCode =
    RICH_TEXT_EDITOR_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceFilledCode =
    RICH_TEXT_EDITOR_SHOWCASE_APPEARANCE_FILLED_CODE;
  protected readonly statesCode = RICH_TEXT_EDITOR_SHOWCASE_STATES_CODE;
  protected readonly reactiveCode = RICH_TEXT_EDITOR_SHOWCASE_REACTIVE_CODE;
  protected readonly previewCode = RICH_TEXT_EDITOR_SHOWCASE_PREVIEW_CODE;

  protected readonly fields: readonly SolarisRichTextField[] = [
    { id: 'full-name', label: 'Full name', key: 'fullName' },
    { id: 'email', label: 'Email', key: 'email' },
  ];

  protected readonly notesControl = new FormControl('');

  protected readonly descriptionEditing = signal(false);

  protected readonly descriptionSaved = signal<SolarisRichTextValue>({
    html: RICH_TEXT_EDITOR_SHOWCASE_PREVIEW_HTML,
    text: RICH_TEXT_EDITOR_SHOWCASE_PREVIEW_TEXT,
    blocks: [],
    version: 1,
  });

  protected readonly descriptionDraft = signal<SolarisRichTextValue>({
    html: RICH_TEXT_EDITOR_SHOWCASE_PREVIEW_HTML,
    text: RICH_TEXT_EDITOR_SHOWCASE_PREVIEW_TEXT,
    blocks: [],
    version: 1,
  });

  protected readonly descriptionDirty = computed(
    () => this.descriptionDraft().html !== this.descriptionSaved().html,
  );

  protected startDescriptionEdit(): void {
    this.descriptionDraft.set(this.descriptionSaved());
    this.descriptionEditing.set(true);
  }

  protected saveDescriptionEdit(): void {
    this.descriptionSaved.set(this.descriptionDraft());
    this.descriptionEditing.set(false);
  }

  protected cancelDescriptionEdit(): void {
    this.descriptionDraft.set(this.descriptionSaved());
    this.descriptionEditing.set(false);
  }

  protected readonly submittedLog = signal<readonly SolarisRichTextValue[]>([]);

  protected readonly formattingVisible = signal(true);

  protected readonly fieldFormattingVisible = signal(true);

  protected readonly selectedAppearance = signal<
    'outline' | 'surface' | 'filled'
  >('outline');

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: RICH_TEXT_EDITOR_TRANSLATION_PREFIX,
      slug: RICH_TEXT_EDITOR_SHOWCASE_SLUG,
      importCode: RICH_TEXT_EDITOR_SHOWCASE_IMPORT_CODE,
    },
  );

  protected onComposerSubmit(value: SolarisRichTextValue): void {
    this.submittedLog.update((log) => [...log.slice(-4), value]);
  }

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
