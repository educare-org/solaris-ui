import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDividerComponent } from './divider.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDividerComponent> = {
  component: SolarisDividerComponent,
  title: 'SolarisDividerComponent',
};
export default meta;

type Story = StoryObj<SolarisDividerComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/divider/gi)).toBeTruthy();
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Section',
  },
};

export const WithLabelStart: Story = {
  args: {
    label: 'Section',
    textPosition: 'start',
  },
};

export const WithLabelEnd: Story = {
  args: {
    label: 'Section',
    textPosition: 'end',
  },
};
