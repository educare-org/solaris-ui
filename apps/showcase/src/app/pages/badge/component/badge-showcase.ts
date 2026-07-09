import { Component } from '@angular/core';

import {
  SolarisBadgeComponent,
  SolarisBadgeIconDirective,
  SolarisIconComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisBadgeComponent,
    SolarisBadgeIconDirective,
    SolarisIconComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './badge-showcase.html',
  styleUrls: ['./badge-showcase.scss'],
})
export class BadgeShowcasePage {}
