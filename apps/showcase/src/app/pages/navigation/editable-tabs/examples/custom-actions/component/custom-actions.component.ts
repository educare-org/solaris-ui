import { Component, signal } from '@angular/core';

import { SolarisEditableTabsComponent, SolarisTranslatePipe } from '@solaris-ui/angular';
import type { SolarisEditableTabData, SolarisEditableTabAction } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-editable-tabs-custom-actions-example',
  imports: [SolarisEditableTabsComponent, SolarisTranslatePipe],
  templateUrl: './custom-actions.component.html',
})
export class EditableTabsCustomActionsExample {
  readonly activeTab = signal<string | number>('inbox');
  readonly lastAction = signal('');

  readonly customActions: SolarisEditableTabAction[] = [
    { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
    { id: 'export', label: 'Export', icon: 'export' },
    { id: 'archive', label: 'Archive', icon: 'archives', color: 'warning' },
  ];

  readonly tabs: SolarisEditableTabData[] = [
    { value: 'inbox', label: 'Inbox', customActions: this.customActions },
    { value: 'sent', label: 'Sent', customActions: this.customActions },
    { value: 'drafts', label: 'Drafts', customActions: this.customActions },
  ];

  onAction(event: { actionId: string }): void {
    this.lastAction.set(`Action: ${event.actionId}`);
  }
}
