import { Component, signal } from '@angular/core';

import {
  SolarisGradebookComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

import {
  GRADEBOOK_SHOWCASE_BASIC_COLUMNS,
  GRADEBOOK_SHOWCASE_IDENTITY,
  GRADEBOOK_SHOWCASE_ROWS,
} from '../../../model/gradebook-showcase.data';

@Component({
  standalone: true,
  selector: 'app-layout-gradebook-example',
  imports: [
    SolarisGradebookComponent,
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutGradebookExample {
  protected readonly rows = GRADEBOOK_SHOWCASE_ROWS;
  protected readonly columns = GRADEBOOK_SHOWCASE_BASIC_COLUMNS;
  protected readonly identity = GRADEBOOK_SHOWCASE_IDENTITY;
  protected readonly fullWidth = signal(false);
}
