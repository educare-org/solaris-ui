import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisDropdownMenuGroupComponent } from '../component/dropdown-menu-group.component';
import { SolarisDropdownMenuLabelComponent } from '../component/dropdown-menu-label.component';
import { SolarisDropdownMenuItemComponent } from '../component/dropdown-menu-item.component';

describe('SolarisDropdownMenuGroupComponent', () => {
  describe('with label', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisDropdownMenuGroupComponent,
        SolarisDropdownMenuLabelComponent,
        SolarisDropdownMenuItemComponent,
      ],
      template: `
        <solaris-dropdown-menu-group>
          <solaris-dropdown-menu-label label="Actions" />
          <solaris-dropdown-menu-item label="Edit" />
          <solaris-dropdown-menu-item label="Delete" />
        </solaris-dropdown-menu-group>
      `,
    })
    class TestHost {}

    it('should apply role="group" when label is present', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-menu-group',
      );
      expect(el.getAttribute('role')).toBe('group');
    });

    it('should set aria-labelledby pointing to label id', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const groupEl = fixture.nativeElement.querySelector(
        'solaris-dropdown-menu-group',
      );
      const labelEl = fixture.nativeElement.querySelector(
        'solaris-dropdown-menu-label',
      );
      expect(groupEl.getAttribute('aria-labelledby')).toBe(
        labelEl.getAttribute('id'),
      );
    });

    it('should render items inside group', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll(
        'solaris-dropdown-menu-item',
      );
      expect(items.length).toBe(2);
    });
  });

  describe('without label', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisDropdownMenuGroupComponent,
        SolarisDropdownMenuItemComponent,
      ],
      template: `
        <solaris-dropdown-menu-group>
          <solaris-dropdown-menu-item label="Edit" />
        </solaris-dropdown-menu-group>
      `,
    })
    class TestHost {}

    it('should not set role when no label', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-menu-group',
      );
      expect(el.getAttribute('role')).toBeNull();
    });
  });
});
