import { Component } from '@angular/core';

import {
  SolarisCardComponent,
  SolarisCardHeaderDirective,
  SolarisCardContentDirective,
  SolarisCardMediaDirective,
  SolarisCardFooterDirective,
  SolarisCardTitleDirective,
  SolarisCardDescriptionDirective,
  SolarisBadgeComponent,
  SolarisSkeletonComponent,
  SolarisTranslatePipe,
} from '@educarehq/solaris-ui';

@Component({
  standalone: true,
  imports: [
    SolarisCardComponent,
    SolarisCardHeaderDirective,
    SolarisCardContentDirective,
    SolarisCardMediaDirective,
    SolarisCardFooterDirective,
    SolarisCardTitleDirective,
    SolarisCardDescriptionDirective,
    SolarisBadgeComponent,
    SolarisSkeletonComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './card-showcase.html',
  styleUrls: ['./card-showcase.scss'],
})
export class CardShowcasePage {}
