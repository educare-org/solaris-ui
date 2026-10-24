import { Component, signal } from '@angular/core';

import {
  SolarisRecordGridComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  type SolarisRecordGridColumn,
  type SolarisRecordGridCommit,
} from '@solaris-ui/angular';

import {
  RECORD_GRID_SHOWCASE_ROWS,
  type ShowcaseAttendance,
} from '../../../model/record-grid-showcase.data';

function rangeValidator(
  _row: ShowcaseAttendance,
  _columnId: string,
  value: unknown,
): string | null {
  if (value === null) {
    return null;
  }
  return typeof value === 'number' && value >= 0 && value <= 10
    ? null
    : 'Enter a value between 0 and 10';
}

@Component({
  standalone: true,
  selector: 'app-editing-record-grid-example',
  imports: [
    SolarisRecordGridComponent,
    SolarisTabComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.scss'],
})
export class EditingRecordGridExample {
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
        validateOf: rangeValidator,
      },
      {
        id: 'project',
        headerKey: 'record-grid.col.project',
        accessor: 'project',
        type: 'number',
        align: 'end',
        sortable: true,
        validateOf: rangeValidator,
      },
      {
        id: 'total',
        headerKey: 'record-grid.col.total',
        type: 'number',
        align: 'end',
        sortable: true,
        computed: { from: ['present', 'project'], by: 'sum' },
      },
    ];

  protected readonly mode = signal<'editable' | 'readonly'>('editable');
  protected readonly commitLog = signal<readonly string[]>([]);

  protected onRecordCommit(
    commit: SolarisRecordGridCommit<ShowcaseAttendance>,
  ): void {
    this.commitLog.update((log) =>
      [
        `${commit.rowId} · ${commit.columnId}: ${String(commit.previousValue)} → ${String(commit.value)}`,
        ...log,
      ].slice(0, 5),
    );
  }
}
