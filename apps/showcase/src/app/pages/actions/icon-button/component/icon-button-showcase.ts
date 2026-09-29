import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisIconButtonDirective,
  SolarisButtonDirective,
  SolarisIconButtonBadgeDirective,
  SolarisBadgeComponent,
  SolarisCodeBlockComponent,
  SolarisIconComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisIconButtonAppearance,
  type SolarisIconButtonColor,
  type SolarisIconButtonDensity,
  type SolarisIconButtonRadius,
  type SolarisIconButtonShape,
  type SolarisIconButtonSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  ICON_BUTTON_SHOWCASE_APPEARANCES,
  ICON_BUTTON_SHOWCASE_BREADCRUMBS,
  ICON_BUTTON_SHOWCASE_COLORS,
  ICON_BUTTON_SHOWCASE_CUSTOM_VIOLET_CODE,
  ICON_BUTTON_SHOWCASE_IMPORT_CODE,
  ICON_BUTTON_SHOWCASE_INSTALL_COMMANDS,
  ICON_BUTTON_SHOWCASE_NEXT,
  ICON_BUTTON_SHOWCASE_PREV,
  ICON_BUTTON_SHOWCASE_RADII,
  ICON_BUTTON_SHOWCASE_SLUG,
  ICON_BUTTON_SHOWCASE_TOC_ITEMS,
  ICON_BUTTON_TRANSLATION_PREFIX,
} from '../model/icon-button-showcase.data';

@Component({
  standalone: true,
  imports: [
    SolarisIconButtonDirective,
    SolarisButtonDirective,
    SolarisIconButtonBadgeDirective,
    SolarisBadgeComponent,
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
  ],
  templateUrl: './icon-button-showcase.html',
  styleUrls: ['./icon-button-showcase.scss'],
})
export class IconButtonShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = ICON_BUTTON_SHOWCASE_BREADCRUMBS;
  protected readonly prev = ICON_BUTTON_SHOWCASE_PREV;
  protected readonly next = ICON_BUTTON_SHOWCASE_NEXT;
  protected readonly tocItems = ICON_BUTTON_SHOWCASE_TOC_ITEMS;

  protected readonly appearances = ICON_BUTTON_SHOWCASE_APPEARANCES;
  protected readonly colors = ICON_BUTTON_SHOWCASE_COLORS;
  protected readonly radii = ICON_BUTTON_SHOWCASE_RADII;

  protected readonly installCommands = ICON_BUTTON_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = ICON_BUTTON_SHOWCASE_IMPORT_CODE;
  protected readonly customVioletCode = ICON_BUTTON_SHOWCASE_CUSTOM_VIOLET_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: ICON_BUTTON_TRANSLATION_PREFIX,
      slug: ICON_BUTTON_SHOWCASE_SLUG,
      importCode: ICON_BUTTON_SHOWCASE_IMPORT_CODE,
    },
  );

  protected selectedAppearance = signal<SolarisIconButtonAppearance>('solid');
  protected selectedColor = signal<SolarisIconButtonColor>('primary');
  protected selectedSize = signal<SolarisIconButtonSize>('md');
  protected selectedDensity = signal<SolarisIconButtonDensity>('normal');
  protected selectedChromelessSize = signal<SolarisIconButtonSize>('md');
  protected selectedRadius = signal<SolarisIconButtonRadius>('md');
  protected selectedShape = signal<SolarisIconButtonShape>('normal');
  protected selectedStateTab = signal<string>('loading');
  protected readonly stateOn = signal(true);

  protected toggleState(): void {
    this.stateOn.update((value) => !value);
  }

  protected readonly stateToggleKey = computed(() => {
    const on = this.stateOn();
    if (this.selectedStateTab() === 'disabled') {
      return on
        ? 'icon-button.states.toggle.disabled.off'
        : 'icon-button.states.toggle.disabled.on';
    }
    return on
      ? 'icon-button.states.toggle.loading.off'
      : 'icon-button.states.toggle.loading.on';
  });

  protected readonly appearanceColorCode = computed(() =>
    [
      `<button solaris-icon-button appearance="${this.selectedAppearance()}" color="${this.selectedColor()}" aria-label="Check">`,
      '  <solaris-icon name="check" [decorative]="true" />',
      '</button>',
    ].join('\n'),
  );

  protected readonly sizeDensityCode = computed(() =>
    [
      `<button solaris-icon-button size="${this.selectedSize()}" density="${this.selectedDensity()}" color="primary" aria-label="Check">`,
      '  <solaris-icon name="check" [decorative]="true" />',
      '</button>',
    ].join('\n'),
  );

  protected readonly chromelessCode = computed(() =>
    [
      `<button solaris-icon-button chromeless size="${this.selectedChromelessSize()}" aria-label="Notifications, 3 new">`,
      '  <solaris-icon name="notification" [decorative]="true" />',
      '  <solaris-badge solaris-icon-button-badge variant="count" color="danger" size="sm">3</solaris-badge>',
      '</button>',
    ].join('\n'),
  );

  protected radiusCode(radius: SolarisIconButtonRadius): string {
    return [
      `<button solaris-icon-button radius="${radius}" color="primary" aria-label="Check">`,
      '  <solaris-icon name="check" [decorative]="true" />',
      '</button>',
    ].join('\n');
  }

  protected shapeCode(shape: SolarisIconButtonShape): string {
    return [
      `<button solaris-icon-button shape="${shape}" color="primary" aria-label="Check">`,
      '  <solaris-icon name="check" [decorative]="true" />',
      '</button>',
    ].join('\n');
  }

  protected readonly stateCode = computed(() => {
    const on = this.stateOn() ? 'true' : 'false';
    switch (this.selectedStateTab()) {
      case 'disabled':
        return [
          `<button solaris-icon-button color="primary" [disabled]="${on}" aria-label="Info">`,
          '  <solaris-icon name="info" [decorative]="true" />',
          '</button>',
        ].join('\n');
      case 'loading':
      default:
        return [
          `<button solaris-icon-button color="primary" [loading]="${on}" aria-label="Info">`,
          '  <solaris-icon name="info" [decorative]="true" />',
          '</button>',
        ].join('\n');
    }
  });

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
