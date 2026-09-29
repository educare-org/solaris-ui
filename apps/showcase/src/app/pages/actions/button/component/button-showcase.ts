import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisButtonIconDirective,
  SolarisCodeBlockComponent,
  SolarisIconComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisButtonAppearance,
  type SolarisButtonColor,
  type SolarisButtonDensity,
  type SolarisButtonRadius,
  type SolarisButtonShape,
  type SolarisButtonSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  BUTTON_SHOWCASE_ANCHOR_CODE,
  BUTTON_SHOWCASE_APPEARANCES,
  BUTTON_SHOWCASE_BASIC_CODE,
  BUTTON_SHOWCASE_BREADCRUMBS,
  BUTTON_SHOWCASE_COLORS,
  BUTTON_SHOWCASE_CUSTOM_AMBER_CODE,
  BUTTON_SHOWCASE_CUSTOM_VIOLET_CODE,
  BUTTON_SHOWCASE_FULL_WIDTH_CODE,
  BUTTON_SHOWCASE_IMPORT_CODE,
  BUTTON_SHOWCASE_INSTALL_COMMANDS,
  BUTTON_SHOWCASE_NEXT,
  BUTTON_SHOWCASE_PREV,
  BUTTON_SHOWCASE_RADII,
  BUTTON_SHOWCASE_SLUG,
  BUTTON_SHOWCASE_TOC_ITEMS,
  BUTTON_TRANSLATION_PREFIX,
} from '../model/button-showcase.data';
import { AnchorLinkButtonExample } from '../examples/anchor-link/component/anchor-link.component';
import { BasicButtonExample } from '../examples/basic/component/basic.component';
import { CustomButtonExample } from '../examples/custom/component/custom.component';
import { FullWidthButtonExample } from '../examples/full-width/component/full-width.component';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisButtonIconDirective,
    SolarisCodeBlockComponent,
    SolarisIconComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicButtonExample,
    CustomButtonExample,
    AnchorLinkButtonExample,
    FullWidthButtonExample,
  ],
  templateUrl: './button-showcase.html',
  styleUrls: ['./button-showcase.scss'],
})
export class ButtonShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = BUTTON_SHOWCASE_BREADCRUMBS;
  protected readonly prev = BUTTON_SHOWCASE_PREV;
  protected readonly next = BUTTON_SHOWCASE_NEXT;
  protected readonly tocItems = BUTTON_SHOWCASE_TOC_ITEMS;

  protected readonly appearances = BUTTON_SHOWCASE_APPEARANCES;
  protected readonly colors = BUTTON_SHOWCASE_COLORS;
  protected readonly radii = BUTTON_SHOWCASE_RADII;

  protected readonly installCommands = BUTTON_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = BUTTON_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = BUTTON_SHOWCASE_BASIC_CODE;
  protected readonly customVioletCode = BUTTON_SHOWCASE_CUSTOM_VIOLET_CODE;
  protected readonly customAmberCode = BUTTON_SHOWCASE_CUSTOM_AMBER_CODE;
  protected readonly anchorCode = BUTTON_SHOWCASE_ANCHOR_CODE;
  protected readonly fullWidthCode = BUTTON_SHOWCASE_FULL_WIDTH_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: BUTTON_TRANSLATION_PREFIX,
      slug: BUTTON_SHOWCASE_SLUG,
      importCode: BUTTON_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance =
    signal<SolarisButtonAppearance>('solid');
  protected readonly selectedColor = signal<SolarisButtonColor>('primary');
  protected readonly selectedIconTab = signal<string>('icon-before');
  protected readonly selectedProvider = signal<string>('google');
  protected readonly selectedStateTab = signal<string>('loading');
  protected readonly selectedCustom = signal<string>('violet');
  protected readonly stateOn = signal(true);

  protected toggleState(): void {
    this.stateOn.update((value) => !value);
  }
  protected readonly selectedRadius = signal<SolarisButtonRadius>('md');
  protected readonly selectedShape = signal<SolarisButtonShape>('normal');
  protected readonly selectedSize = signal<SolarisButtonSize>('md');
  protected readonly selectedDensity = signal<SolarisButtonDensity>('normal');

  protected readonly appearanceColorCode = computed(() =>
    [
      `<button solaris-button appearance="${this.selectedAppearance()}" color="${this.selectedColor()}">`,
      '  Action',
      '</button>',
    ].join('\n'),
  );

  protected readonly sizeDensityCode = computed(() =>
    [
      `<button solaris-button size="${this.selectedSize()}" density="${this.selectedDensity()}" color="primary">`,
      '  Save',
      '</button>',
    ].join('\n'),
  );

  protected readonly iconCode = computed(() => {
    switch (this.selectedIconTab()) {
      case 'icon-after':
        return [
          '<button solaris-button color="primary">',
          '  Continue',
          '  <solaris-icon solaris-button-icon name="chevron-right" [decorative]="true" />',
          '</button>',
        ].join('\n');
      case 'icon-input-start':
        return [
          '<button solaris-button icon="check" color="primary">',
          '  Confirm',
          '</button>',
        ].join('\n');
      case 'icon-input-end':
        return [
          '<button solaris-button icon="chevron-right" iconPosition="end" color="primary">',
          '  Continue',
          '</button>',
        ].join('\n');
      case 'icon-before':
      default:
        return [
          '<button solaris-button color="primary">',
          '  <solaris-icon solaris-button-icon name="check" [decorative]="true" />',
          '  Confirm',
          '</button>',
        ].join('\n');
    }
  });

  protected readonly providersCode = computed(() => {
    const provider = String(this.selectedProvider());
    const label = provider.charAt(0).toUpperCase() + provider.slice(1);
    return [
      `<button solaris-button icon="${provider}" appearance="outline">`,
      `  Continue with ${label}`,
      '</button>',
    ].join('\n');
  });

  protected readonly stateLabelKey = computed(() => {
    switch (this.selectedStateTab()) {
      case 'disabled':
        return 'button.example.states.disabled';
      case 'pressed':
        return 'button.example.states.favorite';
      case 'loading':
      default:
        return 'button.example.loading.save';
    }
  });

  protected readonly stateCode = computed(() => {
    const on = this.stateOn() ? 'true' : 'false';
    switch (this.selectedStateTab()) {
      case 'disabled':
        return [
          `<button solaris-button color="primary" [disabled]="${on}">`,
          '  Disabled',
          '</button>',
        ].join('\n');
      case 'pressed':
        return [
          `<button solaris-button color="primary" [pressed]="${on}">`,
          '  Favorite',
          '</button>',
        ].join('\n');
      case 'loading':
      default:
        return [
          `<button solaris-button color="primary" [loading]="${on}">`,
          '  Save',
          '</button>',
        ].join('\n');
    }
  });

  protected radiusCode(radius: SolarisButtonRadius): string {
    return [
      `<button solaris-button radius="${radius}" color="primary">`,
      '  Action',
      '</button>',
    ].join('\n');
  }

  protected shapeCode(shape: SolarisButtonShape): string {
    return [
      `<button solaris-button shape="${shape}" color="primary">`,
      '  Action',
      '</button>',
    ].join('\n');
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
