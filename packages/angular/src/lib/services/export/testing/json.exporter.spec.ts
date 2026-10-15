import {
  buildJsonContent,
  createJsonExporter,
} from '../exporters/json.exporter';

describe('buildJsonContent', () => {
  it('should map rows to header-keyed objects', () => {
    const content = buildJsonContent({
      rows: [{ id: '1', name: 'Ana' }],
      columns: [{ id: 'name', header: 'Name', accessor: 'name' }],
    });
    expect(JSON.parse(content)).toEqual([{ Name: 'Ana' }]);
  });

  it('should support compact output', () => {
    const content = buildJsonContent(
      {
        rows: [{ id: '1', name: 'Ana' }],
        columns: [{ id: 'name', header: 'Name', accessor: 'name' }],
      },
      { pretty: false },
    );
    expect(content).toBe('[{"Name":"Ana"}]');
  });
});

describe('createJsonExporter', () => {
  it('should expose json metadata', () => {
    const exporter = createJsonExporter();
    expect(exporter.id).toBe('json');
    expect(exporter.extension).toBe('json');
    expect(exporter.icon).toBe('json');
    expect(exporter.labelKey).toBe('solaris.export.json');
    expect(exporter.label).toBe('Export JSON');
    expect(exporter.mime).toContain('application/json');
  });
});
