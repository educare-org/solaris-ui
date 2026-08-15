import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { provideSolaris } from '../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisEditableTabsComponent } from '../component/editable-tabs.component';

import type { SolarisEditableTabData } from '../model/editable-tabs.types';

const THREE_TABS: SolarisEditableTabData[] = [
  { value: 'tab1', label: 'Tab 1' },
  { value: 'tab2', label: 'Tab 2' },
  { value: 'tab3', label: 'Tab 3' },
];

const TWO_TABS: SolarisEditableTabData[] = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
];

const LOCKED_TABS: SolarisEditableTabData[] = [
  { value: 'overview', label: 'Overview', locked: true },
  { value: 'details', label: 'Details' },
  { value: 'history', label: 'History', locked: true },
];

const DISABLED_TABS: SolarisEditableTabData[] = [
  { value: 'x', label: 'X' },
  { value: 'y', label: 'Y', disabled: true },
  { value: 'z', label: 'Z' },
];

@Component({
  standalone: true,
  imports: [SolarisEditableTabsComponent],
  template: `
    <solaris-editable-tabs
      [tabs]="tabs()"
      [(value)]="value"
      [defaultValue]="'tab1'"
    />
  `,
})
class BasicTestHost {
  readonly tabs = signal<SolarisEditableTabData[]>(THREE_TABS);
  value: unknown = 'tab1';
}

@Component({
  standalone: true,
  imports: [SolarisEditableTabsComponent],
  template: `
    <solaris-editable-tabs
      [tabs]="tabs()"
      [(value)]="value"
      [editable]="false"
    />
  `,
})
class NonEditableTestHost {
  readonly tabs = signal<SolarisEditableTabData[]>(THREE_TABS);
  value: unknown = 'tab1';
}

@Component({
  standalone: true,
  imports: [SolarisEditableTabsComponent],
  template: `
    <solaris-editable-tabs
      [tabs]="tabs()"
      [(value)]="value"
      [showActions]="'always'"
    />
  `,
})
class AlwaysShowActionsTestHost {
  readonly tabs = signal<SolarisEditableTabData[]>(THREE_TABS);
  value: unknown = 'tab1';
}

@Component({
  standalone: true,
  imports: [SolarisEditableTabsComponent],
  template: ` <solaris-editable-tabs [tabs]="tabs()" [(value)]="value" /> `,
  host: { 'data-jig': 'locked' },
})
class LockedTabTestHost {
  readonly tabs = signal<SolarisEditableTabData[]>(LOCKED_TABS);
  value: unknown = 'overview';
}

@Component({
  standalone: true,
  imports: [SolarisEditableTabsComponent],
  template: ` <solaris-editable-tabs [tabs]="tabs()" [(value)]="value" /> `,
  host: { 'data-jig': 'disabled' },
})
class DisabledTabTestHost {
  readonly tabs = signal<SolarisEditableTabData[]>(DISABLED_TABS);
  value: unknown = 'x';
}

@Component({
  standalone: true,
  imports: [SolarisEditableTabsComponent],
  template: `
    <solaris-editable-tabs
      [tabs]="tabs()"
      [(value)]="value"
      [allowEmpty]="true"
      [minTabs]="0"
    />
  `,
})
class AllowEmptyTestHost {
  readonly tabs = signal<SolarisEditableTabData[]>(TWO_TABS);
  value: unknown = 'a';
}

@Component({
  standalone: true,
  imports: [SolarisEditableTabsComponent],
  template: `
    <solaris-editable-tabs
      [tabs]="tabs()"
      [(value)]="value"
      [orientation]="'vertical'"
      [appearance]="'pills'"
      [size]="'sm'"
      [density]="'compact'"
    />
  `,
})
class ConfigurableTestHost {
  readonly tabs = signal<SolarisEditableTabData[]>(TWO_TABS);
  value: unknown = 'a';
}

@Component({
  standalone: true,
  imports: [SolarisEditableTabsComponent],
  template: `
    <solaris-editable-tabs
      [tabs]="tabs()"
      [(value)]="value"
      (tabRename)="onRename($event)"
      (tabRemove)="onRemove($event)"
      (tabMove)="onMove($event)"
      (defaultTabChange)="onDefaultChange($event)"
      (tabAction)="onAction($event)"
    />
  `,
})
class EventsTestHost {
  readonly tabs = signal<SolarisEditableTabData[]>(THREE_TABS);
  value: unknown = 'tab1';

  renameEvent: any = null;
  removeEvent: any = null;
  moveEvent: any = null;
  defaultChangeEvent: any = null;
  actionEvent: any = null;

  onRename(e: any): void {
    this.renameEvent = e;
  }

  onRemove(e: any): void {
    this.removeEvent = e;
  }

  onMove(e: any): void {
    this.moveEvent = e;
  }

  onDefaultChange(e: any): void {
    this.defaultChangeEvent = e;
  }

  onAction(e: any): void {
    this.actionEvent = e;
  }
}

@Component({
  standalone: true,
  imports: [SolarisEditableTabsComponent],
  template: `
    <solaris-editable-tabs
      [tabs]="tabs()"
      [(value)]="value"
      (tabAction)="onAction($event)"
    />
  `,
})
class CustomActionsTestHost {
  readonly tabs = signal<SolarisEditableTabData[]>([
    {
      value: 'tab1',
      label: 'Tab 1',
      customActions: [
        { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
        { id: 'export', label: 'Export', icon: 'export', color: 'primary' },
      ],
    },
    { value: 'tab2', label: 'Tab 2' },
  ]);
  value: unknown = 'tab1';

  actionEvent: any = null;

  onAction(e: any): void {
    this.actionEvent = e;
  }
}

@Component({
  standalone: true,
  imports: [SolarisEditableTabsComponent],
  template: ` <solaris-editable-tabs [tabs]="tabs()" [(value)]="value" /> `,
  host: { 'data-jig': 'no-default' },
})
class NoDefaultValueTestHost {
  readonly tabs = signal<SolarisEditableTabData[]>(THREE_TABS);
  value: unknown = undefined;
}

@Component({
  standalone: true,
  imports: [SolarisEditableTabsComponent],
  template: `
    <solaris-editable-tabs
      [tabs]="tabs()"
      [(value)]="value"
      [renamable]="renamable()"
      [removable]="removable()"
      [movable]="movable()"
      [defaultable]="defaultable()"
      [minTabs]="minTabs()"
    />
  `,
})
class PermissionsTestHost {
  readonly tabs = signal<SolarisEditableTabData[]>(THREE_TABS);
  value: unknown = 'tab1';
  readonly renamable = signal(true);
  readonly removable = signal(true);
  readonly movable = signal(true);
  readonly defaultable = signal(true);
  readonly minTabs = signal(1);
}

function configureBase(): void {
  configureSolarisTesting();
  TestBed.configureTestingModule({
    providers: [
      ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
    ],
  });
}

function getComponent(
  fixture: ComponentFixture<unknown>,
): SolarisEditableTabsComponent {
  return fixture.debugElement.query(By.directive(SolarisEditableTabsComponent))
    .componentInstance as SolarisEditableTabsComponent;
}

describe('SolarisEditableTabsComponent', () => {
  describe('rendering', () => {
    it('should render the component', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('solaris-editable-tabs'),
      ).toBeTruthy();
    });

    it('should apply host class', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.solaris-editable-tabs'),
      ).toBeTruthy();
    });

    it('should render inner solaris-tabs', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('solaris-tabs')).toBeTruthy();
    });

    it('should render a solaris-tab for each tab data item', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('solaris-tab').length).toBe(
        3,
      );
    });

    it('should render the tablist wrapper', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.solaris-editable-tabs__wrapper'),
      ).toBeTruthy();
    });
  });

  describe('host attributes', () => {
    it('should set data-orientation', () => {
      configureBase();
      const fixture = TestBed.createComponent(ConfigurableTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('solaris-editable-tabs')
          ?.getAttribute('data-orientation'),
      ).toBe('vertical');
    });

    it('should set data-appearance', () => {
      configureBase();
      const fixture = TestBed.createComponent(ConfigurableTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('solaris-editable-tabs')
          ?.getAttribute('data-appearance'),
      ).toBe('pills');
    });

    it('should set data-size', () => {
      configureBase();
      const fixture = TestBed.createComponent(ConfigurableTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('solaris-editable-tabs')
          ?.getAttribute('data-size'),
      ).toBe('sm');
    });

    it('should set data-density', () => {
      configureBase();
      const fixture = TestBed.createComponent(ConfigurableTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('solaris-editable-tabs')
          ?.getAttribute('data-density'),
      ).toBe('compact');
    });

    it('should set default orientation to horizontal', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('solaris-editable-tabs')
          ?.getAttribute('data-orientation'),
      ).toBe('horizontal');
    });

    it('should set default appearance to underline', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('solaris-editable-tabs')
          ?.getAttribute('data-appearance'),
      ).toBe('underline');
    });
  });

  describe('action trigger', () => {
    it('should render action area for editable tabs with showActions always', () => {
      configureBase();
      const fixture = TestBed.createComponent(AlwaysShowActionsTestHost);
      fixture.detectChanges();
      const actionAreas = fixture.nativeElement.querySelectorAll(
        '.solaris-editable-tabs__action-area--visible',
      );
      expect(actionAreas.length).toBe(3);
    });

    it('should not render action area when editable is false', () => {
      configureBase();
      const fixture = TestBed.createComponent(NonEditableTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(
          '.solaris-editable-tabs__action-area',
        ),
      ).toBeNull();
    });

    it('should not render action area for disabled tabs', () => {
      configureBase();
      const fixture = TestBed.createComponent(DisabledTabTestHost);
      fixture.detectChanges();
      const tabs = fixture.nativeElement.querySelectorAll('solaris-tab');
      const disabledTab = tabs[1];
      const actionArea = disabledTab.querySelector(
        '.solaris-editable-tabs__action-area',
      );
      expect(actionArea).toBeNull();
    });

    it('should render action trigger button with ellipsis icon', () => {
      configureBase();
      const fixture = TestBed.createComponent(AlwaysShowActionsTestHost);
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector(
        '.solaris-editable-tabs__action-trigger',
      );
      expect(trigger).toBeTruthy();
      expect(trigger?.getAttribute('type')).toBe('button');
    });
  });

  describe('configuration passthrough', () => {
    it('should pass orientation to inner solaris-tabs', () => {
      configureBase();
      const fixture = TestBed.createComponent(ConfigurableTestHost);
      fixture.detectChanges();
      const innerTabs = fixture.nativeElement.querySelector('solaris-tabs');
      expect(innerTabs?.getAttribute('data-orientation')).toBe('vertical');
    });

    it('should pass appearance to inner solaris-tabs', () => {
      configureBase();
      const fixture = TestBed.createComponent(ConfigurableTestHost);
      fixture.detectChanges();
      const innerTabs = fixture.nativeElement.querySelector('solaris-tabs');
      expect(innerTabs?.getAttribute('data-appearance')).toBe('pills');
    });

    it('should pass size to inner solaris-tabs', () => {
      configureBase();
      const fixture = TestBed.createComponent(ConfigurableTestHost);
      fixture.detectChanges();
      const innerTabs = fixture.nativeElement.querySelector('solaris-tabs');
      expect(innerTabs?.getAttribute('data-size')).toBe('sm');
    });
  });

  describe('rename', () => {
    it('should show rename input when rename is triggered', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[0];
      (component as any).startRename(tab);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(
          '.solaris-editable-tabs__rename-input',
        ),
      ).toBeTruthy();
    });

    it('should hide rename input on commit', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[0];
      (component as any).startRename(tab);
      fixture.detectChanges();
      (component as any).commitRename(tab);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(
          '.solaris-editable-tabs__rename-input',
        ),
      ).toBeNull();
    });

    it('should emit tabRename and tabRenameRequested when rename is committed', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[0];
      (component as any).startRename(tab);
      (component as any).renameValue.set('Renamed Tab');
      fixture.detectChanges();
      (component as any).commitRename(tab);
      fixture.detectChanges();
      expect(fixture.componentInstance.renameEvent).toBeTruthy();
      expect(fixture.componentInstance.renameEvent.previousLabel).toBe('Tab 1');
      expect(fixture.componentInstance.renameEvent.nextLabel).toBe(
        'Renamed Tab',
      );
      expect(fixture.componentInstance.renameEvent.source).toBe('inline');
    });

    it('should not emit rename when label is unchanged', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[0];
      (component as any).startRename(tab);
      fixture.detectChanges();
      (component as any).commitRename(tab);
      fixture.detectChanges();
      expect(fixture.componentInstance.renameEvent).toBeNull();
    });

    it('should not emit rename when label is empty', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[0];
      (component as any).startRename(tab);
      (component as any).renameValue.set('   ');
      fixture.detectChanges();
      (component as any).commitRename(tab);
      fixture.detectChanges();
      expect(fixture.componentInstance.renameEvent).toBeNull();
    });

    it('should cancel rename on Escape', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[0];
      (component as any).startRename(tab);
      (component as any).renameValue.set('New');
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector(
        '.solaris-editable-tabs__rename-input',
      );
      expect(input).toBeTruthy();
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(
          '.solaris-editable-tabs__rename-input',
        ),
      ).toBeNull();
    });

    it('should commit rename on Enter', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[0];
      (component as any).startRename(tab);
      (component as any).renameValue.set('Entered');
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector(
        '.solaris-editable-tabs__rename-input',
      );
      expect(input).toBeTruthy();
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(
          '.solaris-editable-tabs__rename-input',
        ),
      ).toBeNull();
    });
  });

  describe('canRename logic', () => {
    it('should return false when renamable input is false', () => {
      configureBase();
      const fixture = TestBed.createComponent(PermissionsTestHost);
      fixture.componentInstance.renamable.set(false);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canRename(THREE_TABS[0])).toBe(false);
    });

    it('should return false for locked tab without renamable override', () => {
      configureBase();
      const fixture = TestBed.createComponent(LockedTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canRename(LOCKED_TABS[0])).toBe(false);
    });

    it('should return true for locked tab with renamable override', () => {
      configureBase();
      const fixture = TestBed.createComponent(LockedTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const overriddenTab = { ...LOCKED_TABS[0], renamable: true };
      expect((component as any).canRename(overriddenTab)).toBe(true);
    });

    it('should return false when tab renamable is false', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as any).canRename({ ...THREE_TABS[0], renamable: false }),
      ).toBe(false);
    });
  });

  describe('remove', () => {
    it('should emit tabRemove and tabRemoveRequested on remove', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[0];
      (component as any).confirmRemove(tab, 0);
      fixture.detectChanges();
      expect(fixture.componentInstance.removeEvent).toBeTruthy();
      expect(fixture.componentInstance.removeEvent.value).toBe('tab1');
      expect(fixture.componentInstance.removeEvent.index).toBe(0);
      expect(fixture.componentInstance.removeEvent.wasActive).toBe(true);
    });

    it('should set wasActive to false when removing inactive tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[2];
      (component as any).confirmRemove(tab, 2);
      fixture.detectChanges();
      expect(fixture.componentInstance.removeEvent.wasActive).toBe(false);
    });
  });

  describe('canRemove logic', () => {
    it('should return false when removable input is false', () => {
      configureBase();
      const fixture = TestBed.createComponent(PermissionsTestHost);
      fixture.componentInstance.removable.set(false);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canRemove(THREE_TABS[0])).toBe(false);
    });

    it('should return false for locked tab without removable override', () => {
      configureBase();
      const fixture = TestBed.createComponent(LockedTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canRemove(LOCKED_TABS[0])).toBe(false);
    });

    it('should return false for disabled tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(DisabledTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canRemove(DISABLED_TABS[1])).toBe(false);
    });

    it('should return false when at minimum tabs', () => {
      configureBase();
      const fixture = TestBed.createComponent(PermissionsTestHost);
      fixture.componentInstance.minTabs.set(3);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canRemove(THREE_TABS[0])).toBe(false);
    });

    it('should return true when allowEmpty is true regardless of minTabs', () => {
      configureBase();
      const fixture = TestBed.createComponent(AllowEmptyTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canRemove(TWO_TABS[0])).toBe(true);
    });
  });

  describe('move', () => {
    it('should emit tabMove on move left', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[1];
      (component as any).moveTab(tab, 1, 'left');
      fixture.detectChanges();
      expect(fixture.componentInstance.moveEvent).toBeTruthy();
      expect(fixture.componentInstance.moveEvent.value).toBe('tab2');
      expect(fixture.componentInstance.moveEvent.previousIndex).toBe(1);
      expect(fixture.componentInstance.moveEvent.nextIndex).toBe(0);
      expect(fixture.componentInstance.moveEvent.direction).toBe('left');
    });

    it('should emit tabMove on move right', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[1];
      (component as any).moveTab(tab, 1, 'right');
      fixture.detectChanges();
      expect(fixture.componentInstance.moveEvent.direction).toBe('right');
      expect(fixture.componentInstance.moveEvent.nextIndex).toBe(2);
    });
  });

  describe('canMoveLeft logic', () => {
    it('should return false for first tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canMoveLeft(THREE_TABS[0])).toBe(false);
    });

    it('should return true for second tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canMoveLeft(THREE_TABS[1])).toBe(true);
    });

    it('should return false when movable input is false', () => {
      configureBase();
      const fixture = TestBed.createComponent(PermissionsTestHost);
      fixture.componentInstance.movable.set(false);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canMoveLeft(THREE_TABS[1])).toBe(false);
    });

    it('should return false for disabled tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(DisabledTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canMoveLeft(DISABLED_TABS[1])).toBe(false);
    });
  });

  describe('canMoveRight logic', () => {
    it('should return false for last tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canMoveRight(THREE_TABS[2])).toBe(false);
    });

    it('should return true for middle tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canMoveRight(THREE_TABS[0])).toBe(true);
    });
  });

  describe('move with locked tabs', () => {
    it('should not allow moving left past a locked tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(LockedTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canMoveLeft(LOCKED_TABS[1])).toBe(false);
    });

    it('should not allow moving right past a locked tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(LockedTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).canMoveRight(LOCKED_TABS[1])).toBe(false);
    });

    it('should not move tab when moveTab is called without permission', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      (component as any).moveTab(THREE_TABS[0], 0, 'left');
      fixture.detectChanges();
      expect(fixture.componentInstance.moveEvent).toBeNull();
    });
  });

  describe('default tab', () => {
    it('should emit defaultTabChange on set as default', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[1];
      (component as any).setAsDefault(tab);
      fixture.detectChanges();
      expect(fixture.componentInstance.defaultChangeEvent).toBeTruthy();
      expect(fixture.componentInstance.defaultChangeEvent.value).toBe('tab2');
    });

    it('should include previousDefaultValue when changing default', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      (component as any).setAsDefault(component['tabs']()[0]);
      fixture.detectChanges();
      expect(
        fixture.componentInstance.defaultChangeEvent.previousDefaultValue,
      ).toBeUndefined();
    });

    it('should track default tab value across changes', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab1 = component['tabs']()[0];
      const tab2 = component['tabs']()[1];
      (component as any).setAsDefault(tab1);
      fixture.detectChanges();
      (component as any).setAsDefault(tab2);
      fixture.detectChanges();
      expect(
        fixture.componentInstance.defaultChangeEvent.previousDefaultValue,
      ).toBe('tab1');
    });
  });

  describe('custom actions', () => {
    it('should emit tabAction when custom action is triggered', () => {
      configureBase();
      const fixture = TestBed.createComponent(CustomActionsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[0];
      const action = tab.customActions![0];
      (component as any).handleCustomAction(tab, action);
      fixture.detectChanges();
      expect(fixture.componentInstance.actionEvent).toBeTruthy();
      expect(fixture.componentInstance.actionEvent.tabValue).toBe('tab1');
      expect(fixture.componentInstance.actionEvent.actionId).toBe('duplicate');
    });
  });

  describe('hasActions logic', () => {
    it('should return false when editable is false', () => {
      configureBase();
      const fixture = TestBed.createComponent(NonEditableTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).hasActions(THREE_TABS[0])).toBe(false);
    });

    it('should return true for editable tab with default settings', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).hasActions(THREE_TABS[0])).toBe(true);
    });

    it('should return true when tab has custom actions', () => {
      configureBase();
      const fixture = TestBed.createComponent(CustomActionsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tabWithActions = component['tabs']()[0];
      expect((component as any).hasActions(tabWithActions)).toBe(true);
    });

    it('should return true when tab has custom actions even when removable/movable are disabled', () => {
      configureBase();
      const fixture = TestBed.createComponent(PermissionsTestHost);
      fixture.componentInstance.renamable.set(false);
      fixture.componentInstance.removable.set(false);
      fixture.componentInstance.movable.set(false);
      fixture.componentInstance.defaultable.set(false);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tabWithActions = {
        ...THREE_TABS[0],
        customActions: [{ id: 'test', label: 'Test' }],
      };
      expect((component as any).hasActions(tabWithActions)).toBe(true);
    });

    it('should return false for disabled tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(DisabledTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).hasActions(DISABLED_TABS[1])).toBe(false);
    });

    it('should return false when all individual actions are disabled', () => {
      configureBase();
      const fixture = TestBed.createComponent(PermissionsTestHost);
      fixture.componentInstance.renamable.set(false);
      fixture.componentInstance.removable.set(false);
      fixture.componentInstance.movable.set(false);
      fixture.componentInstance.defaultable.set(false);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect((component as any).hasActions(THREE_TABS[0])).toBe(false);
    });
  });

  describe('value binding', () => {
    it('should use defaultValue when value is not set', () => {
      configureBase();
      const fixture = TestBed.createComponent(NoDefaultValueTestHost);
      fixture.detectChanges();
      expect(fixture.componentInstance.value).toBeUndefined();
    });

    it('should sync value through two-way binding', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      expect(fixture.componentInstance.value).toBe('tab1');
    });
  });

  describe('accessibility', () => {
    it('should pass aria-label to inner tablist', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const tablist = fixture.nativeElement.querySelector(
        '.solaris-tabs__tablist',
      );
      expect(tablist?.getAttribute('aria-label')).toBeTruthy();
    });

    it('should set default aria-label on inner tablist', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const tablist = fixture.nativeElement.querySelector(
        '.solaris-tabs__tablist',
      );
      expect(tablist?.getAttribute('aria-label')).toBe('Editable tabs');
    });
  });
});
