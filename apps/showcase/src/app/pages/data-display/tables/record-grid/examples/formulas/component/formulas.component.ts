import { Component } from '@angular/core';

import {
  SolarisRecordGridComponent,
  type SolarisRecordGridColumn,
} from '@solaris-ui/angular';

import {
  RECORD_GRID_SHOWCASE_ROWS,
  type ShowcaseAttendance,
} from '../../../model/record-grid-showcase.data';

@Component({
  standalone: true,
  selector: 'app-formulas-record-grid-example',
  imports: [SolarisRecordGridComponent],
  templateUrl: './formulas.component.html',
})
export class FormulasRecordGridExample {
  protected readonly rows = RECORD_GRID_SHOWCASE_ROWS;
  protected readonly columns: readonly SolarisRecordGridColumn<ShowcaseAttendance>[] =
    [
      {
        id: 'student',
        headerKey: 'record-grid.col.student',
        accessor: 'student',
        sortable: true,
      },
      {
        id: 'present',
        headerKey: 'record-grid.col.present',
        accessor: 'present',
        type: 'number',
        align: 'end',
        sortable: true,
      },
      {
        id: 'project',
        headerKey: 'record-grid.col.project',
        accessor: 'project',
        type: 'number',
        align: 'end',
        sortable: true,
      },
      {
        id: 'total',
        headerKey: 'record-grid.col.total',
        type: 'number',
        align: 'end',
        sortable: true,
        computed: { from: ['present', 'project'], by: 'sum' },
      },
      {
        id: 'final',
        headerKey: 'record-grid.col.final',
        type: 'number',
        align: 'end',
        sortable: true,
        computed: {
          from: ['total', 'project'],
          by: 'weighted',
          weights: { total: 2, project: 1 },
        },
      },
    ];
}
