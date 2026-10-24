import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisAvatarProfileComponent } from './avatar-profile.component';

const meta: Meta<SolarisAvatarProfileComponent> = {
  component: SolarisAvatarProfileComponent,
  title: 'SolarisAvatarProfileComponent',
};
export default meta;

type Story = StoryObj<SolarisAvatarProfileComponent>;

export const Primary: Story = {
  args: {
    name: 'Amelia Davis',
    title: 'Amelia Davis',
    subtitle: 'davis@example.com',
  } as Partial<SolarisAvatarProfileComponent>,
};

export const WithBadge: Story = {
  args: {
    name: 'Amelia Davis',
    title: 'Amelia Davis',
    subtitle: 'davis@example.com',
    badgeText: 'PRO',
    count: 2,
    status: 'online',
    showStatus: true,
    verified: true,
  } as Partial<SolarisAvatarProfileComponent>,
};

export const Compact: Story = {
  args: {
    name: 'Amelia Davis',
    title: 'Amelia Davis',
    subtitle: 'davis@example.com',
    compact: true,
  } as Partial<SolarisAvatarProfileComponent>,
};

export const WithLink: Story = {
  args: {
    name: 'Amelia Davis',
    title: 'Amelia Davis',
    subtitle: 'davis@example.com',
    badgeText: 'PRO',
    href: '/users/amelia-davis',
  } as Partial<SolarisAvatarProfileComponent>,
};

export const CompactAction: Story = {
  args: {
    name: 'Amelia Davis',
    title: 'Amelia Davis',
    subtitle: 'davis@example.com',
    compact: true,
    actionAriaLabel: 'Open profile',
  } as Partial<SolarisAvatarProfileComponent>,
};
