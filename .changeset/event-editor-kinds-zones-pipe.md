---
'@educarehq/solaris-ui': minor
---

Event editor second overhaul: item kinds, separate time zones, description/link, pipe-based i18n.

BREAKING: `eventSave` now emits `SolarisCalendarEvent | SolarisCalendarTask` (tasks emit a task draft with `due`/`completed`); `SolarisEventVisibility` narrowed to `'public' | 'private'` (unset/legacy values hydrate as `public`); the component fallback text files are gone (see below).

- Item kinds: a `solaris-segmented-control` (event/task/appointment schedule) on top. Tasks hide end dates, recurrence, reminders and visibility and emit `SolarisCalendarTask`; schedules persist `scheduleSlot: true` on the event. New `itemKindChange` output; `event` input and `SolarisEventEditorData.event` accept the union.
- Time zones: the all-day row keeps only the change-zone button (current zone no longer displayed). The picker dialog body is now a searchable `solaris-select`. A new "separate start/end time zones" checkbox reveals two searchable zone selects with a swap action; new `timeZoneEnd` input + `timeZoneEndChange` output (input-mirroring). Draft/record conversions use the start zone for the start and the end zone for the end.
- New `description` (textarea) and `meetingUrl` fields on `SolarisCalendarEvent` (plus `description` on `SolarisCalendarTask`), persisted in drafts.
- `visibility` offers only public/private; `color` is now a select pairing the token swatch with the color name, sharing a row with visibility.
- i18n: removed the custom `text()` method — templates use the `translate` pipe (params included), TS-side strings call the required `SolarisTranslateService` directly like every other component; the per-component fallback files were deleted (the service-level per-locale maps remain the single source).
