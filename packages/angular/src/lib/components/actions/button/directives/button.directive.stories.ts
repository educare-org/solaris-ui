import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisButtonDirective } from '../directives/button.directive';

const meta: Meta<SolarisButtonDirective> = {
  component: SolarisButtonDirective,
  title: 'Actions/Button',
  render: (args) => ({
    props: args,
    template: `<button solaris-button [appearance]="appearance" [color]="color" [density]="density" [disabled]="disabled" [loading]="loading">Button</button>`,
  }),
  argTypes: {
    appearance: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'tonal', 'surface'],
    },
    color: {
      control: 'select',
      options: [
        'neutral',
        'primary',
        'success',
        'warning',
        'danger',
        'info',
        'custom',
      ],
    },
    density: {
      control: 'select',
      options: ['compact', 'normal', 'comfortable'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<SolarisButtonDirective>;

export const Solid: Story = {
  args: { appearance: 'solid', color: 'primary', density: 'normal' },
};
export const Outline: Story = {
  args: { appearance: 'outline', color: 'primary', density: 'normal' },
};
export const Ghost: Story = {
  args: { appearance: 'ghost', color: 'primary', density: 'normal' },
};
export const Disabled: Story = {
  args: {
    appearance: 'solid',
    color: 'primary',
    density: 'normal',
    disabled: true,
  },
};
export const Loading: Story = {
  args: {
    appearance: 'solid',
    color: 'primary',
    density: 'normal',
    loading: true,
  },
};
export const Compact: Story = {
  args: { appearance: 'solid', color: 'primary', density: 'compact' },
};
export const Comfortable: Story = {
  args: { appearance: 'solid', color: 'primary', density: 'comfortable' },
};
export const Danger: Story = {
  args: { appearance: 'solid', color: 'danger', density: 'normal' },
};
