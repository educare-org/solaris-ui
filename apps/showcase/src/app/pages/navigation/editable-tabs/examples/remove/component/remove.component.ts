import { Component, signal } from '@angular/core';

import { SolarisEditableTabsComponent, SolarisTranslatePipe } from '@solaris-ui/angular';
import type { SolarisEditableTabData } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-editable-tabs-remove-example',
  imports: [SolarisEditableTabsComponent, SolarisTranslatePipe],
  templateUrl: './remove.component.html',
})
export class EditableTabsRemoveExample {
  readonly activeTab = signal<string | number>('spring');

  readonly tabs: SolarisEditableTabData[] = [
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'autumn', label: 'Autumn' },
    { value: 'winter', label: 'Winter' },
  ];

  onRemove(event: { value: unknown; index: number; wasActive: boolean }): void {
    this.tabs.splice(event.index, 1);
    if (event.wasActive && this.tabs.length > 0) {
      const newIndex = Math.min(event.index, this.tabs.length - 1);
      this.activeTab.set(this.tabs[newIndex].value as string | number);
    }
  }
}
