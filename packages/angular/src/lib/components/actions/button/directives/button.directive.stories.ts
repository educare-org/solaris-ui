import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisButtonDirective } from '../directives/button.directive';

const meta: Meta<SolarisButtonDirective> = {
  component: SolarisButtonDirective,
  title: 'Actions/Button',
  render: (args) => ({
    props: args,
    template: `<button solaris-button [appearance]="appearance" [color]="color" [size]="size" [disabled]="disabled" [loading]="loading">Button</button>`,
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
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<SolarisButtonDirective>;

export const Solid: Story = {
  args: { appearance: 'solid', color: 'primary', size: 'md' },
};
export const Outline: Story = {
  args: { appearance: 'outline', color: 'primary', size: 'md' },
};
export const Ghost: Story = {
  args: { appearance: 'ghost', color: 'primary', size: 'md' },
};
export const Disabled: Story = {
  args: { appearance: 'solid', color: 'primary', size: 'md', disabled: true },
};
export const Loading: Story = {
  args: { appearance: 'solid', color: 'primary', size: 'md', loading: true },
};
export const Small: Story = {
  args: { appearance: 'solid', color: 'primary', size: 'sm' },
};
export const Large: Story = {
  args: { appearance: 'solid', color: 'primary', size: 'lg' },
};
export const Danger: Story = {
  args: { appearance: 'solid', color: 'danger', size: 'md' },
};
