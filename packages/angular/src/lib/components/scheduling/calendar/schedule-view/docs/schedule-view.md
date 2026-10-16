# Solaris Calendar Schedule View

## Purpose

Chronological agenda grouped by day with inline task check-off and
windowed pagination: only `windowDays` days render at a time, so the DOM
stays bounded no matter how many events the consumer owns. This view is the
shell `responsiveFallback` below 640px. Click selection only; drag is C6.

## API

| Input         | Description                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `focusedDate` | Two-way date-only string anchoring the visible window (`focusedDate` never shifts on day clicks). |
| `events`      | Consumer-owned array; recurrence expands inside the window only, never mutated.                   |
| `tasks`       | Tasks with `due` dates rendered with inline check-off via `taskToggle`.                           |
| `holidays`    | Resolved holidays (wire `builtInHolidays()` + preload in the shell).                              |
| `timeZone`    | Display zone (defaults to the consumer locale zone).                                              |
| `locale`      | BCP 47 locale for day, time, and helper-text formatting.                                          |
| `windowDays`  | Days per window, clamped `1`–`31` (default `7`).                                                  |
| `density`     | `'compact'` / `'normal'` / `'comfortable'` (default); scales day padding.                         |
| `size`        | `'sm'` / `'md'` (default) / `'lg'`; scales day circles and item text.                             |
| `selectedId`  | Highlights one event/task item.                                                                   |

| Output       | Description                                          |
| ------------ | ---------------------------------------------------- |
| `daySelect`  | Date-only string of the activated day header.        |
| `eventOpen`  | `{ id, start }` of the activated occurrence.         |
| `taskToggle` | Id of the toggled task (consumer flips `completed`). |

User-facing strings resolve through `SolarisTranslateService`
(`solaris.calendar.*`, English/Portuguese/Spanish bundled) with `locale`-based
fallbacks when the service is absent. Item times use the locale clock; day
headers use short weekday + day number.

## Accessibility

The agenda is a labelled list with `aria-activedescendant` over day headers:
`↑/↓` (and `←/→`) move between rendered day groups, `Home`/`End` jump to the
first/last group, `PageUp`/`PageDown` paginate the window, `Enter`/`Space`
selects the active day. Event items are buttons with time-range labels and
hover tooltips; task items expose `role="checkbox"`. Window moves, selection,
and toggles are announced through a polite live region. Today carries
`aria-current="date"`. Empty windows render an explicit empty state.

## Examples

```html
<solaris-calendar-schedule-view locale="pt-BR" timeZone="America/Sao_Paulo" [(focusedDate)]="focusedDate" [windowDays]="7" [events]="events" [tasks]="tasks" [holidays]="holidays" (eventOpen)="onEventOpen($event)" (taskToggle)="onTaskToggle($event)" />
```

## Limits

- Rendering is bounded by the window (`windowDays`, max 31 days); recurrence
  expands only inside the visible window. Days outside the window never render.
- A single extremely dense day (hundreds of items) renders fully: narrow the
  window or split the data if a day alone becomes heavy.
- No drag-create/move/resize yet (phase C6); selection is click + keyboard only.
- Multi-day timed events repeat one row per day with the time shown on the
  first day only.

## Visual variants

`density` drives day padding; `size` drives day circles and item text.
The window pager reuses `solaris-button` (today, outline) and
`solaris-icon-button` (chevrons, ghost) with built-in chevron icons.
Weekend groups are marked with `data-weekend` for consumer tinting. Hover
states animate with `--solaris-motion-duration-normal` (instant under reduced
motion). The list never scrolls horizontally: it wraps to any width, which is
why it is the ≤640px fallback.

## CSS Variables

| Variable                                          | Resolves to                       | Description      |
| ------------------------------------------------- | --------------------------------- | ---------------- |
| `--solaris-calendar-schedule-view-border`         | `--solaris-neutral-border-subtle` | Day separators   |
| `--solaris-calendar-schedule-view-day-size`       | spacing token per `size`          | Day number badge |
| `--solaris-calendar-schedule-view-item-font-size` | per `size`                        | Item text size   |
