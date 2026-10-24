import { Component } from '@angular/core';

import {
  SolarisDividerComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-divider-with-label-example',
  imports: [SolarisDividerComponent, SolarisTranslatePipe],
  templateUrl: './with-label.component.html',
  styleUrls: ['./with-label.component.scss'],
})
export class DividerWithLabelExample {}
