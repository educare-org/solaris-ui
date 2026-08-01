import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

import { SolarisDropdownSubmenuComponent } from '../component/dropdown-submenu.component';
import { SolarisDropdownSubmenuTriggerComponent } from '../component/dropdown-submenu-trigger.component';
import { SolarisDropdownMenuComponent } from '../component/dropdown-menu.component';
import { SolarisDropdownMenuItemComponent } from '../component/dropdown-menu-item.component';
import type { SolarisDropdownSubmenuPlacement } from '../model/dropdown-submenu.types';

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
        <solaris-dropdown-menu-item label="CSV" />
      </solaris-dropdown-menu>
    </solaris-dropdown-submenu>
  `,
})
class BasicTestHost {
  @ViewChild(SolarisDropdownSubmenuComponent)
  submenu!: SolarisDropdownSubmenuComponent;
}

@Component({
  standalone: true,
  imports: [
    SolarisDropdownSubmenuComponent,
    SolarisDropdownSubmenuTriggerComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <solaris-dropdown-submenu [disabled]="true">
      <solaris-dropdown-submenu-trigger label="Export" />
      <solaris-dropdown-menu>
        <solaris-dropdown-menu-item label="PDF" />
      </solaris-dropdown-menu>
    </solaris-dropdown-submenu>
  `,
})
class DisabledTestHost {
  @ViewChild(SolarisDropdownSubmenuComponent)
  submenu!: SolarisDropdownSubmenuComponent;
}

@Component({
  standalone: true,
  imports: [
    SolarisDropdownSubmenuComponent,
    SolarisDropdownSubmenuTriggerComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <solaris-dropdown-submenu placement="left-start">
      <solaris-dropdown-submenu-trigger label="Export" />
      <solaris-dropdown-menu>
        <solaris-dropdown-menu-item label="PDF" />
      </solaris-dropdown-menu>
    </solaris-dropdown-submenu>
  `,
})
class LeftPlacementTestHost {
  @ViewChild(SolarisDropdownSubmenuComponent)
  submenu!: SolarisDropdownSubmenuComponent;
}

@Component({
  standalone: true,
  imports: [
    SolarisDropdownSubmenuComponent,
    SolarisDropdownSubmenuTriggerComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <solaris-dropdown-submenu [matchTriggerWidth]="true">
      <solaris-dropdown-submenu-trigger label="Export" />
      <solaris-dropdown-menu>
        <solaris-dropdown-menu-item label="PDF" />
      </solaris-dropdown-menu>
    </solaris-dropdown-submenu>
  `,
})
class MatchWidthTestHost {
  @ViewChild(SolarisDropdownSubmenuComponent)
  submenu!: SolarisDropdownSubmenuComponent;
}

@Component({
  standalone: true,
  imports: [
    SolarisDropdownSubmenuComponent,
    SolarisDropdownSubmenuTriggerComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <solaris-dropdown-submenu minWidth="200px">
      <solaris-dropdown-submenu-trigger label="Export" />
      <solaris-dropdown-menu>
        <solaris-dropdown-menu-item label="PDF" />
      </solaris-dropdown-menu>
    </solaris-dropdown-submenu>
  `,
})
class MinWidthTestHost {
  @ViewChild(SolarisDropdownSubmenuComponent)
  submenu!: SolarisDropdownSubmenuComponent;
}

@Component({
  standalone: true,
  imports: [
    SolarisDropdownSubmenuComponent,
    SolarisDropdownSubmenuTriggerComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <solaris-dropdown-submenu maxWidth="400px">
      <solaris-dropdown-submenu-trigger label="Export" />
      <solaris-dropdown-menu>
        <solaris-dropdown-menu-item label="PDF" />
      </solaris-dropdown-menu>
    </solaris-dropdown-submenu>
  `,
})
class MaxWidthTestHost {
  @ViewChild(SolarisDropdownSubmenuComponent)
  submenu!: SolarisDropdownSubmenuComponent;
}

@Component({
  standalone: true,
  imports: [
    SolarisDropdownSubmenuComponent,
    SolarisDropdownSubmenuTriggerComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <solaris-dropdown-submenu [openDelay]="300">
      <solaris-dropdown-submenu-trigger label="Export" />
      <solaris-dropdown-menu>
        <solaris-dropdown-menu-item label="PDF" />
      </solaris-dropdown-menu>
    </solaris-dropdown-submenu>
  `,
})
class CustomOpenDelayTestHost {
  @ViewChild(SolarisDropdownSubmenuComponent)
  submenu!: SolarisDropdownSubmenuComponent;
}

@Component({
  standalone: true,
  imports: [
    SolarisDropdownSubmenuComponent,
    SolarisDropdownSubmenuTriggerComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <solaris-dropdown-submenu [closeDelay]="500">
      <solaris-dropdown-submenu-trigger label="Export" />
      <solaris-dropdown-menu>
        <solaris-dropdown-menu-item label="PDF" />
      </solaris-dropdown-menu>
    </solaris-dropdown-submenu>
  `,
})
class CustomCloseDelayTestHost {
  @ViewChild(SolarisDropdownSubmenuComponent)
  submenu!: SolarisDropdownSubmenuComponent;
}

@Component({
  standalone: true,
  imports: [
    SolarisDropdownSubmenuComponent,
    SolarisDropdownSubmenuTriggerComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <solaris-dropdown-submenu openMode="click">
      <solaris-dropdown-submenu-trigger label="Export" />
      <solaris-dropdown-menu>
        <solaris-dropdown-menu-item label="PDF" />
      </solaris-dropdown-menu>
    </solaris-dropdown-submenu>
  `,
})
class ClickModeTestHost {
  @ViewChild(SolarisDropdownSubmenuComponent)
  submenu!: SolarisDropdownSubmenuComponent;
}

@Component({
  standalone: true,
  imports: [
    SolarisDropdownSubmenuComponent,
    SolarisDropdownSubmenuTriggerComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
  ],
  template: `
    <solaris-dropdown-submenu openMode="hover">
      <solaris-dropdown-submenu-trigger label="Export" />
      <solaris-dropdown-menu>
        <solaris-dropdown-menu-item label="PDF" />
      </solaris-dropdown-menu>
    </solaris-dropdown-submenu>
  `,
})
class HoverModeTestHost {
  @ViewChild(SolarisDropdownSubmenuComponent)
  submenu!: SolarisDropdownSubmenuComponent;
}

describe('SolarisDropdownSubmenuComponent', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('creation', () => {
    it('should create the component', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      expect(fixture.componentInstance.submenu).toBeTruthy();
    });

    it('should have isOpen false initially', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      expect(fixture.componentInstance.submenu['isOpen']()).toBe(false);
    });
  });

  describe('default inputs', () => {
    let fixture: ComponentFixture<BasicTestHost>;
    let component: SolarisDropdownSubmenuComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      component = fixture.componentInstance.submenu;
    });

    it('should have default openMode as hover-click', () => {
      expect(component.openMode()).toBe('hover-click');
    });

    it('should have default placement as right-start', () => {
      expect(component.placement()).toBe('right-start');
    });

    it('should have default disabled as false', () => {
      expect(component.disabled()).toBe(false);
    });

    it('should have default openDelay as 120', () => {
      expect(component.openDelay()).toBe(120);
    });

    it('should have default closeDelay as 160', () => {
      expect(component.closeDelay()).toBe(160);
    });

    it('should have default matchTriggerWidth as false', () => {
      expect(component.matchTriggerWidth()).toBe(false);
    });

    it('should have default minWidth as null', () => {
      expect(component.minWidth()).toBeNull();
    });

    it('should have default maxWidth as null', () => {
      expect(component.maxWidth()).toBeNull();
    });
  });

  describe('content projection', () => {
    let fixture: ComponentFixture<BasicTestHost>;
    let component: SolarisDropdownSubmenuComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      component = fixture.componentInstance.submenu;
    });

    it('should have nestedMenu content child', () => {
      expect(component.nestedMenu()).toBeTruthy();
    });

    it('should have triggerChild content child', () => {
      expect(component.triggerChild()).toBeTruthy();
    });

    it('should have nested menu element in DOM', () => {
      const el = fixture.nativeElement.querySelector('solaris-dropdown-menu');
      expect(el).toBeTruthy();
    });

    it('should have trigger element in DOM', () => {
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-submenu-trigger',
      );
      expect(el).toBeTruthy();
    });
  });

  describe('open/close/toggle', () => {
    let fixture: ComponentFixture<BasicTestHost>;
    let component: SolarisDropdownSubmenuComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      component = fixture.componentInstance.submenu;
    });

    afterEach(() => {
      component.close();
      fixture.destroy();
      TestBed.resetTestingModule();
    });

    it('should set isOpen true when open() is called', () => {
      component.open();
      expect(component['isOpen']()).toBe(true);
    });

    it('should set isOpen false when close() is called after open()', () => {
      component.open();
      expect(component['isOpen']()).toBe(true);
      component.close();
      expect(component['isOpen']()).toBe(false);
    });

    it('should toggle from closed to open', () => {
      expect(component['isOpen']()).toBe(false);
      component.toggle();
      expect(component['isOpen']()).toBe(true);
    });

    it('should toggle from open to closed', () => {
      component.open();
      expect(component['isOpen']()).toBe(true);
      component.toggle();
      expect(component['isOpen']()).toBe(false);
    });

    it('should be a no-op calling close() when already closed', () => {
      expect(component['isOpen']()).toBe(false);
      component.close();
      expect(component['isOpen']()).toBe(false);
    });

    it('should be a no-op calling open() when already open', () => {
      component.open();
      expect(component['isOpen']()).toBe(true);
      component.open();
      expect(component['isOpen']()).toBe(true);
    });
  });

  describe('disabled', () => {
    it('should not open when disabled', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledTestHost);
      fixture.detectChanges();
      const component = fixture.componentInstance.submenu;
      expect(component.disabled()).toBe(true);
      component.open();
      expect(component['isOpen']()).toBe(false);
    });

    it('should not toggle when disabled', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledTestHost);
      fixture.detectChanges();
      const component = fixture.componentInstance.submenu;
      component.toggle();
      expect(component['isOpen']()).toBe(false);
    });
  });

  describe('inputs', () => {
    it('should reflect openDelay input', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(CustomOpenDelayTestHost);
      fixture.detectChanges();
      expect(fixture.componentInstance.submenu.openDelay()).toBe(300);
    });

    it('should reflect closeDelay input', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(CustomCloseDelayTestHost);
      fixture.detectChanges();
      expect(fixture.componentInstance.submenu.closeDelay()).toBe(500);
    });

    it('should reflect placement input', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(LeftPlacementTestHost);
      fixture.detectChanges();
      expect(fixture.componentInstance.submenu.placement()).toBe('left-start');
    });

    it('should reflect matchTriggerWidth input', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(MatchWidthTestHost);
      fixture.detectChanges();
      expect(fixture.componentInstance.submenu.matchTriggerWidth()).toBe(true);
    });

    it('should reflect minWidth input', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(MinWidthTestHost);
      fixture.detectChanges();
      expect(fixture.componentInstance.submenu.minWidth()).toBe('200px');
    });

    it('should reflect maxWidth input', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(MaxWidthTestHost);
      fixture.detectChanges();
      expect(fixture.componentInstance.submenu.maxWidth()).toBe('400px');
    });

    it('should accept openMode click', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ClickModeTestHost);
      fixture.detectChanges();
      expect(fixture.componentInstance.submenu.openMode()).toBe('click');
    });

    it('should accept openMode hover', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(HoverModeTestHost);
      fixture.detectChanges();
      expect(fixture.componentInstance.submenu.openMode()).toBe('hover');
    });
  });

  describe('host class', () => {
    it('should have class solaris-dropdown-submenu', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector(
        'solaris-dropdown-submenu',
      );
      expect(el.classList.contains('solaris-dropdown-submenu')).toBe(true);
    });
  });

  describe('hover behavior', () => {
    let fixture: ComponentFixture<BasicTestHost>;
    let component: SolarisDropdownSubmenuComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      component = fixture.componentInstance.submenu;
    });

    afterEach(() => {
      component.close();
      fixture.destroy();
      TestBed.resetTestingModule();
    });

    it('should open after openDelay when onTriggerHover is called', () => {
      vi.useFakeTimers();
      component.onTriggerHover();
      expect(component['isOpen']()).toBe(false);
      vi.advanceTimersByTime(component.openDelay());
      expect(component['isOpen']()).toBe(true);
    });

    it('should not open when onTriggerHover is canceled by onTriggerLeave before timer fires', () => {
      vi.useFakeTimers();
      component.onTriggerHover();
      vi.advanceTimersByTime(50);
      component.onTriggerLeave();
      vi.advanceTimersByTime(component.openDelay());
      expect(component['isOpen']()).toBe(false);
    });

    it('should not open on hover when openMode is click', () => {
      component.onTriggerHover();
      expect(component['isOpen']()).toBe(false);
    });

    it('should close after closeDelay when onTriggerLeave is called', () => {
      vi.useFakeTimers();
      component.open();
      expect(component['isOpen']()).toBe(true);
      component.onTriggerLeave();
      vi.advanceTimersByTime(component.closeDelay());
      expect(component['isOpen']()).toBe(false);
    });

    it('should not close on trigger leave when openMode is click', () => {
      vi.useFakeTimers();
      component.open();
      component.onTriggerLeave();
      vi.advanceTimersByTime(component.closeDelay());
      expect(component['isOpen']()).toBe(false);
    });

    it('should clear close timer when onTriggerHover is called again', () => {
      vi.useFakeTimers();
      component.open();
      component.onTriggerLeave();
      component.onTriggerHover();
      vi.advanceTimersByTime(component.closeDelay() + 10);
      expect(component['isOpen']()).toBe(true);
    });
  });

  describe('nested menu panel id', () => {
    it('should compute nestedMenuPanelId from nestedMenu', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const component = fixture.componentInstance.submenu;
      const panelId = component.nestedMenuPanelId();
      expect(panelId).toMatch(/^solaris-dropdown-menu-\d+$/);
    });
  });

  describe('keyboard integration', () => {
    let fixture: ComponentFixture<BasicTestHost>;
    let component: SolarisDropdownSubmenuComponent;
    let menu: SolarisDropdownMenuComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      component = fixture.componentInstance.submenu;
      menu = fixture.debugElement.query(
        By.directive(SolarisDropdownMenuComponent),
      ).componentInstance;
    });

    afterEach(() => {
      component.close();
      fixture.destroy();
      TestBed.resetTestingModule();
    });

    it('should navigate down with ArrowDown', () => {
      const spy = vi.spyOn(menu, 'focusNextItem');
      component.handleKeydown(
        new KeyboardEvent('keydown', { key: 'ArrowDown' }),
      );
      expect(spy).toHaveBeenCalled();
    });

    it('should navigate up with ArrowUp', () => {
      const spy = vi.spyOn(menu, 'focusPreviousItem');
      component.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(spy).toHaveBeenCalled();
    });

    it('should focus first item with Home', () => {
      const spy = vi.spyOn(menu, 'focusFirstItem');
      component.handleKeydown(new KeyboardEvent('keydown', { key: 'Home' }));
      expect(spy).toHaveBeenCalled();
    });

    it('should focus last item with End', () => {
      const spy = vi.spyOn(menu, 'focusLastItem');
      component.handleKeydown(new KeyboardEvent('keydown', { key: 'End' }));
      expect(spy).toHaveBeenCalled();
    });

    it('should activate focused item and close on Enter', () => {
      const spy = vi.spyOn(menu, 'activateFocusedItem');
      component.open();
      component.handleKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(spy).toHaveBeenCalled();
      expect(component['isOpen']()).toBe(false);
    });

    it('should close on ArrowLeft', () => {
      component.open();
      component.handleKeydown(
        new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
      );
      expect(component['isOpen']()).toBe(false);
    });

    it('should close on Escape', () => {
      component.open();
      component.handleKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(component['isOpen']()).toBe(false);
    });

    it('should focus by label for single character without modifiers', () => {
      const spy = vi.spyOn(menu, 'focusItemByLabel');
      component.handleKeydown(new KeyboardEvent('keydown', { key: 'p' }));
      expect(spy).toHaveBeenCalledWith('p');
    });
  });

  describe('placement integration', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisDropdownSubmenuComponent,
        SolarisDropdownSubmenuTriggerComponent,
        SolarisDropdownMenuComponent,
        SolarisDropdownMenuItemComponent,
      ],
      template: `
        <solaris-dropdown-submenu [placement]="placement">
          <solaris-dropdown-submenu-trigger label="Export" />
          <solaris-dropdown-menu>
            <solaris-dropdown-menu-item label="PDF" />
          </solaris-dropdown-menu>
        </solaris-dropdown-submenu>
      `,
    })
    class PlacementHost {
      placement: SolarisDropdownSubmenuPlacement = 'right-start';
      @ViewChild(SolarisDropdownSubmenuComponent)
      submenu!: SolarisDropdownSubmenuComponent;
    }

    @Component({
      standalone: true,
      imports: [
        SolarisDropdownSubmenuComponent,
        SolarisDropdownSubmenuTriggerComponent,
        SolarisDropdownMenuComponent,
        SolarisDropdownMenuItemComponent,
      ],
      template: `
        <solaris-dropdown-submenu minWidth="200px" maxWidth="400px">
          <solaris-dropdown-submenu-trigger label="Export" />
          <solaris-dropdown-menu>
            <solaris-dropdown-menu-item label="PDF" />
          </solaris-dropdown-menu>
        </solaris-dropdown-submenu>
      `,
    })
    class SizedTestHost {
      @ViewChild(SolarisDropdownSubmenuComponent)
      submenu!: SolarisDropdownSubmenuComponent;
    }

    it('should build positions for every placement without error', () => {
      const placements: SolarisDropdownSubmenuPlacement[] = [
        'right-start',
        'right',
        'right-end',
        'left-start',
        'left',
        'left-end',
      ];
      for (const placement of placements) {
        TestBed.configureTestingModule({});
        const fixture = TestBed.createComponent(PlacementHost);
        fixture.componentInstance.placement = placement;
        fixture.detectChanges();
        const component = fixture.componentInstance.submenu;
        expect(() => {
          component.open();
          component.close();
        }).not.toThrow();
        fixture.destroy();
        TestBed.resetTestingModule();
      }
    });

    it('should set minWidth and maxWidth on overlay', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SizedTestHost);
      fixture.detectChanges();
      const component = fixture.componentInstance.submenu;
      component.open();
      expect(component['overlayRef']).toBeTruthy();
      expect(component['overlayRef']!.getConfig().maxWidth).toBe('400px');
      component.close();
      fixture.destroy();
      TestBed.resetTestingModule();
    });
  });

  describe('event handlers', () => {
    let fixture: ComponentFixture<BasicTestHost>;
    let component: SolarisDropdownSubmenuComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      component = fixture.componentInstance.submenu;
    });

    afterEach(() => {
      component.close();
      fixture.destroy();
      TestBed.resetTestingModule();
    });

    it('should close on outside click', () => {
      component.open();
      expect(component['isOpen']()).toBe(true);
      (component as any).handleOutsideClick({
        target: document.createElement('div'),
      });
      expect(component['isOpen']()).toBe(false);
    });

    it('should not close when clicking inside overlay', () => {
      component.open();
      const overlayEl = component['overlayRef']!.overlayElement;
      (component as any).handleOutsideClick({ target: overlayEl });
      expect(component['isOpen']()).toBe(true);
      component.close();
    });

    it('should ignore outside click without overlay', () => {
      expect(() => {
        (component as any).handleOutsideClick({
          target: document.createElement('div'),
        });
      }).not.toThrow();
    });

    it('should close on item click', () => {
      component.open();
      const overlayEl = component['overlayRef']!.overlayElement;
      const item = document.createElement('solaris-dropdown-menu-item');
      overlayEl.appendChild(item);
      (component as any).handleItemClick({ target: item });
      expect(component['isOpen']()).toBe(false);
    });
  });
});

describe('SolarisDropdownSubmenuComponent without nested menu', () => {
  @Component({
    standalone: true,
    imports: [
      SolarisDropdownSubmenuComponent,
      SolarisDropdownSubmenuTriggerComponent,
    ],
    template: `
      <solaris-dropdown-submenu>
        <solaris-dropdown-submenu-trigger label="Export" />
      </solaris-dropdown-submenu>
    `,
  })
  class NoMenuHost {
    @ViewChild(SolarisDropdownSubmenuComponent)
    submenu!: SolarisDropdownSubmenuComponent;
  }

  it('should compute null panel id without nested menu', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(NoMenuHost);
    fixture.detectChanges();
    const component = fixture.componentInstance.submenu;
    expect(component.nestedMenuPanelId()).toBeNull();
    fixture.destroy();
  });

  it('should ignore keydown when no nested menu', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(NoMenuHost);
    fixture.detectChanges();
    const component = fixture.componentInstance.submenu;
    expect(() => {
      component.handleKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    }).not.toThrow();
    fixture.destroy();
  });
});
