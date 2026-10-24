import { Component } from '@angular/core';

import {
  SolarisSelectionCardComponent,
  SolarisSelectionCardContentDirective,
  SolarisSelectionCardDescriptionDirective,
  SolarisSelectionCardHeaderDirective,
  SolarisSelectionCardTitleDirective,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-selection-card-example',
  imports: [
    SolarisSelectionCardComponent,
    SolarisSelectionCardContentDirective,
    SolarisSelectionCardDescriptionDirective,
    SolarisSelectionCardHeaderDirective,
    SolarisSelectionCardTitleDirective,
  ],
  templateUrl: './basic.component.html',
})
export class BasicSelectionCardExample {}
