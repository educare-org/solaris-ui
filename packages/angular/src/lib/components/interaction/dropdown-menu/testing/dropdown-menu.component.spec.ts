import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';

import { SolarisDropdownMenuComponent } from '../component/dropdown-menu.component';
import { SolarisDropdownMenuItemComponent } from '../component/dropdown-menu-item.component';
import type { SolarisDropdownMenuSize, SolarisDropdownMenuDensity } from '../model/dropdown-menu.types';

describe('SolarisDropdownMenuComponent', () => {
  @Component({
    standalone: true,
    imports: [SolarisDropdownMenuComponent, SolarisDropdownMenuItemComponent],
    template: `
      <solaris-dropdown-menu
        [size]="size"
        [density]="density"
      >
        <solaris-dropdown-menu-item label="First" />
        <solaris-dropdown-menu-item label="Second" />
        <solaris-dropdown-menu-item label="Third" [disabled]="true" />
        <solaris-dropdown-menu-item label="Fourth" />
      </solaris-dropdown-menu>
    `,
  })
  class TestHost {
    @ViewChild(SolarisDropdownMenuComponent) menu!: SolarisDropdownMenuComponent;
    size: SolarisDropdownMenuSize = 'md';
    density: SolarisDropdownMenuDensity = 'comfortable';
  }

  let fixture: ComponentFixture<TestHost>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance.menu).toBeTruthy();
  });

  it('should have role menu', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector('solaris-dropdown-menu')!;
    expect(el.getAttribute('role')).toBe('menu');
  });

  it('should have a panelId', () => {
    const id = fixture.componentInstance.menu.panelId;
    expect(id).toMatch(/^solaris-dropdown-menu-\d+$/);
  });

  it('should set data-size host attribute', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector('solaris-dropdown-menu')!;
    expect(el.getAttribute('data-size')).toBe('md');
  });

  it('should set data-density host attribute', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector('solaris-dropdown-menu')!;
    expect(el.getAttribute('data-density')).toBe('comfortable');
  });

  it('should have 3 enabled navigable items (excluding disabled)', () => {
    const count = fixture.componentInstance.menu['enabledNavigableItems']().length;
    expect(count).toBe(3);
  });

  describe('focusFirstItem', () => {
    it('should focus first enabled item', () => {
      const items = fixture.componentInstance.menu['enabledNavigableItems']();
      vi.spyOn(items[0], 'focus');
      fixture.componentInstance.menu.focusFirstItem();
      expect(items[0].focus).toHaveBeenCalled();
    });

    it('should update focusedIndex to 0', () => {
      fixture.componentInstance.menu.focusFirstItem();
      expect(fixture.componentInstance.menu['focusedIndex']()).toBe(0);
    });
  });

  describe('focusLastItem', () => {
    it('should focus last enabled item', () => {
      const items = fixture.componentInstance.menu['enabledNavigableItems']();
      vi.spyOn(items[items.length - 1], 'focus');
      fixture.componentInstance.menu.focusLastItem();
      expect(items[items.length - 1].focus).toHaveBeenCalled();
    });
  });

  describe('focusNextItem', () => {
    it('should move focus to next item', () => {
      fixture.componentInstance.menu.focusFirstItem();
      const items = fixture.componentInstance.menu['enabledNavigableItems']();
      vi.spyOn(items[1], 'focus');
      fixture.componentInstance.menu.focusNextItem();
      expect(items[1].focus).toHaveBeenCalled();
      expect(fixture.componentInstance.menu['focusedIndex']()).toBe(1);
    });

    it('should wrap from last to first', () => {
      const items = fixture.componentInstance.menu['enabledNavigableItems']();
      fixture.componentInstance.menu.focusLastItem();
      vi.spyOn(items[0], 'focus');
      fixture.componentInstance.menu.focusNextItem();
      expect(items[0].focus).toHaveBeenCalled();
    });
  });

  describe('focusPreviousItem', () => {
    it('should move focus to previous item', () => {
      fixture.componentInstance.menu.focusLastItem();
      const items = fixture.componentInstance.menu['enabledNavigableItems']();
      vi.spyOn(items[1], 'focus');
      fixture.componentInstance.menu.focusPreviousItem();
      expect(items[1].focus).toHaveBeenCalled();
    });

    it('should wrap from first to last', () => {
      fixture.componentInstance.menu.focusFirstItem();
      const items = fixture.componentInstance.menu['enabledNavigableItems']();
      vi.spyOn(items[items.length - 1], 'focus');
      fixture.componentInstance.menu.focusPreviousItem();
      expect(items[items.length - 1].focus).toHaveBeenCalled();
    });
  });

  describe('focusItemByLabel', () => {
    it('should focus item matching label (case insensitive)', () => {
      const items = fixture.componentInstance.menu['enabledNavigableItems']();
      vi.spyOn(items[1], 'focus');
      fixture.componentInstance.menu.focusItemByLabel('second');
      expect(items[1].focus).toHaveBeenCalled();
    });

    it('should not focus any item when no match', () => {
      const items = fixture.componentInstance.menu['enabledNavigableItems']();
      items.forEach(item => vi.spyOn(item, 'focus'));
      fixture.componentInstance.menu.focusItemByLabel('nonexistent');
      items.forEach(item => expect(item.focus).not.toHaveBeenCalled());
    });
  });

  describe('activateFocusedItem', () => {
    it('should call handleClick on focused item', () => {
      fixture.componentInstance.menu.focusFirstItem();
      const items = fixture.componentInstance.menu['enabledNavigableItems']();
      vi.spyOn(items[0], 'handleClick');
      fixture.componentInstance.menu.activateFocusedItem();
      expect(items[0].handleClick).toHaveBeenCalled();
    });

    it('should do nothing when no item is focused', () => {
      expect(() => fixture.componentInstance.menu.activateFocusedItem()).not.toThrow();
    });
  });

  it('should skip disabled items in enabledNavigableItems', () => {
    const items = fixture.componentInstance.menu['navigableItems']();
    const enabledItems = fixture.componentInstance.menu['enabledNavigableItems']();
    expect(items.length).toBe(4);
    expect(enabledItems.length).toBe(3);
  });
});
