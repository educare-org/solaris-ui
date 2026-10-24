import { Component, input, signal } from '@angular/core';

import {
  SolarisAvatarGroupComponent,
  SolarisTranslatePipe,
  type SolarisAvatarGroupMemberEvent,
  type SolarisAvatarGroupUser,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-group-avatar-example',
  imports: [SolarisAvatarGroupComponent, SolarisTranslatePipe],
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupAvatarExample {
  readonly max = input<number>(4);
  readonly users = input<readonly SolarisAvatarGroupUser[]>([
    {
      userId: 'user-1',
      name: 'Amelia Davis',
      tooltip: 'Amelia Davis',
      actionAriaLabel: 'Open Amelia Davis profile',
    },
    {
      userId: 'user-2',
      name: 'Dominic Price',
      tooltip: 'Dominic Price',
      actionAriaLabel: 'Open Dominic Price profile',
    },
    {
      userId: 'user-3',
      name: 'Elijah Cooper',
      tooltip: 'Elijah Cooper',
      actionAriaLabel: 'Open Elijah Cooper profile',
    },
    {
      userId: 'user-4',
      name: 'Henry Nguyen',
      tooltip: 'Henry Nguyen',
      actionAriaLabel: 'Open Henry Nguyen profile',
    },
    {
      userId: 'user-5',
      name: 'Kaique Ferreira',
      tooltip: 'Kaique Ferreira',
      actionAriaLabel: 'Open Kaique Ferreira profile',
    },
  ]);

  protected readonly lastMemberClicked = signal<string | undefined>(undefined);

  protected onMemberClick(event: SolarisAvatarGroupMemberEvent): void {
    this.lastMemberClicked.set(event.user.name);
  }
}
