import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisSparklineComponent } from './sparkline.component';

const meta: Meta<SolarisSparklineComponent> = {
  title: 'Data Display/Sparkline',
  component: SolarisSparklineComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SolarisSparklineComponent>;

export const Rising: Story = {
  args: {
    points: [3, 5, 4, 8, 7, 10],
    ariaLabel: 'Revenue trend, rising',
    positiveIsGood: true,
  },
};

export const Falling: Story = {
  args: {
    points: [10, 8, 9, 5, 4, 3],
    ariaLabel: 'Churn trend, falling',
    positiveIsGood: true,
  },
};

export const FallingIsGood: Story = {
  args: {
    points: [10, 8, 9, 5, 4, 3],
    ariaLabel: 'Error rate trend, falling',
    positiveIsGood: false,
  },
};

export const WithGaps: Story = {
  args: {
    points: [3, null, 5, 4, undefined, 8],
    ariaLabel: 'Attendance trend with gaps',
    positiveIsGood: true,
  },
};
