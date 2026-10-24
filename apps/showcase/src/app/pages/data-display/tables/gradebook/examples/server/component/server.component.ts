import { Component, signal } from '@angular/core';

import {
  SolarisGradebookComponent,
  createServerTableDataSource,
  type SolarisTableSort,
} from '@solaris-ui/angular';

import {
  GRADEBOOK_SHOWCASE_BASIC_COLUMNS,
  GRADEBOOK_SHOWCASE_IDENTITY,
  GRADEBOOK_SHOWCASE_ROWS,
  type ShowcaseSubject,
} from '../../../model/gradebook-showcase.data';

function sortServerRows(
  rows: readonly ShowcaseSubject[],
  sort: SolarisTableSort | null,
): readonly ShowcaseSubject[] {
  if (!sort?.columnId || !sort.direction) {
    return [...rows];
  }
  const multiplier = sort.direction === 'asc' ? 1 : -1;
  return rows
    .map((row, stableIndex) => ({ row, stableIndex }))
    .sort((left, right) => {
      // Identity column sorts by subject name; grade columns sort by score.
      if (!(sort.columnId in left.row.scores)) {
        const comparison = left.row.name.localeCompare(
          right.row.name,
          'pt-BR',
          {
            numeric: true,
            sensitivity: 'base',
          },
        );
        if (comparison !== 0) {
          return comparison * multiplier;
        }
        return left.stableIndex - right.stableIndex;
      }
      const leftValue = left.row.scores[sort.columnId] ?? null;
      const rightValue = right.row.scores[sort.columnId] ?? null;
      if (leftValue === null && rightValue === null) {
        return left.stableIndex - right.stableIndex;
      }
      if (leftValue === null) {
        return 1;
      }
      if (rightValue === null) {
        return -1;
      }
      if (leftValue !== rightValue) {
        return (leftValue - rightValue) * multiplier;
      }
      return left.stableIndex - right.stableIndex;
    })
    .map((entry) => entry.row);
}

@Component({
  standalone: true,
  selector: 'app-server-gradebook-example',
  imports: [SolarisGradebookComponent],
  templateUrl: './server.component.html',
})
export class ServerGradebookExample {
  protected readonly columns = GRADEBOOK_SHOWCASE_BASIC_COLUMNS;
  protected readonly identity = GRADEBOOK_SHOWCASE_IDENTITY;
  protected readonly sort = signal<SolarisTableSort | null>(null);

  private readonly serverRows = signal<readonly ShowcaseSubject[]>([]);
  private readonly total = signal<number | undefined>(undefined);
  private readonly serverLoading = signal(true);

  protected readonly source = createServerTableDataSource(
    this.serverRows,
    this.total,
    this.serverLoading,
  );

  constructor() {
    this.load(null, 800);
  }

  protected onSortChange(sort: SolarisTableSort | null): void {
    this.load(sort, 350);
  }

  private load(sort: SolarisTableSort | null, delay: number): void {
    this.serverLoading.set(true);
    setTimeout(() => {
      this.serverRows.set(sortServerRows(GRADEBOOK_SHOWCASE_ROWS, sort));
      this.total.set(GRADEBOOK_SHOWCASE_ROWS.length);
      this.serverLoading.set(false);
    }, delay);
  }
}
