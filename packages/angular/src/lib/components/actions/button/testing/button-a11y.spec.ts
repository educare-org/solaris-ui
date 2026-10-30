import {
  resolveAriaLabel,
  resolveLoadingLabel,
} from '../functions/button-a11y';

describe('button-a11y', () => {
  it('prefers explicit loading label', () => {
    expect(
      resolveLoadingLabel('Saving', 'key', () => 'Translated', 'fallback'),
    ).toBe('Saving');
  });

  it('translates loading label key before fallback', () => {
    const translate = (key: string) => `t:${key}`;
    expect(resolveLoadingLabel(undefined, 'key', translate, 'fallback')).toBe(
      't:key',
    );
    expect(
      resolveLoadingLabel(undefined, undefined, translate, 'fallback'),
    ).toBe('t:fallback');
  });

  it('returns undefined without translator', () => {
    expect(
      resolveLoadingLabel(undefined, 'key', undefined, 'fallback'),
    ).toBeUndefined();
  });

  it('resolves aria label with key translation', () => {
    const translate = (key: string) => `t:${key}`;
    expect(resolveAriaLabel('Close', 'key', translate)).toBe('Close');
    expect(resolveAriaLabel(undefined, 'key', translate)).toBe('t:key');
    expect(resolveAriaLabel(undefined, undefined, translate)).toBeUndefined();
  });
});
