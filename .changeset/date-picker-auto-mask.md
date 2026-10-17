---
'@educarehq/solaris-ui': patch
---

Apply the locale date mask while typing in date-picker and date-range-picker: writing `16102026` in `pt-BR` becomes `16/10/2026` (`dd/MM/yyyy`). Order and separator always follow `locale` (`MM/dd/yyyy` in `en-US`), eight continuous digits parse without separators, and only complete `yyyy` years are committed.
