---
'@educarehq/solaris-ui': patch
---

fix(forms): fall back to embedded labels when no translate provider is present

Always-rendered, value-driven field chrome (clear-button aria labels in email, phone, date-picker, date-range-picker, select and multi-select; date-picker text resolver; date-range-picker calendar/placeholder labels and resolved locale; phone country list locale) no longer crashes with `TypeError: Cannot read properties of null` when `SolarisTranslateService` is provided as `null`. Label resolution now uses optional chaining with the existing en-US strings as embedded defaults, so trees rendered without a translate provider (e.g. chart-shell and calendar-shell fallback tests) keep working.
