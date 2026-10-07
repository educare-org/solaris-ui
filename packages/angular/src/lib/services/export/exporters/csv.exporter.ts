import type {
  SolarisCsvOptions,
  SolarisExportColumn,
  SolarisExportRequest,
  SolarisExporter,
} from '../model/export.types';
import { SOLARIS_CSV_DELIMITER_PRESETS } from '../model/export.types';

const CSV_BOM = '﻿';
const DEFAULT_DELIMITER = SOLARIS_CSV_DELIMITER_PRESETS.comma;

export function resolveExportCellText<T>(
  row: T,
  column: SolarisExportColumn<T>,
): string {
  const custom = column.displayValueOf?.(row);
  if (custom !== undefined && custom !== null && custom.trim() !== '') {
    return custom;
  }
  const raw = resolveExportRawValue(row, column);
  if (raw === null || raw === undefined) {
    return '';
  }
  return String(raw);
}

export function resolveExportHeader<T>(column: SolarisExportColumn<T>): string {
  const header = column.header?.trim();
  return header && header.length > 0 ? header : column.id;
}

export function escapeCsvCell(value: string, delimiter: string): string {
  const needsQuotes =
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r');
  if (!needsQuotes) {
    return value;
  }
  return `"${value.replace(/"/g, '""')}"`;
}

export function buildCsvContent<T>(
  request: SolarisExportRequest<T>,
  options: SolarisCsvOptions = {},
): string {
  const delimiter = options.delimiter ?? DEFAULT_DELIMITER;
  const includeHeader = options.includeHeader ?? true;
  const bom = options.bom ?? true;
  const lines: string[] = [];
  if (includeHeader) {
    lines.push(
      request.columns
        .map((column) => escapeCsvCell(resolveExportHeader(column), delimiter))
        .join(delimiter),
    );
  }
  for (const row of request.rows) {
    lines.push(
      request.columns
        .map((column) =>
          escapeCsvCell(resolveExportCellText(row, column), delimiter),
        )
        .join(delimiter),
    );
  }
  const body = lines.join('\r\n');
  return `${bom ? CSV_BOM : ''}${body}`;
}

export function createCsvExporter<T = unknown>(
  options: SolarisCsvOptions = {},
): SolarisExporter<T> {
  return {
    id: 'csv',
    label: 'Export CSV',
    labelKey: 'solaris.export.csv',
    icon: 'file-text',
    extension: 'csv',
    mime: 'text/csv;charset=utf-8',
    buildContent: (request: SolarisExportRequest<T>) =>
      buildCsvContent(request as SolarisExportRequest<T>, options),
  };
}

function resolveExportRawValue<T>(
  row: T,
  column: SolarisExportColumn<T>,
): unknown {
  if (typeof column.accessor === 'function') {
    return column.accessor(row);
  }
  if (column.accessor) {
    return row[column.accessor] as unknown;
  }
  return (row as Record<string, unknown>)[column.id];
}
