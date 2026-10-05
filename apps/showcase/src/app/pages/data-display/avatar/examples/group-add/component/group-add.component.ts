import { Component, signal } from '@angular/core';

import {
  SolarisAvatarGroupComponent,
  SolarisTranslatePipe,
  type SolarisAvatarGroupUser,
} from '@solaris-ui/angular';

const FIRST_NAMES = [
  'Dominic',
  'Elijah',
  'Henry',
  'Sofia',
  'Rafael',
  'Camila',
  'Tiago',
  'Beatriz',
  'Gabriel',
  'Laura',
] as const;

const LAST_NAMES = [
  'Price',
  'Cooper',
  'Nguyen',
  'Almeida',
  'Mendes',
  'Rocha',
  'Santos',
  'Lima',
  'Costa',
  'Pereira',
] as const;

const MAX_MEMBERS = 6;

@Component({
  standalone: true,
  selector: 'app-group-add-avatar-example',
  imports: [SolarisAvatarGroupComponent, SolarisTranslatePipe],
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.scss'],
})
export class GroupAddAvatarExample {
  protected readonly maxMembers = MAX_MEMBERS;
  protected readonly users = signal<readonly SolarisAvatarGroupUser[]>([
    { userId: 'user-amelia', name: 'Amelia Davis' },
    { userId: 'user-kaique', name: 'Kaique Ferreira' },
  ]);

  private memberCounter = 0;

  protected addRandom(): void {
    if (this.users().length >= MAX_MEMBERS) return;
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    this.memberCounter += 1;
    const user: SolarisAvatarGroupUser = {
      userId: `user-random-${this.memberCounter}-${first}-${last}`,
      name: `${first} ${last}`,
    };
    this.users.update((users) => [...users, user]);
  }
}
