import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { vi } from 'vitest';

import { createCsvExporter } from '../exporters/csv.exporter';
import {
  SolarisExportService,
  resolveExportFilename,
} from '../service/export.service';
import {
  SOLARIS_EXPORT_CONFIG,
  SOLARIS_EXPORTERS,
} from '../token/export.tokens';

describe('resolveExportFilename', () => {
  it('should slugify base and append date plus extension', () => {
    const filename = resolveExportFilename(
      'My Table!',
      'csv',
      new Date('2026-03-04T10:00:00.000Z'),
    );
    expect(filename).toBe('my-table-20260304.csv');
  });

  it('should fall back to export base', () => {
    const filename = resolveExportFilename(
      '   ',
      'json',
      new Date('2026-01-02T00:00:00.000Z'),
    );
    expect(filename).toBe('export-20260102.json');
  });
});

describe('SolarisExportService.buildContent', () => {
  it('should truncate rows beyond maxRows', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(SolarisExportService);
    const exporter = createCsvExporter<{ id: string }>();
    const rows = Array.from({ length: 6000 }, (_, index) => ({
      id: `row-${index}`,
    }));
    const result = service.buildContent(exporter, {
      rows,
      columns: [{ id: 'id', header: 'Id', accessor: 'id' }],
    });
    expect(result.truncated).toBe(true);
    expect(result.rows.length).toBe(5000);
  });
});

describe('resolveExportFilename security', () => {
  const date = new Date('2026-03-04T10:00:00.000Z');

  it('should strip path traversal sequences', () => {
    const filename = resolveExportFilename('../../etc/passwd', 'csv', date);
    expect(filename).not.toContain('/');
    expect(filename).not.toContain('..');
    expect(filename).toBe('etc-passwd-20260304.csv');
  });

  it('should strip control characters and cap separator runs', () => {
    const filename = resolveExportFilename('a\x00\x1Fb___c', 'csv', date);
    expect(filename).toBe('a-b___c-20260304.csv');
  });
});

describe('SolarisExportService.downloadFile', () => {
  it('should set rel=noopener, download attr, and revoke the object URL', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(SolarisExportService);
    const doc = TestBed.inject(DOCUMENT);

    const createdAnchors: HTMLAnchorElement[] = [];
    const origCreate = doc.createElement.bind(doc);
    const createSpy = vi.spyOn(doc, 'createElement').mockImplementation(((
      tag: string,
      options?: ElementCreationOptions,
    ) => {
      const el = origCreate(tag, options);
      if (tag === 'a') createdAnchors.push(el as HTMLAnchorElement);
      return el;
    }) as typeof doc.createElement);

    const view = doc.defaultView as unknown as Record<string, unknown>;
    const urls = view['URL'] as unknown as Record<string, unknown>;
    const revokeSpy = vi.spyOn(urls, 'revokeObjectURL' as never);
    const origSetTimeout = view['setTimeout'];
    const timeoutCalls: unknown[][] = [];
    view['setTimeout'] = ((cb: () => void) => {
      timeoutCalls.push([cb]);
      cb();
      return 0;
    }) as unknown;

    const ok = service.downloadFile('a,b', 'my-table-20260304.csv', 'text/csv');

    expect(ok).toBe(true);
    expect(createdAnchors.length).toBeGreaterThanOrEqual(1);
    const anchor = createdAnchors[createdAnchors.length - 1];
    expect(anchor.rel).toBe('noopener');
    expect(anchor.download).toBe('my-table-20260304.csv');
    expect(timeoutCalls.length).toBeGreaterThanOrEqual(1);
    expect(revokeSpy).toHaveBeenCalled();
    view['setTimeout'] = origSetTimeout;
    createSpy.mockRestore();
  });
});

describe('SolarisExportService.exporters', () => {
  it('should return an empty list when no exporters are registered', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(SolarisExportService);
    expect(service.exporters).toEqual([]);
  });

  it('should return the registered exporters', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SOLARIS_EXPORTERS, useValue: [createCsvExporter()] },
      ],
    });
    const service = TestBed.inject(SolarisExportService);
    expect(service.exporters.length).toBe(1);
    expect(service.exporters[0].extension).toBe('csv');
  });

  it('should honor a positive configured max rows', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SOLARIS_EXPORT_CONFIG, useValue: { maxRows: 10 } },
      ],
    });
    expect(TestBed.inject(SolarisExportService).maxRows).toBe(10);
  });
});

describe('SolarisExportService.downloadFile guards', () => {
  it('should return false outside the browser', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const service = TestBed.inject(SolarisExportService);
    expect(service.downloadFile('a,b', 'export.csv', 'text/csv')).toBe(false);
  });

  it('should return false when the document has no default view', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: { defaultView: null } as unknown as Document,
        },
      ],
    });
    const service = TestBed.inject(SolarisExportService);
    expect(service.downloadFile('a,b', 'export.csv', 'text/csv')).toBe(false);
  });

  it('should return false when object URLs are unavailable', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(SolarisExportService);
    const doc = TestBed.inject(DOCUMENT);
    const view = doc.defaultView as unknown as {
      URL: { createObjectURL(blob: Blob): string };
    };
    const createSpy = vi
      .spyOn(view.URL, 'createObjectURL')
      .mockReturnValue(null as unknown as string);
    try {
      expect(service.downloadFile('a,b', 'export.csv', 'text/csv')).toBe(false);
    } finally {
      createSpy.mockRestore();
    }
  });
});

describe('SolarisExportService.exportAndDownload', () => {
  it('should build content and delegate the download without touching the DOM', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(SolarisExportService);
    const exporter = createCsvExporter<{ id: string }>();
    const downloadSpy = vi.spyOn(service, 'downloadFile').mockReturnValue(true);
    try {
      const result = service.exportAndDownload(exporter, {
        rows: [{ id: 'a' }, { id: 'b' }],
        columns: [{ id: 'id', header: 'Id', accessor: 'id' }],
        filename: 'My Report!',
      });
      expect(result.mime).toBe(exporter.mime);
      expect(result.truncated).toBe(false);
      expect(result.filename).toMatch(/^my-report-\d{8}\.csv$/);
      expect(downloadSpy).toHaveBeenCalledTimes(1);
      const [content, filename, mime] = downloadSpy.mock.calls[0];
      expect(filename).toBe(result.filename);
      expect(mime).toBe(exporter.mime);
      expect(content).toContain('Id');
      expect(content).toContain('a');
    } finally {
      downloadSpy.mockRestore();
    }
  });

  it('should flag truncation when rows exceed maxRows', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: SOLARIS_EXPORT_CONFIG, useValue: { maxRows: 1 } }],
    });
    const service = TestBed.inject(SolarisExportService);
    const exporter = createCsvExporter<{ id: string }>();
    const downloadSpy = vi
      .spyOn(service, 'downloadFile')
      .mockReturnValue(false);
    try {
      const result = service.exportAndDownload(exporter, {
        rows: [{ id: 'a' }, { id: 'b' }],
        columns: [{ id: 'id', header: 'Id', accessor: 'id' }],
      });
      expect(result.truncated).toBe(true);
      expect(result.filename).toMatch(/^export-\d{8}\.csv$/);
      expect(downloadSpy).toHaveBeenCalledTimes(1);
    } finally {
      downloadSpy.mockRestore();
    }
  });
});
