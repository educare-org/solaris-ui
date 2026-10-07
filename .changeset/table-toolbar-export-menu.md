---
'@educarehq/solaris-ui': minor
---

feature(table-filter): export menu now groups options under a "Format" title (`solaris.dataDisplay.tableFilter.exportFormat`, en-US/pt-BR) and shows a per-format icon. `SolarisExporter` gains an optional `icon` field; the built-in CSV/JSON exporters use `file-text`/`json` (`json` also added to the built-in icon name union).
