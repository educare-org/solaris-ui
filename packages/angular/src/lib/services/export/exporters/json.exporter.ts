import type {
  SolarisExportRequest,
  SolarisExporter,
  SolarisJsonOptions,
} from '../model/export.types';
import { resolveExportCellText, resolveExportHeader } from './csv.exporter';

export function buildJsonContent<T>(
  request: SolarisExportRequest<T>,
  options: SolarisJsonOptions = {},
): string {
  const pretty = options.pretty ?? true;
  const data = request.rows.map((row) => {
    const entry: Record<string, string> = {};
    for (const column of request.columns) {
      entry[resolveExportHeader(column)] = resolveExportCellText(row, column);
    }
    return entry;
  });
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}

export function createJsonExporter<T = unknown>(
  options: SolarisJsonOptions = {},
): SolarisExporter<T> {
  return {
    id: 'json',
    label: 'Export JSON',
    labelKey: 'solaris.export.json',
    icon: 'json',
    extension: 'json',
    mime: 'application/json;charset=utf-8',
    buildContent: (request: SolarisExportRequest<T>) =>
      buildJsonContent(request as SolarisExportRequest<T>, options),
  };
}
