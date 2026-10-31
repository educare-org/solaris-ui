---
'@educarehq/solaris-ui': minor
---

feature(button): add async action support for button and icon-button

New `action` input (`() => Promise<unknown>`) on `SolarisButtonHostBase` (both `[solaris-button]` and `[solaris-icon-button]`) with internal `pending` state: effective loading is `manual || pending`, effective disabled includes `pending`, `aria-busy="true"` while pending, and clicks during pending are discarded. Emits `actionSuccess` with the result or `actionError` with the failure (resetting pending, restoring focus on error). On `<a>` with `href`, the directive calls `preventDefault()` before running the action. Promise-only; the action never runs on the server and initial pending is always `false`.
