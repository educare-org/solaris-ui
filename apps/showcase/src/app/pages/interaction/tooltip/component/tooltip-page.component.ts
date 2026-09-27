import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTooltipDirective,
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

import { TooltipBasicHoverExample } from '../examples/basic-hover/component/basic-hover.component';
import { TooltipClickCloseableExample } from '../examples/click-closeable/component/click-closeable.component';
import { TooltipDisabledWrapperExample } from '../examples/disabled-wrapper/component/disabled-wrapper.component';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTooltipDirective,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    TooltipBasicHoverExample,
    TooltipClickCloseableExample,
    TooltipDisabledWrapperExample,
  ],
  templateUrl: './tooltip-page.component.html',
  styleUrls: ['./tooltip-page.component.scss'],
})
export class TooltipPageComponent {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.interaction', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.tooltip' },
  ];

  protected readonly prev: ShowcaseDocsPageNav = {
    labelKey: 'shell.sidebar.item.popover',
    route: '/interaction/popover',
  };

  protected readonly next: ShowcaseDocsPageNav = {
    labelKey: 'shell.sidebar.item.dropdown-menu',
    route: '/interaction/dropdown-menu',
  };

  protected readonly tocItems: readonly ShowcaseTocItem[] = [
    { anchor: 'examples', labelKey: 'tooltip.section.examples' },
    { anchor: 'triggers', labelKey: 'tooltip.section.triggers' },
    { anchor: 'content', labelKey: 'tooltip.section.content' },
    { anchor: 'appearance', labelKey: 'tooltip.section.appearance' },
    { anchor: 'sizes', labelKey: 'tooltip.section.sizes' },
    { anchor: 'radius', labelKey: 'tooltip.section.radius' },
    { anchor: 'placement', labelKey: 'tooltip.section.placement' },
    { anchor: 'delays', labelKey: 'tooltip.section.delays' },
    { anchor: 'states', labelKey: 'tooltip.section.states' },
    { anchor: 'installation', labelKey: 'tooltip.section.installation' },
    { anchor: 'props', labelKey: 'tooltip.section.props' },
  ];

  protected readonly selectedTrigger = signal<string>('hover');
  protected readonly selectedContent = signal<string>('title-body');
  protected readonly selectedAppearance = signal<string>('outline');
  protected readonly selectedSize = signal<string>('sm');
  protected readonly selectedRadius = signal<string>('md');
  protected readonly selectedPlacement = signal<string>('top');

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
    "import { SolarisTooltipDirective } from '@solaris-ui/angular';";

  protected readonly basicCode = [
    '<button [solarisTooltip]="\'Edit item\'" solaris-button>',
    '  Edit',
    '</button>',
  ].join('\n');

  protected readonly triggerHoverCode = [
    '<button [solarisTooltip]="\'Edit item\'" solaris-button>',
    '  Edit',
    '</button>',
  ].join('\n');

  protected readonly triggerClickCode = [
    '<button [solarisTooltip]="\'Persists on click\'" solarisTooltipTrigger="click" solaris-button>',
    '  Help',
    '</button>',
  ].join('\n');

  protected readonly triggerCloseableCode = [
    '<button [solarisTooltip]="\'Has a close button\'" solarisTooltipTrigger="click" [solarisTooltipCloseable]="true" solaris-button>',
    '  Info',
    '</button>',
  ].join('\n');

  protected readonly triggerManualCode = [
    '<button [solarisTooltip]="\'Controlled\'" solarisTooltipTrigger="manual" [solarisTooltipOpen]="isOpen" solaris-button>',
    '  Controlled',
    '</button>',
  ].join('\n');

  protected readonly contentTitleBodyCode = [
    '<button [solarisTooltip]="\'Available after payment confirmation.\'" [solarisTooltipTitle]="\'Pending access\'" solaris-button>',
    '  Status',
    '</button>',
  ].join('\n');

  protected readonly contentIconCode = [
    '<button [solarisTooltip]="\'This metric considers the last 30 days.\'" solarisTooltipIcon="info" solaris-button>',
    '  Help',
    '</button>',
  ].join('\n');

  protected readonly contentTemplateCode = [
    '<button [solarisTooltipFor]="paymentTooltip" solarisTooltipTrigger="click" [solarisTooltipCloseable]="true" solaris-button>',
    '  Learn more',
    '</button>',
    '',
    '<ng-template #paymentTooltip>',
    '  Payment can take up to 48 hours to be confirmed.',
    '</ng-template>',
  ].join('\n');

  protected readonly appearanceOutlineCode = [
    '<button [solarisTooltip]="\'Outline\'" solarisTooltipAppearance="outline" solarisTooltipTrigger="click" solaris-button>',
    '  Outline',
    '</button>',
  ].join('\n');

  protected readonly appearanceSurfaceCode = [
    '<button [solarisTooltip]="\'Surface\'" solarisTooltipAppearance="surface" solarisTooltipTrigger="click" solaris-button>',
    '  Surface',
    '</button>',
  ].join('\n');

  protected readonly appearanceInverseCode = [
    '<button [solarisTooltip]="\'Inverse\'" solarisTooltipAppearance="inverse" solarisTooltipTrigger="click" solaris-button>',
    '  Inverse',
    '</button>',
  ].join('\n');

  protected readonly sizeSmCode = [
    '<button [solarisTooltip]="\'Small\'" solarisTooltipSize="sm" solarisTooltipTrigger="click" solaris-button>',
    '  sm',
    '</button>',
  ].join('\n');

  protected readonly sizeMdCode = [
    '<button [solarisTooltip]="\'Medium\'" solarisTooltipSize="md" solarisTooltipTrigger="click" solaris-button>',
    '  md',
    '</button>',
  ].join('\n');

  protected readonly sizeLgCode = [
    '<button [solarisTooltip]="\'Large\'" solarisTooltipSize="lg" solarisTooltipTrigger="click" solaris-button>',
    '  lg',
    '</button>',
  ].join('\n');

  protected readonly radiusSmCode = [
    '<button [solarisTooltip]="\'Radius sm\'" solarisTooltipRadius="sm" solarisTooltipTrigger="click" solaris-button>',
    '  sm',
    '</button>',
  ].join('\n');

  protected readonly radiusMdCode = [
    '<button [solarisTooltip]="\'Radius md\'" solarisTooltipRadius="md" solarisTooltipTrigger="click" solaris-button>',
    '  md',
    '</button>',
  ].join('\n');

  protected readonly radiusLgCode = [
    '<button [solarisTooltip]="\'Radius lg\'" solarisTooltipRadius="lg" solarisTooltipTrigger="click" solaris-button>',
    '  lg',
    '</button>',
  ].join('\n');

  protected readonly placementTopCode = [
    '<button [solarisTooltip]="\'Top\'" solarisTooltipPlacement="top" solarisTooltipTrigger="click" solaris-button>',
    '  Top',
    '</button>',
  ].join('\n');

  protected readonly placementBottomCode = [
    '<button [solarisTooltip]="\'Bottom\'" solarisTooltipPlacement="bottom" solarisTooltipTrigger="click" solaris-button>',
    '  Bottom',
    '</button>',
  ].join('\n');

  protected readonly placementRightCode = [
    '<button [solarisTooltip]="\'Right\'" solarisTooltipPlacement="right" solarisTooltipTrigger="click" solaris-button>',
    '  Right',
    '</button>',
  ].join('\n');

  protected readonly placementLeftCode = [
    '<button [solarisTooltip]="\'Left\'" solarisTooltipPlacement="left" solarisTooltipTrigger="click" solaris-button>',
    '  Left',
    '</button>',
  ].join('\n');

  protected readonly delaysCode = [
    '<button [solarisTooltip]="\'Skips the wait on quick re-hover\'" [solarisTooltipShowDelay]="300" [solarisTooltipHideDelay]="100" [solarisTooltipSkipDelay]="300" solaris-button>',
    '  Hover me, leave, hover again',
    '</button>',
  ].join('\n');

  protected readonly disabledCode = [
    '<button [solarisTooltip]="\'Never appears\'" [solarisTooltipDisabled]="true" solaris-button>',
    '  Disabled',
    '</button>',
  ].join('\n');

  protected readonly disabledWrapperCode = [
    '<span solaris-tooltip="Why is this disabled?">',
    '  <button solaris-button [disabled]="true">Edit</button>',
    '</span>',
  ].join('\n');

  protected readonly maxWidthCode = [
    '<button [solarisTooltip]="\'Very long text wraps…\'" [solarisTooltipMaxWidth]="\'256px\'" solarisTooltipTrigger="click" solaris-button>',
    '  Max width',
    '</button>',
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
    anchor.download = 'tooltip.md';
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
    const prompt = this.translateService.translate('tooltip.ai.prompt', {
      component: this.translateService.translate('tooltip.title'),
      url: view.location.href,
    });
    view.open(`${baseUrl}${encodeURIComponent(prompt)}`, '_blank', 'noopener');
  }

  private buildPageMarkdown(): string {
    const translate = (key: string): string =>
      this.translateService.translate(key);
    return [
      `# ${translate('tooltip.title')}`,
      '',
      translate('tooltip.description'),
      '',
      `## ${translate('tooltip.section.examples')}`,
      '',
      translate('tooltip.examples.note'),
      '',
      `## ${translate('tooltip.section.installation')}`,
      '',
      translate('tooltip.installation.note'),
      '',
      '```sh',
      'pnpm add @educarehq/solaris-ui',
      '```',
      '',
      '```ts',
      this.importCode,
      '```',
      '',
      `## ${translate('tooltip.section.props')}`,
      '',
      translate('tooltip.props.note'),
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
