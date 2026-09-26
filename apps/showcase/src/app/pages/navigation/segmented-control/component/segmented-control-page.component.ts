import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisCodeBlockCommand,
  type SolarisSegmentedControlDensity,
  type SolarisSegmentedControlSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import {
  ShowcaseDocsPageHeader,
  type ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

import { SegmentedBasicExample } from '../examples/basic/component/basic.component';
import { SegmentedVerticalExample } from '../examples/vertical/component/vertical.component';
import { SegmentedFullWidthExample } from '../examples/full-width/component/full-width.component';
import { SegmentedEqualWidthExample } from '../examples/equal-width/component/equal-width.component';
import { SegmentedManyOptionsExample } from '../examples/many-options/component/many-options.component';
import { SegmentedLongLabelsExample } from '../examples/long-labels/component/long-labels.component';
import { SegmentedWithIconsExample } from '../examples/with-icons/component/with-icons.component';
import { SegmentedWithBadgeExample } from '../examples/with-badge/component/with-badge.component';
import { SegmentedIconOnlyExample } from '../examples/icon-only/component/icon-only.component';
import { SegmentedNoIndicatorExample } from '../examples/no-indicator/component/no-indicator.component';
import { SegmentedDisabledGroupExample } from '../examples/disabled-group/component/disabled-group.component';
import { SegmentedDisabledItemExample } from '../examples/disabled-item/component/disabled-item.component';
import { SegmentedReadonlyExample } from '../examples/readonly/component/readonly.component';
import { SegmentedInvalidExample } from '../examples/invalid/component/invalid.component';
import { SegmentedReactiveFormsExample } from '../examples/reactive-forms/component/reactive-forms.component';

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisSegmentedControlComponent,
    SolarisSegmentedItemComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    SegmentedBasicExample,
    SegmentedVerticalExample,
    SegmentedFullWidthExample,
    SegmentedEqualWidthExample,
    SegmentedManyOptionsExample,
    SegmentedLongLabelsExample,
    SegmentedWithIconsExample,
    SegmentedWithBadgeExample,
    SegmentedIconOnlyExample,
    SegmentedNoIndicatorExample,
    SegmentedDisabledGroupExample,
    SegmentedDisabledItemExample,
    SegmentedReadonlyExample,
    SegmentedInvalidExample,
    SegmentedReactiveFormsExample,
  ],
  templateUrl: './segmented-control-page.component.html',
  styleUrls: ['./segmented-control-page.component.scss'],
})
export class SegmentedControlPageComponent {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.navigation', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.segmented-control' },
  ];

  protected readonly prev: ShowcaseDocsPageNav = {
    labelKey: 'shell.sidebar.item.stepper',
    route: '/navigation/stepper',
  };

  protected readonly next: ShowcaseDocsPageNav = {
    labelKey: 'shell.sidebar.item.editable-tabs',
    route: '/navigation/editable-tabs',
  };

  protected readonly tocItems: readonly ShowcaseTocItem[] = [
    { anchor: 'examples', labelKey: 'segmented-control.section.examples' },
    {
      anchor: 'appearances',
      labelKey: 'segmented-control.section.appearances',
    },
    {
      anchor: 'size-density',
      labelKey: 'segmented-control.section.size-density',
    },
    { anchor: 'radius', labelKey: 'segmented-control.section.radius' },
    {
      anchor: 'orientation',
      labelKey: 'segmented-control.section.orientation',
    },
    { anchor: 'layout', labelKey: 'segmented-control.section.layout' },
    { anchor: 'features', labelKey: 'segmented-control.section.features' },
    { anchor: 'states', labelKey: 'segmented-control.section.states' },
    { anchor: 'forms', labelKey: 'segmented-control.section.forms' },
    {
      anchor: 'installation',
      labelKey: 'segmented-control.section.installation',
    },
    { anchor: 'props', labelKey: 'segmented-control.section.props' },
  ];

  protected readonly selectedAppearance = signal<string>('surface');
  protected readonly selectedSize = signal<SolarisSegmentedControlSize>('md');
  protected readonly selectedDensity =
    signal<SolarisSegmentedControlDensity>('normal');
  protected readonly selectedRadius = signal<string>('md');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-segmented-control size="${this.selectedSize()}" density="${this.selectedDensity()}" defaultValue="m" aria-label="Size and density">`,
      '  <solaris-segmented-item value="s">Small</solaris-segmented-item>',
      '  <solaris-segmented-item value="m">Medium</solaris-segmented-item>',
      '  <solaris-segmented-item value="l">Large</solaris-segmented-item>',
      '</solaris-segmented-control>',
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
    "import { SolarisSegmentedControlComponent, SolarisSegmentedItemComponent } from '@solaris-ui/angular';";

  protected readonly basicCode = [
    '<solaris-segmented-control [(value)]="billingCycle" aria-label="Billing cycle">',
    '  <solaris-segmented-item value="monthly">Monthly</solaris-segmented-item>',
    '  <solaris-segmented-item value="yearly">Yearly</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly appearanceSurfaceCode = [
    '<solaris-segmented-control appearance="surface" defaultValue="a" aria-label="Surface">',
    '  <solaris-segmented-item value="a">Option A</solaris-segmented-item>',
    '  <solaris-segmented-item value="b">Option B</solaris-segmented-item>',
    '  <solaris-segmented-item value="c">Option C</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly appearanceOutlineCode = [
    '<solaris-segmented-control appearance="outline" defaultValue="x" aria-label="Outline">',
    '  <solaris-segmented-item value="x">Option X</solaris-segmented-item>',
    '  <solaris-segmented-item value="y">Option Y</solaris-segmented-item>',
    '  <solaris-segmented-item value="z">Option Z</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly radiusSmCode = [
    '<solaris-segmented-control radius="sm" defaultValue="a" aria-label="Radius small">',
    '  <solaris-segmented-item value="a">Radius SM</solaris-segmented-item>',
    '  <solaris-segmented-item value="b">Radius MD</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly radiusMdCode = [
    '<solaris-segmented-control radius="md" defaultValue="a" aria-label="Radius medium">',
    '  <solaris-segmented-item value="a">Radius SM</solaris-segmented-item>',
    '  <solaris-segmented-item value="b">Radius MD</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly radiusLgCode = [
    '<solaris-segmented-control radius="lg" defaultValue="a" aria-label="Radius large">',
    '  <solaris-segmented-item value="a">Radius LG</solaris-segmented-item>',
    '  <solaris-segmented-item value="b">Radius Full</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly radiusFullCode = [
    '<solaris-segmented-control radius="full" defaultValue="a" aria-label="Radius full">',
    '  <solaris-segmented-item value="a">Radius SM</solaris-segmented-item>',
    '  <solaris-segmented-item value="b">Radius Full</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly verticalCode = [
    '<solaris-segmented-control orientation="vertical" [(value)]="section" aria-label="Section">',
    '  <solaris-segmented-item value="general">General</solaris-segmented-item>',
    '  <solaris-segmented-item value="security">Security</solaris-segmented-item>',
    '  <solaris-segmented-item value="notifications">Notifications</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly fullWidthCode = [
    '<solaris-segmented-control [fullWidth]="true" [(value)]="option" aria-label="Option">',
    '  <solaris-segmented-item value="a">Option A</solaris-segmented-item>',
    '  <solaris-segmented-item value="b">Option B</solaris-segmented-item>',
    '  <solaris-segmented-item value="c">Option C</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly equalWidthCode = [
    '<solaris-segmented-control [equalWidth]="true" [(value)]="size" aria-label="Size">',
    '  <solaris-segmented-item value="short">Short</solaris-segmented-item>',
    '  <solaris-segmented-item value="medium">Medium</solaris-segmented-item>',
    '  <solaris-segmented-item value="long">Long</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly manyOptionsCode = [
    '<solaris-segmented-control [(value)]="priority" aria-label="Priority">',
    '  <solaris-segmented-item value="critical">Critical</solaris-segmented-item>',
    '  <solaris-segmented-item value="high">High</solaris-segmented-item>',
    '  <solaris-segmented-item value="medium">Medium</solaris-segmented-item>',
    '  <solaris-segmented-item value="low">Low</solaris-segmented-item>',
    '  <solaris-segmented-item value="none">None</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly longLabelsCode = [
    '<solaris-segmented-control [equalWidth]="true" [(value)]="setting" aria-label="Setting">',
    '  <solaris-segmented-item value="a">User Settings</solaris-segmented-item>',
    '  <solaris-segmented-item value="b">System Preferences</solaris-segmented-item>',
    '  <solaris-segmented-item value="c">Notifications & Alerts</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly withIconsCode = [
    '<solaris-segmented-control [(value)]="viewMode" aria-label="View mode">',
    '  <solaris-segmented-item value="list" icon="list">List</solaris-segmented-item>',
    '  <solaris-segmented-item value="grid" icon="grid">Grid</solaris-segmented-item>',
    '  <solaris-segmented-item value="kanban" icon="columns">Kanban</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly withBadgeCode = [
    '<solaris-segmented-control [(value)]="filter" aria-label="Filter">',
    '  <solaris-segmented-item value="all">All</solaris-segmented-item>',
    '  <solaris-segmented-item value="issues">',
    '    Issues',
    '    <solaris-badge size="sm" color="neutral">30</solaris-badge>',
    '  </solaris-segmented-item>',
    '  <solaris-segmented-item value="prs">',
    '    Pull Requests',
    '    <solaris-badge size="sm" color="neutral">12</solaris-badge>',
    '  </solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly iconOnlyCode = [
    '<solaris-segmented-control [(value)]="view" aria-label="View mode">',
    '  <solaris-segmented-item value="list" icon="list" aria-label="List view" />',
    '  <solaris-segmented-item value="grid" icon="grid" aria-label="Grid view" />',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly noIndicatorCode = [
    '<solaris-segmented-control [indicator]="false" [(value)]="option" aria-label="Option">',
    '  <solaris-segmented-item value="a">Option A</solaris-segmented-item>',
    '  <solaris-segmented-item value="b">Option B</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly disabledGroupCode = [
    '<solaris-segmented-control [disabled]="true" [(value)]="option" aria-label="Option">',
    '  <solaris-segmented-item value="a">Option A</solaris-segmented-item>',
    '  <solaris-segmented-item value="b">Option B</solaris-segmented-item>',
    '  <solaris-segmented-item value="c">Option C</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly disabledItemCode = [
    '<solaris-segmented-control [(value)]="option" aria-label="Option">',
    '  <solaris-segmented-item value="a">Enabled</solaris-segmented-item>',
    '  <solaris-segmented-item value="b" [disabled]="true">Disabled</solaris-segmented-item>',
    '  <solaris-segmented-item value="c">Enabled</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly readonlyCode = [
    '<solaris-segmented-control [readonly]="true" [(value)]="option" aria-label="Option">',
    '  <solaris-segmented-item value="a">Option A</solaris-segmented-item>',
    '  <solaris-segmented-item value="b">Option B</solaris-segmented-item>',
    '</solaris-segmented-control>',
  ].join('\n');

  protected readonly invalidCode = [
    '<solaris-segmented-control [required]="true" [invalid]="showError" aria-label="Plan">',
    '  <solaris-segmented-item value="a">Option A</solaris-segmented-item>',
    '  <solaris-segmented-item value="b">Option B</solaris-segmented-item>',
    '</solaris-segmented-control>',
    '<button solaris-button type="button" (click)="validate()">Validate</button>',
    '@if (showError) {',
    '  <p role="alert">Select an option to continue.</p>',
    '}',
  ].join('\n');

  protected readonly reactiveFormsCode = [
    '<solaris-segmented-control [formControl]="themeControl" aria-label="Theme">',
    '  <solaris-segmented-item value="light">Light</solaris-segmented-item>',
    '  <solaris-segmented-item value="dark">Dark</solaris-segmented-item>',
    '  <solaris-segmented-item value="system">System</solaris-segmented-item>',
    '</solaris-segmented-control>',
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
    anchor.download = 'segmented-control.md';
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
    const prompt = this.translateService.translate(
      'segmented-control.ai.prompt',
      {
        component: this.translateService.translate('segmented-control.title'),
        url: view.location.href,
      },
    );
    view.open(`${baseUrl}${encodeURIComponent(prompt)}`, '_blank', 'noopener');
  }

  private buildPageMarkdown(): string {
    const translate = (key: string): string =>
      this.translateService.translate(key);
    return [
      `# ${translate('segmented-control.title')}`,
      '',
      translate('segmented-control.description'),
      '',
      `## ${translate('segmented-control.section.examples')}`,
      '',
      translate('segmented-control.examples.note'),
      '',
      `## ${translate('segmented-control.section.installation')}`,
      '',
      translate('segmented-control.installation.note'),
      '',
      '```sh',
      'pnpm add @educarehq/solaris-ui',
      '```',
      '',
      '```ts',
      this.importCode,
      '```',
      '',
      `## ${translate('segmented-control.section.props')}`,
      '',
      translate('segmented-control.props.note'),
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
