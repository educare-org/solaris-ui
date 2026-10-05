import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisStepComponent,
  SolarisStepperComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisStepperAppearance,
  type SolarisStepperDensity,
  type SolarisStepperOrientation,
  type SolarisStepperSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  STEPPER_SHOWCASE_ACTIONS_CODE,
  STEPPER_SHOWCASE_BASIC_HORIZONTAL_CODE,
  STEPPER_SHOWCASE_BASIC_VERTICAL_CODE,
  STEPPER_SHOWCASE_BREADCRUMBS,
  STEPPER_SHOWCASE_CARD_CODE,
  STEPPER_SHOWCASE_DASHED_CODE,
  STEPPER_SHOWCASE_ERROR_CODE,
  STEPPER_SHOWCASE_ICON_CODE,
  STEPPER_SHOWCASE_IMPORT_CODE,
  STEPPER_SHOWCASE_INSTALL_COMMANDS,
  STEPPER_SHOWCASE_LINEAR_CODE,
  STEPPER_SHOWCASE_NEXT,
  STEPPER_SHOWCASE_NON_LINEAR_CODE,
  STEPPER_SHOWCASE_OPTIONAL_CODE,
  STEPPER_SHOWCASE_PREV,
  STEPPER_SHOWCASE_RESPONSIVE_CODE,
  STEPPER_SHOWCASE_SLUG,
  STEPPER_SHOWCASE_TOC_ITEMS,
  STEPPER_SHOWCASE_TRANSITION_CODE,
  STEPPER_SHOWCASE_VALIDATION_CODE,
  STEPPER_SHOWCASE_WARNING_CODE,
  STEPPER_SHOWCASE_WIZARD_CODE,
  STEPPER_TRANSLATION_PREFIX,
} from '../model/stepper-showcase.data';

import { BasicHorizontalStepperExample } from '../examples/basic-horizontal/component/basic-horizontal.component';
import { BasicVerticalStepperExample } from '../examples/basic-vertical/component/basic-vertical.component';
import { DashedStepperExample } from '../examples/dashed/component/dashed.component';
import { CardStepperExample } from '../examples/card/component/card.component';
import { LinearStepperExample } from '../examples/linear/component/linear.component';
import { NonLinearStepperExample } from '../examples/non-linear/component/non-linear.component';
import { ErrorStepperExample } from '../examples/error/component/error.component';
import { WarningStepperExample } from '../examples/warning/component/warning.component';
import { OptionalStepExample } from '../examples/optional/component/optional.component';
import { WizardStepperExample } from '../examples/wizard/component/wizard.component';
import { ContentTransitionStepperExample } from '../examples/content-transition/component/content-transition.component';
import { ActionsAlignmentStepperExample } from '../examples/actions-alignment/component/actions-alignment.component';
import { IconStepperExample } from '../examples/icon/component/icon.component';
import { ResponsiveStepperExample } from '../examples/responsive/component/responsive.component';
import { ValidationStepperExample } from '../examples/validation/component/validation.component';

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisStepComponent,
    SolarisStepperComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicHorizontalStepperExample,
    BasicVerticalStepperExample,
    DashedStepperExample,
    CardStepperExample,
    LinearStepperExample,
    NonLinearStepperExample,
    ErrorStepperExample,
    WarningStepperExample,
    OptionalStepExample,
    WizardStepperExample,
    ContentTransitionStepperExample,
    ActionsAlignmentStepperExample,
    IconStepperExample,
    ResponsiveStepperExample,
    ValidationStepperExample,
  ],
  templateUrl: './stepper-page.component.html',
  styleUrls: ['./stepper-page.component.scss'],
})
export class StepperPageComponent {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = STEPPER_SHOWCASE_BREADCRUMBS;
  protected readonly prev = STEPPER_SHOWCASE_PREV;
  protected readonly next = STEPPER_SHOWCASE_NEXT;
  protected readonly tocItems = STEPPER_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = STEPPER_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = STEPPER_SHOWCASE_IMPORT_CODE;
  protected readonly basicHorizontalCode =
    STEPPER_SHOWCASE_BASIC_HORIZONTAL_CODE;
  protected readonly basicVerticalCode = STEPPER_SHOWCASE_BASIC_VERTICAL_CODE;
  protected readonly cardCode = STEPPER_SHOWCASE_CARD_CODE;
  protected readonly dashedCode = STEPPER_SHOWCASE_DASHED_CODE;
  protected readonly linearCode = STEPPER_SHOWCASE_LINEAR_CODE;
  protected readonly nonLinearCode = STEPPER_SHOWCASE_NON_LINEAR_CODE;
  protected readonly errorCode = STEPPER_SHOWCASE_ERROR_CODE;
  protected readonly warningCode = STEPPER_SHOWCASE_WARNING_CODE;
  protected readonly optionalCode = STEPPER_SHOWCASE_OPTIONAL_CODE;
  protected readonly iconCode = STEPPER_SHOWCASE_ICON_CODE;
  protected readonly validationCode = STEPPER_SHOWCASE_VALIDATION_CODE;
  protected readonly wizardCode = STEPPER_SHOWCASE_WIZARD_CODE;
  protected readonly transitionCode = STEPPER_SHOWCASE_TRANSITION_CODE;
  protected readonly actionsCode = STEPPER_SHOWCASE_ACTIONS_CODE;
  protected readonly responsiveCode = STEPPER_SHOWCASE_RESPONSIVE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: STEPPER_TRANSLATION_PREFIX,
      slug: STEPPER_SHOWCASE_SLUG,
      importCode: STEPPER_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedOrientation =
    signal<SolarisStepperOrientation>('horizontal');
  protected readonly selectedAppearance =
    signal<SolarisStepperAppearance>('default');
  protected readonly selectedLinear = signal<string>('linear');
  protected readonly selectedSize = signal<SolarisStepperSize>('md');
  protected readonly selectedDensity = signal<SolarisStepperDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      '<solaris-stepper',
      '  [activeIndex]="1"',
      `  size="${this.selectedSize()}"`,
      `  density="${this.selectedDensity()}"`,
      '>',
      '  <solaris-step label="Step 1" status="completed" />',
      '  <solaris-step label="Step 2" status="active" />',
      '  <solaris-step label="Step 3" status="pending" />',
      '</solaris-stepper>',
    ].join('\n'),
  );

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
