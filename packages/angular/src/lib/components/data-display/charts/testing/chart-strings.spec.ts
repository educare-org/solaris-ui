import { describe, expect, it } from 'vitest';

import {
  chartFallbackLanguage,
  resolveChartFallback,
} from '../model/strings/chart-strings';

describe('Solaris chart strings', () => {
  it('resolves locales with regional fallback to English', () => {
    expect(resolveChartFallback('pt-BR', 'solaris.chart.viewLine', {})).toBe(
      'Linha',
    );
    expect(resolveChartFallback('es-419', 'solaris.chart.viewPie', {})).toBe(
      'Circular',
    );
    expect(resolveChartFallback('fr-FR', 'solaris.chart.viewBar', {})).toBe(
      'Bar',
    );
  });

  it('renders templates and returns the key when unknown', () => {
    expect(
      resolveChartFallback('en-US', 'solaris.chart.legendToggle', {
        label: 'Receita',
      }),
    ).toBe('Toggle Receita series');
    expect(resolveChartFallback('pt-BR', 'solaris.chart.unknown', {})).toBe(
      'solaris.chart.unknown',
    );
  });

  it('accepts keys without the service prefix', () => {
    expect(resolveChartFallback('en-US', 'viewLine', {})).toBe('Line');
  });

  it('keeps placeholders without matching params', () => {
    expect(
      resolveChartFallback('en-US', 'solaris.chart.legendToggle', {}),
    ).toBe('Toggle {{label}} series');
  });

  it('maps base languages for the service fallback', () => {
    expect(chartFallbackLanguage('pt-BR')).toBe('pt');
    expect(chartFallbackLanguage('es-MX')).toBe('es');
    expect(chartFallbackLanguage('de-DE')).toBe('en');
  });
});
