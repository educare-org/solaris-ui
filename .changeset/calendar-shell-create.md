---
'solaris-ui-angular': patch
---

Click-to-create in the calendar shell: slot clicks and drag-create proposals open the event-editor dialog when `editable` (one-hour timed draft / proposed range, `solaris.calendar.newEvent` title fallback in en/pt-BR/es), saving emits `eventSave` for consumer upsert.
