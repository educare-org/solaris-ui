---
'@educarehq/solaris-ui': minor
---

Add `solaris-table-toolbar` + `solaris-column-manager` (`data-display/table-filter`): global search (debounced), per-column conditions (text/number/date/options operators with chips + clear-all), saved-view tabs with `viewCreate`, pluggable export button (`icon` default, `icon-label` opt-in; hidden without exporters, direct download with one, menu with many), and the `Customize columns` manager (drag-reorder with keyboard alternative, visibility toggles, Reset/Cancel/Save). Pure helpers (`applyTableFilters`, `applyOrderedVisibleColumns`, persistence) cover the client adapter; server tables consume `filterChange`. `solaris-table` gains the `ng-template[solaris-table-toolbar]` header slot inside its frame (mirrors the pagination footer); without the slot the table is unchanged. Follow-ups: nested AND/OR groups, dirty-view state, URL-shared views, XLSX exporter.
