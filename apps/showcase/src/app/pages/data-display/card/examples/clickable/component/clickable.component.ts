import { Component } from '@angular/core';

import {
  SolarisCardComponent,
  SolarisCardContentDirective,
  SolarisCardDescriptionDirective,
  SolarisCardTitleDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-clickable-card-example',
  imports: [
    SolarisCardComponent,
    SolarisCardContentDirective,
    SolarisCardDescriptionDirective,
    SolarisCardTitleDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './clickable.component.html',
})
export class ClickableCardExample {}
