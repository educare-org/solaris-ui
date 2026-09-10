import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisCardComponent } from './card.component';

const meta: Meta<SolarisCardComponent> = {
  component: SolarisCardComponent,
  title: 'Data Display/Card',
  render: (args) => ({
    props: args,
    template: `<solaris-card>
      <span solaris-card-header>Card Header</span>
      <span solaris-card-content>This is the card content area with descriptive text.</span>
      <span solaris-card-footer>Footer</span>
    </solaris-card>`,
  }),
};
export default meta;

type Story = StoryObj<SolarisCardComponent>;

export const Basic: Story = {};

export const MediaStart: Story = {
  args: {
    mediaPosition: 'start',
  },
};
