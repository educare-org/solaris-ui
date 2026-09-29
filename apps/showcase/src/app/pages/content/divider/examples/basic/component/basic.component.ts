import { Component } from '@angular/core';

import {
  SolarisDividerComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-divider-basic-example',
  imports: [SolarisDividerComponent, SolarisTranslatePipe],
  templateUrl: './basic.component.html',
})
export class DividerBasicExample {}
