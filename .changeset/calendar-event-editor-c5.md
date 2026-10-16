---
'@educarehq/solaris-ui': minor
---

Add `solaris-calendar-event-editor` (phase C5): dialog-hosted event form with title, date/time via `solaris-date-picker`, all-day `solaris-checkbox` (projected label, Google parity), recurrence sub-form (daily/weekly/monthly/yearly + interval + weekday chips + count/until ends), time-zone display with change request (`timeZoneChange`, consumer-owned zone list), color dots bound to `event.color` (8 token-driven hues), and scoped delete (`this`/`following`/`all`) resolved immutably via `resolveSolarisEventDelete` (exDate/until/remove). Emits `eventSave`/`eventDelete`/`eventCancel`/`timeZoneChange`; 45 new `solaris.calendar.editor*` strings in en/pt-BR/es.
