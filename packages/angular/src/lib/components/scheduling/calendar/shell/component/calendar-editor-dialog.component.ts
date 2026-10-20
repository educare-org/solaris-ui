import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  SOLARIS_DIALOG_DATA,
  SOLARIS_DIALOG_REF,
  type SolarisDialogRef,
} from '../../../../overlay/dialog';
import { SolarisCalendarEventEditorComponent } from '../../event-editor/component/event-editor.component';
import type {
  SolarisCalendarEvent,
  SolarisCalendarTask,
} from '../../model/calendar.types';
import type { SolarisEventDeleteRequest } from '../../event-editor/model/event-editor.types';
import type {
  SolarisCalendarEditorDialogData,
  SolarisCalendarEditorDialogResult,
} from '../model/shell.types';

@Component({
  selector: 'solaris-calendar-editor-dialog',
  standalone: true,
  imports: [SolarisCalendarEventEditorComponent],
  templateUrl: './calendar-editor-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolarisCalendarEditorDialogComponent {
  protected readonly data = inject(
    SOLARIS_DIALOG_DATA,
  ) as SolarisCalendarEditorDialogData;
  private readonly dialogRef = inject(
    SOLARIS_DIALOG_REF,
  ) as SolarisDialogRef<SolarisCalendarEditorDialogResult>;

  protected readonly timeZone = signal(this.data.timeZone);

  protected onSave(event: SolarisCalendarEvent | SolarisCalendarTask): void {
    this.dialogRef.close({ kind: 'save', event });
  }

  protected onDelete(request: SolarisEventDeleteRequest): void {
    this.dialogRef.close({ kind: 'delete', request });
  }

  protected onCancel(): void {
    this.dialogRef.close({ kind: 'cancel' });
  }

  protected onTimeZoneChange(zone: string): void {
    if (typeof zone === 'string' && zone.length > 0) {
      this.timeZone.set(zone);
    }
  }
}
