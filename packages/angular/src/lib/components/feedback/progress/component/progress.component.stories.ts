import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisProgressComponent } from './progress.component';

const meta: Meta<SolarisProgressComponent> = {
  component: SolarisProgressComponent,
  title: 'Feedback/SolarisProgressComponent',
  args: {
    size: 'md',
    density: undefined,
    color: 'primary',
    status: 'active',
    value: 40,
    indeterminate: false,
    striped: false,
    animatedStripes: false,
    showPercent: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    density: {
      control: 'select',
      options: ['compact', 'normal', 'comfortable'],
    },
    status: {
      control: 'select',
      options: ['active', 'success', 'exception'],
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
    striped: {
      control: 'boolean',
    },
    animatedStripes: {
      control: 'boolean',
    },
    bufferValue: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
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

export const Success: Story = {
  args: {
    status: 'success',
    value: 100,
    showPercent: true,
  },
};

export const Exception: Story = {
  args: {
    status: 'exception',
    value: 65,
    label: 'Upload failed',
    showPercent: true,
  },
};

export const Striped: Story = {
  args: {
    striped: true,
    value: 55,
  },
};

export const AnimatedStripes: Story = {
  args: {
    animatedStripes: true,
    value: 55,
  },
};

export const WithBuffer: Story = {
  args: {
    value: 40,
    bufferValue: 70,
    label: 'Buffering',
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
