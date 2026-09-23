import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDialogActionsComponent } from './dialog-actions.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDialogActionsComponent> = {
  component: SolarisDialogActionsComponent,
  title: 'SolarisDialogActionsComponent',
};
export default meta;

type Story = StoryObj<SolarisDialogActionsComponent>;

export const Primary: Story = {
  args: {
    actions: [{ label: 'Cancel', appearance: 'ghost' }, { label: 'Confirm' }],
  },
};

export const Scrolled: Story = {
  args: {
    actions: [{ label: 'Cancel', appearance: 'ghost' }, { label: 'Confirm' }],
    scrolled: true,
  },
  play: async ({ canvas }) => {
    const actions = canvas
      .getByRole('button', { name: 'Confirm' })
      .closest('solaris-dialog-actions') as HTMLElement;
    await expect(actions?.getAttribute('data-scrolled')).toBe('');
  },
};
