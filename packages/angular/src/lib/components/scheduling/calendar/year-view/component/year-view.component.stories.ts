import type { Meta, StoryObj } from '@storybook/angular';

import type { SolarisCalendarEvent } from '../../model/calendar.types';
import { SolarisCalendarYearViewComponent } from './year-view.component';

const EVENTS: SolarisCalendarEvent[] = [
  {
    id: 'standup',
    kind: 'event',
    title: 'Team standup',
    start: '2026-10-15T09:00:00-03:00',
    end: '2026-10-15T09:30:00-03:00',
    color: 'info',
    recurrence: { freq: 'weekly', byWeekday: [4], count: 8 },
  },
  {
    id: 'planning',
    kind: 'event',
    title: 'Sprint planning',
    start: '2026-03-10T14:00:00-03:00',
    end: '2026-03-10T16:00:00-03:00',
    color: 'primary',
  },
  {
    id: 'offsite',
    kind: 'event',
    title: 'Design offsite',
    start: '2026-07-20',
    end: '2026-07-22',
    allDay: true,
    color: 'accent',
  },
];

const meta: Meta<SolarisCalendarYearViewComponent> = {
  component: SolarisCalendarYearViewComponent,
  title: 'Scheduling/Year View',
};

export default meta;

type Story = StoryObj<SolarisCalendarYearViewComponent>;

export const Default: Story = {
  args: {
    locale: 'en-US',
    timeZone: 'America/Sao_Paulo',
    focusedDate: '2026-10-15',
    events: EVENTS,
    tasks: [
      {
        id: 'report',
        kind: 'task',
        title: 'Send status report',
        due: '2026-10-16',
        completed: false,
      },
    ],
    holidays: [{ date: '2026-10-12', name: 'Nossa Senhora Aparecida' }],
  },
};

export const Compact: Story = {
  args: {
    ...Default.args,
    density: 'compact',
    size: 'sm',
  },
};

export const WeekdaysOnly: Story = {
  args: {
    ...Default.args,
    showWeekends: false,
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'lg',
  },
};

export const Portuguese: Story = {
  args: {
    ...Default.args,
    locale: 'pt-BR',
    weekStartsOn: 1,
  },
};

export const Spanish: Story = {
  args: {
    ...Default.args,
    locale: 'es',
  },
};
