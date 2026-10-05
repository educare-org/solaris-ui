import { Component, input } from '@angular/core';

import { SolarisAvatarGroupComponent } from '@solaris-ui/angular';
import type { SolarisAvatarGroupUser } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-group-avatar-example',
  imports: [SolarisAvatarGroupComponent],
  templateUrl: './group.component.html',
})
export class GroupAvatarExample {
  readonly max = input<number>(4);
  readonly users = input<readonly SolarisAvatarGroupUser[]>([
    { userId: 'user-1', name: 'Amelia Davis' },
    { userId: 'user-2', name: 'Dominic Price' },
    { userId: 'user-3', name: 'Elijah Cooper' },
    { userId: 'user-4', name: 'Henry Nguyen' },
    { userId: 'user-5', name: 'Kaique Ferreira' },
  ]);
}
