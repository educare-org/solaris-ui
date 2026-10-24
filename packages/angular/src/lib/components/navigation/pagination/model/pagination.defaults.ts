export const DEFAULT_SOLARIS_PAGINATION_PAGE_INDEX = 0;
export const DEFAULT_SOLARIS_PAGINATION_PAGE_SIZE = 10;
export const DEFAULT_SOLARIS_PAGINATION_PAGE_SIZE_OPTIONS: readonly number[] = [
  10, 25, 50,
];

export const PAGINATION_ARIA_LABEL_FALLBACK_KEY =
  'solaris.navigation.pagination.ariaLabel';
export const PAGINATION_ARIA_LABEL_FALLBACK_TEXT = 'Pagination';
export const PAGINATION_FIRST_PAGE_LABEL_KEY =
  'solaris.navigation.pagination.firstPage';
export const PAGINATION_FIRST_PAGE_LABEL = 'First page';
export const PAGINATION_PREVIOUS_PAGE_LABEL_KEY =
  'solaris.navigation.pagination.previousPage';
export const PAGINATION_PREVIOUS_PAGE_LABEL = 'Previous page';
export const PAGINATION_NEXT_PAGE_LABEL_KEY =
  'solaris.navigation.pagination.nextPage';
export const PAGINATION_NEXT_PAGE_LABEL = 'Next page';
export const PAGINATION_LAST_PAGE_LABEL_KEY =
  'solaris.navigation.pagination.lastPage';
export const PAGINATION_LAST_PAGE_LABEL = 'Last page';
export const PAGINATION_ROWS_PER_PAGE_LABEL_KEY =
  'solaris.navigation.pagination.rowsPerPageLabel';
export const PAGINATION_ROWS_PER_PAGE_LABEL = 'Rows per page';
export const PAGINATION_RANGE_LABEL_KEY =
  'solaris.navigation.pagination.rangeLabel';
export const PAGINATION_RANGE_LABEL = '{{start}}–{{end}} of {{total}}';
export const PAGINATION_RANGE_LABEL_COMPACT_KEY =
  'solaris.navigation.pagination.rangeLabelCompact';
export const PAGINATION_RANGE_LABEL_COMPACT = '{{start}}–{{end}}';

export function clampPaginationPageIndex(
  pageIndex: number,
  pageSize: number,
  total: number | undefined,
): number {
  const normalized = Number.isFinite(pageIndex)
    ? Math.max(0, Math.floor(pageIndex))
    : 0;
  if (total === undefined) {
    return normalized;
  }
  if (total <= 0) {
    return 0;
  }
  const size = Math.max(1, Math.floor(pageSize) || 1);
  return Math.min(normalized, Math.max(0, Math.ceil(total / size) - 1));
}

export function normalizePaginationPageSizeOptions(
  value: readonly number[] | undefined,
  pageSize: number,
): readonly number[] {
  const source = value?.length
    ? value
    : DEFAULT_SOLARIS_PAGINATION_PAGE_SIZE_OPTIONS;
  const next = new Set<number>();
  for (const option of source) {
    const normalized = Math.max(0, Math.floor(Number(option)));
    if (Number.isFinite(normalized) && normalized > 0) {
      next.add(normalized);
    }
  }
  const size = Math.max(1, Math.floor(Number(pageSize)) || 1);
  next.add(size);
  return Array.from(next).sort((left, right) => left - right);
}

export function normalizeOptionalString(
  value: string | null | undefined,
): string | null {
  if (!value) {
    return null;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function interpolatePaginationText(
  template: string,
  params: Record<string, string | number>,
): string {
  return Object.entries(params).reduce((resolved, [key, value]) => {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return resolved
      .replace(
        new RegExp(String.raw`\{\{\s*${escaped}\s*}}`, 'g'),
        String(value),
      )
      .replace(new RegExp(String.raw`\{${escaped}\}`, 'g'), String(value));
  }, template);
}
