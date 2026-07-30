import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';

import { SolarisDropdownMenuTriggerDirective } from '../directives/dropdown-menu-trigger.directive';
import { SolarisDropdownMenuComponent } from '../component/dropdown-menu.component';
import { SolarisDropdownMenuItemComponent } from '../component/dropdown-menu-item.component';
import type { SolarisDropdownMenuPlacement } from '../model/dropdown-menu.types';

@Component({
  standalone: true,
  imports: [
    SolarisDropdownMenuTriggerDirective,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <button
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

@Component({
  standalone: true,
  imports: [
    SolarisDropdownMenuTriggerDirective,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <button
      solaris-dropdown-menu-trigger
      [solarisDropdownMenuTriggerFor]="menu"
      [solarisDropdownMenuDisabled]="true"
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
class DisabledTestHost {
  @ViewChild(SolarisDropdownMenuTriggerDirective)
  trigger!: SolarisDropdownMenuTriggerDirective;
  @ViewChild(SolarisDropdownMenuComponent)
  menu!: SolarisDropdownMenuComponent;
}

@Component({
  standalone: true,
  imports: [
    SolarisDropdownMenuTriggerDirective,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <button
      solaris-dropdown-menu-trigger
      [solarisDropdownMenuTriggerFor]="menu"
      [solarisDropdownMenuCloseOnEscape]="false"
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
class CloseOnEscapeDisabledTestHost {
  @ViewChild(SolarisDropdownMenuTriggerDirective)
  trigger!: SolarisDropdownMenuTriggerDirective;
  @ViewChild(SolarisDropdownMenuComponent)
  menu!: SolarisDropdownMenuComponent;
}

@Component({
  standalone: true,
  imports: [
    SolarisDropdownMenuTriggerDirective,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <button
      solaris-dropdown-menu-trigger
      [solarisDropdownMenuTriggerFor]="menu"
      [solarisDropdownMenuCloseOnOutsideClick]="false"
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
class CloseOnOutsideClickDisabledTestHost {
  @ViewChild(SolarisDropdownMenuTriggerDirective)
  trigger!: SolarisDropdownMenuTriggerDirective;
  @ViewChild(SolarisDropdownMenuComponent)
  menu!: SolarisDropdownMenuComponent;
}

@Component({
  standalone: true,
  imports: [
    SolarisDropdownMenuTriggerDirective,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <button
      solaris-dropdown-menu-trigger
      [solarisDropdownMenuTriggerFor]="menu"
      [solarisDropdownMenuOpen]="true"
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
class ControlledOpenTestHost {
  @ViewChild(SolarisDropdownMenuTriggerDirective)
  trigger!: SolarisDropdownMenuTriggerDirective;
  @ViewChild(SolarisDropdownMenuComponent)
  menu!: SolarisDropdownMenuComponent;
}

@Component({
  standalone: true,
  imports: [
    SolarisDropdownMenuTriggerDirective,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <button
      solaris-dropdown-menu-trigger
      [solarisDropdownMenuTriggerFor]="menu"
      [solarisDropdownMenuMatchTriggerWidth]="true"
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
class MatchTriggerWidthTestHost {
  @ViewChild(SolarisDropdownMenuTriggerDirective)
  trigger!: SolarisDropdownMenuTriggerDirective;
  @ViewChild(SolarisDropdownMenuComponent)
  menu!: SolarisDropdownMenuComponent;
}

@Component({
  standalone: true,
  imports: [
    SolarisDropdownMenuTriggerDirective,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <button
      solaris-dropdown-menu-trigger
      [solarisDropdownMenuTriggerFor]="menu"
      [solarisDropdownMenuPlacement]="placement"
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
class PlacementTestHost {
  @ViewChild(SolarisDropdownMenuTriggerDirective)
  trigger!: SolarisDropdownMenuTriggerDirective;
  @ViewChild(SolarisDropdownMenuComponent)
  menu!: SolarisDropdownMenuComponent;
  placement: SolarisDropdownMenuPlacement = 'top';
}

describe('SolarisDropdownMenuTriggerDirective', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.componentInstance.trigger.close();
    TestBed.resetTestingModule();
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
    expect(menu.navigableItems()).toHaveLength(3);
  });

  it('should have disabled item ignored in navigable items', () => {
    const menu = fixture.componentInstance.menu;
    expect(menu.enabledNavigableItems()).toHaveLength(2);
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

  it('should close menu on outside click', () => {
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(true);

    document.body.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(false);
  });

  it('should emit menuOpened when menu opens', () => {
    const emitSpy = vi.spyOn(
      fixture.componentInstance.trigger.menuOpened,
      'emit',
    );
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    el.click();
    fixture.detectChanges();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit menuClosed when menu closes', () => {
    const emitSpy = vi.spyOn(
      fixture.componentInstance.trigger.menuClosed,
      'emit',
    );
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    el.click();
    fixture.detectChanges();
    el.click();
    fixture.detectChanges();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit openChange on open and close', () => {
    const emitSpy = vi.spyOn(
      fixture.componentInstance.trigger.openChange,
      'emit',
    );
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    el.click();
    fixture.detectChanges();
    expect(emitSpy).toHaveBeenCalledWith(true);

    el.click();
    fixture.detectChanges();
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it('should restore focus to trigger after close', () => {
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    el.focus();
    fixture.detectChanges();
    expect(document.activeElement).toBe(el);

    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(true);

    fixture.componentInstance.trigger.close();
    fixture.detectChanges();
    expect(document.activeElement).toBe(el);
  });
});

describe('SolarisDropdownMenuTriggerDirective - disabled', () => {
  let fixture: ComponentFixture<DisabledTestHost>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(DisabledTestHost);
    fixture.detectChanges();
  });

  it('should not open menu when disabled', () => {
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(false);
  });
});

describe('SolarisDropdownMenuTriggerDirective - closeOnEscape', () => {
  let fixture: ComponentFixture<CloseOnEscapeDisabledTestHost>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(CloseOnEscapeDisabledTestHost);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.componentInstance.trigger.close();
    TestBed.resetTestingModule();
  });

  it('should not close menu on Escape when closeOnEscape is false', () => {
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(true);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    el.dispatchEvent(event);
    fixture.detectChanges();
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(true);
  });
});

describe('SolarisDropdownMenuTriggerDirective - closeOnOutsideClick', () => {
  let fixture: ComponentFixture<CloseOnOutsideClickDisabledTestHost>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(CloseOnOutsideClickDisabledTestHost);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.componentInstance.trigger.close();
    TestBed.resetTestingModule();
  });

  it('should not close menu on outside click when closeOnOutsideClick is false', () => {
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(true);

    document.body.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(true);
  });
});

describe('SolarisDropdownMenuTriggerDirective - controlled open', () => {
  let fixture: ComponentFixture<ControlledOpenTestHost>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ControlledOpenTestHost);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.componentInstance.trigger.close();
    TestBed.resetTestingModule();
  });

  it('should open when solarisDropdownMenuOpen is true', () => {
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(true);
  });
});

describe('SolarisDropdownMenuTriggerDirective - matchTriggerWidth', () => {
  let fixture: ComponentFixture<MatchTriggerWidthTestHost>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(MatchTriggerWidthTestHost);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.componentInstance.trigger.close();
    TestBed.resetTestingModule();
  });

  it('should handle matchTriggerWidth without error', () => {
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(true);
  });
});

describe('SolarisDropdownMenuTriggerDirective - placement', () => {
  let fixture: ComponentFixture<PlacementTestHost>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(PlacementTestHost);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.componentInstance.trigger.close();
    TestBed.resetTestingModule();
  });

  it('should handle placement input without error', () => {
    const el = fixture.nativeElement.querySelector(
      '[solaris-dropdown-menu-trigger]',
    );
    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.trigger['isOpen']()).toBe(true);
  });
});
