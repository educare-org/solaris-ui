import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { vi } from 'vitest';

import { createCsvExporter } from '../exporters/csv.exporter';
import {
  SolarisExportService,
  resolveExportFilename,
} from '../service/export.service';

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
