import { Component } from '@angular/core';

import {
  SolarisDividerComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-divider-vertical-example',
  imports: [SolarisDividerComponent, SolarisTranslatePipe],
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.scss'],
})
export class DividerVerticalExample {}
