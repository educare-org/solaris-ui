import { TestBed } from '@angular/core/testing';

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
