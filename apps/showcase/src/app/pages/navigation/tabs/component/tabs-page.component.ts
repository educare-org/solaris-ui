import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisCodeBlockCommand,
  type SolarisTabsDensity,
  type SolarisTabsSize,
  SolarisTabsAppearance,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import {
  ShowcaseDocsPageHeader,
  type ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

import { BasicTabsExample } from '../examples/basic/component/basic.component';
import { TabsWithPanelsExample } from '../examples/with-panels/component/with-panels.component';
import { IconsAndBadgesTabsExample } from '../examples/icons-and-badges/component/icons-and-badges.component';
import { DisabledTabsExample } from '../examples/disabled/component/disabled.component';
import { VerticalTabsExample } from '../examples/vertical/component/vertical.component';
import { PillsTabsExample } from '../examples/pills/component/pills.component';
import { ShapeTabsExample } from '../examples/shape/component/shape.component';
import { EnclosedTabsExample } from '../examples/enclosed/component/enclosed.component';
import { FullWidthTabsExample } from '../examples/full-width/component/full-width.component';
import { ScrollableTabsExample } from '../examples/scrollable/component/scrollable.component';
import { ManualActivationTabsExample } from '../examples/manual-activation/component/manual-activation.component';
import { TransitionFadeTabsExample } from '../examples/transition-fade/component/transition-fade.component';
import { TransitionSlideTabsExample } from '../examples/transition-slide/component/transition-slide.component';

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicTabsExample,
    TabsWithPanelsExample,
    IconsAndBadgesTabsExample,
    DisabledTabsExample,
    VerticalTabsExample,
    PillsTabsExample,
    ShapeTabsExample,
    EnclosedTabsExample,
    FullWidthTabsExample,
    ScrollableTabsExample,
    ManualActivationTabsExample,
    TransitionFadeTabsExample,
    TransitionSlideTabsExample,
  ],
  templateUrl: './tabs-page.component.html',
  styleUrls: ['./tabs-page.component.scss'],
})
export class TabsPageComponent {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.navigation', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.tabs' },
  ];

  protected readonly prev: ShowcaseDocsPageNav = {
    labelKey: 'shell.sidebar.item.accordion',
    route: '/interaction/accordion',
  };

  protected readonly next: ShowcaseDocsPageNav = {
    labelKey: 'shell.sidebar.item.breadcrumb',
    route: '/navigation/breadcrumb',
  };

  protected readonly tocItems: readonly ShowcaseTocItem[] = [
    { anchor: 'examples', labelKey: 'tabs.section.examples' },
    { anchor: 'appearances', labelKey: 'tabs.section.appearances' },
    { anchor: 'size-density', labelKey: 'tabs.section.size-density' },
    { anchor: 'color', labelKey: 'tabs.section.color' },
    { anchor: 'orientation', labelKey: 'tabs.section.orientation' },
    { anchor: 'layout', labelKey: 'tabs.section.layout' },
    { anchor: 'features', labelKey: 'tabs.section.features' },
    { anchor: 'states', labelKey: 'tabs.section.states' },
    { anchor: 'transitions', labelKey: 'tabs.section.transitions' },
    { anchor: 'installation', labelKey: 'tabs.section.installation' },
    { anchor: 'props', labelKey: 'tabs.section.props' },
  ];

  protected readonly selectedAppearance = signal<string>('underline');
  protected readonly selectedSize = signal<SolarisTabsSize>('md');
  protected readonly selectedDensity = signal<SolarisTabsDensity>('normal');
  protected readonly selectedDemoAppearance =
    signal<SolarisTabsAppearance>('underline');

  protected readonly sizeDensityAppearanceCode = computed(() =>
    [
      `<solaris-tabs size="${this.selectedSize()}" density="${this.selectedDensity()}" appearance="${this.selectedDemoAppearance()}" defaultValue="m" aria-label="Size, density and appearance">`,
      '  <solaris-tab value="s">Small</solaris-tab>',
      '  <solaris-tab value="m">Medium</solaris-tab>',
      '  <solaris-tab value="l">Large</solaris-tab>',
      '</solaris-tabs>',
    ].join('\n'),
  );

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
    "import { SolarisTabsComponent, SolarisTabComponent, SolarisTabPanelComponent } from '@solaris-ui/angular';";

  protected readonly basicCode = [
    '<solaris-tabs [(value)]="activeTab">',
    '  <solaris-tab value="code">Code</solaris-tab>',
    '  <solaris-tab value="issues">Issues</solaris-tab>',
    '  <solaris-tab value="pull-requests">Pull requests</solaris-tab>',
    '  <solaris-tab value="actions">Actions</solaris-tab>',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly appearanceUnderlineCode = [
    '<solaris-tabs appearance="underline" [(value)]="activeTab">',
    '  <solaris-tab value="code">Code</solaris-tab>',
    '  <solaris-tab value="issues">Issues</solaris-tab>',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly appearancePillsCode = [
    '<solaris-tabs appearance="pills" [(value)]="activeTab">',
    '  <solaris-tab value="drafts">Drafts</solaris-tab>',
    '  <solaris-tab value="active">Active</solaris-tab>',
    '  <solaris-tab value="archived">Archived</solaris-tab>',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly appearanceEnclosedCode = [
    '<solaris-tabs appearance="enclosed" [(value)]="activeTab">',
    '  <solaris-tab value="details">Details</solaris-tab>',
    '  <solaris-tab value="activity">Activity</solaris-tab>',
    '  <solaris-tab value="settings">Settings</solaris-tab>',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly colorPrimaryCode = [
    '<solaris-tabs color="primary" defaultValue="a" aria-label="Primary">',
    '  <solaris-tab value="a">Option A</solaris-tab>',
    '  <solaris-tab value="b">Option B</solaris-tab>',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly colorNeutralCode = [
    '<solaris-tabs color="neutral" defaultValue="a" aria-label="Neutral">',
    '  <solaris-tab value="a">Option A</solaris-tab>',
    '  <solaris-tab value="b">Option B</solaris-tab>',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly verticalCode = [
    '<solaris-tabs orientation="vertical" [(value)]="activeTab">',
    '  <solaris-tab value="general">General</solaris-tab>',
    '  <solaris-tab value="security">Security</solaris-tab>',
    '  <solaris-tab value="notifications">Notifications</solaris-tab>',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly fullWidthCode = [
    '<solaris-tabs [fullWidth]="true" [(value)]="activeTab">',
    '  <solaris-tab value="overview">Overview</solaris-tab>',
    '  <solaris-tab value="analytics">Analytics</solaris-tab>',
    '  <solaris-tab value="reports">Reports</solaris-tab>',
    '  <solaris-tab value="export">Export</solaris-tab>',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly scrollableCode = [
    '<solaris-tabs [(value)]="activeTab">',
    '  <solaris-tab value="tab-1">Tab 1</solaris-tab>',
    '  <solaris-tab value="tab-2">Tab 2</solaris-tab>',
    '  <!-- ... more tabs scroll horizontally -->',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly shapeCode = [
    '<solaris-tabs appearance="pills" shape="wide" [(value)]="activeTab">',
    '  <solaris-tab value="drafts">Drafts</solaris-tab>',
    '  <solaris-tab value="active">Active</solaris-tab>',
    '  <solaris-tab value="archived">Archived</solaris-tab>',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly withPanelsCode = [
    '<solaris-tabs [(value)]="activeTab">',
    '  <solaris-tab value="code" icon="code">Code</solaris-tab>',
    '  <solaris-tab value="issues" icon="issue" [badge]="30">Issues</solaris-tab>',
    '',
    '  <solaris-tab-panel value="code">Code content</solaris-tab-panel>',
    '  <solaris-tab-panel value="issues">Issues content</solaris-tab-panel>',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly iconsAndBadgesCode = [
    '<solaris-tabs [(value)]="activeTab">',
    '  <solaris-tab value="code" icon="code">Code</solaris-tab>',
    '  <solaris-tab value="issues" icon="issue" [badge]="30">Issues</solaris-tab>',
    '  <solaris-tab value="pull-requests" icon="pull-request" [badge]="5">Pull requests</solaris-tab>',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly disabledCode = [
    '<solaris-tabs [(value)]="activeTab">',
    '  <solaris-tab value="enabled-1">Enabled 1</solaris-tab>',
    '  <solaris-tab value="disabled-1" [disabled]="true">Disabled tab</solaris-tab>',
    '  <solaris-tab value="enabled-2">Enabled 2</solaris-tab>',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly manualActivationCode = [
    '<solaris-tabs activationMode="manual" [(value)]="activeTab">',
    '  <solaris-tab value="step-1">Step 1</solaris-tab>',
    '  <solaris-tab value="step-2">Step 2</solaris-tab>',
    '  <solaris-tab value="step-3">Step 3</solaris-tab>',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly transitionFadeCode = [
    '<solaris-tabs contentTransition="fade" [(value)]="activeTab">',
    '  <solaris-tab value="a">Section A</solaris-tab>',
    '  <solaris-tab value="b">Section B</solaris-tab>',
    '',
    '  <solaris-tab-panel value="a">Section A content</solaris-tab-panel>',
    '  <solaris-tab-panel value="b">Section B content</solaris-tab-panel>',
    '</solaris-tabs>',
  ].join('\n');

  protected readonly transitionSlideCode = [
    '<solaris-tabs contentTransition="slide" [(value)]="activeTab">',
    '  <solaris-tab value="first">First</solaris-tab>',
    '  <solaris-tab value="second">Second</solaris-tab>',
    '',
    '  <solaris-tab-panel value="first">First panel</solaris-tab-panel>',
    '  <solaris-tab-panel value="second">Second panel</solaris-tab-panel>',
    '</solaris-tabs>',
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
    anchor.download = 'tabs.md';
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
    const prompt = this.translateService.translate('tabs.ai.prompt', {
      component: this.translateService.translate('tabs.title'),
      url: view.location.href,
    });
    view.open(`${baseUrl}${encodeURIComponent(prompt)}`, '_blank', 'noopener');
  }

  private buildPageMarkdown(): string {
    const translate = (key: string): string =>
      this.translateService.translate(key);
    return [
      `# ${translate('tabs.title')}`,
      '',
      translate('tabs.description'),
      '',
      `## ${translate('tabs.section.examples')}`,
      '',
      translate('tabs.examples.note'),
      '',
      `## ${translate('tabs.section.installation')}`,
      '',
      translate('tabs.installation.note'),
      '',
      '```sh',
      'pnpm add @educarehq/solaris-ui',
      '```',
      '',
      '```ts',
      this.importCode,
      '```',
      '',
      `## ${translate('tabs.section.props')}`,
      '',
      translate('tabs.props.note'),
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
