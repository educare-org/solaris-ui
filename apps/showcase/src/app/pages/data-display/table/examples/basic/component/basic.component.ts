import { Component } from '@angular/core';

import { SolarisTableComponent } from '@solaris-ui/angular';

import {
  TABLE_SHOWCASE_BASIC_COLUMNS,
  TABLE_SHOWCASE_ROWS,
  type ShowcasePerson,
} from '../../../model/table-showcase.data';

@Component({
  standalone: true,
  selector: 'app-basic-table-example',
  imports: [SolarisTableComponent],
  templateUrl: './basic.component.html',
})
export class BasicTableExample {
  protected readonly rows: readonly ShowcasePerson[] =
    TABLE_SHOWCASE_ROWS.slice(0, 5);
  protected readonly columns = TABLE_SHOWCASE_BASIC_COLUMNS;
}
