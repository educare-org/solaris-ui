# Solaris Calendar Event Editor

## Purpose

Dialog content for creating and editing a calendar entry: an item-kind
`segmented-control` (event, task, appointment schedule), title, description
and meeting-link fields, date/time (reusing `solaris-date-picker` plus time
inputs), all-day checkbox side by side with the time-zone button, optional
separate start/end time zones, recurrence sub-form (frequency with a `Custom`
mode that reveals interval, weekday chips, and ends; simple frequencies imply
interval 1 and never ends), stacked notification reminders, visibility + color
selects, and delete with scope. The editor is opened
through `SolarisDialogService.openComponent` by the consumer or the shell; the
dialog container owns the focus trap. The editor never mutates the consumer
event array: `eventSave` emits an immutable draft copy and `eventDelete`
emits a scope request the consumer resolves (see scope resolution below).

This component is NOT a `ControlValueAccessor`: it is a form hosted inside a
dialog, with `invalid`/`disabled` states following the forms-security rules.

## API

| Input             | Description                                                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `event`           | Source entry draft, event or task (required, never mutated; the editor hydrates from it).                                        |
| `occurrenceStart` | Occurrence being edited for recurring series (default `null`).                                                                   |
| `timeZone`        | Display zone for the start (defaults to the consumer locale zone).                                                               |
| `timeZoneEnd`     | Optional display zone for the end; enables the separate-zones mode.                                                              |
| `timeZoneOptions` | Optional zone catalog for the stacked picker and zone selects (defaults to a curated list; the current zone is always included). |
| `locale`          | BCP 47 locale for dates, weekday chips, and helper-text formatting (required).                                                   |
| `size`            | `'sm'` / `'md'` (default) / `'lg'`; scales body padding.                                                                         |
| `density`         | `'compact'` / `'normal'` / `'comfortable'` (default); scales body gaps.                                                          |
| `disabled`        | Disables every field and action.                                                                                                 |

| Output              | Description                                                                                                                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `eventSave`         | Immutable draft: `SolarisCalendarEvent` for event/schedule kinds, `SolarisCalendarTask` for tasks.                                                                                                                                       |
| `eventDelete`       | `{ scope, eventId, occurrenceStart }` (maps to `delete(scope)` in 03-api-design).                                                                                                                                                        |
| `eventCancel`       | Cancel without changes (maps to `cancel` in 03-api-design).                                                                                                                                                                              |
| `timeZoneChange`    | Selected start display zone (input-mirroring: the consumer writes it back to the `timeZone` input; the lib never mutates it). Falls back to emitting the current zone when no `SolarisDialogService` is available (e.g. isolated tests). |
| `timeZoneEndChange` | Selected end display zone from the separate-zones select or the swap action (mirrored back to `timeZoneEnd`).                                                                                                                            |
| `itemKindChange`    | Item kind selected in the segmented control (`event` / `task` / `schedule`).                                                                                                                                                             |

User-facing strings resolve through `SolarisTranslateService`
(`solaris.calendar.editor*`, English/Portuguese/Spanish bundled) with
`locale`-based fallbacks when the service is absent.

### Scope resolution

Use `resolveSolarisEventDelete(event, occurrenceStart, scope, timeZone)`:

- `this` → appends the occurrence civil date to
  `recurrenceExceptionDates` (exDate); the series keeps all other instances.
- `following` → truncates the series by setting `recurrence.until` just
  before the occurrence (datetime: one minute before in the display zone;
  date-only: the previous civil day). Deleting from the first occurrence
  resolves to `remove`.
- `all` (or a non-recurring event) → `remove` the whole event.

The helper is pure and immutable: the input event is never mutated.

## Accessibility

Title is the first tab stop (`data-autofocus`, honoured by the dialog
container); the dialog container traps focus (`CdkTrapFocus`), restores focus
on close, and closes on Escape. The recurrence group and delete scope are
native `fieldset`/`legend` groups; weekday chips are buttons with
`aria-pressed`; invalid range/recurrence render `role="alert"` errors and the
save button stays disabled while invalid. Selection, scope, and validation
announce through a polite live region. Full keyboard: Tab/Shift+Tab through
fields, arrows change radios/chips via native controls, Enter activates,
Escape cancels via the dialog.

## Examples

```ts
import { SolarisDialogService } from '@solaris-ui/angular';
import { SolarisCalendarEventEditorComponent } from '@solaris-ui/angular';

const ref = this.dialogService.openComponent(SolarisCalendarEventEditorComponent, {
  title: 'Edit event',
  width: '560px',
  data: undefined,
});
```

```html
<solaris-calendar-event-editor locale="pt-BR" timeZone="America/Sao_Paulo" [event]="draft" [occurrenceStart]="occurrence" (eventSave)="onSave($event)" (eventDelete)="onDelete($event)" (eventCancel)="onCancel()" />
```

Resolving a delete (consumer side, immutable):

```ts
import { resolveSolarisEventDelete } from '@solaris-ui/angular';

onDelete(request: SolarisEventDeleteRequest): void {
  const source = this.events().find((item) => item.id === request.eventId);
  if (!source) return;
  const resolved = resolveSolarisEventDelete(
    source,
    request.occurrenceStart,
    request.scope,
    this.timeZone(),
  );
  if (resolved.action === 'remove') {
    this.events.update((items) => items.filter((item) => item.id !== source.id));
  } else {
    this.events.update((items) =>
      items.map((item) => (item.id === source.id ? resolved.event : item)),
    );
  }
}
```

## Time zone

The all-day row carries only the `Change time zone` button (no current-zone
text): it opens `SolarisEventEditorTimezoneDialogComponent` stacked above the
editor (560px, `solaris-dialog-content` in `comfortable` density for breathing
room). The dialog stacks a separate-zones checkbox and a row pairing the two
searchable zone selects (back to back, full width) with the swap action in its
own column at the right, vertically centered — `arrow-left-right` rotated 90°
in a small circular chip clearly above the fields. The end select stays
disabled and mirrors the start zone until the checkbox is checked; confirming
closes with `{ start, end | null }`, which the editor mirrors back to
`timeZone`/`timeZoneEnd`. The framework never hardcodes zone catalogs beyond
a curated default — larger locale-specific catalogs can be passed via
`timeZoneOptions`. Per-occurrence start/end zones (Google-style) are OUT of
the persisted model: the model stores instants as ISO-with-offset and the
zones stay editor-level display context.

## Item kinds, visibility, color, reminders

- The `segmented-control` switches `event` (with others), `task` (personal)
  and `schedule` (bookable window, persisted as `scheduleSlot: true` on the
  event). Tasks hide end dates, recurrence, reminders and visibility and emit
  a `SolarisCalendarTask` draft (`due` from the date row, `completed`
  preserved); events and schedules emit `SolarisCalendarEvent`.
- `visibility` is `public|private` (default `public`); private events stay
  hidden from agenda guests.
- `color` is a select whose options pair the token-driven swatch with the
  color name; it shares a row with `visibility`.
- `reminders` is a stack of up to 5 notifications (`minutesBefore`), each a
  preset select (at start, 5/10/15/30 min, 1 h, 1 day) with a `Custom…` option
  revealing a minutes number input, plus add/remove controls.
- The delete scope uses the framework `solaris-radio-group` +
  `solaris-radio` (vertical, labelled) instead of native radios.
- All user-facing strings go through the `translate` pipe (params supported);
  TS-side strings call `SolarisTranslateService` directly, following the same
  required-service pattern as the pipe and the other framework components.

## Sync / external calendars (Google et al.)

Vendor integrations (OAuth, HTTP, push channels) live in the consumer app,
never in the framework. The lib exposes everything a sync adapter needs:

| Lib field                               | Sync mapping                                                                           |
| --------------------------------------- | -------------------------------------------------------------------------------------- |
| `id` (consumer-owned, stable)           | Provider event id (`events.insert/update/delete`) / `iCalUID` correlation              |
| `calendarId` (work/personal/room)       | Provider calendar id (`calendarList`)                                                  |
| `start/end` ISO-with-offset + `allDay`  | `start.dateTime/date` + `end`, with `timeZone`                                         |
| `recurrence` subset                     | RFC5545 `RRULE` (`FREQ/INTERVAL/COUNT/UNTIL/BYDAY`); monthly `monthDay` → `BYMONTHDAY` |
| `recurrenceExceptionDates`              | Detached instances (`exdates` / `originalStartTime` overrides)                         |
| `timeZone` display zone                 | `timeZone` parameter of date-times                                                     |
| `description` / `meetingUrl`            | Provider description / location or conference link                                     |
| `scheduleSlot`                          | Bookable appointment window marker (consumer-defined semantics)                        |
| `eventSave` draft / `eventDelete` scope | Create/update vs. single-instance vs. series delete                                    |

Rule of thumb: the lib emits immutable proposals, the adapter translates
them to provider calls. No network, no credentials, no vendor SDK in lib.

## Limits

- Recurrence is the D-RRULE subset only: `daily|weekly|monthly|yearly` with
  `interval`, `count|until`, `byWeekday[]` (weekly), `monthDay` (monthly),
  `exDates`. Full RFC5545 (`nth-weekday`, `bysetpos`, complex rules) is OUT.
- `monthDay` derives from the start date; the editor does not expose an
  arbitrary day picker for monthly series.
- Time entry is a native `time` input next to the reused `date-picker`; there
  is no duration picker (end defaults to start when empty or reversed).
- No drag interaction (phase C6); the editor emits proposals only.

## CSS Variables

The editor defines no component-scoped variables: section borders use
`--solaris-neutral-border-subtle`, validation text uses
`--solaris-danger-foreground`, and weekday chips use
`--solaris-neutral-subtle` / `--solaris-primary-soft` /
`--solaris-primary-foreground` directly. Errors render through
`solaris-form-error` and the time-zone action is a
`solaris-button` (`appearance="ghost"`, `size="sm"`).
