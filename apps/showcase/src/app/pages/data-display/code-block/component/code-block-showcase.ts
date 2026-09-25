import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
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

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './code-block-showcase.html',
  styleUrls: ['./code-block-showcase.scss'],
})
export class CodeBlockShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.data-display', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.code-block' },
  ];

  protected readonly prev: ShowcaseDocsPageNav = {
    labelKey: 'shell.sidebar.item.card',
    route: '/data-display/card',
  };

  protected readonly next: ShowcaseDocsPageNav = {
    labelKey: 'shell.sidebar.item.alert',
    route: '/feedback/alert',
  };

  protected readonly tocItems: readonly ShowcaseTocItem[] = [
    { anchor: 'examples', labelKey: 'code-block.section.examples' },
    { anchor: 'layouts', labelKey: 'code-block.section.layouts' },
    { anchor: 'commands', labelKey: 'code-block.section.commands' },
    { anchor: 'appearances', labelKey: 'code-block.section.appearances' },
    { anchor: 'sizes', labelKey: 'code-block.section.sizes' },
    { anchor: 'density', labelKey: 'code-block.section.density' },
    { anchor: 'expandable', labelKey: 'code-block.section.expandable' },
    { anchor: 'editable', labelKey: 'code-block.section.editable' },
    { anchor: 'highlighting', labelKey: 'code-block.section.highlighting' },
    { anchor: 'installation', labelKey: 'code-block.section.installation' },
    { anchor: 'props', labelKey: 'code-block.section.props' },
  ];

  protected readonly basicCode = 'const answer = 42;';

  protected readonly selectedAppearance = signal<string>('surface');
  protected readonly selectedSize = signal<string>('md');
  protected readonly selectedDensity = signal<string>('comfortable');
  protected readonly selectedLayout = signal<string>('inline');

  protected editableCode = 'const answer = 42;';

  protected handleEditableCodeChange(value: string): void {
    this.editableCode = value;
  }

  protected readonly inlineCode = 'pnpm nx build angular';

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
    "import { SolarisCodeBlockComponent } from '@solaris-ui/angular';";

  protected readonly longCode = [
    'const answer = 42;',
    'function greet(name: string) {',
    '  return `Hello ${name}`;',
    '}',
    "console.log(greet('Solaris'));",
    "console.log(greet('Educare'));",
    "console.log(greet('Docs'));",
    "console.log(greet('Tokens'));",
    "console.log(greet('Signals'));",
    "console.log(greet('Standalone'));",
  ].join('\n');

  protected readonly jsonCode = [
    '{',
    '  "framework": "Solaris UI",',
    '  "standalone": true,',
    '  "signals": true,',
    '  "version": 1,',
    '}',
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
    anchor.download = 'code-block.md';
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
    const prompt = this.translateService.translate('code-block.ai.prompt', {
      component: this.translateService.translate('code-block.title'),
      url: view.location.href,
    });
    view.open(`${baseUrl}${encodeURIComponent(prompt)}`, '_blank', 'noopener');
  }

  private buildPageMarkdown(): string {
    const translate = (key: string): string =>
      this.translateService.translate(key);
    return [
      `# ${translate('code-block.title')}`,
      '',
      translate('code-block.description'),
      '',
      `## ${translate('code-block.section.examples')}`,
      '',
      translate('code-block.examples.note'),
      '',
      '```ts',
      this.basicCode,
      '```',
      '',
      `## ${translate('code-block.section.installation')}`,
      '',
      translate('code-block.installation.note'),
      '',
      '```sh',
      'pnpm add @educarehq/solaris-ui',
      '```',
      '',
      '```ts',
      this.importCode,
      '```',
      '',
      `## ${translate('code-block.section.props')}`,
      '',
      translate('code-block.props.note'),
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
