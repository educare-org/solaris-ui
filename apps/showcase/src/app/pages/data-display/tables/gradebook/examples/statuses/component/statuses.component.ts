import { Component } from '@angular/core';

import {
  SolarisGradebookComponent,
  SolarisGradebookLegendComponent,
  type SolarisGradebookCellStatus,
  type SolarisGradebookLegendItem,
} from '@solaris-ui/angular';

import {
  GRADEBOOK_SHOWCASE_BASIC_COLUMNS,
  GRADEBOOK_SHOWCASE_IDENTITY,
  GRADEBOOK_SHOWCASE_ROWS,
  type ShowcaseSubject,
} from '../../../model/gradebook-showcase.data';

const STATUS_BY_ROW: Record<string, SolarisGradebookCellStatus> = {
  dotnet: 'graded',
  compliance: 'late',
  devops: 'missing',
  java: 'graded',
  mobile: 'excused',
};

@Component({
  standalone: true,
  selector: 'app-statuses-gradebook-example',
  imports: [SolarisGradebookComponent, SolarisGradebookLegendComponent],
  templateUrl: './statuses.component.html',
})
export class StatusesGradebookExample {
  protected readonly rows = GRADEBOOK_SHOWCASE_ROWS;
  protected readonly columns = GRADEBOOK_SHOWCASE_BASIC_COLUMNS;
  protected readonly identity = GRADEBOOK_SHOWCASE_IDENTITY;
  protected readonly legend: readonly SolarisGradebookLegendItem[] = [
    { labelKey: 'gradebook.legend.approved', color: 'success' },
    { labelKey: 'gradebook.legend.exam', color: 'warning' },
    { labelKey: 'gradebook.legend.missing', color: 'danger' },
  ];

  protected statusOf(row: ShowcaseSubject): SolarisGradebookCellStatus {
    return STATUS_BY_ROW[row.id] ?? 'graded';
  }
}
