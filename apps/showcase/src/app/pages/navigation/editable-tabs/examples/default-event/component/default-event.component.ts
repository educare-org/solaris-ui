import { Component, signal } from '@angular/core';

import { SolarisEditableTabsComponent, SolarisTranslatePipe } from '@solaris-ui/angular';
import type { SolarisEditableTabData } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-editable-tabs-default-event-example',
  imports: [SolarisEditableTabsComponent, SolarisTranslatePipe],
  templateUrl: './default-event.component.html',
})
export class EditableTabsDefaultEventExample {
  readonly activeTab = signal<string | number>('tab2');
  readonly defaultTab = signal<string | number>('tab1');

  readonly tabs: SolarisEditableTabData[] = [
    { value: 'tab1', label: 'Overview' },
    { value: 'tab2', label: 'Details' },
    { value: 'tab3', label: 'Activity' },
  ];

  onDefaultChange(event: { value: unknown }): void {
    this.defaultTab.set(event.value as string | number);
  }
}
