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

export const WithPadding: Story = {
  args: {
    padding: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<solaris-card padding="md">
      <span solaris-card-header>Card Header</span>
      <span solaris-card-content>This is the card content area with descriptive text.</span>
      <span solaris-card-footer>Footer</span>
    </solaris-card>`,
  }),
};

export const Clickable: Story = {
  args: {
    href: '/data-display/card',
    ariaLabel: 'Open the card documentation',
  },
  render: (args) => ({
    props: args,
    template: `<solaris-card href="/data-display/card" ariaLabel="Open the card documentation">
      <span solaris-card-header>Clickable Card</span>
      <span solaris-card-content>The whole surface is a single link.</span>
    </solaris-card>`,
  }),
};

export const MediaStart: Story = {
  args: {
    mediaPosition: 'start',
  },
  render: (args) => ({
    props: args,
    template: `<solaris-card mediaPosition="start">
      <span solaris-card-header>Card Header</span>
      <span solaris-card-content>This is the card content area with descriptive text.</span>
      <span solaris-card-footer>Footer</span>
    </solaris-card>`,
  }),
};
