import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisSpinnerComponent } from './spinner.component';

const meta: Meta<SolarisSpinnerComponent> = {
  component: SolarisSpinnerComponent,
  title: 'Feedback/SolarisSpinnerComponent',
  args: {
    size: 'md',
    color: 'primary',
    speed: 'normal',
    easing: 'linear',
    backdrop: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
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
    speed: {
      control: 'select',
      options: ['slow', 'normal', 'fast'],
    },
    easing: {
      control: 'select',
      options: [
        'linear',
        'ease',
        'ease-in',
        'ease-out',
        'ease-in-out',
        'spring',
      ],
    },
    backdrop: {
      control: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<SolarisSpinnerComponent>;

export const Primary: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Loading...',
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

export const FullScreen: Story = {
  args: {
    size: 'xl',
    label: 'Loading application...',
  },
};

export const Backdrop: Story = {
  args: {
    size: 'xl',
    backdrop: true,
    label: 'Loading application...',
  },
};

export const Fast: Story = {
  args: {
    speed: 'fast',
  },
};

export const Slow: Story = {
  args: {
    speed: 'slow',
  },
};

export const SpringEasing: Story = {
  args: {
    easing: 'spring',
  },
};

export const Success: Story = {
  args: {
    color: 'success',
  },
};

export const Custom: Story = {
  args: {
    color: 'custom',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Set --solaris-spinner-custom-color on the host or an ancestor to use your own brand color.',
      },
    },
  },
};
