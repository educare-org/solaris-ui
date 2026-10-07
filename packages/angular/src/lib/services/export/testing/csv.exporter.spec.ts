import {
  buildCsvContent,
  createCsvExporter,
  escapeCsvCell,
} from '../exporters/csv.exporter';

interface Person {
  id: string;
  name: string;
  email: string;
}

const ROWS: readonly Person[] = [
  { id: '1', name: 'Ana', email: 'ana@example.com' },
  { id: '2', name: 'Beto "o bravo"', email: 'beto@example.com' },
];

describe('escapeCsvCell', () => {
  it('should leave plain values untouched', () => {
    expect(escapeCsvCell('Ana', ',')).toBe('Ana');
  });

  it('should quote values with delimiter, quotes or newlines', () => {
    expect(escapeCsvCell('a,b', ',')).toBe('"a,b"');
    expect(escapeCsvCell('say "hi"', ',')).toBe('"say ""hi"""');
    expect(escapeCsvCell('line\nbreak', ',')).toBe('"line\nbreak"');
  });
});

describe('buildCsvContent', () => {
  it('should build header plus rows with BOM by default', () => {
    const content = buildCsvContent({
      rows: ROWS.slice(0, 1),
      columns: [
        { id: 'name', header: 'Name', accessor: 'name' },
        { id: 'email', header: 'Email', accessor: 'email' },
      ],
    });
    expect(content.startsWith('﻿')).toBe(true);
    expect(content).toContain('Name,Email');
    expect(content).toContain('Ana,ana@example.com');
  });

  it('should escape quotes and respect semicolon delimiter', () => {
    const content = buildCsvContent(
      {
        rows: ROWS.slice(1),
        columns: [
          { id: 'name', header: 'Name', accessor: 'name' },
          { id: 'email', header: 'Email', accessor: 'email' },
        ],
      },
      { delimiter: ';', bom: false },
    );
    expect(content).toContain('"Beto ""o bravo""";beto@example.com');
  });

  it('should prefer displayValueOf over raw accessor', () => {
    const content = buildCsvContent(
      {
        rows: ROWS.slice(0, 1),
        columns: [
          {
            id: 'name',
            header: 'Name',
            accessor: 'name',
            displayValueOf: () => 'Custom',
          },
        ],
      },
      { bom: false },
    );
    expect(content).toContain('Custom');
  });
});

describe('createCsvExporter', () => {
  it('should expose csv metadata and build content', () => {
    const exporter = createCsvExporter<Person>();
    expect(exporter.id).toBe('csv');
    expect(exporter.extension).toBe('csv');
    expect(exporter.icon).toBe('file-text');
    const content = exporter.buildContent({
      rows: ROWS.slice(0, 1),
      columns: [{ id: 'name', header: 'Name', accessor: 'name' }],
    });
    expect(content).toContain('Ana');
  });
});
