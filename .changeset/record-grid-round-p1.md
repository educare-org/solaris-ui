---
'@educarehq/solaris-ui': patch
---

fix(record-grid): correct error, selection, sticky and i18n contract

- `hasError`/`hasEmptyState` resolve through `error`/`errorKey` with the
  translated fallback, matching `solaris-table`; `errorKey` alone now shows
  the error state.
- Grouped headers keep a functional select-all checkbox reusing
  `toggleSelectAllVisibleRows` and the tri-state labels.
- `getAriaSort` returns `null` for non-sortable columns so the attribute is
  removed instead of polluting screen readers with `none`.
- Second grouped header row exposes continuous `aria-colindex` through the
  shared visible-column index.
- `allVisibleRowsSelected`/`someVisibleRowsSelected` are gated by
  `selectionMode="multiple"`, matching the table in `single`/`none` with a
  prefilled model.
- `isStickyColumn` keeps the first data column fixed when selection is
  enabled (selection offset parity with the table).
- Header/footer template resolvers return their concrete directive types
  without unsafe casts.
- `GradebookAutofocusDirective` is exported from the gradebook barrel and the
  public entrypoint; record-grid imports it from the barrel.
- Gradebook text moves to `solaris.dataDisplay.gradebook.*` (`editorLabel`,
  `status.missing/late/excused`, en-US + pt-BR) with legacy `gradebook.*`
  fallback before the documented English text.
- Sort-cleared announcements resolve through
  `solaris.dataDisplay.{table,recordGrid}.sortedCleared` (en-US + pt-BR).
- Editor keeps the cell alignment (`text-align: inherit`) and shares the
  table `tabular-nums`, so digits no longer shift or change glyphs in edit
  mode; table uses `border-collapse: collapse` (parity with `solaris-table`)
  with single-line body/foot joints and no doubled sticky-edge divider.
- Draftbar actions use the `solaris-button` directive
  (`appearance="outline" size="sm"`) instead of hand-rolled styles and the
  draftbar aligns its actions to the end.
- Sticky first column draws its divider as its own `border-inline-end` (single
  collapsed line, still stuck when scrolled) instead of a `box-shadow` that
  browsers drop under `border-collapse: collapse`.
- Merged span origins (`rowspan`/`colspan` > 1, e.g. identity/section columns)
  no longer open editors: the write target would be ambiguous, so they render
  as text like computed cells.

Follow-ups (not done here, tracked for P2/P3): F1 synthetic `footerText`
rows, F2 `commitAll` `::` separator, F3 `parseDraftValue "09"`, F4 dead
`normalizeRecordGridCellPadding/StripedMode`, F5 undocumented
`records`/`sectionOf`/`writeOf` API, F6 `data` without `SolarisTableDataSource`.
