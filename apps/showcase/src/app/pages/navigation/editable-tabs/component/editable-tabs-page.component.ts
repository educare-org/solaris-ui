import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisCodeBlockCommand,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import {
  ShowcaseDocsPageHeader,
  type ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

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
  templateUrl: './editable-tabs-page.component.html',
  styleUrls: ['./editable-tabs-page.component.scss'],
})
export class EditableTabsPageComponent {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.navigation', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.editable-tabs' },
  ];

  protected readonly prev: ShowcaseDocsPageNav = {
    labelKey: 'shell.sidebar.item.tabs',
    route: '/navigation/tabs',
  };

  protected readonly next: ShowcaseDocsPageNav = {
    labelKey: 'shell.sidebar.item.breadcrumb',
    route: '/navigation/breadcrumb',
  };

  protected readonly tocItems: readonly ShowcaseTocItem[] = [
    { anchor: 'examples', labelKey: 'editableTabs.section.examples' },
    { anchor: 'management', labelKey: 'editableTabs.section.management' },
    { anchor: 'features', labelKey: 'editableTabs.section.features' },
    { anchor: 'layout', labelKey: 'editableTabs.section.layout' },
    { anchor: 'installation', labelKey: 'editableTabs.section.installation' },
    { anchor: 'props', labelKey: 'editableTabs.section.props' },
  ];

  protected readonly installCommands: readonly SolarisCodeBlockCommand[] = [
    {
      id: 'pnpm',
      label: 'pnpm',
      code: 'pnpm add @educarehq/solaris-ui',
      language: 'shell',
    },
    {
      id: 'npm',
      label: 'npm',
      code: 'npm install @educarehq/solaris-ui',
      language: 'shell',
    },
  ];

  protected readonly importCode =
    "import { SolarisEditableTabsComponent } from '@solaris-ui/angular';";

  protected readonly basicCode = [
    '<solaris-editable-tabs',
    '  [tabs]="tabs"',
    '  [(value)]="activeTab"',
    '  (tabRename)="onRename($event)"',
    '  (tabRemove)="onRemove($event)"',
    '  (tabMove)="onMove($event)"',
    '  (defaultTabChange)="onDefaultChange($event)"',
    '/>',
  ].join('\n');

  protected readonly iconsBadgesCode = [
    '<solaris-editable-tabs [tabs]="tabs" [(value)]="activeTab" />',
    '',
    "// tabs: [{ value: 'code', label: 'Code', icon: 'code', badge: 12 }, ...]",
  ].join('\n');

  protected readonly lockedCode = [
    '<solaris-editable-tabs [tabs]="tabs" [(value)]="activeTab" />',
    '',
    "// tabs: [{ value: 'general', label: 'General', locked: true }, ...]",
  ].join('\n');

  protected readonly renameCode = [
    '<solaris-editable-tabs',
    '  [tabs]="tabs"',
    '  [(value)]="activeTab"',
    '  [renamable]="true"',
    '  (tabRename)="onRename($event)"',
    '/>',
  ].join('\n');

  protected readonly removeCode = [
    '<solaris-editable-tabs',
    '  [tabs]="tabs"',
    '  [(value)]="activeTab"',
    '  [minTabs]="1"',
    '  (tabRemove)="onRemove($event)"',
    '/>',
  ].join('\n');

  protected readonly moveCode = [
    '<solaris-editable-tabs',
    '  [tabs]="tabs"',
    '  [(value)]="activeTab"',
    '  [dragToReorder]="true"',
    '  (tabMove)="onMove($event)"',
    '/>',
    '',
    '// tabMove fires for both the action-menu move and drag and drop.',
  ].join('\n');

  protected readonly defaultEventCode = [
    '<solaris-editable-tabs',
    '  [tabs]="tabs"',
    '  [(value)]="activeTab"',
    '  [defaultValue]="defaultTab"',
    '  (defaultTabChange)="onDefaultChange($event)"',
    '/>',
  ].join('\n');

  protected readonly customActionsCode = [
    '<solaris-editable-tabs',
    '  [tabs]="tabs"',
    '  [(value)]="activeTab"',
    '  (tabAction)="onAction($event)"',
    '/>',
    '',
    '// tab: { value, label, customActions: [{ id, label, icon }] }',
  ].join('\n');

  protected readonly verticalCode = [
    '<solaris-editable-tabs',
    '  [tabs]="tabs"',
    '  [(value)]="activeTab"',
    '  [orientation]="\'vertical\'"',
    '/>',
  ].join('\n');

  protected readonly compactCode = [
    '<solaris-editable-tabs',
    '  [tabs]="tabs"',
    '  [(value)]="activeTab"',
    '  [density]="\'compact\'"',
    '/>',
  ].join('\n');

  protected copyPageAsMarkdown(): void {
    void this.copyText(this.buildPageMarkdown());
  }

  protected downloadPageAsMarkdown(): void {
    const view = this.document.defaultView;
    if (!view) {
      return;
    }
    const blob = new Blob([this.buildPageMarkdown()], {
      type: 'text/markdown',
    });
    const url = view.URL.createObjectURL(blob);
    const anchor = this.document.createElement('a');
    anchor.href = url;
    anchor.download = 'editable-tabs.md';
    anchor.click();
    view.URL.revokeObjectURL(url);
  }

  protected openInChatGpt(): void {
    this.openAiAssistant('https://chatgpt.com/?q=');
  }

  protected openInClaude(): void {
    this.openAiAssistant('https://claude.ai/new?q=');
  }

  private openAiAssistant(baseUrl: string): void {
    const view = this.document.defaultView;
    if (!view) {
      return;
    }
    const prompt = this.translateService.translate('editableTabs.ai.prompt', {
      component: this.translateService.translate('editableTabs.title'),
      url: view.location.href,
    });
    view.open(`${baseUrl}${encodeURIComponent(prompt)}`, '_blank', 'noopener');
  }

  private buildPageMarkdown(): string {
    const translate = (key: string): string =>
      this.translateService.translate(key);
    return [
      `# ${translate('editableTabs.title')}`,
      '',
      translate('editableTabs.description'),
      '',
      `## ${translate('editableTabs.section.examples')}`,
      '',
      translate('editableTabs.examples.note'),
      '',
      `## ${translate('editableTabs.section.installation')}`,
      '',
      translate('editableTabs.installation.note'),
      '',
      '```sh',
      'pnpm add @educarehq/solaris-ui',
      '```',
      '',
      '```ts',
      this.importCode,
      '```',
      '',
      `## ${translate('editableTabs.section.props')}`,
      '',
      translate('editableTabs.props.note'),
      '',
    ].join('\n');
  }

  private async copyText(value: string): Promise<void> {
    const view = this.document.defaultView;
    try {
      await view?.navigator.clipboard.writeText(value);
    } catch {
      const textarea = this.document.createElement('textarea');
      textarea.value = value;
      this.document.body.appendChild(textarea);
      textarea.select();
      this.document.execCommand('copy');
      textarea.remove();
    }
  }
}
