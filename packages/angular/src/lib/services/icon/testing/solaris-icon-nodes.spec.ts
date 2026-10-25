import { describe, it, expect } from 'vitest';

import {
  iconElementsToNodes,
  sanitizedInnerToNodes,
} from '../service/solaris-icon-nodes';

describe('solaris-icon-nodes', () => {
  it('should convert outline elements to nodes with kebab-case attrs', () => {
    const nodes = iconElementsToNodes([
      { type: 'path', d: 'm6 9 6 6 6-6', fillRule: 'evenodd' },
      { type: 'circle', cx: 12, cy: 12, r: 3 },
    ]);
    expect(nodes).toHaveLength(2);
    expect(nodes[0]).toEqual({
      tag: 'path',
      attrs: { d: 'm6 9 6 6 6-6', 'fill-rule': 'evenodd' },
      children: [],
    });
    expect(nodes[1].attrs).toEqual({ cx: '12', cy: '12', r: '3' });
  });

  it('should parse flat sanitized markup into leaf nodes', () => {
    const nodes = sanitizedInnerToNodes(
      '<path d="m6 9 6 6 6-6"/><circle cx="12" cy="12" r="3"/>',
    );
    expect(nodes).toHaveLength(2);
    expect(nodes[0].tag).toBe('path');
    expect(nodes[0].attrs['d']).toBe('m6 9 6 6 6-6');
    expect(nodes[1].tag).toBe('circle');
  });

  it('should parse nested mask and group markup preserving hierarchy', () => {
    const nodes = sanitizedInnerToNodes(
      '<mask id="solaris-x-2-mask"><rect x="0" y="0" width="24" height="24" rx="4" fill="#fff"/>' +
        '<g fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="m6 9 6 6 6-6"/></g></mask>' +
        '<rect x="0" y="0" width="24" height="24" rx="4" fill="currentColor" mask="url(#solaris-x-2-mask)"/>',
    );
    expect(nodes).toHaveLength(2);
    expect(nodes[0].tag).toBe('mask');
    expect(nodes[0].attrs['id']).toBe('solaris-x-2-mask');
    expect(nodes[0].children).toHaveLength(2);
    expect(nodes[0].children[0].tag).toBe('rect');
    expect(nodes[0].children[1].tag).toBe('g');
    expect(nodes[0].children[1].children).toHaveLength(1);
    expect(nodes[0].children[1].children[0].tag).toBe('path');
    expect(nodes[1].tag).toBe('rect');
    expect(nodes[1].attrs['mask']).toBe('url(#solaris-x-2-mask)');
  });

  it('should parse duotone group markup with opacity layers', () => {
    const nodes = sanitizedInnerToNodes(
      '<g fill="currentColor" opacity="0.25"><path d="M19 21l-7-4-7 4V5a2 2 0 012-2h10a2 2 0 012 2v16z"/></g>' +
        '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M19 21l-7-4-7 4V5a2 2 0 012-2h10a2 2 0 012 2v16z"/></g>',
    );
    expect(nodes).toHaveLength(2);
    expect(nodes[0].attrs).toMatchObject({
      fill: 'currentColor',
      opacity: '0.25',
    });
    expect(nodes[0].children[0].tag).toBe('path');
    expect(nodes[1].children[0].tag).toBe('path');
  });

  it('should drop disallowed tags and attributes while keeping safe nodes', () => {
    const nodes = sanitizedInnerToNodes(
      '<path d="m6 9 6 6 6-6" onload="alert(1)"/><script>alert(1)</script><use href="x"/>',
    );
    expect(nodes).toHaveLength(1);
    expect(nodes[0].tag).toBe('path');
    expect(nodes[0].attrs['onload']).toBeUndefined();
  });

  it('should return no nodes for empty or fully-unsafe markup', () => {
    expect(sanitizedInnerToNodes('')).toEqual([]);
    expect(sanitizedInnerToNodes('<script>alert(1)</script>')).toEqual([]);
  });

  it('should preserve vector-effect for absolute stroke widths', () => {
    const nodes = sanitizedInnerToNodes(
      '<g vector-effect="non-scaling-stroke"><path d="m6 9 6 6 6-6"/></g>',
    );
    expect(nodes).toHaveLength(1);
    expect(nodes[0].attrs['vector-effect']).toBe('non-scaling-stroke');
    expect(nodes[0].children).toHaveLength(1);
  });
});
