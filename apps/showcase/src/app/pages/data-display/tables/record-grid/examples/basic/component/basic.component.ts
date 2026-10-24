import { Component } from '@angular/core';

import { SolarisRecordGridComponent } from '@solaris-ui/angular';

import {
  RECORD_GRID_SHOWCASE_BASIC_COLUMNS,
  RECORD_GRID_SHOWCASE_ROWS,
} from '../../../model/record-grid-showcase.data';

@Component({
  standalone: true,
  selector: 'app-basic-record-grid-example',
  imports: [SolarisRecordGridComponent],
  templateUrl: './basic.component.html',
})
export class BasicRecordGridExample {
  protected readonly columns = RECORD_GRID_SHOWCASE_BASIC_COLUMNS;
  protected readonly rows = RECORD_GRID_SHOWCASE_ROWS;
}
