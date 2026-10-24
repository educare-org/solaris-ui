import { Component } from '@angular/core';

import {
  SolarisBadgeComponent,
  SolarisCardComponent,
  SolarisCardContentDirective,
  SolarisCardDescriptionDirective,
  SolarisCardFooterDirective,
  SolarisCardHeaderDirective,
  SolarisCardTitleDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-card-example',
  imports: [
    SolarisBadgeComponent,
    SolarisCardComponent,
    SolarisCardContentDirective,
    SolarisCardDescriptionDirective,
    SolarisCardFooterDirective,
    SolarisCardHeaderDirective,
    SolarisCardTitleDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './basic.component.html',
})
export class BasicCardExample {}
