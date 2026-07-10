import { Component } from '@angular/core';

import {
  SolarisBadgeComponent,
  SolarisBadgeIconDirective,
  SolarisIconComponent,
  SolarisTranslatePipe,
} from '@educarehq/solaris-ui';

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
