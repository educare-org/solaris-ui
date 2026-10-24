import { describe, it, expect } from 'vitest';

import { SOLARIS_ICONS_METADATA } from '../icons/generated/solaris-icons-metadata';
import { SOLARIS_OUTLINE_SVG } from '../icons/generated/solaris-icons-outline-svg';
import { SOLARIS_BUILT_IN_ICONS } from '../icons/solaris-built-in-icons';

describe('solaris-icons-generated', () => {
  it('should cover every built-in icon', () => {
    const names = new Set(SOLARIS_BUILT_IN_ICONS.map((i) => i.name));
    expect(Object.keys(SOLARIS_ICONS_METADATA).length).toBe(names.size);
    for (const name of names) {
      expect(SOLARIS_ICONS_METADATA[name]).toBeDefined();
      expect(SOLARIS_OUTLINE_SVG[name]?.length).toBeGreaterThan(0);
    }
  });

  it('should find bookmark by save keyword', () => {
    expect(SOLARIS_ICONS_METADATA['bookmark'].keywords).toContain('save');
    expect(SOLARIS_ICONS_METADATA['bookmark'].class).toBe('fillable');
  });

  it('should classify rss as redrawable and chart-spline as stroke-only', () => {
    expect(SOLARIS_ICONS_METADATA['rss'].class).toBe('redrawable');
    expect(SOLARIS_ICONS_METADATA['chart-spline'].class).toBe('stroke-only');
  });

  it('should have valid metadata shapes', () => {
    for (const meta of Object.values(SOLARIS_ICONS_METADATA)) {
      expect(meta.categories.length).toBeGreaterThan(0);
      expect(['fillable', 'redrawable', 'stroke-only']).toContain(meta.class);
      expect(meta.availableVariants).toContain('outline');
    }
  });
});
