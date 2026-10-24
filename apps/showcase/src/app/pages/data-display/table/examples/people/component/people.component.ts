import { Component } from '@angular/core';

import {
  SolarisAvatarProfileComponent,
  SolarisBadgeComponent,
  SolarisTableCellDirective,
  SolarisTableComponent,
  type SolarisBadgeColor,
  type SolarisTableColumn,
} from '@solaris-ui/angular';

interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly status: 'active' | 'pending' | 'blocked';
  readonly age: number;
}

const STATUS_COLOR: Record<TeamMember['status'], SolarisBadgeColor> = {
  active: 'success',
  pending: 'warning',
  blocked: 'danger',
};

@Component({
  standalone: true,
  selector: 'app-people-table-example',
  imports: [
    SolarisTableComponent,
    SolarisTableCellDirective,
    SolarisAvatarProfileComponent,
    SolarisBadgeComponent,
  ],
  templateUrl: './people.component.html',
})
export class PeopleTableExample {
  protected statusColorOf(status: TeamMember['status']): SolarisBadgeColor {
    return STATUS_COLOR[status];
  }
  protected readonly columns: readonly SolarisTableColumn<TeamMember>[] = [
    {
      id: 'person',
      headerKey: 'table.col.person',
      accessor: 'name',
      sortable: true,
      cellTemplateId: 'person',
      icon: 'user',
    },
    {
      id: 'status',
      headerKey: 'table.col.status',
      accessor: 'status',
      sortable: true,
      cellTemplateId: 'status',
      align: 'center',
      headerAlign: 'center',
      icon: 'badge',
      sortValueOf: (row) =>
        row.status === 'active' ? 0 : row.status === 'pending' ? 1 : 2,
    },
    {
      id: 'age',
      headerKey: 'table.col.age',
      accessor: 'age',
      type: 'number',
      align: 'end',
      headerAlign: 'end',
    },
  ];
  protected readonly rows: readonly TeamMember[] = [
    {
      id: 'u-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      status: 'active',
      age: 36,
    },
    {
      id: 'u-2',
      name: 'Grace Hopper',
      email: 'grace@example.com',
      status: 'pending',
      age: 85,
    },
    {
      id: 'u-3',
      name: 'Alan Turing',
      email: 'alan@example.com',
      status: 'blocked',
      age: 41,
    },
  ];
}
