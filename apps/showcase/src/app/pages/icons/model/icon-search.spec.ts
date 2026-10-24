import { describe, it, expect } from 'vitest';

import { normalizeIconText, matchesIconQuery } from './icon-search';

const bookmark = {
  name: 'bookmark',
  keywords: ['save', 'favorite', 'salvar', 'favorito'],
  aliases: [],
};

describe('icon-search', () => {
  it('should match by exact name', () => {
    expect(matchesIconQuery(bookmark, 'bookmark')).toBe(true);
  });

  it('should match by keyword in another language', () => {
    expect(matchesIconQuery(bookmark, 'save')).toBe(true);
    expect(matchesIconQuery(bookmark, 'salvar')).toBe(true);
  });

  it('should match case-insensitively', () => {
    expect(matchesIconQuery(bookmark, 'SAVE')).toBe(true);
  });

  it('should match ignoring accents', () => {
    expect(normalizeIconText('notificação')).toBe('notificacao');
    expect(
      matchesIconQuery(
        { name: 'notification', keywords: ['notificação'], aliases: [] },
        'notificacao',
      ),
    ).toBe(true);
  });

  it('should match partial terms', () => {
    expect(matchesIconQuery(bookmark, 'mark')).toBe(true);
  });

  it('should return true for empty query', () => {
    expect(matchesIconQuery(bookmark, '  ')).toBe(true);
  });

  it('should reject unrelated queries', () => {
    expect(matchesIconQuery(bookmark, 'truck')).toBe(false);
  });
});
