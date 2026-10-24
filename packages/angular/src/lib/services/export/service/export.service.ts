import { DOCUMENT, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import type {
  SolarisExportRequest,
  SolarisExportResult,
  SolarisExporter,
} from '../model/export.types';
import {
  SOLARIS_EXPORT_CONFIG,
  SOLARIS_EXPORTERS,
} from '../token/export.tokens';

export const DEFAULT_SOLARIS_EXPORT_MAX_ROWS = 5000;
export const DEFAULT_SOLARIS_EXPORT_FILENAME_BASE = 'export';

export function resolveExportFilename(
  base: string | undefined,
  extension: string,
  now: Date = new Date(),
): string {
  const sanitized = (base ?? DEFAULT_SOLARIS_EXPORT_FILENAME_BASE)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const name =
    sanitized.length > 0 ? sanitized : DEFAULT_SOLARIS_EXPORT_FILENAME_BASE;
  return `${name}-${date}.${extension}`;
}

@Injectable({ providedIn: 'root' })
export class SolarisExportService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly registered = inject(SOLARIS_EXPORTERS, { optional: true });
  private readonly config = inject(SOLARIS_EXPORT_CONFIG, { optional: true });

  get exporters(): readonly SolarisExporter[] {
    return this.registered ?? [];
  }

  get maxRows(): number {
    const configured = this.config?.maxRows;
    return Number.isFinite(configured) && (configured as number) > 0
      ? (configured as number)
      : DEFAULT_SOLARIS_EXPORT_MAX_ROWS;
  }

  buildContent<T>(
    exporter: SolarisExporter<T>,
    request: SolarisExportRequest<T>,
  ): { content: string; truncated: boolean; rows: readonly T[] } {
    const rows =
      request.rows.length > this.maxRows
        ? request.rows.slice(0, this.maxRows)
        : request.rows;
    return {
      content: exporter.buildContent({ ...request, rows }),
      truncated: request.rows.length > this.maxRows,
      rows,
    };
  }

  downloadFile(content: string, filename: string, mime: string): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    const view = this.document.defaultView;
    if (!view || typeof view.Blob !== 'function') {
      return false;
    }
    const blob = new view.Blob([content], { type: mime });
    const url =
      typeof view.URL?.createObjectURL === 'function'
        ? view.URL.createObjectURL(blob)
        : null;
    if (!url) {
      return false;
    }
    const anchor = this.document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    this.document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    view.setTimeout(() => view.URL.revokeObjectURL(url), 1000);
    return true;
  }

  exportAndDownload<T>(
    exporter: SolarisExporter<T>,
    request: SolarisExportRequest<T>,
  ): SolarisExportResult {
    const { content, truncated, rows } = this.buildContent(exporter, request);
    const filename = resolveExportFilename(
      request.filename,
      exporter.extension,
    );
    this.downloadFile(content, filename, exporter.mime);
    void rows;
    return { filename, mime: exporter.mime, truncated };
  }
}
