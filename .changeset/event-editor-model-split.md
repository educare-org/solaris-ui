---
'@educarehq/solaris-ui': patch
---

Event editor architecture cleanup: split component internals into model files.

- Fallback text moved out of the component into one file per locale (`event-editor/model/i18n/event-editor-text.{en,pt,es}.ts`, full translation keys so the no-service fallback actually resolves) behind `model/event-editor-text.ts` (`SOLARIS_EVENT_EDITOR_FALLBACKS`, `resolveEventEditorFallback`).
- Types (`SolarisEventEditorFreq`, `SolarisEventEditorEndsMode`, `SolarisEventEditorReminderRow`, `timeZoneOptions` on `SolarisEventEditorData`) live in `model/event-editor.types.ts`; shared constants (colors, reminder presets/limit, curated zones) in `model/event-editor.constants.ts`; pure draft/hydrate/date helpers in `model/event-editor.utils.ts`, which also drops `buildDraft`/`hydrate` cognitive complexity back under the limit and removes the nested ternary in `onFreq`.
- The template now consumes the previously unused `isCustomRecurrence` computed.
- Showcase demo dialog binds `(timeZoneChange)="onTimeZoneChange($event)"` (fixes TS2554).
