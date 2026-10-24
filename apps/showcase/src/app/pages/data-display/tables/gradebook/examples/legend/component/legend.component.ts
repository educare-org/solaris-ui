import { Component } from '@angular/core';

import {
  SolarisGradebookComponent,
  SolarisGradebookLegendComponent,
  type SolarisGradebookLegendItem,
} from '@solaris-ui/angular';

import {
  GRADEBOOK_SHOWCASE_BASIC_COLUMNS,
  GRADEBOOK_SHOWCASE_IDENTITY,
  GRADEBOOK_SHOWCASE_ROWS,
} from '../../../model/gradebook-showcase.data';

@Component({
  standalone: true,
  selector: 'app-legend-gradebook-example',
  imports: [SolarisGradebookComponent, SolarisGradebookLegendComponent],
  templateUrl: './legend.component.html',
})
export class LegendGradebookExample {
  protected readonly rows = GRADEBOOK_SHOWCASE_ROWS;
  protected readonly columns = GRADEBOOK_SHOWCASE_BASIC_COLUMNS;
  protected readonly identity = GRADEBOOK_SHOWCASE_IDENTITY;
  protected readonly legend: readonly SolarisGradebookLegendItem[] = [
    { labelKey: 'gradebook.legend.approved', color: 'success' },
    { labelKey: 'gradebook.legend.exam', color: 'warning' },
    { labelKey: 'gradebook.legend.missing', color: 'danger' },
  ];
}
