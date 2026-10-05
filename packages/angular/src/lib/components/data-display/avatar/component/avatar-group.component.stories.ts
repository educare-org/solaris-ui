import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisAvatarGroupComponent } from './avatar-group.component';

const meta: Meta<SolarisAvatarGroupComponent> = {
  component: SolarisAvatarGroupComponent,
  title: 'SolarisAvatarGroupComponent',
};
export default meta;

type Story = StoryObj<SolarisAvatarGroupComponent>;

const USERS = [
  { userId: 'user-1', name: 'Amelia Davis' },
  { userId: 'user-2', name: 'Dominic Price' },
  { userId: 'user-3', name: 'Elijah Cooper' },
  { userId: 'user-4', name: 'Henry Nguyen' },
  { userId: 'user-5', name: 'Kaique Ferreira' },
];

export const Primary: Story = {
  args: {
    users: USERS.slice(0, 3),
  } as Partial<SolarisAvatarGroupComponent>,
};

export const Truncated: Story = {
  args: {
    users: USERS,
    max: 4,
  } as Partial<SolarisAvatarGroupComponent>,
};

export const WithStatus: Story = {
  args: {
    users: [
      { ...USERS[0], status: 'online', showStatus: true },
      { ...USERS[1], status: 'away', showStatus: true },
      { ...USERS[2], status: 'busy', showStatus: true },
    ],
  } as Partial<SolarisAvatarGroupComponent>,
};
