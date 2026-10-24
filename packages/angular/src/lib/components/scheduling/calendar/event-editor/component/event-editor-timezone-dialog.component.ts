import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SolarisButtonDirective } from '../../../../actions/button';
import { SolarisIconButtonDirective } from '../../../../actions/icon-button';
import { SolarisCheckboxComponent } from '../../../../forms/checkbox';
import { SolarisSelectComponent } from '../../../../forms/select';
import { SolarisOptionComponent } from '../../../../forms/option';
import { SolarisIconComponent } from '../../../../icon';
import { SolarisTranslatePipe } from '../../../../../services/translation';
import {
  SOLARIS_DIALOG_DATA,
  SOLARIS_DIALOG_REF,
} from '../../../../overlay/dialog/token/dialog-data.token';
import type { SolarisDialogRef } from '../../../../overlay/dialog/service/dialog-ref';
import { SOLARIS_EVENT_EDITOR_CURATED_TIME_ZONES } from '../model/event-editor.constants';
import { resolveTimeZoneChoices } from '../model/event-editor.utils';
import {
  SolarisDialogContentComponent,
  SolarisDialogFooterComponent,
} from '../../../../overlay/dialog';

export interface SolarisEventEditorTimezoneData {
  readonly current: string;
  readonly endCurrent?: string;
  readonly separate?: boolean;
  readonly locale: string;
  readonly options?: readonly string[];
}

export interface SolarisEventEditorTimezoneResult {
  readonly start: string;
  readonly end: string | null;
}

@Component({
  selector: 'solaris-event-editor-timezone-dialog',
  standalone: true,
  imports: [
    FormsModule,
    SolarisButtonDirective,
    SolarisIconButtonDirective,
    SolarisIconComponent,
    SolarisCheckboxComponent,
    SolarisSelectComponent,
    SolarisOptionComponent,
    SolarisTranslatePipe,
    SolarisDialogFooterComponent,
    SolarisDialogContentComponent,
  ],
  templateUrl: './event-editor-timezone-dialog.component.html',
  styleUrls: ['./event-editor-timezone-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'solaris-event-editor-timezone-dialog' },
})
export class SolarisEventEditorTimezoneDialogComponent {
  protected readonly data = inject(
    SOLARIS_DIALOG_DATA,
  ) as SolarisEventEditorTimezoneData;
  private readonly dialogRef = inject(
    SOLARIS_DIALOG_REF,
  ) as SolarisDialogRef<SolarisEventEditorTimezoneResult | null>;

  protected readonly selected = signal<string>(this.data.current);
  protected readonly selectedEnd = signal<string>(
    this.data.endCurrent ?? this.data.current,
  );
  protected readonly separate = signal<boolean>(this.data.separate ?? false);

  protected readonly choices = computed(() =>
    resolveTimeZoneChoices(
      this.data.options,
      SOLARIS_EVENT_EDITOR_CURATED_TIME_ZONES,
      this.data.current,
    ),
  );

  protected readonly endValue = computed(() =>
    this.separate() ? this.selectedEnd() : this.selected(),
  );

  protected choose(value: unknown): void {
    if (typeof value !== 'string' || value.length === 0) return;
    this.selected.set(value);
  }

  protected chooseEnd(value: unknown): void {
    if (typeof value !== 'string' || value.length === 0) return;
    this.selectedEnd.set(value);
  }

  protected onToggleSeparate(value: boolean): void {
    this.separate.set(value);
  }

  protected onSwap(): void {
    if (!this.separate()) return;
    const start = this.selected();
    this.selected.set(this.selectedEnd());
    this.selectedEnd.set(start);
  }

  protected onCancel(): void {
    this.dialogRef.close(null);
  }

  protected onConfirm(): void {
    this.dialogRef.close({
      start: this.selected(),
      end: this.separate() ? this.selectedEnd() : null,
    });
  }
}
