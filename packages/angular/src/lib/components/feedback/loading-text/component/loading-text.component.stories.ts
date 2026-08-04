import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisLoadingTextComponent } from './loading-text.component';

const meta: Meta<SolarisLoadingTextComponent> = {
  component: SolarisLoadingTextComponent,
  title: 'Feedback/SolarisLoadingTextComponent',
  args: {
    size: 'md',
    color: 'primary',
    speed: 'normal',
    text: 'Loading...',
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
    text: {
      control: 'text',
    },
  },
};
export default meta;

type Story = StoryObj<SolarisLoadingTextComponent>;

export const Primary: Story = {
  args: {},
};

export const Neutral: Story = {
  args: {
    color: 'neutral',
  },
};

export const WithText: Story = {
  args: {
    text: 'Uploading your report...',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'xl',
    text: 'Loading',
  },
};

export const Slow: Story = {
  args: {
    speed: 'slow',
  },
};

export const Fast: Story = {
  args: {
    speed: 'fast',
  },
};

export const Danger: Story = {
  args: {
    color: 'danger',
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
          'Set --solaris-loading-text-custom-color on the host or an ancestor to use your own brand color.',
      },
    },
  },
};
