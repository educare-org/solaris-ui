---
'@educarehq/solaris-ui': patch
---

Fix select/multi-select dropdown seam in dark theme and harden panel sizing. Form-field-connected `outline` popover panels now use the page background (`--solaris-neutral-page`) instead of `neutral-default`, so trigger and panel read as a single continuous surface with no color step (dark page `#0a0a0a` no longer shows a lighter panel). Panel sizing moved to the pure `resolvePopoverSize` helper: `matchTriggerWidth` also caps `maxWidth` at the trigger width unless an explicit `maxWidth` is given, so the panel can never render wider than the trigger, and the size re-syncs on every overlay reposition (font swap, container resize while open).
