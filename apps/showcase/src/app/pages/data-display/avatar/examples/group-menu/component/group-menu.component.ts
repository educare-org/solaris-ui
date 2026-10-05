import { Component, signal } from '@angular/core';

import {
  SolarisAvatarGroupComponent,
  SolarisDropdownMenuComponent,
  SolarisDropdownMenuItemComponent,
  SolarisDropdownMenuTriggerDirective,
  SolarisTranslatePipe,
  type SolarisAvatarGroupUser,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-group-menu-avatar-example',
  imports: [
    SolarisAvatarGroupComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
    SolarisDropdownMenuTriggerDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './group-menu.component.html',
  styleUrls: ['./group-menu.component.scss'],
})
export class GroupMenuAvatarExample {
  protected readonly users: readonly SolarisAvatarGroupUser[] = [
    { userId: 'user-1', name: 'Amelia Davis' },
    { userId: 'user-2', name: 'Dominic Price' },
    { userId: 'user-3', name: 'Elijah Cooper' },
    { userId: 'user-4', name: 'Henry Nguyen' },
    { userId: 'user-5', name: 'Kaique Ferreira' },
  ];

  protected readonly pillOpenedCount = signal(0);

  protected onOverflowClick(): void {
    this.pillOpenedCount.update((count) => count + 1);
  }
}
