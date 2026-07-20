import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisDropdownMenuItemComponent } from '../component/dropdown-menu-item.component';

import type {
  SolarisDropdownMenuItemColor,
  SolarisDropdownMenuItemType,
} from '../model/dropdown-menu.types';

describe('SolarisDropdownMenuItemComponent', () => {
  describe('basic item', () => {
    @Component({
      standalone: true,
      imports: [SolarisDropdownMenuItemComponent],
      template: '<solaris-dropdown-menu-item label="Edit" />',
    })
    class TestHost {}

    let fixture: ComponentFixture<TestHost>;
    let el: HTMLElement;

    const createFixture = () => {
      TestBed.configureTestingModule({});
      fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      return fixture.nativeElement.querySelector('solaris-dropdown-menu-item');
    };

    it('should render', () => {
      el = createFixture();
      expect(el).toBeTruthy();
    });

    it('should have role menuitem by default', () => {
      el = createFixture();
      expect(el.getAttribute('role')).toBe('menuitem');
    });
  });

  describe('type', () => {
    @Component({
      standalone: true,
      imports: [SolarisDropdownMenuItemComponent],
      template: '<solaris-dropdown-menu-item label="Test" [type]="type" />',
    })
    class TestHost {
      type: SolarisDropdownMenuItemType = 'item';
    }

    it('should have role menuitem for type item', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-menu-item',
      );
      expect(el.getAttribute('role')).toBe('menuitem');
    });

    it('should have role menuitemcheckbox for type checkbox', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.type = 'checkbox';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-menu-item',
      );
      expect(el.getAttribute('role')).toBe('menuitemcheckbox');
    });

    it('should have role menuitemradio for type radio', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.type = 'radio';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-menu-item',
      );
      expect(el.getAttribute('role')).toBe('menuitemradio');
    });
  });

  describe('aria-checked', () => {
    @Component({
      standalone: true,
      imports: [SolarisDropdownMenuItemComponent],
      template:
        '<solaris-dropdown-menu-item label="Test" [type]="type" [checked]="checked" />',
    })
    class TestHost {
      type: SolarisDropdownMenuItemType = 'checkbox';
      checked: boolean | undefined = true;
    }

    it('should set aria-checked for checkbox when checked', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-menu-item',
      );
      expect(el.getAttribute('aria-checked')).toBe('true');
    });

    it('should set aria-checked to false when unchecked', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.checked = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-menu-item',
      );
      expect(el.getAttribute('aria-checked')).toBe('false');
    });

    it('should not set aria-checked for type item', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.type = 'item';
      fixture.componentInstance.checked = true;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-menu-item',
      );
      expect(el.getAttribute('aria-checked')).toBeNull();
    });
  });

  describe('disabled', () => {
    @Component({
      standalone: true,
      imports: [SolarisDropdownMenuItemComponent],
      template:
        '<solaris-dropdown-menu-item label="Test" [disabled]="disabled" />',
    })
    class TestHost {
      disabled = true;
    }

    it('should set aria-disabled when disabled', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-menu-item',
      );
      expect(el.getAttribute('aria-disabled')).toBe('true');
    });

    it('should set tabindex="-1" when disabled', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-menu-item',
      );
      expect(el.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('color', () => {
    @Component({
      standalone: true,
      imports: [SolarisDropdownMenuItemComponent],
      template: '<solaris-dropdown-menu-item label="Test" [color]="color" />',
    })
    class TestHost {
      color: SolarisDropdownMenuItemColor = 'danger';
    }

    it('should set data-color attribute', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-menu-item',
      );
      expect(el.getAttribute('data-color')).toBe('danger');
    });
  });

  describe('itemSelected output', () => {
    @Component({
      standalone: true,
      imports: [SolarisDropdownMenuItemComponent],
      template:
        '<solaris-dropdown-menu-item label="Test" (itemSelected)="onSelect()" />',
    })
    class TestHost {
      selected = false;
      onSelect(): void {
        this.selected = true;
      }
    }

    it('should emit itemSelected on click', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-menu-item',
      );
      el.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.selected).toBe(true);
    });
  });
});
