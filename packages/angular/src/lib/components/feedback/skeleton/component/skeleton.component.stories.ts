import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisSkeletonComponent } from './skeleton.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisSkeletonComponent> = {
  component: SolarisSkeletonComponent,
  title: 'SolarisSkeletonComponent',
};
export default meta;

type Story = StoryObj<SolarisSkeletonComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/skeleton/gi)).toBeTruthy();
  },
};
