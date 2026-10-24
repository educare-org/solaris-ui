import { Component, signal } from '@angular/core';

import {
  SolarisRecordGridComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  type SolarisTableLayout,
} from '@solaris-ui/angular';

import {
  RECORD_GRID_SHOWCASE_BASIC_COLUMNS,
  RECORD_GRID_SHOWCASE_ROWS,
} from '../../../model/record-grid-showcase.data';

@Component({
  standalone: true,
  selector: 'app-layout-record-grid-example',
  imports: [
    SolarisRecordGridComponent,
    SolarisTabComponent,
    SolarisTabsComponent,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutRecordGridExample {
  protected readonly columns = RECORD_GRID_SHOWCASE_BASIC_COLUMNS;
  protected readonly rows = RECORD_GRID_SHOWCASE_ROWS;
  protected readonly layout = signal<SolarisTableLayout>('auto');
}
