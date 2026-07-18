import { Component, signal } from '@angular/core';

import { SolarisEditableTabsComponent, SolarisTranslatePipe } from '@solaris-ui/angular';
import type { SolarisEditableTabData } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-editable-tabs-locked-example',
  imports: [SolarisEditableTabsComponent, SolarisTranslatePipe],
  templateUrl: './locked.component.html',
})
export class EditableTabsLockedExample {
  readonly activeTab = signal<string | number>('general');

  readonly tabs: SolarisEditableTabData[] = [
    { value: 'general', label: 'General', locked: true },
    { value: 'security', label: 'Security' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'privacy', label: 'Privacy' },
  ];
}
