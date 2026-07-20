import { Component, signal } from '@angular/core';

import { SolarisEditableTabsComponent } from '@solaris-ui/angular';
import type { SolarisEditableTabData } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-editable-tabs-compact-example',
  imports: [SolarisEditableTabsComponent],
  templateUrl: './compact.component.html',
})
export class EditableTabsCompactExample {
  readonly activeTab = signal<string | number>('t1');

  readonly tabs: SolarisEditableTabData[] = [
    { value: 't1', label: 'Files' },
    { value: 't2', label: 'Images' },
    { value: 't3', label: 'Code' },
    { value: 't4', label: 'Docs' },
  ];
}
