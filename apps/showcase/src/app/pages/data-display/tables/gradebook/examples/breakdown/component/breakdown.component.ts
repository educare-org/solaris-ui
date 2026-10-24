import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  SolarisDialogService,
  SolarisGradebookComponent,
  SolarisIconComponent,
  SolarisTableCellDirective,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisGradebookColumn,
} from '@solaris-ui/angular';

import {
  GRADEBOOK_SHOWCASE_FULL_COLUMNS,
  GRADEBOOK_SHOWCASE_GROUPS,
  GRADEBOOK_SHOWCASE_IDENTITY,
  GRADEBOOK_SHOWCASE_ROWS,
  type ShowcaseSubject,
} from '../../../model/gradebook-showcase.data';

import { GradeBreakdownDialogComponent } from './grade-breakdown-dialog.component';
import type { GradeBreakdownData } from '../model/grade-breakdown.data';

const MP_BREAKDOWN_CELL_TEMPLATE_ID = 'mp-breakdown';

@Component({
  standalone: true,
  selector: 'app-breakdown-gradebook-example',
  imports: [
    SolarisGradebookComponent,
    SolarisIconComponent,
    SolarisTableCellDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './breakdown.component.html',
  styleUrls: ['./breakdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreakdownGradebookExample {
  private readonly dialogService = inject(SolarisDialogService);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly rows = GRADEBOOK_SHOWCASE_ROWS;
  protected readonly groups = GRADEBOOK_SHOWCASE_GROUPS;
  protected readonly identity = GRADEBOOK_SHOWCASE_IDENTITY;
  protected readonly columns: readonly SolarisGradebookColumn<ShowcaseSubject>[] =
    GRADEBOOK_SHOWCASE_FULL_COLUMNS.map((column) =>
      column.id === 'mp'
        ? { ...column, cellTemplateId: MP_BREAKDOWN_CELL_TEMPLATE_ID }
        : column,
    );

  protected formatScore(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric)) {
      return String(value);
    }
    return new Intl.NumberFormat(this.translateService?.locale() ?? 'pt-BR', {
      maximumFractionDigits: 1,
    }).format(numeric);
  }

  protected openBreakdown(row: ShowcaseSubject): void {
    if (this.dialogService.openCount > 0) {
      return;
    }
    const data: GradeBreakdownData = {
      subject: row.name,
      parts: [
        {
          labelKey: 'gradebook.col.ftat',
          value: row.scores['ftat'] ?? null,
          weight: '20%',
        },
        {
          labelKey: 'gradebook.col.gs1',
          value: row.scores['gs1'] ?? null,
          weight: '40%',
        },
        {
          labelKey: 'gradebook.col.gs2',
          value: row.scores['gs2'] ?? null,
          weight: '40%',
        },
      ],
      result: row.scores['mp'] ?? null,
    };
    this.dialogService.openComponent(GradeBreakdownDialogComponent, {
      width: '480px',
      data,
    });
  }
}
