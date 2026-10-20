# Solaris Calendar Shell

## Purpose

Composition shell owning `view`/`focusedDate`/`customDays`/`timeZone`/`showWeekends`/`showHolidays`
signals and projecting month/week/year/schedule views. Toolbar (previous/today/next),
mini-month navigator, view switcher select (including custom N days), single time-zone
select with friendly city labels and GMT offset hint, a custom-days select,
a display-options collapsible (weekends/holidays), and a
narrow-viewport fallback to the schedule agenda. The
shell never renders events itself and never mutates the consumer array. Day titles
capitalize the month name; schedule titles show the 7-day window range;
the week/day grid shows the now-line
only when the visible day is today. When projecting the schedule view the shell
hides its internal toolbar (`[showToolbar]="false"`) to avoid duplicated navigation.

## API

| Input                | Description                                                                                                                                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `view`               | Two-way `day \| week \| month \| year \| schedule \| custom` (default `month`).                                                                                                                                              |
| `focusedDate`        | Two-way date-only string driving the visible range and the active day.                                                                                                                                                       |
| `customDays`         | Two-way custom day count for `custom` view, clamped `1`–`7` (week grid supports `1\|3\|4\|7`).                                                                                                                               |
| `events`             | Consumer-owned array; recurrence expands inside views, never mutated.                                                                                                                                                        |
| `tasks`              | Tasks with `due` dates and inline check-off via `taskToggle`.                                                                                                                                                                |
| `holidays`           | Resolved holidays (wire `builtInHolidays()` + preload).                                                                                                                                                                      |
| `timeZone`           | Two-way display zone (defaults to the consumer locale zone).                                                                                                                                                                 |
| `locale`             | BCP 47 locale for titles, weekdays, and time formatting.                                                                                                                                                                     |
| `weekStartsOn`       | `0`–`6` override (default: locale first day).                                                                                                                                                                                |
| `showWeekends`       | Two-way weekend visibility toggle.                                                                                                                                                                                           |
| `showHolidays`       | Two-way holiday visibility toggle (filters `holidays` before projecting).                                                                                                                                                    |
| `density`            | `'compact'` / `'normal'` / `'comfortable'` (default).                                                                                                                                                                        |
| `size`               | `'sm'` / `'md'` (default) / `'lg'`.                                                                                                                                                                                          |
| `responsiveFallback` | Narrow-viewport fallback view (`'schedule'` default, `null` disables) at `≤640px`.                                                                                                                                           |
| `timeZones`          | Selectable zones for the time-zone control.                                                                                                                                                                                  |
| `editable`           | When `true`, clicking an event opens the editor dialog with the current data, and clicking an empty slot (week/day grids) or drag-creating (month/week) opens the create dialog with an empty-title draft (default `false`). |
| `editorDisabled`     | Disables the edit dialog even when `editable` is `true` (default `false`).                                                                                                                                                   |

| Output        | Description                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `viewChange`  | Emitted when the view switcher changes `view`.                                                                              |
| `daySelect`   | Date-only string of the activated day (views + mini).                                                                       |
| `eventOpen`   | `{ id, start }` of the activated occurrence.                                                                                |
| `slotSelect`  | `{ date, time }` from week/day grids. In `editable` mode the shell also focuses the slot date and opens the create dialog.  |
| `taskToggle`  | Id of the toggled task (consumer flips `completed`).                                                                        |
| `taskMove`    | `{ id, due }` when a month-view task chip is dragged to another day (consumer applies).                                     |
| `eventCreate` | Drag-create proposal (consumer applies). In `editable` mode the shell also opens the create dialog with the proposed range. |
| `eventMove`   | Drag-move proposal (consumer applies).                                                                                      |
| `eventResize` | Drag-resize proposal (consumer applies).                                                                                    |
| `eventSave`   | Immutable save request `{ event, scope, occurrenceStart }` (consumer resolves via `resolveSolarisEventSave`).               |
| `eventDelete` | `{ scope, eventId, occurrenceStart }` (consumer resolves via `resolveSolarisEventDelete`).                                  |
| `eventCancel` | Editor dialog closed without changes.                                                                                       |

User-facing strings resolve through `SolarisTranslateService`
(`solaris.calendar.*`, English/Portuguese/Spanish bundled) with `locale`-based
fallbacks when the service is absent.

## Accessibility

Toolbar uses grouped icon buttons with `aria-label` previous/next plus a today
button. The view switcher is a labeled select. The mini-month is a `grid`
of day buttons with `aria-current="date"` on today and a capitalized
month/year heading. Display options live in a collapsible with labeled
checkboxes. View changes and date shifts are announced
through a polite live region. Narrow fallback keeps the schedule `list`
semantics (arrows + `Enter`, `PageUp`/`PageDown` paginate).

## Examples

```html
<solaris-calendar locale="pt-BR" [(view)]="view" [(focusedDate)]="focusedDate" [events]="events" [tasks]="tasks" [holidays]="holidays" (eventCreate)="onCreate($event)" />
```

Click-to-edit (opt-in, lib never mutates the consumer array):

```html
<solaris-calendar locale="pt-BR" [events]="events()" [editable]="true" (eventOpen)="onOpen($event)" (eventSave)="onSave($event)" (eventDelete)="onDelete($event)" />
```

```ts
onSave(request: SolarisEventSaveRequest): void {
  const draft = request.event;
  if (draft.kind === 'task') {
    this.tasks.update((items) =>
      items.some((item) => item.id === draft.id)
        ? items.map((item) => (item.id === draft.id ? draft : item))
        : [...items, draft],
    );
    return;
  }
  const source = this.events().find((item) => item.id === draft.id);
  if (
    !source ||
    source.recurrence === undefined ||
    request.scope === 'all' ||
    request.occurrenceStart === null
  ) {
    this.events.update((items) =>
      items.some((item) => item.id === draft.id)
        ? items.map((item) => (item.id === draft.id ? (draft as SolarisCalendarEvent) : item))
        : [...items, draft as SolarisCalendarEvent],
    );
    return;
  }
  const resolved = resolveSolarisEventSave(
    source,
    request.occurrenceStart,
    draft as SolarisCalendarEvent,
    request.scope,
    this.timeZone(),
  );
  if (resolved === null) return;
  const ids = new Set(resolved.map((item) => item.id));
  this.events.update((items) => [
    ...items.filter((item) => item.id !== source.id && !ids.has(item.id)),
    ...resolved,
  ]);
}

onDelete(request: SolarisEventDeleteRequest): void {
  const source = this.events().find((item) => item.id === request.eventId);
  if (!source) return;
  const resolved = resolveSolarisEventDelete(source, request.occurrenceStart, request.scope, this.timeZone());
  if (resolved.action === 'remove') {
    this.events.update((items) => items.filter((item) => item.id !== source.id));
  } else {
    this.events.update((items) =>
      items.map((item) => (item.id === source.id ? resolved.event : item)),
    );
  }
}
```

When `editable` is `true`, the shell looks up the clicked `{ id, start }` in
`events()`, opens `solaris-calendar-event-editor` in a `560px` dialog with the
current data (`occurrenceStart` = clicked occurrence, `timeZone`/`locale`/`size`/`density`
forwarded), and re-emits `eventSave`/`eventDelete`/`eventCancel`. `eventOpen`
is always emitted first for logging/telemetry. Without `SolarisDialogService`
(or when the id is unknown) the shell only emits `eventOpen`. Saving emits
`eventSave` as `{ event, scope, occurrenceStart }` — the consumer resolves
scoped occurrence edits via `resolveSolarisEventSave` (legacy `{ kind: 'save', event }`
dialog results are wrapped as `{ event, scope: 'all', occurrenceStart: null }`).

Click-to-create (same `editable` opt-in): slot clicks (`slotSelect`, one-hour
draft from `{ date, time }` in the shell `timeZone`, slot date focused first)
and drag-create proposals (`eventCreate`, all-day or timed range) open the
create dialog with an empty-title draft (`occurrenceStart: null`, dialog title
falls back to `solaris.calendar.newEvent`). The proposals are still emitted
first, so non-editable consumers keep working. Saving emits `eventSave` with
`{ event, scope: 'all', occurrenceStart: null }` — the consumer upserts by `id`
(append when unknown) and the calendar re-renders from the updated array.
Scoped occurrence saves (`scope` `'this'`/`'following'` with an
`occurrenceStart`) resolve via `resolveSolarisEventSave` into the updated
series plus the detached/following event.

## Visual variants

`size`/`density` forward to the projected view. Weekends collapse via
`showWeekends`. At `≤640px` the shell projects the schedule agenda by default.
Mini-month sits beside the main view on desktop and stacks below on mobile.
Mini days render as fixed token-size circles with a narrow weekday header row;
days outside the visible month are muted with `text-secondary`. In `year`
view the shell queries its own width: below 640px the side panel stacks on top
so the months use the full width, otherwise they sit beside it. Either way the
months flow 3 → 2 → 1 through auto-fill.

## Print

`@media print` hides the toolbar and side panel, expands the main view, and
flattens shadows for ink-safe output. Pair with the showcase print page
(`window.print()` preview) to export month/agenda PDFs from the browser.

## CSS Variables

| Variable                          | Resolves to                       | Description   |
| --------------------------------- | --------------------------------- | ------------- |
| `--solaris-calendar-shell-border` | `--solaris-neutral-border-subtle` | Shell borders |
