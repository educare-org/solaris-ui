import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisAvatarGroupBadgeComponent } from './avatar-group-badge.component';

const meta: Meta<SolarisAvatarGroupBadgeComponent> = {
  component: SolarisAvatarGroupBadgeComponent,
  title: 'SolarisAvatarGroupBadgeComponent',
};
export default meta;

type Story = StoryObj<SolarisAvatarGroupBadgeComponent>;

const USERS = [
  { userId: 'user-1', name: 'Amelia Davis' },
  { userId: 'user-2', name: 'Dominic Price' },
  { userId: 'user-3', name: 'Elijah Cooper' },
  { userId: 'user-4', name: 'Henry Nguyen' },
  { userId: 'user-5', name: 'Kaique Ferreira' },
];

export const Primary: Story = {
  args: {
    users: USERS.slice(0, 2),
    label: 'Amelia, Dominic',
  } as Partial<SolarisAvatarGroupBadgeComponent>,
};

export const Overflow: Story = {
  args: {
    users: USERS,
    max: 3,
    label: 'Design team',
  } as Partial<SolarisAvatarGroupBadgeComponent>,
};

export const WithLink: Story = {
  args: {
    users: USERS.slice(0, 3),
    label: 'Design team',
    href: '/teams/design',
  } as Partial<SolarisAvatarGroupBadgeComponent>,
};
