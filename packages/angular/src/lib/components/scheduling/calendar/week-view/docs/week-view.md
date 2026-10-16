# Solaris Calendar Week View

## Purpose

Time-grid rendering `1|3|4|7` visible days with an all-day row, timed event
blocks, a time-zone aware now-line, and click selection without drag
(drag-create/move/resize arrive in phase C6).

## API

| Input              | Description                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `focusedDate`      | Two-way date-only string driving the visible range and the active slot.                                       |
| `visibleDays`      | `1` / `3` / `4` / `7` (default). `7` anchors to the locale week start; smaller values start at `focusedDate`. |
| `events`           | Consumer-owned array; recurrence expands inside the lib, never mutated.                                       |
| `tasks`            | Tasks with `due` dates rendered in the all-day row with inline check-off via `taskToggle`.                    |
| `holidays`         | Resolved holidays (wire `builtInHolidays()` + preload in the shell).                                          |
| `timeZone`         | Display zone (defaults to the consumer locale zone). Blocks and the now-line render in this zone.             |
| `locale`           | BCP 47 locale for weekday, hour, and helper-text formatting.                                                  |
| `weekStartsOn`     | `0`–`6` override (default: locale first day).                                                                 |
| `showWeekends`     | Hides Saturday/Sunday columns when `false`; navigation skips them.                                            |
| `showAllDay`       | Shows the all-day row when `true` (default); hiding it also hides all-day events, tasks, and holidays.        |
| `density`          | `'compact'` / `'normal'` / `'comfortable'` (default); scales the hour height.                                 |
| `size`             | `'sm'` / `'md'` (default) / `'lg'`; scales chip and block text.                                               |
| `selectedId`       | Highlights one event/task block or chip.                                                                      |
| `maxVisiblePerDay` | All-day chips before the overflow button (default `3`).                                                       |
| `moreLabel`        | Full-text override for the overflow button.                                                                   |
| `moreLabelKey`     | Translation key for the overflow button (`{{count}}` param).                                                  |

| Output       | Description                                                                      |
| ------------ | -------------------------------------------------------------------------------- |
| `daySelect`  | Date-only string of the activated day header.                                    |
| `slotSelect` | `{ date, time }` (`time` is wall `HH:mm` in `timeZone`) of the picked hour slot. |
| `eventOpen`  | `{ id, start }` of the activated occurrence.                                     |
| `moreOpen`   | Date-only string whose all-day overflow popover opened.                          |
| `taskToggle` | Id of the toggled task (consumer flips `completed`).                             |

User-facing strings resolve through `SolarisTranslateService`
(`solaris.calendar.*`, English/Portuguese/Spanish bundled) with `locale`-based
fallbacks when the service is absent. Hour gutter labels and spoken times use
a 12-hour clock; emitted `slotSelect` times stay wall `HH:mm` (24-hour).

## Accessibility

The time-grid uses `aria-activedescendant` over hour slots: `←/→` move days,
`↑/↓` move hours, `Home`/`End` jump to the first/last visible day,
`PageUp`/`PageDown` shift a week, `Enter`/`Space` picks the active slot.
Event blocks are tab stops with time-range labels and hover tooltips; task
chips expose `role="checkbox"`. Selection, overflow, and toggles are announced
through a polite live region. Today carries `aria-current="date"` and the
now-line exposes its wall time as an image label. The now-line spans the full day-column width while today is visible. The
now-line never animates and stays static when reduced motion is preferred.

## Examples

```html
<solaris-calendar-week-view locale="pt-BR" timeZone="America/Sao_Paulo" [(focusedDate)]="focusedDate" [visibleDays]="7" [events]="events" [tasks]="tasks" [holidays]="holidays" (slotSelect)="onSlotSelect($event)" (eventOpen)="onEventOpen($event)" />
```

## Limits

- No drag-create/move/resize yet (phase C6); selection is click + keyboard only.
- Full 24-hour days only; no `dayStartHour`/`dayEndHour` window (consumer can
  hide night hours with CSS if needed).
- Multi-day timed events are clipped per day; all-day events repeat one chip
  per day instead of spanning bars.
- `visibleDays="1"` on a hidden weekend focuses the next visible weekday.
- On narrow viewports the grid scrolls horizontally with a sticky gutter;
  prefer the schedule view below 640px (shell `responsiveFallback`).

## Visual variants

`density` drives layout compactness (hour height, column width, all-day rows,
chip height); `size` drives overall scale (block text, day circle, weekday
text). Weekends collapse via `showWeekends`; the all-day row hides via
`showAllDay`. Hover states animate with `--solaris-motion-duration-normal`
(instant under reduced motion).

## CSS Variables

| Variable                                         | Resolves to                       | Description                 |
| ------------------------------------------------ | --------------------------------- | --------------------------- |
| `--solaris-calendar-week-view-border`            | `--solaris-neutral-border-subtle` | Grid lines                  |
| `--solaris-calendar-week-view-gutter`            | spacing token                     | Hour gutter width           |
| `--solaris-calendar-week-view-hour-height`       | spacing token per `density`       | Hour row height             |
| `--solaris-calendar-week-view-column-min`        | spacing token per `density`       | Min day-column width        |
| `--solaris-calendar-week-view-allday-rows`       | count per `density`               | All-day visible rows        |
| `--solaris-calendar-week-view-chip-min-height`   | spacing token per `density`       | Chip min height             |
| `--solaris-calendar-week-view-block-font-size`   | per `size`                        | Block/chip text size        |
| `--solaris-calendar-week-view-block-gap`         | spacing token                     | Gap between overlap columns |
| `--solaris-calendar-week-view-day-size`          | spacing token per `size`          | Day number circle           |
| `--solaris-calendar-week-view-weekday-font-size` | per `size`                        | Weekday label size          |
| `--solaris-calendar-week-view-transition`        | motion tokens                     | Hover transitions           |
