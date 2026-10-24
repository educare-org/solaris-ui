import { describe, it, expect } from 'vitest';

import { iconElementsToInner } from '../service/solaris-icon-serializer';

describe('solaris-icon-serializer', () => {
  it('should serialize a path element', () => {
    expect(iconElementsToInner([{ type: 'path', d: 'm6 9 6 6 6-6' }])).toBe(
      '<path d="m6 9 6 6 6-6"/>',
    );
  });

  it('should map camelCase attrs to kebab-case', () => {
    expect(
      iconElementsToInner([
        { type: 'path', d: 'M0 0h24', fillRule: 'evenodd', strokeWidth: 3 },
      ]),
    ).toBe('<path d="M0 0h24" fill-rule="evenodd" stroke-width="3"/>');
  });

  it('should serialize circle and rect geometry', () => {
    expect(
      iconElementsToInner([
        { type: 'circle', cx: 12, cy: 12, r: 3 },
        { type: 'rect', x: 1, y: 1, width: 6, height: 6, fill: '#F35325' },
      ]),
    ).toBe(
      '<circle cx="12" cy="12" r="3"/><rect x="1" y="1" width="6" height="6" fill="#F35325"/>',
    );
  });
});
