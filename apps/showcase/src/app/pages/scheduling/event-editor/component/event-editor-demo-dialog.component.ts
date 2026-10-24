import { Component, inject, signal } from '@angular/core';

import {
  SOLARIS_DIALOG_DATA,
  SOLARIS_DIALOG_REF,
  SolarisCalendarEventEditorComponent,
  type SolarisCalendarEvent,
  type SolarisCalendarTask,
  type SolarisDialogRef,
  type SolarisEventDeleteRequest,
  type SolarisEventSaveRequest,
} from '@solaris-ui/angular';

export interface EventEditorDemoData {
  event: SolarisCalendarEvent | SolarisCalendarTask;
  occurrenceStart: string | null;
  timeZone: string;
  locale: string;
}

export interface EventEditorDemoResult {
  kind: 'save' | 'delete' | 'cancel';
  event?: SolarisCalendarEvent | SolarisCalendarTask;
  request?: SolarisEventDeleteRequest;
  saveRequest?: SolarisEventSaveRequest;
}

const DEMO_TIME_ZONES = [
  'America/Sao_Paulo',
  'America/New_York',
  'Europe/Lisbon',
];

@Component({
  standalone: true,
  imports: [SolarisCalendarEventEditorComponent],
  template: `
    <solaris-calendar-event-editor
      [event]="data.event"
      [locale]="data.locale"
      [timeZone]="timeZone()"
      (eventCancel)="onCancel()"
      (eventSave)="onSave($event)"
      (eventDelete)="onDelete($event)"
      [occurrenceStart]="data.occurrenceStart"
      (timeZoneChange)="onTimeZoneChange($event)"
    />
  `,
})
export class EventEditorDemoDialogComponent {
  protected readonly data = inject(SOLARIS_DIALOG_DATA) as EventEditorDemoData;
  private readonly dialogRef = inject(
    SOLARIS_DIALOG_REF,
  ) as SolarisDialogRef<EventEditorDemoResult>;

  protected readonly timeZone = signal(this.data.timeZone);

  protected onSave(request: SolarisEventSaveRequest): void {
    this.dialogRef.close({ kind: 'save', saveRequest: request });
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
      return;
    }
    const current = DEMO_TIME_ZONES.indexOf(this.timeZone());
    const next =
      DEMO_TIME_ZONES[(current + 1) % DEMO_TIME_ZONES.length] ??
      DEMO_TIME_ZONES[0];
    this.timeZone.set(next);
  }
}
