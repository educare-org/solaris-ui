import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';

import { SolarisButtonDirective } from '../../../actions/button/directives/button.directive';
import { SolarisDropdownMenuTriggerDirective } from '../directives/dropdown-menu-trigger.directive';
import { SolarisDropdownMenuComponent } from '../component/dropdown-menu.component';
import { SolarisDropdownMenuItemComponent } from '../component/dropdown-menu-item.component';

describe('SolarisDropdownMenuTriggerDirective', () => {
  @Component({
    standalone: true,
    imports: [
      SolarisButtonDirective,
      SolarisDropdownMenuTriggerDirective,
      SolarisDropdownMenuComponent,
      SolarisDropdownMenuItemComponent,
    ],
    template: `
      <button
        solaris-button
        solaris-dropdown-menu-trigger
        [solarisDropdownMenuTriggerFor]="menu"
      >
        Open
      </button>
      <solaris-dropdown-menu #menu>
        <solaris-dropdown-menu-item label="Item 1" />
        <solaris-dropdown-menu-item label="Item 2" />
        <solaris-dropdown-menu-item label="Item 3" [disabled]="true" />
      </solaris-dropdown-menu>
    `,
  })
  class TestHost {
    @ViewChild(SolarisDropdownMenuTriggerDirective)
    trigger!: SolarisDropdownMenuTriggerDirective;
    @ViewChild(SolarisDropdownMenuComponent)
    menu!: SolarisDropdownMenuComponent;
  }

  let fixture: ComponentFixture<TestHost>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance.trigger).toBeTruthy();
  });

  it('should set aria-haspopup="menu"', () => {
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    expect(el.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('should have aria-expanded set to false initially', () => {
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    expect(el.getAttribute('aria-expanded')).toBe('false');
  });

  it('should open menu on trigger click', () => {
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(true);
    expect(el.getAttribute('aria-expanded')).toBe('true');
  });

  it('should close menu on second click', () => {
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    el.click();
    fixture.detectChanges();
    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(false);
  });

  it('should close menu on Escape', () => {
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(true);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    el.dispatchEvent(event);
    fixture.detectChanges();
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(false);
  });

  it('should have menu items accessible via contentChildren', () => {
    const menu = fixture.componentInstance.menu;
    expect(menu.items().length).toBe(3);
  });

  it('should have disabled item ignored in enabledItems', () => {
    const menu = fixture.componentInstance.menu;
    expect(menu.enabledItems().length).toBe(2);
  });

  it('should set aria-controls pointing to menu id', () => {
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    const menuEl = fixture.nativeElement.querySelector('solaris-dropdown-menu');
    expect(el.getAttribute('aria-controls')).toBe(menuEl.getAttribute('id'));
  });

  it('should have role="menu" on dropdown menu', () => {
    const menuEl = fixture.nativeElement.querySelector('solaris-dropdown-menu');
    expect(menuEl.getAttribute('role')).toBe('menu');
  });
});
