import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';
import { SolarisAvatarComponent } from './avatar.component';

const meta: Meta<SolarisAvatarComponent> = {
  component: SolarisAvatarComponent,
  title: 'SolarisAvatarComponent',
};
export default meta;

type Story = StoryObj<SolarisAvatarComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {
    name: 'Amelia Davis',
  } as Partial<SolarisAvatarComponent>,
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/AD/gi)).toBeTruthy();
  },
};

export const Generative: Story = {
  args: {
    name: 'Amelia Davis',
    userId: 'user-amelia',
  } as Partial<SolarisAvatarComponent>,
};

export const Photo: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128',
    name: 'Amelia Davis',
  } as Partial<SolarisAvatarComponent>,
};

export const Status: Story = {
  args: {
    name: 'Amelia Davis',
    status: 'online',
    showStatus: true,
  } as Partial<SolarisAvatarComponent>,
};

export const Dnd: Story = {
  args: {
    name: 'Amelia Davis',
    status: 'dnd',
    showStatus: true,
  } as Partial<SolarisAvatarComponent>,
};

export const OffHours: Story = {
  args: {
    name: 'Amelia Davis',
    status: 'online',
    showStatus: true,
    offHoursOverride: true,
  } as Partial<SolarisAvatarComponent>,
};

export const Count: Story = {
  args: {
    name: 'Amelia Davis',
    count: 3,
  } as Partial<SolarisAvatarComponent>,
};

export const CountCapped: Story = {
  args: {
    name: 'Amelia Davis',
    count: 103,
  } as Partial<SolarisAvatarComponent>,
};

export const Verified: Story = {
  args: {
    name: 'Amelia Davis',
    verified: true,
  } as Partial<SolarisAvatarComponent>,
};

export const Loading: Story = {
  args: {
    name: 'Amelia Davis',
    loading: true,
  } as Partial<SolarisAvatarComponent>,
};

export const Active: Story = {
  args: {
    name: 'Amelia Davis',
    active: true,
  } as Partial<SolarisAvatarComponent>,
};

export const Empty: Story = {
  args: {
    empty: true,
    emptyAriaLabel: 'Add member',
  } as Partial<SolarisAvatarComponent>,
};
