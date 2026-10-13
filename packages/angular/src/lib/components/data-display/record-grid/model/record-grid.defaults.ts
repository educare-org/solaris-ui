export const SOLARIS_RECORD_GRID_CELL_TEMPLATE_ID = 'solaris-record-grid-cell';
export const SOLARIS_RECORD_GRID_HEADER_TEMPLATE_ID =
  'solaris-record-grid-header';
export const SOLARIS_RECORD_GRID_FOOTER_CELL_TEMPLATE_ID =
  'solaris-record-grid-footer-cell';
export const SOLARIS_RECORD_GRID_SELECTION_COLUMN_ID =
  '__solaris_record_grid_selection__';

export const RECORD_GRID_ARIA_LABEL_FALLBACK_KEY =
  'solaris.dataDisplay.recordGrid.ariaLabel';
export const RECORD_GRID_ARIA_LABEL_FALLBACK = 'Record grid';
export const RECORD_GRID_EMPTY_TEXT_KEY =
  'solaris.dataDisplay.recordGrid.emptyText';
export const RECORD_GRID_EMPTY_TEXT = 'No records found';
export const RECORD_GRID_LOADING_TEXT_KEY =
  'solaris.dataDisplay.recordGrid.loadingText';
export const RECORD_GRID_LOADING_TEXT = 'Loading records';
export const RECORD_GRID_ERROR_TEXT_KEY =
  'solaris.dataDisplay.recordGrid.errorText';
export const RECORD_GRID_ERROR_TEXT = 'Unable to load records';
export const RECORD_GRID_SELECT_ALL_LABEL_KEY =
  'solaris.dataDisplay.recordGrid.selectAllVisible';
export const RECORD_GRID_SELECT_ALL_LABEL = 'Select all visible rows';
export const RECORD_GRID_SELECT_ROW_LABEL_KEY =
  'solaris.dataDisplay.recordGrid.selectRow';
export const RECORD_GRID_SELECT_ROW_LABEL = 'Select row {{rowId}}';
export const RECORD_GRID_SORT_ASC_LABEL_KEY =
  'solaris.dataDisplay.recordGrid.sortAsc';
export const RECORD_GRID_SORT_ASC_LABEL = 'Sort {{column}} ascending';
export const RECORD_GRID_SORT_DESC_LABEL_KEY =
  'solaris.dataDisplay.recordGrid.sortDesc';
export const RECORD_GRID_SORT_DESC_LABEL = 'Sort {{column}} descending';
export const RECORD_GRID_SORT_CLEAR_LABEL_KEY =
  'solaris.dataDisplay.recordGrid.sortClear';
export const RECORD_GRID_SORT_CLEAR_LABEL = 'Clear sorting for {{column}}';
export const RECORD_GRID_SORTED_ANNOUNCE_KEY =
  'solaris.dataDisplay.recordGrid.sortedAnnounce';
export const RECORD_GRID_SORTED_ANNOUNCE = 'Sorted by {{column}} {{direction}}';
export const RECORD_GRID_SORTED_CLEARED_ANNOUNCE_KEY =
  'solaris.dataDisplay.recordGrid.sortedCleared';
export const RECORD_GRID_SORTED_CLEARED_ANNOUNCE =
  'Record grid sorting cleared';
export const RECORD_GRID_COMMIT_ALL_LABEL_KEY =
  'solaris.dataDisplay.recordGrid.commitAll';
export const RECORD_GRID_COMMIT_ALL_LABEL = 'Commit all drafts';
export const RECORD_GRID_DISCARD_ALL_LABEL_KEY =
  'solaris.dataDisplay.recordGrid.discardAll';
export const RECORD_GRID_DISCARD_ALL_LABEL = 'Discard all drafts';

export function normalizeRecordGridCellPadding(
  value: string | undefined,
): 'none' | 'sm' | 'md' | 'lg' {
  if (value === 'sm' || value === 'md' || value === 'lg') {
    return value;
  }
  return 'none';
}

export function normalizeRecordGridStripedMode(
  value: string | undefined,
): 'even' | 'odd' {
  return value === 'odd' ? 'odd' : 'even';
}
