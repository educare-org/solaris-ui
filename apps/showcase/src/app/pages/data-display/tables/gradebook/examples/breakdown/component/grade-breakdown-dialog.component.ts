import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  SOLARIS_DIALOG_DATA,
  SolarisButtonDirective,
  SolarisDialogCloseDirective,
  SolarisDialogContentComponent,
  SolarisDialogFooterComponent,
  SolarisDialogHeaderComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

import type { GradeBreakdownData } from '../model/grade-breakdown.data';

@Component({
  standalone: true,
  selector: 'app-grade-breakdown-dialog',
  imports: [
    SolarisDialogHeaderComponent,
    SolarisDialogContentComponent,
    SolarisDialogFooterComponent,
    SolarisDialogCloseDirective,
    SolarisButtonDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './grade-breakdown-dialog.component.html',
  styleUrls: ['./grade-breakdown-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradeBreakdownDialogComponent {
  readonly data = inject(SOLARIS_DIALOG_DATA) as GradeBreakdownData;
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected formatScore(value: number | null): string {
    if (value === null || value === undefined) {
      return '—';
    }
    return new Intl.NumberFormat(this.translateService?.locale() ?? 'pt-BR', {
      maximumFractionDigits: 1,
    }).format(value);
  }
}
