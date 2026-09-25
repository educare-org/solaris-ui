import { Component } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisTranslatePipe,
  type SolarisCodeBlockCommand,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './code-block-showcase.html',
  styleUrls: ['./code-block-showcase.scss'],
})
export class CodeBlockShowcasePage {
  protected readonly tocItems: readonly ShowcaseTocItem[] = [
    { anchor: 'basic', labelKey: 'code-block.section.basic' },
    { anchor: 'layouts', labelKey: 'code-block.section.layouts' },
    { anchor: 'commands', labelKey: 'code-block.section.commands' },
    { anchor: 'appearances', labelKey: 'code-block.section.appearances' },
    { anchor: 'sizes', labelKey: 'code-block.section.sizes' },
    { anchor: 'density', labelKey: 'code-block.section.density' },
    { anchor: 'expandable', labelKey: 'code-block.section.expandable' },
    { anchor: 'editable', labelKey: 'code-block.section.editable' },
    { anchor: 'highlighting', labelKey: 'code-block.section.highlighting' },
  ];

  protected readonly basicCode = 'const answer = 42;';

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
}
