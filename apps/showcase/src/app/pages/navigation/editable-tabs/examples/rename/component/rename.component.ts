import { Component, signal } from '@angular/core';

import { SolarisEditableTabsComponent, SolarisTranslatePipe } from '@solaris-ui/angular';
import type { SolarisEditableTabData } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-editable-tabs-rename-example',
  imports: [SolarisEditableTabsComponent, SolarisTranslatePipe],
  templateUrl: './rename.component.html',
})
export class EditableTabsRenameExample {
  readonly activeTab = signal<string | number>('home');

  readonly tabs: SolarisEditableTabData[] = [
    { value: 'home', label: 'Home' },
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'reports', label: 'Reports' },
    { value: 'analytics', label: 'Analytics' },
  ];

  onRename(event: { value: unknown; nextLabel: string }): void {
    const tab = this.tabs.find((t) => t.value === event.value);
    if (tab) tab.label = event.nextLabel;
  }
}
