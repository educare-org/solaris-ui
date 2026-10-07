export interface SolarisExportColumn<T = unknown> {
  readonly id: string;
  readonly header?: string;
  readonly displayValueOf?: (row: T) => string | null;
  readonly accessor?: keyof T | ((row: T) => unknown);
}

export interface SolarisExportRequest<T = unknown> {
  readonly rows: readonly T[];
  readonly columns: readonly SolarisExportColumn<T>[];
  readonly filename?: string;
}

export interface SolarisExporter<T = unknown> {
  readonly id: string;
  readonly label: string;
  readonly labelKey?: string;
  readonly icon?: string;
  readonly extension: string;
  readonly mime: string;
  buildContent: (request: SolarisExportRequest<T>) => string;
}

export type SolarisCsvDelimiter = ',' | ';';

export const SOLARIS_CSV_DELIMITER_PRESETS = {
  comma: ',',
  semicolon: ';',
} as const satisfies Record<string, SolarisCsvDelimiter>;

export type SolarisCsvDelimiterPreset =
  keyof typeof SOLARIS_CSV_DELIMITER_PRESETS;

export interface SolarisCsvOptions {
  readonly delimiter?: SolarisCsvDelimiter;
  readonly includeHeader?: boolean;
  readonly bom?: boolean;
}

export interface SolarisJsonOptions {
  readonly pretty?: boolean;
}

export interface SolarisExportConfig {
  readonly maxRows?: number;
}

export interface SolarisExportResult {
  readonly filename: string;
  readonly mime: string;
  readonly truncated: boolean;
}
