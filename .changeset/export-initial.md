---
'@educarehq/solaris-ui': minor
---

Add the agnostic export infrastructure: `SolarisExportService` (`exportAndDownload`, `downloadFile`, `maxRows` truncation with `SOLARIS_EXPORT_CONFIG`), the `SolarisExporter` plugin contract, built-in `createCsvExporter` (RFC 4180, BOM, `delimiter: ','` default with `SOLARIS_CSV_DELIMITER_PRESETS.semicolon` for Excel PT-BR) and `createJsonExporter`, plus `provideSolarisExport([...])` registration. New formats ship as new exporters with no consumer changes.
