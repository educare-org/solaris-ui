import { Component, signal, viewChild } from '@angular/core';

import {
  SolarisGradebookComponent,
  SolarisTranslatePipe,
  type SolarisGradebookBulkCommit,
  type SolarisGradebookCommitEvent,
} from '@solaris-ui/angular';

import {
  GRADEBOOK_SHOWCASE_BASIC_COLUMNS,
  GRADEBOOK_SHOWCASE_IDENTITY,
  GRADEBOOK_SHOWCASE_ROWS,
  type ShowcaseSubject,
} from '../../../model/gradebook-showcase.data';

@Component({
  standalone: true,
  selector: 'app-editing-gradebook-example',
  imports: [SolarisGradebookComponent, SolarisTranslatePipe],
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.scss'],
})
export class EditingGradebookExample {
  protected readonly rows = signal<readonly ShowcaseSubject[]>(
    GRADEBOOK_SHOWCASE_ROWS,
  );
  protected readonly columns = GRADEBOOK_SHOWCASE_BASIC_COLUMNS;
  protected readonly identity = GRADEBOOK_SHOWCASE_IDENTITY;

  protected readonly selectedIds = signal<readonly string[]>([]);
  protected readonly bulkAssignment = signal<string>('gs1');
  protected readonly bulkApplied = signal<number | null>(null);

  private readonly gradebook = viewChild(
    SolarisGradebookComponent<ShowcaseSubject>,
  );

  protected onCommit(
    event: SolarisGradebookCommitEvent<ShowcaseSubject>,
  ): void {
    this.rows.update((rows) =>
      rows.map((row) =>
        row.id === event.rowId
          ? {
              ...row,
              scores: { ...row.scores, [event.assignmentId]: event.value },
            }
          : row,
      ),
    );
  }

  protected onBulkCommit(
    event: SolarisGradebookBulkCommit<ShowcaseSubject>,
  ): void {
    const values = new Map(event.rowIds.map((rowId) => [rowId, event.value]));
    this.rows.update((rows) =>
      rows.map((row) =>
        values.has(row.id)
          ? {
              ...row,
              scores: {
                ...row.scores,
                [event.assignmentId]: values.get(row.id) ?? null,
              },
            }
          : row,
      ),
    );
    this.bulkApplied.set(event.rowIds.length);
  }

  protected applyBulk(rawValue: string): void {
    const trimmed = rawValue.trim().replace(',', '.');
    const value = trimmed === '' ? null : Number(trimmed);
    if (value !== null && !Number.isFinite(value)) {
      return;
    }
    this.gradebook()?.commitBulk(
      this.selectedIds(),
      this.bulkAssignment(),
      value,
    );
  }
}
