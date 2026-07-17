import { Component } from '@angular/core';

import { SolarisTranslatePipe } from '@solaris-ui/angular';

import { BasicHorizontalStepperExample } from '../examples/basic-horizontal/component/basic-horizontal.component';
import { BasicVerticalStepperExample } from '../examples/basic-vertical/component/basic-vertical.component';
import { DashedStepperExample } from '../examples/dashed/component/dashed.component';
import { CardStepperExample } from '../examples/card/component/card.component';
import { LinearStepperExample } from '../examples/linear/component/linear.component';
import { NonLinearStepperExample } from '../examples/non-linear/component/non-linear.component';
import { ErrorStepperExample } from '../examples/error/component/error.component';
import { OptionalStepExample } from '../examples/optional/component/optional.component';
import { WizardStepperExample } from '../examples/wizard/component/wizard.component';
import { ContentTransitionStepperExample } from '../examples/content-transition/component/content-transition.component';
import { ActionsAlignmentStepperExample } from '../examples/actions-alignment/component/actions-alignment.component';
import { CompactDensityStepperExample } from '../examples/compact-density/component/compact-density.component';
import { IconStepperExample } from '../examples/icon/component/icon.component';
import { ResponsiveStepperExample } from '../examples/responsive/component/responsive.component';

@Component({
  standalone: true,
  imports: [
    SolarisTranslatePipe,
    BasicHorizontalStepperExample,
    BasicVerticalStepperExample,
    DashedStepperExample,
    CardStepperExample,
    LinearStepperExample,
    NonLinearStepperExample,
    ErrorStepperExample,
    OptionalStepExample,
    WizardStepperExample,
    ContentTransitionStepperExample,
    ActionsAlignmentStepperExample,
    CompactDensityStepperExample,
    IconStepperExample,
    ResponsiveStepperExample,
  ],
  templateUrl: './stepper-page.component.html',
  styleUrls: ['./stepper-page.component.scss'],
})
export class StepperPageComponent {}
