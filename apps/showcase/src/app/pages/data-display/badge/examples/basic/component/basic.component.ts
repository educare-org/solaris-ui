import { Component } from '@angular/core';

import {
  SolarisBadgeComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-badge-example',
  imports: [SolarisBadgeComponent, SolarisTranslatePipe],
  templateUrl: './basic.component.html',
})
export class BasicBadgeExample {}
