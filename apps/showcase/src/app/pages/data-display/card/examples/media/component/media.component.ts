import { Component } from '@angular/core';

import {
  SolarisBadgeComponent,
  SolarisCardComponent,
  SolarisCardContentDirective,
  SolarisCardDescriptionDirective,
  SolarisCardFooterDirective,
  SolarisCardMediaDirective,
  SolarisCardTitleDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-media-card-example',
  imports: [
    SolarisBadgeComponent,
    SolarisCardComponent,
    SolarisCardContentDirective,
    SolarisCardDescriptionDirective,
    SolarisCardFooterDirective,
    SolarisCardMediaDirective,
    SolarisCardTitleDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaCardExample {}
