import { Component, inject } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisDialogService,
  SolarisTableCellDirective,
  SolarisTableComponent,
  SolarisTranslatePipe,
  type SolarisTableColumn,
} from '@solaris-ui/angular';

import type { ShowcasePerson } from '../../../model/table-showcase.data';
import { TABLE_SHOWCASE_ROWS } from '../../../model/table-showcase.data';

@Component({
  standalone: true,
  selector: 'app-row-dialog-table-example',
  imports: [
    SolarisTableComponent,
    SolarisTableCellDirective,
    SolarisButtonDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './row-dialog.component.html',
})
export class RowDialogTableExample {
  private readonly dialogService = inject(SolarisDialogService);

  protected readonly columns: readonly SolarisTableColumn<ShowcasePerson>[] = [
    {
      id: 'name',
      headerKey: 'table.col.name',
      accessor: 'name',
      sortable: true,
    },
    {
      id: 'city',
      headerKey: 'table.col.city',
      accessor: 'city',
    },
    {
      id: 'details',
      headerKey: 'table.col.details',
      cellTemplateId: 'details',
    },
  ];
  protected readonly rows: readonly ShowcasePerson[] =
    TABLE_SHOWCASE_ROWS.slice(0, 5);

  protected openDetails(row: ShowcasePerson): void {
    this.dialogService.open({
      title: row.name,
      description: `Age ${row.age} · ${row.city} · joined ${row.joined} · score ${row.score}.`,
      actions: [{ label: 'Close', appearance: 'ghost', close: true }],
    });
  }
}
