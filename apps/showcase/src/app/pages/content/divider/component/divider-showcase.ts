import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisDividerComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisDividerAppearance,
  type SolarisDividerOrientation,
  type SolarisDividerTextPosition,
  type SolarisDividerVariant,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  DIVIDER_SHOWCASE_APPEARANCE_STRONG_CODE,
  DIVIDER_SHOWCASE_APPEARANCE_SUBTLE_CODE,
  DIVIDER_SHOWCASE_BASIC_CODE,
  DIVIDER_SHOWCASE_BREADCRUMBS,
  DIVIDER_SHOWCASE_DROPDOWN_CODE,
  DIVIDER_SHOWCASE_IMPORT_CODE,
  DIVIDER_SHOWCASE_INSTALL_COMMANDS,
  DIVIDER_SHOWCASE_INSET_CODE,
  DIVIDER_SHOWCASE_LABEL_CENTER_CODE,
  DIVIDER_SHOWCASE_LABEL_END_CODE,
  DIVIDER_SHOWCASE_LABEL_START_CODE,
  DIVIDER_SHOWCASE_LENGTH_CODE,
  DIVIDER_SHOWCASE_NEXT,
  DIVIDER_SHOWCASE_ORIENTATION_HORIZONTAL_CODE,
  DIVIDER_SHOWCASE_ORIENTATION_VERTICAL_CODE,
  DIVIDER_SHOWCASE_PREV,
  DIVIDER_SHOWCASE_SEMANTIC_CODE,
  DIVIDER_SHOWCASE_SLUG,
  DIVIDER_SHOWCASE_SPACING_CODE,
  DIVIDER_SHOWCASE_TOC_ITEMS,
  DIVIDER_SHOWCASE_VARIANT_DASHED_CODE,
  DIVIDER_SHOWCASE_VARIANT_DOTTED_CODE,
  DIVIDER_SHOWCASE_VARIANT_SOLID_CODE,
  DIVIDER_TRANSLATION_PREFIX,
} from '../model/divider-showcase.data';

import { DividerBasicExample } from '../examples/basic/component/basic.component';
import { DividerInDropdownExample } from '../examples/in-dropdown/component/in-dropdown.component';
import { DividerVerticalExample } from '../examples/vertical/component/vertical.component';
import { DividerWithLabelExample } from '../examples/with-label/component/with-label.component';

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisDividerComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    DividerBasicExample,
    DividerInDropdownExample,
    DividerVerticalExample,
    DividerWithLabelExample,
  ],
  templateUrl: './divider-showcase.html',
  styleUrls: ['./divider-showcase.scss'],
})
export class DividerShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = DIVIDER_SHOWCASE_BREADCRUMBS;
  protected readonly prev = DIVIDER_SHOWCASE_PREV;
  protected readonly next = DIVIDER_SHOWCASE_NEXT;
  protected readonly tocItems = DIVIDER_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = DIVIDER_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = DIVIDER_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = DIVIDER_SHOWCASE_BASIC_CODE;
  protected readonly appearanceSubtleCode =
    DIVIDER_SHOWCASE_APPEARANCE_SUBTLE_CODE;
  protected readonly appearanceStrongCode =
    DIVIDER_SHOWCASE_APPEARANCE_STRONG_CODE;
  protected readonly variantSolidCode = DIVIDER_SHOWCASE_VARIANT_SOLID_CODE;
  protected readonly variantDashedCode = DIVIDER_SHOWCASE_VARIANT_DASHED_CODE;
  protected readonly variantDottedCode = DIVIDER_SHOWCASE_VARIANT_DOTTED_CODE;
  protected readonly orientationHorizontalCode =
    DIVIDER_SHOWCASE_ORIENTATION_HORIZONTAL_CODE;
  protected readonly orientationVerticalCode =
    DIVIDER_SHOWCASE_ORIENTATION_VERTICAL_CODE;
  protected readonly spacingCode = DIVIDER_SHOWCASE_SPACING_CODE;
  protected readonly insetCode = DIVIDER_SHOWCASE_INSET_CODE;
  protected readonly lengthCode = DIVIDER_SHOWCASE_LENGTH_CODE;
  protected readonly labelCenterCode = DIVIDER_SHOWCASE_LABEL_CENTER_CODE;
  protected readonly labelStartCode = DIVIDER_SHOWCASE_LABEL_START_CODE;
  protected readonly labelEndCode = DIVIDER_SHOWCASE_LABEL_END_CODE;
  protected readonly dropdownCode = DIVIDER_SHOWCASE_DROPDOWN_CODE;
  protected readonly semanticCode = DIVIDER_SHOWCASE_SEMANTIC_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: DIVIDER_TRANSLATION_PREFIX,
      slug: DIVIDER_SHOWCASE_SLUG,
      importCode: DIVIDER_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance =
    signal<SolarisDividerAppearance>('subtle');
  protected readonly selectedVariant = signal<SolarisDividerVariant>('solid');
  protected readonly selectedOrientation =
    signal<SolarisDividerOrientation>('horizontal');
  protected readonly selectedTextPosition =
    signal<SolarisDividerTextPosition>('center');
  protected readonly selectedLayout = signal<string>('spacing');

  protected readonly appearanceCode = computed(() =>
    this.selectedAppearance() === 'strong'
      ? DIVIDER_SHOWCASE_APPEARANCE_STRONG_CODE
      : DIVIDER_SHOWCASE_APPEARANCE_SUBTLE_CODE,
  );

  protected readonly variantCode = computed(() => {
    switch (this.selectedVariant()) {
      case 'dashed':
        return DIVIDER_SHOWCASE_VARIANT_DASHED_CODE;
      case 'dotted':
        return DIVIDER_SHOWCASE_VARIANT_DOTTED_CODE;
      default:
        return DIVIDER_SHOWCASE_VARIANT_SOLID_CODE;
    }
  });

  protected readonly orientationCode = computed(() =>
    this.selectedOrientation() === 'vertical'
      ? DIVIDER_SHOWCASE_ORIENTATION_VERTICAL_CODE
      : DIVIDER_SHOWCASE_ORIENTATION_HORIZONTAL_CODE,
  );

  protected readonly labelCode = computed(() => {
    switch (this.selectedTextPosition()) {
      case 'start':
        return DIVIDER_SHOWCASE_LABEL_START_CODE;
      case 'end':
        return DIVIDER_SHOWCASE_LABEL_END_CODE;
      default:
        return DIVIDER_SHOWCASE_LABEL_CENTER_CODE;
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
