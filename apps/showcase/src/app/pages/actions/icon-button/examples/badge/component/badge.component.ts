import { Component } from '@angular/core';

import {
  SolarisBadgeComponent,
  SolarisIconButtonBadgeDirective,
  SolarisIconButtonDirective,
  SolarisIconComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-badge-icon-button-example',
  imports: [
    SolarisBadgeComponent,
    SolarisIconButtonBadgeDirective,
    SolarisIconButtonDirective,
    SolarisIconComponent,
  ],
  templateUrl: './badge.component.html',
})
export class BadgeIconButtonExample {}
