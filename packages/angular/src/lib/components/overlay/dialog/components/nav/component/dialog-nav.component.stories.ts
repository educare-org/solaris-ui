import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisDialogNavComponent } from './dialog-nav.component';

const meta: Meta<SolarisDialogNavComponent> = {
  component: SolarisDialogNavComponent,
  title: 'Overlay/DialogNav',
};

export default meta;

type Story = StoryObj<SolarisDialogNavComponent>;

const sections = [
  { value: 'audiobook', label: 'Create audiobook', icon: 'notebook-text' },
  { value: 'publish', label: 'Publish to ElevenReader', icon: 'up-arrow' },
  { value: 'series', label: 'Create series', icon: 'square-stack' },
];

export const Basic: Story = {
  args: {
    items: sections,
    activeStep: 0,
  },
};

export const WithDescription: Story = {
  args: {
    items: [
      {
        value: 'audiobook',
        label: 'Create audiobook',
        description: 'EPUB, PDF or DOCX upload',
        icon: 'notebook-text',
      },
      {
        value: 'publish',
        label: 'Publish to ElevenReader',
        description: 'Dynamic narration',
        icon: 'up-arrow',
      },
    ],
    activeStep: 1,
  },
};

export const WithError: Story = {
  args: {
    items: [
      { value: 'audiobook', label: 'Create audiobook', icon: 'notebook-text' },
      {
        value: 'publish',
        label: 'Publish to ElevenReader',
        icon: 'up-arrow',
        error: true,
      },
      {
        value: 'series',
        label: 'Create series',
        icon: 'square-stack',
        disabled: true,
      },
    ],
    activeStep: 0,
  },
};

export const WithContent: Story = {
  render: (args) => ({
    props: args,
    template: `
      <solaris-dialog-nav [items]="items" [(activeStep)]="activeStep">
        <ng-template solaris-dialog-nav-content="audiobook">
          <p>Audiobook upload content.</p>
        </ng-template>
        <ng-template solaris-dialog-nav-content="publish">
          <p>Publish content.</p>
        </ng-template>
        <ng-template solaris-dialog-nav-content="series">
          <p>Series content.</p>
        </ng-template>
      </solaris-dialog-nav>
    `,
  }),
  args: {
    items: sections,
    activeStep: 0,
  },
};

export const WithNavFooter: Story = {
  render: (args) => ({
    props: args,
    template: `
      <solaris-dialog-nav [items]="items" [(activeStep)]="activeStep">
        <button type="button" solaris-dialog-nav-footer>New blank project</button>
        <ng-template solaris-dialog-nav-content="audiobook">
          <p>Audiobook upload content.</p>
        </ng-template>
      </solaris-dialog-nav>
    `,
  }),
  args: {
    items: sections,
    activeStep: 0,
  },
};
