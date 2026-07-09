import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideSolarisIcons } from '../provider/provide-solaris-icons';
import { SolarisIconComponent } from './solaris-icon.component';

const meta: Meta<SolarisIconComponent> = {
  component: SolarisIconComponent,
  title: 'Foundation/Icon',
  decorators: [
    applicationConfig({
      providers: [provideSolarisIcons()],
    }),
  ],
  argTypes: {
    name: {
      control: 'select',
      options: ['star', 'heart', 'search', 'settings', 'user', 'home', 'info', 'alert', 'check', 'close', 'menu', 'arrow-down', 'arrow-up', 'arrow-left', 'arrow-right', 'external-link', 'copy', 'eye', 'eye-off', 'sun', 'moon'],
    },
  },
};

export default meta;
type Story = StoryObj<SolarisIconComponent>;

export const Default: Story = {
  args: {
    name: 'search',
    decorative: false,
    ariaLabel: 'Search',
  },
};

export const Decorative: Story = {
  args: {
    name: 'heart',
    decorative: true,
  },
};

export const WithLabel: Story = {
  args: {
    name: 'settings',
    ariaLabel: 'Settings',
    decorative: false,
  },
};

export const AlertIcon: Story = {
  args: {
    name: 'alert',
    ariaLabel: 'Alert',
  },
};

export const CloseIcon: Story = {
  args: {
    name: 'close',
    ariaLabel: 'Close',
  },
};