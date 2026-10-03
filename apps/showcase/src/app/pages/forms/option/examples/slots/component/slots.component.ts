import { Component } from '@angular/core';

import {
  SolarisBadgeComponent,
  SolarisIconComponent,
  SolarisOptionComponent,
  SolarisOptionDescriptionDirective,
  SolarisOptionLabelDirective,
  SolarisOptionLeadingDirective,
  SolarisOptionMetaDirective,
  SolarisOptionTrailingDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-slots-option-example',
  imports: [
    SolarisBadgeComponent,
    SolarisIconComponent,
    SolarisOptionComponent,
    SolarisOptionDescriptionDirective,
    SolarisOptionLabelDirective,
    SolarisOptionLeadingDirective,
    SolarisOptionMetaDirective,
    SolarisOptionTrailingDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './slots.component.html',
})
export class SlotsOptionExample {}
