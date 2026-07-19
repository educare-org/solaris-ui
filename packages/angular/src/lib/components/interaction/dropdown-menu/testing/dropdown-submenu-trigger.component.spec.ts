import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisDropdownSubmenuTriggerComponent } from '../component/dropdown-submenu-trigger.component';
import { SolarisDropdownSubmenuComponent } from '../component/dropdown-submenu.component';
import { SolarisDropdownMenuComponent } from '../component/dropdown-menu.component';
import { SolarisDropdownMenuItemComponent } from '../component/dropdown-menu-item.component';

describe('SolarisDropdownSubmenuTriggerComponent', () => {
  describe('basic trigger', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisDropdownSubmenuComponent,
        SolarisDropdownSubmenuTriggerComponent,
        SolarisDropdownMenuComponent,
        SolarisDropdownMenuItemComponent,
      ],
      template: `
        <solaris-dropdown-submenu>
          <solaris-dropdown-submenu-trigger label="Export" />
          <solaris-dropdown-menu>
            <solaris-dropdown-menu-item label="PDF" />
          </solaris-dropdown-menu>
        </solaris-dropdown-submenu>
      `,
    })
    class TestHost {}

    let el: HTMLElement;

    const createFixture = () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      return fixture.nativeElement.querySelector(
        'solaris-dropdown-submenu-trigger',
      );
    };

    it('should render', () => {
      el = createFixture();
      expect(el).toBeTruthy();
    });

    it('should have role menuitem', () => {
      el = createFixture();
      expect(el.getAttribute('role')).toBe('menuitem');
    });

    it('should have aria-haspopup="menu"', () => {
      el = createFixture();
      expect(el.getAttribute('aria-haspopup')).toBe('menu');
    });

    it('should have aria-expanded set to false initially', () => {
      el = createFixture();
      expect(el.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('icon', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisDropdownSubmenuComponent,
        SolarisDropdownSubmenuTriggerComponent,
        SolarisDropdownMenuComponent,
        SolarisDropdownMenuItemComponent,
      ],
      template: `
        <solaris-dropdown-submenu>
          <solaris-dropdown-submenu-trigger label="Export" icon="download" />
          <solaris-dropdown-menu>
            <solaris-dropdown-menu-item label="PDF" />
          </solaris-dropdown-menu>
        </solaris-dropdown-submenu>
      `,
    })
    class TestHost {}

    it('should render with icon', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-submenu-trigger',
      );
      expect(el).toBeTruthy();
      const icon = el.querySelector('solaris-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('disabled', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisDropdownSubmenuComponent,
        SolarisDropdownSubmenuTriggerComponent,
        SolarisDropdownMenuComponent,
        SolarisDropdownMenuItemComponent,
      ],
      template: `
        <solaris-dropdown-submenu>
          <solaris-dropdown-submenu-trigger label="Export" [disabled]="true" />
          <solaris-dropdown-menu>
            <solaris-dropdown-menu-item label="PDF" />
          </solaris-dropdown-menu>
        </solaris-dropdown-submenu>
      `,
    })
    class TestHost {}

    it('should set aria-disabled when disabled', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-submenu-trigger',
      );
      expect(el.getAttribute('aria-disabled')).toBe('true');
    });

    it('should set tabindex="-1" when disabled', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-submenu-trigger',
      );
      expect(el.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('color', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisDropdownSubmenuComponent,
        SolarisDropdownSubmenuTriggerComponent,
        SolarisDropdownMenuComponent,
        SolarisDropdownMenuItemComponent,
      ],
      template: `
        <solaris-dropdown-submenu>
          <solaris-dropdown-submenu-trigger label="Delete" color="danger" />
          <solaris-dropdown-menu>
            <solaris-dropdown-menu-item label="PDF" />
          </solaris-dropdown-menu>
        </solaris-dropdown-submenu>
      `,
    })
    class TestHost {}

    it('should set data-color attribute', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-submenu-trigger',
      );
      expect(el.getAttribute('data-color')).toBe('danger');
    });
  });
});
