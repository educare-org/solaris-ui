import { describe, it, expect } from 'vitest';

import {
  sanitizeIconSvgInner,
  isSafeIconSvgInner,
} from '../service/solaris-icon-sanitizer';

describe('solaris-icon-sanitizer', () => {
  it('should keep safe outline content unchanged', () => {
    const inner = '<path d="m6 9 6 6 6-6"/>';
    expect(sanitizeIconSvgInner(inner)).toBe(inner);
    expect(isSafeIconSvgInner(inner)).toBe(true);
  });

  it('should remove script tags', () => {
    const out = sanitizeIconSvgInner(
      '<path d="m6 9 6 6 6-6"/><script>alert(1)</script>',
    );
    expect(out).not.toContain('script');
    expect(out).toContain('<path');
  });

  it('should strip event handler attributes', () => {
    const out = sanitizeIconSvgInner(
      '<path d="m6 9 6 6 6-6" onload="alert(1)"/>',
    );
    expect(out).not.toContain('onload');
  });

  it('should remove foreignObject and use tags', () => {
    expect(
      sanitizeIconSvgInner('<foreignObject><p>x</p></foreignObject>'),
    ).toBe('');
    expect(sanitizeIconSvgInner('<use href="https://evil/x.svg#y"/>')).toBe('');
  });

  it('should strip javascript urls and expressions', () => {
    expect(
      sanitizeIconSvgInner(
        '<path d="m6 9 6 6 6-6" fill="javascript:alert(1)"/>',
      ),
    ).not.toContain('javascript:');
  });

  it('should drop disallowed svg/style wrappers but keep inner safe nodes', () => {
    const out = sanitizeIconSvgInner(
      '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    );
    expect(out).toContain('<path');
    expect(out).not.toContain('<svg');
  });

  it('should remove html comments', () => {
    expect(sanitizeIconSvgInner('<!-- x --><path d="m6 9 6 6 6-6"/>')).toBe(
      '<path d="m6 9 6 6 6-6"/>',
    );
  });
});
