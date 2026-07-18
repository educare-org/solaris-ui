import { Component, signal } from '@angular/core';

import { SolarisEditableTabsComponent } from '@solaris-ui/angular';
import type { SolarisEditableTabData } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-editable-tabs-icons-badges-example',
  imports: [SolarisEditableTabsComponent],
  templateUrl: './icons-and-badges.component.html',
})
export class EditableTabsIconsBadgesExample {
  readonly activeTab = signal<string | number>('code');

  readonly tabs: SolarisEditableTabData[] = [
    { value: 'code', label: 'Code', icon: 'code', badge: 12 },
    { value: 'issues', label: 'Issues', icon: 'issue', badge: 5 },
    { value: 'pull-requests', label: 'PRs', icon: 'pull-request', badge: 3 },
    { value: 'notifications', label: 'Notifications', icon: 'notification', badge: 99 },
  ];
}
