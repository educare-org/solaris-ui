# Solaris Calendar Year View

## Purpose

Twelve mini-months for a full year with per-day density dots and drill-down:
activating a day sets `focusedDate` and emits `daySelect` so the shell can
switch to the month or day view. Each mini-month shows six full weeks with
adjacent-month filler days in a muted tone (all drillable), and month-only
titles with a capital first letter. Click selection only; drag arrives in C6.

## API

| Input          | Description                                                                             |
| -------------- | --------------------------------------------------------------------------------------- |
| `focusedDate`  | Two-way date-only string driving the visible year and the active day.                   |
| `events`       | Consumer-owned array; recurrence expands inside the lib, never mutated.                 |
| `tasks`        | Tasks with `due` dates counted in the day density.                                      |
| `holidays`     | Resolved holidays (wire `builtInHolidays()` + preload in the shell); tint the day dots. |
| `timeZone`     | Display zone (defaults to the consumer locale zone).                                    |
| `locale`       | BCP 47 locale for month, weekday, and helper-text formatting.                           |
| `weekStartsOn` | `0`–`6` override (default: locale first day).                                           |
| `showWeekends` | Hides Saturday/Sunday columns when `false`; navigation skips them.                      |
| `density`      | `'compact'` / `'normal'` / `'comfortable'` (default); scales mini-month gaps.           |
| `size`         | `'sm'` / `'md'` (default) / `'lg'`; scales day numbers.                                 |

| Output      | Description                                         |
| ----------- | --------------------------------------------------- |
| `daySelect` | Date-only string of the activated day (drill-down). |

User-facing strings resolve through `SolarisTranslateService`
(`solaris.calendar.*`, English/Portuguese/Spanish bundled) with `locale`-based
fallbacks when the service is absent.

## Accessibility

The year uses `aria-activedescendant`: `←/→` move days, `↑/↓` move weeks,
`Home`/`End` jump to week edges, `PageUp`/`PageDown` change months,
`Enter`/`Space` drills into the active day. Day buttons carry full date labels
with item counts; today carries `aria-current="date"`. Drill-down and moves
are announced through a polite live region.

## Examples

```html
<solaris-calendar-year-view locale="pt-BR" timeZone="America/Sao_Paulo" [(focusedDate)]="focusedDate" [events]="events" [tasks]="tasks" [holidays]="holidays" (daySelect)="onDaySelect($event)" />
```

## Limits

- Mini-months always render six weeks: leading/trailing filler days from the
  adjacent months keep every grid full. Filler days are muted but fully
  interactive (drill-down, keyboard, dots).
- At most three density dots render per day; higher counts appear only in the
  accessible label.
- No per-event selection or popover: the year summarizes days, it does not
  open occurrences (use `daySelect` to drill into month/day views).
- No drag-create/move/resize yet (phase C6); selection is click + keyboard only.
- The visible year always follows `focusedDate`; there is no separate `year`
  input (the shell owns view switching in C7).

## Visual variants

`density` drives mini-month gaps; `size` drives day numbers. Weekends collapse
via `showWeekends`. Holiday days tint their dots. Hover states animate with
`--solaris-motion-duration-normal` (instant under reduced motion).

## CSS Variables

| Variable                                     | Resolves to                       | Description        |
| -------------------------------------------- | --------------------------------- | ------------------ |
| `--solaris-calendar-year-view-border`        | `--solaris-neutral-border-subtle` | Month card lines   |
| `--solaris-calendar-year-view-day-size`      | spacing token per `size`          | Day number circle  |
| `--solaris-calendar-year-view-day-font-size` | per `size`                        | Day/weekday text   |
| `--solaris-calendar-year-view-month-min`     | spacing token                     | Mini-month min col |
| `--solaris-calendar-year-view-transition`    | motion tokens                     | Hover transitions  |
