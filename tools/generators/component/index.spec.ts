import { describe, expect, it } from 'vitest';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import componentGenerator from './index';

describe('component generator', () => {
  it('creates the folder contract with dictionaries and changeset', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    await componentGenerator(tree, {
      name: 'color-picker',
      category: 'forms',
      type: 'component',
    });
    const base = 'packages/angular/src/lib/components/forms/color-picker';
    for (const file of [
      'component/color-picker.component.ts',
      'component/color-picker.component.html',
      'component/color-picker.component.scss',
      'model/color-picker.types.ts',
      'functions/color-picker.utils.ts',
      'testing/color-picker.component.spec.ts',
      'docs/color-picker.md',
      'translation/en-US.json',
      'translation/pt-BR.json',
      'translation/es-419.json',
      'translation/index.ts',
      'index.ts',
    ]) {
      expect(tree.exists(`${base}/${file}`)).toBe(true);
    }
    expect(tree.read(`${base}/index.ts`, 'utf-8')).toContain(
      'SolarisColorPickerComponent',
    );
    expect(
      tree.children('.changeset').filter((child) => child.endsWith('.md')),
    ).not.toHaveLength(0);
  });

  it('rejects unknown categories', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    await expect(
      componentGenerator(tree, {
        name: 'color-picker',
        category: 'unknown' as never,
        type: 'component',
      }),
    ).rejects.toThrow('Invalid category');
  });
});
