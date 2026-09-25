import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisPreviewCodeComponent,
  SolarisCodeBlockComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisCodeBlockCommand,
  type SolarisPreviewCodeFile,
  type SolarisPreviewCodeTab,
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
    SolarisButtonDirective,
    SolarisPreviewCodeComponent,
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
  templateUrl: './preview-code-showcase.html',
  styleUrls: ['./preview-code-showcase.scss'],
})
export class PreviewCodeShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.data-display', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.preview-code' },
  ];

  protected readonly prev: ShowcaseDocsPageNav = {
    labelKey: 'shell.sidebar.item.code-block',
    route: '/data-display/code-block',
  };

  protected readonly next: ShowcaseDocsPageNav = {
    labelKey: 'shell.sidebar.item.alert',
    route: '/feedback/alert',
  };

  protected readonly tocItems: readonly ShowcaseTocItem[] = [
    { anchor: 'examples', labelKey: 'preview-code.section.examples' },
    { anchor: 'controlled', labelKey: 'preview-code.section.controlled' },
    { anchor: 'files', labelKey: 'preview-code.section.files' },
    { anchor: 'expandable', labelKey: 'preview-code.section.expandable' },
    { anchor: 'layout', labelKey: 'preview-code.section.layout' },
    { anchor: 'installation', labelKey: 'preview-code.section.installation' },
    { anchor: 'props', labelKey: 'preview-code.section.props' },
  ];

  protected readonly basicCode = '<button solaris-button>Save</button>';

  protected readonly controlledTab = signal<SolarisPreviewCodeTab>('preview');

  protected readonly selectedAlign = signal<string>('center');
  protected readonly selectedPadding = signal<string>('md');
  protected readonly selectedMinHeight = signal<string>('md');

  protected readonly buttonFiles: readonly SolarisPreviewCodeFile[] = [
    {
      id: 'html',
      label: 'HTML',
      language: 'html',
      code: '<button solaris-button>Save</button>',
    },
    {
      id: 'ts',
      label: 'TypeScript',
      language: 'typescript',
      code: "import { SolarisButtonDirective } from '@solaris-ui/angular';",
    },
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
    "import { SolarisPreviewCodeComponent } from '@solaris-ui/angular';";

  protected readonly longCode = [
    'const answer = 42;',
    'function greet(name: string) {',
    '  return `Hello ${name}`;',
    '}',
    "console.log(greet('Solaris'));",
    "console.log(greet('Educare'));",
    "console.log(greet('Docs'));",
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
    anchor.download = 'preview-code.md';
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
    const prompt = this.translateService.translate('preview-code.ai.prompt', {
      component: this.translateService.translate('preview-code.title'),
      url: view.location.href,
    });
    view.open(`${baseUrl}${encodeURIComponent(prompt)}`, '_blank', 'noopener');
  }

  private buildPageMarkdown(): string {
    const translate = (key: string): string =>
      this.translateService.translate(key);
    return [
      `# ${translate('preview-code.title')}`,
      '',
      translate('preview-code.description'),
      '',
      `## ${translate('preview-code.section.examples')}`,
      '',
      translate('preview-code.examples.note'),
      '',
      '```html',
      this.basicCode,
      '```',
      '',
      `## ${translate('preview-code.section.installation')}`,
      '',
      translate('preview-code.installation.note'),
      '',
      '```sh',
      'pnpm add @educarehq/solaris-ui',
      '```',
      '',
      '```ts',
      this.importCode,
      '```',
      '',
      `## ${translate('preview-code.section.props')}`,
      '',
      translate('preview-code.props.note'),
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
