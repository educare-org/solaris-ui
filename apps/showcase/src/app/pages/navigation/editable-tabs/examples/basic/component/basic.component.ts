import { Component, signal } from '@angular/core';

import {
  SolarisEditableTabsComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';
import type { SolarisEditableTabData } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-editable-tabs-example',
  imports: [SolarisEditableTabsComponent, SolarisTranslatePipe],
  templateUrl: './basic.component.html',
})
export class BasicEditableTabsExample {
  readonly activeTab = signal<string | number>('tab1');

  readonly tabs = signal<SolarisEditableTabData[]>([
    { value: 'tab1', label: 'Design' },
    { value: 'tab2', label: 'Code' },
    { value: 'tab3', label: 'Issues' },
    { value: 'tab4', label: 'Settings' },
  ]);

  onRename(event: { value: unknown; nextLabel: string }): void {
    this.tabs.update((tabs) =>
      tabs.map((t) =>
        t.value === event.value ? { ...t, label: event.nextLabel } : t,
      ),
    );
  }

  onRemove(event: { value: unknown }): void {
    this.tabs.update((tabs) => tabs.filter((t) => t.value !== event.value));
  }

  onMove(event: {
    value: unknown;
    previousIndex: number;
    nextIndex: number;
  }): void {
    this.tabs.update((tabs) => {
      const updated = [...tabs];
      const [tab] = updated.splice(event.previousIndex, 1);
      updated.splice(event.nextIndex, 0, tab);
      return updated;
    });
  }

  onDefaultChange(_event: unknown): void {
    // no-op
  }
}
