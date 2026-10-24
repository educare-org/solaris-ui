import { Component } from '@angular/core';

import {
  SolarisAvatarProfileComponent,
  SolarisBadgeComponent,
  SolarisButtonDirective,
  SolarisTableCellDirective,
  SolarisTableComponent,
  SolarisTranslatePipe,
  type SolarisBadgeColor,
  type SolarisTableColumn,
} from '@solaris-ui/angular';

import type { ShowcasePerson } from '../../../model/table-showcase.data';
import { TABLE_SHOWCASE_ROWS } from '../../../model/table-showcase.data';

type MemberStatus = 'active' | 'pending' | 'blocked';

const STATUS_COLOR: Record<MemberStatus, SolarisBadgeColor> = {
  active: 'success',
  pending: 'warning',
  blocked: 'danger',
};

function statusOf(score: number): MemberStatus {
  if (score >= 800) {
    return 'active';
  }
  if (score >= 600) {
    return 'pending';
  }
  return 'blocked';
}

@Component({
  standalone: true,
  selector: 'app-mobile-composed-table-example',
  imports: [
    SolarisTableComponent,
    SolarisTableCellDirective,
    SolarisAvatarProfileComponent,
    SolarisBadgeComponent,
    SolarisButtonDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './mobile-composed.component.html',
})
export class MobileComposedTableExample {
  protected readonly columns: readonly SolarisTableColumn<ShowcasePerson>[] = [
    {
      id: 'person',
      headerKey: 'table.col.person',
      accessor: 'name',
      sortable: true,
      cellTemplateId: 'person',
      hideCardLabel: true,
    },
    {
      id: 'status',
      headerKey: 'table.col.status',
      accessor: 'score',
      sortable: true,
      cellTemplateId: 'status',
      align: 'center',
      headerAlign: 'center',
      sortValueOf: (row) =>
        statusOf(row.score) === 'active'
          ? 0
          : statusOf(row.score) === 'pending'
            ? 1
            : 2,
    },
    {
      id: 'age',
      headerKey: 'table.col.age',
      accessor: 'age',
      type: 'number',
      align: 'end',
      headerAlign: 'end',
    },
    {
      id: 'actions',
      headerKey: 'table.col.actions',
      cellTemplateId: 'actions',
      align: 'end',
      headerAlign: 'end',
    },
  ];
  protected readonly rows: readonly ShowcasePerson[] =
    TABLE_SHOWCASE_ROWS.slice(0, 3);

  protected statusOf(score: number): MemberStatus {
    return statusOf(score);
  }

  protected statusColorOf(score: number): SolarisBadgeColor {
    return STATUS_COLOR[statusOf(score)];
  }
}
