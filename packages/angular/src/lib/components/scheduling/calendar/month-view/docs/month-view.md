# Solaris Calendar Month View

## Purpose

Six-week month grid rendering event chips, all-day rows, tasks, and holidays
with a `+n more` popover, selection, drag-create/drag-move proposals (events
and task chips can be dragged to another day), and full keyboard navigation.

## API

| Input              | Description                                                                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `focusedDate`      | Two-way date-only string driving the visible month and the active day.                                                                                                            |
| `events`           | Consumer-owned array; recurrence expands inside the lib, never mutated.                                                                                                           |
| `tasks`            | Tasks with `due` dates and inline check-off via `taskToggle`.                                                                                                                     |
| `holidays`         | Resolved holidays (wire `builtInHolidays()` + preload in the shell).                                                                                                              |
| `timeZone`         | Display zone (defaults to the consumer locale zone).                                                                                                                              |
| `locale`           | BCP 47 locale for weekday, month, and time formatting.                                                                                                                            |
| `weekStartsOn`     | `0`–`6` override (default: locale first day).                                                                                                                                     |
| `showWeekends`     | Hides Saturday/Sunday columns when `false`.                                                                                                                                       |
| `density`          | `'compact'` / `'normal'` / `'comfortable'` (default).                                                                                                                             |
| `size`             | `'sm'` / `'md'` (default) / `'lg'`.                                                                                                                                               |
| `selectedId`       | Highlights one event/task chip.                                                                                                                                                   |
| `maxVisiblePerDay` | Initial chips before the overflow button (default `3`). In the browser the visible rows auto-fit the square cell, so the more button only appears when markings exceed what fits. |
| `moreLabel`        | Full-text override for the overflow button.                                                                                                                                       |
| `moreLabelKey`     | Translation key for the overflow button (`{{count}}` param).                                                                                                                      |

| Output       | Description                                                                  |
| ------------ | ---------------------------------------------------------------------------- |
| `daySelect`  | Date-only string of the activated day.                                       |
| `eventOpen`  | `{ id, start }` of the activated occurrence.                                 |
| `moreOpen`   | Date-only string whose overflow popover opened.                              |
| `taskToggle` | Id of the toggled task (consumer flips `completed`).                         |
| `taskMove`   | `{ id, due }` when a task chip is dragged to another day (consumer applies). |

User-facing strings resolve through `SolarisTranslateService`
(`solaris.calendar.*`, English/Portuguese/Spanish bundled) with `locale`-based
fallbacks when the service is absent.

## Accessibility

The grid uses `aria-activedescendant`: arrows move the active day (and
`focusedDate`), `Home`/`End` jump to week edges, `PageUp`/`PageDown` change
months, `Enter`/`Space` selects the active day. Event and task chips are
regular tab stops with descriptive labels; task chips expose `role="checkbox"`.
Selection, overflow, and toggles are announced through a polite live region.
Today carries `aria-current="date"`.

## Examples

```html
<solaris-calendar-month-view locale="pt-BR" timeZone="America/Sao_Paulo" [(focusedDate)]="focusedDate" [events]="events" [tasks]="tasks" [holidays]="holidays" (daySelect)="onDaySelect($event)" (eventOpen)="onEventOpen($event)" />
```

## Visual variants

`size` scales the day circle and chip text; `density` scales cell height.
Weekends collapse to five columns via `showWeekends`. Hover states animate
with `--solaris-motion-duration-normal` (instant under reduced motion).

## CSS Variables

| Variable                                       | Resolves to                       | Description       |
| ---------------------------------------------- | --------------------------------- | ----------------- |
| `--solaris-calendar-month-view-border`         | `--solaris-neutral-border-subtle` | Grid lines        |
| `--solaris-calendar-month-view-day-size`       | spacing token per `size`          | Day number circle |
| `--solaris-calendar-month-view-chip-font-size` | `12px` per `size`                 | Chip text size    |
