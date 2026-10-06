import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisPaginationComponent } from './pagination.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisPaginationComponent> = {
  component: SolarisPaginationComponent,
  title: 'SolarisPaginationComponent',
};
export default meta;

type Story = StoryObj<SolarisPaginationComponent>;

export const Primary: Story = {
  args: {
    pageIndex: 0,
    pageSize: 10,
    total: 95,
  } as Partial<SolarisPaginationComponent>,
};

export const UnknownTotal: Story = {
  args: {
    pageIndex: 2,
    pageSize: 10,
    hasMore: true,
  } as Partial<SolarisPaginationComponent>,
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/21–30/gi)).toBeTruthy();
  },
};
