import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, within } from 'storybook/test';

import type { SolarisCalendarEvent } from '../../model/calendar.types';
import { SolarisCalendarWeekViewComponent } from './week-view.component';

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
    id: 'review',
    kind: 'event',
    title: 'Design review',
    start: '2026-10-15T10:30:00-03:00',
    end: '2026-10-15T11:30:00-03:00',
    color: 'violet',
  },
  {
    id: 'retro',
    kind: 'event',
    title: 'Retrospective',
    start: '2026-10-15T10:45:00-03:00',
    end: '2026-10-15T11:15:00-03:00',
    color: 'accent',
  },
  {
    id: 'offsite',
    kind: 'event',
    title: 'Design offsite',
    start: '2026-10-20',
    end: '2026-10-22',
    allDay: true,
    color: 'warning',
  },
];

const meta: Meta<SolarisCalendarWeekViewComponent> = {
  component: SolarisCalendarWeekViewComponent,
  title: 'Scheduling/Week View',
};

export default meta;

type Story = StoryObj<SolarisCalendarWeekViewComponent>;

export const Default: Story = {
  args: {
    locale: 'en-US',
    timeZone: 'America/Sao_Paulo',
    focusedDate: '2026-10-15',
    visibleDays: 7,
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

export const Day: Story = {
  args: {
    ...Default.args,
    visibleDays: 1,
  },
};

export const ThreeDay: Story = {
  args: {
    ...Default.args,
    visibleDays: 3,
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

export const WithoutAllDay: Story = {
  args: {
    ...Default.args,
    showAllDay: false,
  },
};

export const Portuguese: Story = {
  args: {
    ...Default.args,
    locale: 'pt-BR',
    weekStartsOn: 1,
  },
};

export const DragDisabled: Story = {
  args: {
    ...Default.args,
    dragDisabled: true,
  },
};

export const DragGhost: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const block = canvas.getByRole('button', { name: /Team standup/ });
    block.focus();
    fireEvent.keyDown(block, { key: 'ArrowRight' });
    await expect(canvasElement.querySelector('[data-ghost]')).not.toBeNull();
    await expect(
      canvasElement
        .querySelector('.solaris-calendar-week-view')
        ?.getAttribute('data-dragging'),
    ).toBe('');
  },
};

export const DragKeyboardMove: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const block = canvas.getByRole('button', { name: /Team standup/ });
    block.focus();
    fireEvent.keyDown(block, { key: 'ArrowRight' });
    await expect(canvasElement.querySelector('[data-ghost]')).not.toBeNull();
    fireEvent.keyDown(block, { key: 'Enter' });
    await expect(canvasElement.querySelector('[data-ghost]')).toBeNull();
  },
};

export const DragKeyboardResize: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const block = canvas.getByRole('button', { name: /Team standup/ });
    block.focus();
    fireEvent.keyDown(block, { key: 'ArrowDown', shiftKey: true });
    await expect(canvasElement.querySelector('[data-ghost]')).not.toBeNull();
    await expect(
      canvasElement
        .querySelector('.solaris-calendar-week-view')
        ?.getAttribute('data-resizing'),
    ).toBe('');
    fireEvent.keyDown(block, { key: 'Enter' });
    await expect(canvasElement.querySelector('[data-ghost]')).toBeNull();
  },
};
