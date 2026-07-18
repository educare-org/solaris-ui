import { Component, signal } from '@angular/core';

import {
  SolarisEditableTabsComponent,
  type SolarisEditableTabData,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-editable-tabs-vertical-example',
  imports: [SolarisEditableTabsComponent],
  templateUrl: './vertical.component.html',
})
export class EditableTabsVerticalExample {
  readonly activeTab = signal<string | number>('profile');

  readonly tabs: SolarisEditableTabData[] = [
    { value: 'profile', label: 'Profile', icon: 'user' },
    { value: 'security', label: 'Security', icon: 'security' },
    { value: 'notifications', label: 'Notifications', icon: 'notification' },
    { value: 'billing', label: 'Billing', icon: 'building' },
  ];
}
