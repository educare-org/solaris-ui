import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisImageEditorComponent } from './image-editor.component';

const meta: Meta<SolarisImageEditorComponent> = {
  component: SolarisImageEditorComponent,
  title: 'SolarisImageEditorComponent',
};

export default meta;
type Story = StoryObj<SolarisImageEditorComponent>;

export const Inline: Story = {
  args: {
    image: 'https://picsum.photos/800/600',
  },
};
