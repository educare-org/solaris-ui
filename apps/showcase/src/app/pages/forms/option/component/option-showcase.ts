import { Component } from '@angular/core';

import {
  SolarisOptionComponent,
  SolarisOptionGroupComponent,
  SolarisOptionLeadingDirective,
  SolarisOptionLabelDirective,
  SolarisOptionDescriptionDirective,
  SolarisOptionMetaDirective,
  SolarisOptionTrailingDirective,
  SolarisBadgeComponent,
  SolarisIconComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisOptionComponent,
    SolarisOptionGroupComponent,
    SolarisOptionLeadingDirective,
    SolarisOptionLabelDirective,
    SolarisOptionDescriptionDirective,
    SolarisOptionMetaDirective,
    SolarisOptionTrailingDirective,
    SolarisBadgeComponent,
    SolarisIconComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './option-showcase.html',
  styleUrls: ['./option-showcase.scss'],
})
export class OptionShowcasePage {}
