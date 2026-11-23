---
'@educarehq/solaris-ui': minor
---

Make the phone-field dial code editable inside the input (`+55 (11) 99999-8888`) with auto-detection on typing/paste and full-empty support, and align the country panel with the select visual language (connected, trigger-width matched, shared option states). Typing, focusing or clearing the input dismisses the panel without focus restore (keeping focus and keystrokes in the field); closing it from a country selection or Escape/Tab in the search restores focus as usual. Deleting auto-added formatting (e.g. the `)` in `+55 (11)`) also drops the last digit so backspace always shortens the number down to empty. Compact the search box (prefix divider and form-field-grade icon cell: stretched, centered, full-height border) and option rows with wider flag-to-name spacing, restore search autofocus on open, and harden clearing (clear action also syncs and refocuses the native input).
