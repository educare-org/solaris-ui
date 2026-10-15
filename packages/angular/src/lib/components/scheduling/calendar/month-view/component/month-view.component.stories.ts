import type { Meta, StoryObj } from '@storybook/angular';

import type { SolarisCalendarEvent } from '../../model/calendar.types';
import { SolarisCalendarMonthViewComponent } from './month-view.component';

const EVENTS: SolarisCalendarEvent[] = [
  {
    id: 'standup',
    kind: 'event',
    title: 'Team standup',
    start: '2026-10-15T09:00:00-03:00',
    end: '2026-10-15T09:30:00-03:00',
    color: 'info',
    recurrence: { freq: 'weekly', byWeekday: [1, 2, 3, 4, 5], count: 12 },
  },
  {
    id: 'planning',
    kind: 'event',
    title: 'Sprint planning',
    start: '2026-10-15T14:00:00-03:00',
    end: '2026-10-15T16:00:00-03:00',
    color: 'primary',
  },
  {
    id: 'offsite',
    kind: 'event',
    title: 'Design offsite',
    start: '2026-10-20',
    end: '2026-10-22',
    allDay: true,
    color: 'accent',
  },
  {
    id: 'review',
    kind: 'event',
    title: 'Design review',
    start: '2026-10-15T17:00:00-03:00',
    end: '2026-10-15T18:00:00-03:00',
    color: 'violet',
  },
];

const meta: Meta<SolarisCalendarMonthViewComponent> = {
  component: SolarisCalendarMonthViewComponent,
  title: 'Scheduling/Month View',
};

export default meta;

type Story = StoryObj<SolarisCalendarMonthViewComponent>;

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
  },
};

export const WeekdaysOnly: Story = {
  args: {
    ...Default.args,
    showWeekends: false,
  },
};

export const Portuguese: Story = {
  args: {
    ...Default.args,
    locale: 'pt-BR',
    weekStartsOn: 1,
  },
};
