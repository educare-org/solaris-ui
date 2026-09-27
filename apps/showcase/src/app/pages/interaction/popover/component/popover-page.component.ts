import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisCodeBlockComponent,
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
  SolarisPreviewCodeComponent,
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

import { PopoverBasicExample } from '../examples/basic/component/basic.component';
import { PopoverInteractiveExample } from '../examples/interactive/component/interactive.component';
import { PopoverMatchWidthExample } from '../examples/match-width/component/match-width.component';
import { PopoverMaxHeightExample } from '../examples/max-height/component/max-height.component';
import { PopoverReactiveExample } from '../examples/reactive/component/reactive.component';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisCodeBlockComponent,
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    PopoverBasicExample,
    PopoverInteractiveExample,
    PopoverMatchWidthExample,
    PopoverMaxHeightExample,
    PopoverReactiveExample,
  ],
  templateUrl: './popover-page.component.html',
  styleUrls: ['./popover-page.component.scss'],
})
export class PopoverPageComponent {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.interaction', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.popover' },
  ];

  protected readonly prev: ShowcaseDocsPageNav = {
    labelKey: 'shell.sidebar.item.multi-select',
    route: '/forms/multi-select',
  };

  protected readonly next: ShowcaseDocsPageNav = {
    labelKey: 'shell.sidebar.item.tooltip',
    route: '/interaction/tooltip',
  };

  protected readonly tocItems: readonly ShowcaseTocItem[] = [
    { anchor: 'examples', labelKey: 'popover.section.examples' },
    { anchor: 'placements', labelKey: 'popover.section.placements' },
    { anchor: 'align', labelKey: 'popover.section.align' },
    { anchor: 'appearance', labelKey: 'popover.section.appearance' },
    { anchor: 'padding', labelKey: 'popover.section.padding' },
    { anchor: 'radius', labelKey: 'popover.section.radius' },
    { anchor: 'sizing', labelKey: 'popover.section.sizing' },
    { anchor: 'behaviors', labelKey: 'popover.section.behaviors' },
    { anchor: 'accessibility', labelKey: 'popover.section.accessibility' },
    { anchor: 'installation', labelKey: 'popover.section.installation' },
    { anchor: 'props', labelKey: 'popover.section.props' },
  ];

  protected readonly selectedPlacement = signal<string>('bottom');
  protected readonly selectedAlign = signal<string>('start');
  protected readonly selectedAppearance = signal<string>('surface');
  protected readonly selectedPadding = signal<string>('md');
  protected readonly selectedRadius = signal<string>('md');

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
    "import { SolarisPopoverDirective, SolarisPopoverTriggerDirective } from '@solaris-ui/angular';";

  protected readonly basicCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="helpPopover" solarisPopoverPadding="md">',
    '  Help',
    '</button>',
    '',
    '<ng-template #helpPopover solaris-popover>',
    '  <p>This panel can contain structured, interactive content.</p>',
    '</ng-template>',
  ].join('\n');

  protected readonly placementTopCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="topPopover" solarisPopoverPlacement="top" solarisPopoverPadding="md">',
    '  Top',
    '</button>',
    '',
    '<ng-template #topPopover solaris-popover>',
    '  Popover content on top.',
    '</ng-template>',
  ].join('\n');

  protected readonly placementRightCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="rightPopover" solarisPopoverPlacement="right" solarisPopoverPadding="md">',
    '  Right',
    '</button>',
    '',
    '<ng-template #rightPopover solaris-popover>',
    '  Popover content on the right.',
    '</ng-template>',
  ].join('\n');

  protected readonly placementBottomCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="bottomPopover" solarisPopoverPlacement="bottom" solarisPopoverPadding="md">',
    '  Bottom',
    '</button>',
    '',
    '<ng-template #bottomPopover solaris-popover>',
    '  Popover content at the bottom.',
    '</ng-template>',
  ].join('\n');

  protected readonly placementLeftCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="leftPopover" solarisPopoverPlacement="left" solarisPopoverPadding="md">',
    '  Left',
    '</button>',
    '',
    '<ng-template #leftPopover solaris-popover>',
    '  Popover content on the left.',
    '</ng-template>',
  ].join('\n');

  protected readonly alignStartCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="startPopover" solarisPopoverAlign="start" solarisPopoverPadding="md">',
    '  Start',
    '</button>',
    '',
    '<ng-template #startPopover solaris-popover>',
    '  Aligned to the start edge.',
    '</ng-template>',
  ].join('\n');

  protected readonly alignCenterCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="centerPopover" solarisPopoverAlign="center" solarisPopoverPadding="md">',
    '  Center',
    '</button>',
    '',
    '<ng-template #centerPopover solaris-popover>',
    '  Centered below the trigger.',
    '</ng-template>',
  ].join('\n');

  protected readonly alignEndCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="endPopover" solarisPopoverAlign="end" solarisPopoverPadding="md">',
    '  End',
    '</button>',
    '',
    '<ng-template #endPopover solaris-popover>',
    '  Aligned to the end edge.',
    '</ng-template>',
  ].join('\n');

  protected readonly appearanceSurfaceCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="surfacePopover" solarisPopoverAppearance="surface" solarisPopoverPadding="md">',
    '  Surface',
    '</button>',
    '',
    '<ng-template #surfacePopover solaris-popover>',
    '  Surface appearance with shadow background.',
    '</ng-template>',
  ].join('\n');

  protected readonly appearanceOutlineCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="outlinePopover" solarisPopoverAppearance="outline" solarisPopoverPadding="md">',
    '  Outline',
    '</button>',
    '',
    '<ng-template #outlinePopover solaris-popover>',
    '  Outline appearance with visible border.',
    '</ng-template>',
  ].join('\n');

  protected readonly paddingNoneCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="paddingNonePopover" solarisPopoverPadding="none">',
    '  None',
    '</button>',
    '',
    '<ng-template #paddingNonePopover solaris-popover>',
    '  No padding inside the panel.',
    '</ng-template>',
  ].join('\n');

  protected readonly paddingSmCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="paddingSmPopover" solarisPopoverPadding="sm">',
    '  Small',
    '</button>',
    '',
    '<ng-template #paddingSmPopover solaris-popover>',
    '  Small padding inside the panel.',
    '</ng-template>',
  ].join('\n');

  protected readonly paddingMdCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="paddingMdPopover" solarisPopoverPadding="md">',
    '  Medium',
    '</button>',
    '',
    '<ng-template #paddingMdPopover solaris-popover>',
    '  Medium padding inside the panel.',
    '</ng-template>',
  ].join('\n');

  protected readonly paddingLgCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="paddingLgPopover" solarisPopoverPadding="lg">',
    '  Large',
    '</button>',
    '',
    '<ng-template #paddingLgPopover solaris-popover>',
    '  Large padding inside the panel.',
    '</ng-template>',
  ].join('\n');

  protected readonly radiusNoneCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="radiusNonePopover" solarisPopoverRadius="none" solarisPopoverPadding="md">',
    '  None',
    '</button>',
    '',
    '<ng-template #radiusNonePopover solaris-popover>',
    '  No border radius.',
    '</ng-template>',
  ].join('\n');

  protected readonly radiusSmCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="radiusSmPopover" solarisPopoverRadius="sm" solarisPopoverPadding="md">',
    '  Small',
    '</button>',
    '',
    '<ng-template #radiusSmPopover solaris-popover>',
    '  Small border radius.',
    '</ng-template>',
  ].join('\n');

  protected readonly radiusMdCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="radiusMdPopover" solarisPopoverRadius="md" solarisPopoverPadding="md">',
    '  Medium',
    '</button>',
    '',
    '<ng-template #radiusMdPopover solaris-popover>',
    '  Medium border radius.',
    '</ng-template>',
  ].join('\n');

  protected readonly radiusLgCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="radiusLgPopover" solarisPopoverRadius="lg" solarisPopoverPadding="md">',
    '  Large',
    '</button>',
    '',
    '<ng-template #radiusLgPopover solaris-popover>',
    '  Large border radius.',
    '</ng-template>',
  ].join('\n');

  protected readonly radiusXlCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="radiusXlPopover" solarisPopoverRadius="xl" solarisPopoverPadding="md">',
    '  Extra large',
    '</button>',
    '',
    '<ng-template #radiusXlPopover solaris-popover>',
    '  Extra large border radius.',
    '</ng-template>',
  ].join('\n');

  protected readonly matchWidthCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="matchWidthPopover" [solarisPopoverMatchTriggerWidth]="true" solarisPopoverPadding="md">',
    '  Wide Trigger',
    '</button>',
    '',
    '<ng-template #matchWidthPopover solaris-popover>',
    '  This panel has the same width as the trigger button.',
    '</ng-template>',
  ].join('\n');

  protected readonly minMaxWidthCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="minWidthPopover" [solarisPopoverMinWidth]="\'300px\'" solarisPopoverPadding="md">',
    '  Min Width 300px',
    '</button>',
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="maxWidthPopover" [solarisPopoverMaxWidth]="\'200px\'" solarisPopoverPadding="md">',
    '  Max Width 200px',
    '</button>',
  ].join('\n');

  protected readonly maxHeightCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="tallPopover" [solarisPopoverMaxHeight]="240" solarisPopoverPadding="md">',
    '  Max height 240px',
    '</button>',
    '',
    '<ng-template #tallPopover solaris-popover>',
    '  <!-- long content scrolls inside the panel -->',
    '</ng-template>',
  ].join('\n');

  protected readonly closeBehaviorCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="outsideClickPopover" [solarisPopoverCloseOnOutsideClick]="true" [solarisPopoverCloseOnEscape]="false" solarisPopoverPadding="md">',
    '  Outside Click',
    '</button>',
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="escapePopover" [solarisPopoverCloseOnOutsideClick]="false" [solarisPopoverCloseOnEscape]="true" solarisPopoverPadding="md">',
    '  Escape',
    '</button>',
  ].join('\n');

  protected readonly interactiveCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="actionsPopover" solarisPopoverPadding="md">',
    '  Filters',
    '</button>',
    '',
    '<ng-template #actionsPopover solaris-popover>',
    '  <button solaris-button appearance="solid">Apply</button>',
    '  <button solaris-button appearance="ghost">Clear</button>',
    '</ng-template>',
  ].join('\n');

  protected readonly reactiveCode = [
    "import { CdkScrollable } from '@angular/cdk/scrolling';",
    '',
    '<div class="scroll-area" cdkScrollable>',
    '  <button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="reactivePopover" solarisPopoverPadding="md">',
    '    Scroll Test',
    '  </button>',
    '',
    '  <ng-template #reactivePopover solaris-popover>',
    '    This popover repositions automatically when you scroll.',
    '  </ng-template>',
    '</div>',
  ].join('\n');

  protected readonly accessibilityCode = [
    '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="a11yPopover" solarisPopoverPanelRole="region" solarisPopoverAriaHasPopup="true" solarisPopoverPadding="md">',
    '  A11y Popover',
    '</button>',
    '',
    '<ng-template #a11yPopover solaris-popover>',
    '  This popover has role="region" and aria-haspopup="true".',
    '</ng-template>',
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
    anchor.download = 'popover.md';
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
    const prompt = this.translateService.translate('popover.ai.prompt', {
      component: this.translateService.translate('popover.title'),
      url: view.location.href,
    });
    view.open(`${baseUrl}${encodeURIComponent(prompt)}`, '_blank', 'noopener');
  }

  private buildPageMarkdown(): string {
    const translate = (key: string): string =>
      this.translateService.translate(key);
    return [
      `# ${translate('popover.title')}`,
      '',
      translate('popover.description'),
      '',
      `## ${translate('popover.section.examples')}`,
      '',
      translate('popover.examples.note'),
      '',
      `## ${translate('popover.section.installation')}`,
      '',
      translate('popover.installation.note'),
      '',
      '```sh',
      'pnpm add @educarehq/solaris-ui',
      '```',
      '',
      '```ts',
      this.importCode,
      '```',
      '',
      `## ${translate('popover.section.props')}`,
      '',
      translate('popover.props.note'),
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
