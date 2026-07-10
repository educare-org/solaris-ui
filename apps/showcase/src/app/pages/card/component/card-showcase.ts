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
} from '@solaris-ui/angular';

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
