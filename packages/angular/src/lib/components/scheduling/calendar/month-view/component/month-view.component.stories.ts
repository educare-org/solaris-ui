import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fireEvent, within } from 'storybook/test';

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
    const chip = canvas.getByRole('button', { name: /Team standup/ });
    chip.focus();
    fireEvent.keyDown(chip, { key: 'ArrowRight' });
    await expect(canvasElement.querySelector('[data-ghost]')).not.toBeNull();
    await expect(
      canvasElement
        .querySelector('.solaris-calendar-month-view')
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
    const chip = canvas.getByRole('button', { name: /Team standup/ });
    chip.focus();
    fireEvent.keyDown(chip, { key: 'ArrowRight' });
    await expect(canvasElement.querySelector('[data-ghost]')).not.toBeNull();
    fireEvent.keyDown(chip, { key: 'Enter' });
    await expect(canvasElement.querySelector('[data-ghost]')).toBeNull();
    await expect(
      canvasElement
        .querySelector('.solaris-calendar-month-view')
        ?.getAttribute('data-dragging'),
    ).toBeNull();
  },
};
