import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisSpinnerComponent } from './spinner.component';

const meta: Meta<SolarisSpinnerComponent> = {
  component: SolarisSpinnerComponent,
  title: 'Feedback/SolarisSpinnerComponent',
  args: {
    variant: 'ring',
    size: 'md',
    density: undefined,
    color: 'primary',
    speed: 'normal',
    easing: 'linear',
    backdrop: false,
    overlay: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['ring', 'stacked', 'progress'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    density: {
      control: 'select',
      options: ['compact', 'normal', 'comfortable'],
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
    overlay: {
      control: 'boolean',
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    showPercent: {
      control: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<SolarisSpinnerComponent>;

export const Primary: Story = {
  args: {},
};

export const Stacked: Story = {
  args: {
    variant: 'stacked',
  },
};

export const Progress: Story = {
  args: {
    variant: 'progress',
    value: 40,
    showPercent: true,
  },
};

export const ProgressWithDetails: Story = {
  args: {
    variant: 'progress',
    value: 60,
    label: 'Uploading',
    showPercent: true,
    description: ['File size: 12MB', 'Time left: 30s'],
  },
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

export const Overlay: Story = {
  args: {
    overlay: true,
    label: 'Saving…',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Render inside a [solarisLoadingZone] container to center the spinner over a busy region (form, card) while its fields stay inert.',
      },
    },
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
