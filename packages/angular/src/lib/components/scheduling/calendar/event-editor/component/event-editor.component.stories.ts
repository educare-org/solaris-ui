import type { Meta, StoryObj } from '@storybook/angular';

import type {
  SolarisCalendarEvent,
  SolarisCalendarTask,
} from '../../model/calendar.types';
import { SolarisCalendarEventEditorComponent } from './event-editor.component';

const SINGLE: SolarisCalendarEvent = {
  id: 'planning',
  kind: 'event',
  title: 'Sprint planning',
  start: '2026-10-15T10:00:00-03:00',
  end: '2026-10-15T12:00:00-03:00',
  color: 'primary',
};

const RECURRING: SolarisCalendarEvent = {
  id: 'standup',
  kind: 'event',
  title: 'Team standup',
  start: '2026-10-15T09:00:00-03:00',
  end: '2026-10-15T09:30:00-03:00',
  color: 'info',
  recurrence: { freq: 'weekly', byWeekday: [4], count: 4 },
};

const ALL_DAY: SolarisCalendarEvent = {
  id: 'offsite',
  kind: 'event',
  title: 'Design offsite',
  start: '2026-10-20',
  end: '2026-10-22',
  allDay: true,
  color: 'accent',
};

const TASK: SolarisCalendarTask = {
  id: 'report',
  kind: 'task',
  title: 'Write status report',
  due: '2026-10-16T17:00:00-03:00',
  completed: false,
  description: 'Summarize the sprint outcome.',
};

const SCHEDULE: SolarisCalendarEvent = {
  id: 'office-hours',
  kind: 'event',
  title: 'Office hours',
  start: '2026-10-17T14:00:00-03:00',
  end: '2026-10-17T16:00:00-03:00',
  color: 'success',
  scheduleSlot: true,
};

const meta: Meta<SolarisCalendarEventEditorComponent> = {
  component: SolarisCalendarEventEditorComponent,
  title: 'Scheduling/Event Editor',
};

export default meta;

type Story = StoryObj<SolarisCalendarEventEditorComponent>;

export const Default: Story = {
  args: {
    locale: 'en-US',
    timeZone: 'America/Sao_Paulo',
    event: SINGLE,
  },
};

export const Recurring: Story = {
  args: {
    ...Default.args,
    event: RECURRING,
    occurrenceStart: '2026-10-22T09:00:00-03:00',
  },
};

export const AllDay: Story = {
  args: {
    ...Default.args,
    event: ALL_DAY,
  },
};

export const Portuguese: Story = {
  args: {
    ...Default.args,
    locale: 'pt-BR',
    event: RECURRING,
  },
};

export const Spanish: Story = {
  args: {
    ...Default.args,
    locale: 'es',
    event: SINGLE,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const WithColor: Story = {
  args: {
    ...Default.args,
    event: {
      id: 'review',
      kind: 'event',
      title: 'Design review',
      start: '2026-10-16T14:00:00-03:00',
      end: '2026-10-16T15:00:00-03:00',
      color: 'violet',
    },
  },
};

export const Task: Story = {
  args: {
    ...Default.args,
    event: TASK,
  },
};

export const ScheduleSlot: Story = {
  args: {
    ...Default.args,
    event: SCHEDULE,
  },
};
