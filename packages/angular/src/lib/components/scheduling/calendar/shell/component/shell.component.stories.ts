import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisCalendarComponent } from './shell.component';

const meta: Meta<SolarisCalendarComponent> = {
  title: 'Scheduling/Calendar Shell',
  component: SolarisCalendarComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SolarisCalendarComponent>;

export const Month: Story = {
  args: {
    locale: 'en-US',
    focusedDate: '2026-10-15',
    view: 'month',
    events: [
      {
        id: 'standup',
        kind: 'event',
        title: 'Team standup',
        start: '2026-10-15T09:00:00-03:00',
        end: '2026-10-15T09:30:00-03:00',
        color: 'info',
      },
    ],
  },
};

export const NarrowFallback: Story = {
  args: {
    locale: 'en-US',
    focusedDate: '2026-10-15',
    view: 'month',
    responsiveFallback: 'schedule',
  },
};
