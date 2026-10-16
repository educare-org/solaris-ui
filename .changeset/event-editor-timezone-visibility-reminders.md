---
'@educarehq/solaris-ui': minor
---

Event editor overhaul: stacked time-zone picker, custom recurrence mode, framework radio-group, visibility and stacked reminders.

- Time zone: the change button now sits beside the all-day checkbox and opens `SolarisEventEditorTimezoneDialogComponent` stacked above the editor (search + listbox, curated default catalog overridable via `timeZoneOptions`). `timeZoneChange` now emits the selected zone (`output<string>`, input-mirroring); consumers write it back to `timeZone`.
- Recurrence: `Repete` gains a `Custom` (`editorFreqCustom`) option; `Repetir a cada` and `Termina` (plus the inner `editorCustomFreq` select) only appear in custom mode. Simple frequencies imply interval 1 / never ends; existing complex series hydrate into custom.
- Delete scope now uses the framework `solaris-radio-group` + `solaris-radio` instead of native radios.
- New `visibility` (`default|public|private`) select and stacked `reminders` (up to 5 × presets at-start/5/10/15/30min/1h/1day + `Custom…` minutes input, add/remove), both persisted on `SolarisCalendarEvent` (`visibility?`, `reminders?: SolarisEventReminder[]`).
- i18n: `solaris-translate-defaults.ts` split into one file per locale (`model/i18n/solaris-translate.{en-US,pt-BR,es}.ts`, re-exported for compatibility) plus new `editorFreqCustom`, `editorVisibility*`, `editorReminder*` and `editorTimezone*` keys in en-US/pt-BR/es.
