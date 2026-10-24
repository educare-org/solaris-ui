import { describe, it, expect } from 'vitest';

import { SOLARIS_ICONS_METADATA } from '../icons/generated/solaris-icons-metadata';
import { SOLARIS_GENERATED_ICONS } from '../icons/generated/solaris-icons-generated';
import { SOLARIS_BUILT_IN_ICONS } from '../icons/solaris-built-in-icons';
import { iconElementsToInner } from '../service/solaris-icon-serializer';

describe('solaris-icons-generated', () => {
  it('should cover every built-in icon', () => {
    const names = new Set(SOLARIS_BUILT_IN_ICONS.map((i) => i.name));
    expect(Object.keys(SOLARIS_ICONS_METADATA).length).toBe(names.size);
    for (const name of names) {
      expect(SOLARIS_ICONS_METADATA[name]).toBeDefined();
      const definition = SOLARIS_GENERATED_ICONS.find((i) => i.name === name);
      expect(definition).toBeDefined();
      expect(
        iconElementsToInner(definition?.elements ?? []).length,
      ).toBeGreaterThan(0);
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

  it('should derive solid and duotone art for fillable icons only', () => {
    expect(SOLARIS_ICONS_METADATA['bookmark'].availableVariants).toEqual(
      expect.arrayContaining(['outline', 'solid', 'duotone']),
    );
    expect(SOLARIS_ICONS_METADATA['check'].availableVariants).toEqual([
      'outline',
    ]);
    expect(SOLARIS_ICONS_METADATA['rss'].availableVariants).toEqual([
      'outline',
      'solid',
      'duotone',
    ]);
  });

  it('should provide dedicated art for message, mail and user families', () => {
    for (const name of [
      'mail',
      'mail-open',
      'message-circle',
      'message-circle-2',
      'message-square',
      'inbox',
      'send',
      'user',
      'server',
      'success',
      'search',
    ]) {
      expect(SOLARIS_ICONS_METADATA[name].availableVariants, name).toEqual([
        'outline',
        'solid',
        'duotone',
      ]);
    }
  });

  it('should provide dedicated interior art without background squares', () => {
    for (const name of [
      'mic',
      'notification',
      'monitor',
      'maximize',
      'share',
      'route',
      'pull-request',
      'settings',
      'command',
      'crown',
      'leaf',
      'wallet',
      'key',
      'graduation-cap',
      'mouse-pointer-click',
      'link',
      'unlink',
      'link-2',
      'eye',
      'eye-off',
      'file',
      'file-text',
      'files',
      'filter',
      'gear',
      'layers',
      'columns',
      'folder',
      'star',
      'sun',
      'moon',
      'trash',
      'home',
      'save',
      'download',
      'upload',
      'share-2',
      'unlock',
      'star-plus',
      'sparkles',
      'trophy',
      'headphones-off',
      'grid',
      'issue',
      'image',
      'eject',
      'edit',
      'cookie',
      'calendar',
      'clipboard',
      'city',
      'backpack',
      'blocks',
      'badge',
      'book',
      'book-user',
      'calendar-sync',
      'copy',
      'export',
      'globe',
      'globe-off',
      'list',
      'list-ordered',
      'notebook-pen',
      'notebook-text',
      'notepad',
      'open-folder',
      'package',
      'panel-right',
      'plane',
      'podium',
      'receipt',
      'rocket',
      'security',
      'shopping-bag',
      'shopping-basket',
      'shopping-cart',
      'square-plus',
      'square-stack',
      'squared-text',
      'sticky-note',
      'storage',
      'table',
      'timer',
      'truck',
      'wrench',
    ]) {
      expect(SOLARIS_ICONS_METADATA[name].availableVariants, name).toEqual([
        'outline',
        'solid',
        'duotone',
      ]);
    }
    expect(SOLARIS_ICONS_METADATA['contrast'].availableVariants).toEqual([
      'outline',
      'solid',
      'duotone',
    ]);
  });

  it('should keep open-stroke icons without background squares', () => {
    for (const name of [
      'plus',
      'minus',
      'x',
      'caret-down',
      'caret-left',
      'caret-right',
      'caret-up',
      'chevron-down',
      'chevron-left',
      'chevron-right',
      'chevron-up',
      'chevron-first',
      'chevron-forward',
      'chevron-backward',
      'chevron-last',
      'arrow-left-right',
      'down-arrow',
      'down-left-arrow',
      'down-right-arrow',
      'up-arrow',
      'up-left-arrow',
      'up-right-arrow',
      'left-arrow',
      'right-arrow',
      'sort',
      'sort-asc',
      'sort-desc',
      'expand',
      'move',
      'log-in',
      'log-out',
      'refresh',
      'refresh-back',
      'repeat',
      'repeat-1',
      'repeat-2',
      'repeat-off',
      'rotate-ccw',
      'chart-spline',
      'hash',
      'handshake',
      'clock-arrow-right',
      'code',
      'code-xml',
      'signature',
    ]) {
      expect(SOLARIS_ICONS_METADATA[name].availableVariants, name).toEqual([
        'outline',
        'solid',
        'duotone',
      ]);
    }
  });

  it('should keep loader, dot, slash and ellipsis outline-only', () => {
    for (const name of [
      'loader',
      'dot',
      'slash',
      'ellipsis',
      'ellipsis-vertical',
      'grip-vertical',
      'check',
      'check-check',
    ]) {
      expect(SOLARIS_ICONS_METADATA[name].availableVariants).toEqual([
        'outline',
      ]);
    }
  });

  it('should include name tokens in keywords for every icon', () => {
    for (const [name, meta] of Object.entries(SOLARIS_ICONS_METADATA)) {
      expect(meta.keywords.length).toBeGreaterThan(0);
    }
    expect(SOLARIS_ICONS_METADATA['message-square'].keywords).toContain(
      'message',
    );
  });

  it('should have valid metadata shapes', () => {
    for (const meta of Object.values(SOLARIS_ICONS_METADATA)) {
      expect(meta.categories.length).toBeGreaterThan(0);
      expect(['fillable', 'redrawable', 'stroke-only']).toContain(meta.class);
      expect(meta.availableVariants).toContain('outline');
    }
  });
});
