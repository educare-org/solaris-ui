import {
  resolveDialogNavItemState,
  isDialogNavItemClickable,
  findDialogNavFocusableSection,
  findDialogNavIndexByValue,
} from '../functions/dialog-nav.functions';

import type { SolarisDialogNavItem } from '../model/dialog-nav.types';

describe('dialog-nav.functions', () => {
  const item = (overrides?: Partial<SolarisDialogNavItem>) =>
    ({
      value: 'section',
      ...overrides,
    }) as SolarisDialogNavItem;

  describe('resolveDialogNavItemState', () => {
    it('should return active for the active index', () => {
      expect(resolveDialogNavItemState(1, 1)).toBe('active');
    });

    it('should return upcoming otherwise', () => {
      expect(resolveDialogNavItemState(0, 1)).toBe('upcoming');
      expect(resolveDialogNavItemState(2, 1)).toBe('upcoming');
    });
  });

  describe('isDialogNavItemClickable', () => {
    it('should never allow the active section', () => {
      expect(isDialogNavItemClickable(1, 1, item())).toBe(false);
    });

    it('should never allow disabled sections', () => {
      expect(isDialogNavItemClickable(0, 1, item({ disabled: true }))).toBe(
        false,
      );
    });

    it('should allow past and upcoming sections alike', () => {
      expect(isDialogNavItemClickable(0, 1, item())).toBe(true);
      expect(isDialogNavItemClickable(2, 1, item())).toBe(true);
    });
  });

  describe('findDialogNavFocusableSection', () => {
    const items: SolarisDialogNavItem[] = [
      item({ value: 'a' }),
      item({ value: 'b', disabled: true }),
      item({ value: 'c' }),
    ];

    it('should skip disabled sections', () => {
      expect(findDialogNavFocusableSection(items, 0, 1)).toBe(2);
      expect(findDialogNavFocusableSection(items, 2, -1)).toBe(0);
    });

    it('should stay on the origin when nothing is focusable that way', () => {
      expect(findDialogNavFocusableSection(items, 2, 1)).toBe(2);
      expect(findDialogNavFocusableSection(items, 0, -1)).toBe(0);
    });
  });

  describe('findDialogNavIndexByValue', () => {
    const items: SolarisDialogNavItem[] = [
      item({ value: 'a' }),
      item({ value: 'b' }),
    ];

    it('should return the matching index', () => {
      expect(findDialogNavIndexByValue(items, 'b')).toBe(1);
    });

    it('should return null for unknown values', () => {
      expect(findDialogNavIndexByValue(items, 'nope')).toBeNull();
    });
  });
});
