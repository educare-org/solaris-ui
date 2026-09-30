import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisSkeletonComponent } from './skeleton.component';

const meta: Meta<SolarisSkeletonComponent> = {
  component: SolarisSkeletonComponent,
  title: 'SolarisSkeletonComponent',
};
export default meta;

type Story = StoryObj<SolarisSkeletonComponent>;

export const Text: Story = {
  args: {},
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
  } as Partial<SolarisSkeletonComponent>,
};

export const Circular: Story = {
  args: {
    variant: 'circular',
  } as Partial<SolarisSkeletonComponent>,
};

export const Wave: Story = {
  args: {
    animation: 'wave',
  } as Partial<SolarisSkeletonComponent>,
};

export const SizeDensity: Story = {
  args: {
    size: 'lg',
    density: 'comfortable',
  } as Partial<SolarisSkeletonComponent>,
};

export const MultiLine: Story = {
  args: {
    lines: 3,
  } as Partial<SolarisSkeletonComponent>,
};

export const Delayed: Story = {
  args: {
    delay: 600,
  } as Partial<SolarisSkeletonComponent>,
};

export const FastWave: Story = {
  args: {
    animation: 'wave',
    duration: '400ms',
  } as Partial<SolarisSkeletonComponent>,
};

export const AspectRatio: Story = {
  args: {
    variant: 'rectangular',
    width: '100%',
    aspectRatio: '16 / 9',
  } as Partial<SolarisSkeletonComponent>,
};
