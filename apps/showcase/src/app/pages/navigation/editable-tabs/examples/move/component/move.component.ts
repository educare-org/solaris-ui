import { Component, signal } from '@angular/core';

import {
  SolarisEditableTabsComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';
import type { SolarisEditableTabData } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-editable-tabs-move-example',
  imports: [SolarisEditableTabsComponent, SolarisTranslatePipe],
  templateUrl: './move.component.html',
})
export class EditableTabsMoveExample {
  readonly activeTab = signal<string | number>('todo');

  tabs: SolarisEditableTabData[] = [
    { value: 'todo', label: 'To Do' },
    { value: 'progress', label: 'In Progress' },
    { value: 'review', label: 'In Review' },
    { value: 'done', label: 'Done' },
  ];

  onMove(event: {
    value: unknown;
    previousIndex: number;
    nextIndex: number;
  }): void {
    const tab = this.tabs.splice(event.previousIndex, 1)[0];
    this.tabs.splice(event.nextIndex, 0, tab);
    this.tabs = [...this.tabs];
  }
}
