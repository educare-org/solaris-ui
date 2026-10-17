# Solaris Calendar Shell

## Purpose

Composition shell owning `view`/`focusedDate`/`customDays`/`timeZone`/`showWeekends`
signals and projecting month/week/year/schedule views. Toolbar (previous/today/next),
mini-month navigator, view switcher including custom N days, time-zone label, weekend
and time-zone controls, and a narrow-viewport fallback to the schedule agenda. The
shell never renders events itself and never mutates the consumer array.

## API

| Input                | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `view`               | Two-way `day \| week \| month \| year \| schedule \| custom` (default `month`).                |
| `focusedDate`        | Two-way date-only string driving the visible range and the active day.                         |
| `customDays`         | Two-way custom day count for `custom` view, clamped `1`–`7` (week grid supports `1\|3\|4\|7`). |
| `events`             | Consumer-owned array; recurrence expands inside views, never mutated.                          |
| `tasks`              | Tasks with `due` dates and inline check-off via `taskToggle`.                                  |
| `holidays`           | Resolved holidays (wire `builtInHolidays()` + preload).                                        |
| `timeZone`           | Two-way display zone (defaults to the consumer locale zone).                                   |
| `locale`             | BCP 47 locale for titles, weekdays, and time formatting.                                       |
| `weekStartsOn`       | `0`–`6` override (default: locale first day).                                                  |
| `showWeekends`       | Two-way weekend visibility toggle.                                                             |
| `density`            | `'compact'` / `'normal'` / `'comfortable'` (default).                                          |
| `size`               | `'sm'` / `'md'` (default) / `'lg'`.                                                            |
| `responsiveFallback` | Narrow-viewport fallback view (`'schedule'` default, `null` disables) at `≤640px`.             |
| `timeZones`          | Selectable zones for the time-zone control.                                                    |

| Output        | Description                                           |
| ------------- | ----------------------------------------------------- |
| `viewChange`  | Emitted when the view switcher changes `view`.        |
| `daySelect`   | Date-only string of the activated day (views + mini). |
| `eventOpen`   | `{ id, start }` of the activated occurrence.          |
| `slotSelect`  | `{ date, hour }` from week/day grids.                 |
| `taskToggle`  | Id of the toggled task (consumer flips `completed`).  |
| `eventCreate` | Drag-create proposal (consumer applies).              |
| `eventMove`   | Drag-move proposal (consumer applies).                |
| `eventResize` | Drag-resize proposal (consumer applies).              |

User-facing strings resolve through `SolarisTranslateService`
(`solaris.calendar.*`, English/Portuguese/Spanish bundled) with `locale`-based
fallbacks when the service is absent.

## Accessibility

Toolbar uses grouped buttons with `aria-label` previous/next and `aria-pressed`
on the active view. The mini-month is a `grid` of day buttons with
`aria-current="date"` on today. View changes and date shifts are announced
through a polite live region. Narrow fallback keeps the schedule `list`
semantics (arrows + `Enter`, `PageUp`/`PageDown` paginate).

## Examples

```html
<solaris-calendar locale="pt-BR" [(view)]="view" [(focusedDate)]="focusedDate" [events]="events" [tasks]="tasks" [holidays]="holidays" (eventCreate)="onCreate($event)" />
```

## Visual variants

`size`/`density` forward to the projected view. Weekends collapse via
`showWeekends`. At `≤640px` the shell projects the schedule agenda by default.
Mini-month sits beside the main view on desktop and stacks below on mobile.

## Print

`@media print` hides the toolbar and side panel, expands the main view, and
flattens shadows for ink-safe output. Pair with the showcase print page
(`window.print()` preview) to export month/agenda PDFs from the browser.

## CSS Variables

| Variable                          | Resolves to                       | Description   |
| --------------------------------- | --------------------------------- | ------------- |
| `--solaris-calendar-shell-border` | `--solaris-neutral-border-subtle` | Shell borders |
