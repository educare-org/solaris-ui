import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisProgressComponent } from './progress.component';

const meta: Meta<SolarisProgressComponent> = {
  component: SolarisProgressComponent,
  title: 'Feedback/SolarisProgressComponent',
  args: {
    size: 'md',
    color: 'primary',
    value: 40,
    indeterminate: false,
    showPercent: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
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
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    indeterminate: {
      control: 'boolean',
    },
    showPercent: {
      control: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<SolarisProgressComponent>;

export const Primary: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Uploading',
  },
};

export const WithPercent: Story = {
  args: {
    showPercent: true,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    color: 'success',
    showPercent: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Loading',
  },
};

export const Danger: Story = {
  args: {
    color: 'danger',
    showPercent: true,
  },
};

export const Custom: Story = {
  args: {
    color: 'custom',
    value: 60,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Set --solaris-progress-custom-color on the host or an ancestor to use your own brand color.',
      },
    },
  },
};
