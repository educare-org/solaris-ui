import type { Meta, StoryObj } from '@storybook/angular';

import type { SolarisCalendarEvent } from '../../model/calendar.types';
import { SolarisCalendarScheduleViewComponent } from './schedule-view.component';

const EVENTS: SolarisCalendarEvent[] = [
  {
    id: 'standup',
    kind: 'event',
    title: 'Team standup',
    start: '2026-10-15T09:00:00-03:00',
    end: '2026-10-15T09:30:00-03:00',
    color: 'info',
    recurrence: { freq: 'weekly', byWeekday: [4], count: 4 },
  },
  {
    id: 'planning',
    kind: 'event',
    title: 'Sprint planning',
    start: '2026-10-15T10:00:00-03:00',
    end: '2026-10-15T12:00:00-03:00',
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
];

const meta: Meta<SolarisCalendarScheduleViewComponent> = {
  component: SolarisCalendarScheduleViewComponent,
  title: 'Scheduling/Schedule View',
};

export default meta;

type Story = StoryObj<SolarisCalendarScheduleViewComponent>;

export const Default: Story = {
  args: {
    locale: 'en-US',
    timeZone: 'America/Sao_Paulo',
    focusedDate: '2026-10-15',
    windowDays: 7,
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

export const Empty: Story = {
  args: {
    ...Default.args,
    events: [],
    tasks: [],
    holidays: [],
  },
};

export const Compact: Story = {
  args: {
    ...Default.args,
    density: 'compact',
    size: 'sm',
  },
};

export const Fortnight: Story = {
  args: {
    ...Default.args,
    windowDays: 14,
  },
};

export const Portuguese: Story = {
  args: {
    ...Default.args,
    locale: 'pt-BR',
  },
};

export const Spanish: Story = {
  args: {
    ...Default.args,
    locale: 'es',
  },
};
