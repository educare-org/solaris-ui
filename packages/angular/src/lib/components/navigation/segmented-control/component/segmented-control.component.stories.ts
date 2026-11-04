import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisSegmentedControlComponent } from './segmented-control.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisSegmentedControlComponent> = {
  component: SolarisSegmentedControlComponent,
  title: 'SolarisSegmentedControlComponent',
  render: (args) => ({
    props: args,
    template: `
      <solaris-segmented-control
        [size]="size"
        [density]="density"
        [fullWidth]="fullWidth"
        [value]="value"
      >
        <solaris-segmented-item value="monthly" label="Mensal" />
        <solaris-segmented-item value="yearly" label="Anual" />
      </solaris-segmented-control>
    `,
  }),
};
export default meta;

type Story = StoryObj<SolarisSegmentedControlComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/segmented-control/gi)).toBeTruthy();
  },
};

export const Small: Story = {
  args: { size: 'sm', value: 'monthly' },
};

export const Medium: Story = {
  args: { size: 'md', value: 'monthly' },
};

export const Large: Story = {
  args: { size: 'lg', value: 'monthly' },
};

export const FullWidth: Story = {
  args: { size: 'lg', fullWidth: true, value: 'monthly' },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector(
      'solaris-segmented-control',
    ) as HTMLElement;
    await expect(host?.getAttribute('data-full-width')).not.toBeNull();
  },
};
