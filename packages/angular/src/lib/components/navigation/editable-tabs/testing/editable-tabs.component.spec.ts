import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, signal, type WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';

import {
  assertPresent,
  configureSolarisTesting,
} from '../../../../testing/solaris-test-utilities';
import { provideSolaris } from '../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisEditableTabsComponent } from '../component/editable-tabs.component';

import type {
  SolarisEditableTabAction,
  SolarisEditableTabActionEvent,
  SolarisEditableTabData,
  SolarisEditableTabDefaultChangeEvent,
  SolarisEditableTabMoveDirection,
  SolarisEditableTabMoveEvent,
  SolarisEditableTabRemoveEvent,
  SolarisEditableTabRenameEvent,
} from '../model/editable-tabs.types';

type EditableTabsTestSeam = {
  startRename: (tab: SolarisEditableTabData) => void;
  commitRename: (tab: SolarisEditableTabData) => void;
  renameValue: WritableSignal<string>;
  canRename: (tab: SolarisEditableTabData) => boolean;
  confirmRemove: (tab: SolarisEditableTabData, index: number) => void;
  canRemove: (tab: SolarisEditableTabData) => boolean;
  moveTab: (
    tab: SolarisEditableTabData,
    index: number,
    direction: SolarisEditableTabMoveDirection,
  ) => void;
  canMoveLeft: (tab: SolarisEditableTabData) => boolean;
  canMoveRight: (tab: SolarisEditableTabData) => boolean;
  setAsDefault: (tab: SolarisEditableTabData) => void;
  handleCustomAction: (
    tab: SolarisEditableTabData,
    action: SolarisEditableTabAction,
  ) => void;
  hasActions: (tab: SolarisEditableTabData) => boolean;
  isDragReorderEnabled: (tab: SolarisEditableTabData) => boolean;
  onTabDragStart: (
    event: Pick<DragEvent, 'preventDefault' | 'target'>,
    tab: SolarisEditableTabData,
    index: number,
  ) => void;
  onTabDragOver: (event: DragEvent, index: number) => void;
  onTabDrop: (
    event: DragEvent,
    tab: SolarisEditableTabData,
    index: number,
  ) => void;
  onTabDragEnd: () => void;
  draggingTabIndex: WritableSignal<number | null>;
  dropIndicatorIndex: WritableSignal<number | null>;
};

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
      [size]="'lg'"
      [color]="'neutral'"
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
      [dragToReorder]="true"
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

  renameEvent: SolarisEditableTabRenameEvent | null = null;
  removeEvent: SolarisEditableTabRemoveEvent | null = null;
  moveEvent: SolarisEditableTabMoveEvent | null = null;
  defaultChangeEvent: SolarisEditableTabDefaultChangeEvent | null = null;
  actionEvent: SolarisEditableTabActionEvent | null = null;

  onRename(e: SolarisEditableTabRenameEvent): void {
    this.renameEvent = e;
  }

  onRemove(e: SolarisEditableTabRemoveEvent): void {
    this.removeEvent = e;
  }

  onMove(e: SolarisEditableTabMoveEvent): void {
    this.moveEvent = e;
  }

  onDefaultChange(e: SolarisEditableTabDefaultChangeEvent): void {
    this.defaultChangeEvent = e;
  }

  onAction(e: SolarisEditableTabActionEvent): void {
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

  actionEvent: SolarisEditableTabActionEvent | null = null;

  onAction(e: SolarisEditableTabActionEvent): void {
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

@Component({
  standalone: true,
  imports: [SolarisEditableTabsComponent],
  template: `
    <solaris-editable-tabs
      [tabs]="tabs()"
      [(value)]="value"
      [dragToReorder]="false"
    />
  `,
})
class DragDisabledTestHost {
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
      dragToReorder="false"
    />
  `,
})
class StaticDragOffTestHost {
  readonly tabs = signal<SolarisEditableTabData[]>(THREE_TABS);
  value: unknown = 'tab1';
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

    it('should set default size to md', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('solaris-editable-tabs')
          ?.getAttribute('data-size'),
      ).toBe('md');
    });

    it('should set default color to primary', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('solaris-editable-tabs')
          ?.getAttribute('data-color'),
      ).toBe('primary');
    });

    it('should set data-size', () => {
      configureBase();
      const fixture = TestBed.createComponent(ConfigurableTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('solaris-editable-tabs')
          ?.getAttribute('data-size'),
      ).toBe('lg');
    });

    it('should set data-color', () => {
      configureBase();
      const fixture = TestBed.createComponent(ConfigurableTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('solaris-editable-tabs')
          ?.getAttribute('data-color'),
      ).toBe('neutral');
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

    it('should pass density to inner solaris-tabs', () => {
      configureBase();
      const fixture = TestBed.createComponent(ConfigurableTestHost);
      fixture.detectChanges();
      const innerTabs = fixture.nativeElement.querySelector('solaris-tabs');
      expect(innerTabs?.getAttribute('data-density')).toBe('compact');
    });

    it('should pass size to inner solaris-tabs', () => {
      configureBase();
      const fixture = TestBed.createComponent(ConfigurableTestHost);
      fixture.detectChanges();
      const innerTabs = fixture.nativeElement.querySelector('solaris-tabs');
      expect(innerTabs?.getAttribute('data-size')).toBe('lg');
    });

    it('should pass color to inner solaris-tabs', () => {
      configureBase();
      const fixture = TestBed.createComponent(ConfigurableTestHost);
      fixture.detectChanges();
      const innerTabs = fixture.nativeElement.querySelector('solaris-tabs');
      expect(innerTabs?.getAttribute('data-color')).toBe('neutral');
    });
  });

  describe('rename', () => {
    it('should show rename input when rename is triggered', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[0];
      (component as unknown as EditableTabsTestSeam).startRename(tab);
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
      (component as unknown as EditableTabsTestSeam).startRename(tab);
      fixture.detectChanges();
      (component as unknown as EditableTabsTestSeam).commitRename(tab);
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
      (component as unknown as EditableTabsTestSeam).startRename(tab);
      (component as unknown as EditableTabsTestSeam).renameValue.set(
        'Renamed Tab',
      );
      fixture.detectChanges();
      (component as unknown as EditableTabsTestSeam).commitRename(tab);
      fixture.detectChanges();
      expect(fixture.componentInstance.renameEvent).toBeTruthy();
      expect(
        assertPresent(fixture.componentInstance.renameEvent, 'rename event')
          .previousLabel,
      ).toBe('Tab 1');
      expect(
        assertPresent(fixture.componentInstance.renameEvent, 'rename event')
          .nextLabel,
      ).toBe('Renamed Tab');
      expect(
        assertPresent(fixture.componentInstance.renameEvent, 'rename event')
          .source,
      ).toBe('inline');
    });

    it('should not emit rename when label is unchanged', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[0];
      (component as unknown as EditableTabsTestSeam).startRename(tab);
      fixture.detectChanges();
      (component as unknown as EditableTabsTestSeam).commitRename(tab);
      fixture.detectChanges();
      expect(fixture.componentInstance.renameEvent).toBeNull();
    });

    it('should not emit rename when label is empty', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[0];
      (component as unknown as EditableTabsTestSeam).startRename(tab);
      (component as unknown as EditableTabsTestSeam).renameValue.set('   ');
      fixture.detectChanges();
      (component as unknown as EditableTabsTestSeam).commitRename(tab);
      fixture.detectChanges();
      expect(fixture.componentInstance.renameEvent).toBeNull();
    });

    it('should cancel rename on Escape', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[0];
      (component as unknown as EditableTabsTestSeam).startRename(tab);
      (component as unknown as EditableTabsTestSeam).renameValue.set('New');
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
      (component as unknown as EditableTabsTestSeam).startRename(tab);
      (component as unknown as EditableTabsTestSeam).renameValue.set('Entered');
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
      expect(
        (component as unknown as EditableTabsTestSeam).canRename(THREE_TABS[0]),
      ).toBe(false);
    });

    it('should return false for locked tab without renamable override', () => {
      configureBase();
      const fixture = TestBed.createComponent(LockedTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canRename(
          LOCKED_TABS[0],
        ),
      ).toBe(false);
    });

    it('should return true for locked tab with renamable override', () => {
      configureBase();
      const fixture = TestBed.createComponent(LockedTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const overriddenTab = { ...LOCKED_TABS[0], renamable: true };
      expect(
        (component as unknown as EditableTabsTestSeam).canRename(overriddenTab),
      ).toBe(true);
    });

    it('should return false when tab renamable is false', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canRename({
          ...THREE_TABS[0],
          renamable: false,
        }),
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
      (component as unknown as EditableTabsTestSeam).confirmRemove(tab, 0);
      fixture.detectChanges();
      expect(fixture.componentInstance.removeEvent).toBeTruthy();
      expect(
        assertPresent(fixture.componentInstance.removeEvent, 'remove event')
          .value,
      ).toBe('tab1');
      expect(
        assertPresent(fixture.componentInstance.removeEvent, 'remove event')
          .index,
      ).toBe(0);
      expect(
        assertPresent(fixture.componentInstance.removeEvent, 'remove event')
          .wasActive,
      ).toBe(true);
    });

    it('should set wasActive to false when removing inactive tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[2];
      (component as unknown as EditableTabsTestSeam).confirmRemove(tab, 2);
      fixture.detectChanges();
      expect(
        assertPresent(fixture.componentInstance.removeEvent, 'remove event')
          .wasActive,
      ).toBe(false);
    });
  });

  describe('canRemove logic', () => {
    it('should return false when removable input is false', () => {
      configureBase();
      const fixture = TestBed.createComponent(PermissionsTestHost);
      fixture.componentInstance.removable.set(false);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canRemove(THREE_TABS[0]),
      ).toBe(false);
    });

    it('should return false for locked tab without removable override', () => {
      configureBase();
      const fixture = TestBed.createComponent(LockedTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canRemove(
          LOCKED_TABS[0],
        ),
      ).toBe(false);
    });

    it('should return false for disabled tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(DisabledTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canRemove(
          DISABLED_TABS[1],
        ),
      ).toBe(false);
    });

    it('should return false when at minimum tabs', () => {
      configureBase();
      const fixture = TestBed.createComponent(PermissionsTestHost);
      fixture.componentInstance.minTabs.set(3);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canRemove(THREE_TABS[0]),
      ).toBe(false);
    });

    it('should return true when allowEmpty is true regardless of minTabs', () => {
      configureBase();
      const fixture = TestBed.createComponent(AllowEmptyTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canRemove(TWO_TABS[0]),
      ).toBe(true);
    });
  });

  describe('move', () => {
    it('should emit tabMove on move left', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[1];
      (component as unknown as EditableTabsTestSeam).moveTab(tab, 1, 'left');
      fixture.detectChanges();
      expect(fixture.componentInstance.moveEvent).toBeTruthy();
      expect(
        assertPresent(fixture.componentInstance.moveEvent, 'move event').value,
      ).toBe('tab2');
      expect(
        assertPresent(fixture.componentInstance.moveEvent, 'move event')
          .previousIndex,
      ).toBe(1);
      expect(
        assertPresent(fixture.componentInstance.moveEvent, 'move event')
          .nextIndex,
      ).toBe(0);
      expect(
        assertPresent(fixture.componentInstance.moveEvent, 'move event')
          .direction,
      ).toBe('left');
    });

    it('should emit tabMove on move right', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab = component['tabs']()[1];
      (component as unknown as EditableTabsTestSeam).moveTab(tab, 1, 'right');
      fixture.detectChanges();
      expect(
        assertPresent(fixture.componentInstance.moveEvent, 'move event')
          .direction,
      ).toBe('right');
      expect(
        assertPresent(fixture.componentInstance.moveEvent, 'move event')
          .nextIndex,
      ).toBe(2);
    });
  });

  describe('canMoveLeft logic', () => {
    it('should return false for first tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canMoveLeft(
          THREE_TABS[0],
        ),
      ).toBe(false);
    });

    it('should return true for second tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canMoveLeft(
          THREE_TABS[1],
        ),
      ).toBe(true);
    });

    it('should return false when movable input is false', () => {
      configureBase();
      const fixture = TestBed.createComponent(PermissionsTestHost);
      fixture.componentInstance.movable.set(false);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canMoveLeft(
          THREE_TABS[1],
        ),
      ).toBe(false);
    });

    it('should return false for disabled tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(DisabledTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canMoveLeft(
          DISABLED_TABS[1],
        ),
      ).toBe(false);
    });
  });

  describe('canMoveRight logic', () => {
    it('should return false for last tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canMoveRight(
          THREE_TABS[2],
        ),
      ).toBe(false);
    });

    it('should return true for middle tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canMoveRight(
          THREE_TABS[0],
        ),
      ).toBe(true);
    });
  });

  describe('move with locked tabs', () => {
    it('should not allow moving left past a locked tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(LockedTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canMoveLeft(
          LOCKED_TABS[1],
        ),
      ).toBe(false);
    });

    it('should not allow moving right past a locked tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(LockedTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).canMoveRight(
          LOCKED_TABS[1],
        ),
      ).toBe(false);
    });

    it('should not move tab when moveTab is called without permission', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      (component as unknown as EditableTabsTestSeam).moveTab(
        THREE_TABS[0],
        0,
        'left',
      );
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
      (component as unknown as EditableTabsTestSeam).setAsDefault(tab);
      fixture.detectChanges();
      expect(fixture.componentInstance.defaultChangeEvent).toBeTruthy();
      expect(
        assertPresent(
          fixture.componentInstance.defaultChangeEvent,
          'default change event',
        ).value,
      ).toBe('tab2');
    });

    it('should include previousDefaultValue when changing default', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      (component as unknown as EditableTabsTestSeam).setAsDefault(
        component['tabs']()[0],
      );
      fixture.detectChanges();
      expect(
        assertPresent(
          fixture.componentInstance.defaultChangeEvent,
          'default change event',
        ).previousDefaultValue,
      ).toBeUndefined();
    });

    it('should track default tab value across changes', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tab1 = component['tabs']()[0];
      const tab2 = component['tabs']()[1];
      (component as unknown as EditableTabsTestSeam).setAsDefault(tab1);
      fixture.detectChanges();
      (component as unknown as EditableTabsTestSeam).setAsDefault(tab2);
      fixture.detectChanges();
      expect(
        assertPresent(
          fixture.componentInstance.defaultChangeEvent,
          'default change event',
        ).previousDefaultValue,
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
      const actions = assertPresent(tab.customActions, 'custom actions');
      const action = assertPresent(actions[0], 'custom action');
      (component as unknown as EditableTabsTestSeam).handleCustomAction(
        tab,
        action,
      );
      fixture.detectChanges();
      expect(fixture.componentInstance.actionEvent).toBeTruthy();
      expect(
        assertPresent(fixture.componentInstance.actionEvent, 'action event')
          .tabValue,
      ).toBe('tab1');
      expect(
        assertPresent(fixture.componentInstance.actionEvent, 'action event')
          .actionId,
      ).toBe('duplicate');
    });
  });

  describe('hasActions logic', () => {
    it('should return false when editable is false', () => {
      configureBase();
      const fixture = TestBed.createComponent(NonEditableTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).hasActions(
          THREE_TABS[0],
        ),
      ).toBe(false);
    });

    it('should return true for editable tab with default settings', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).hasActions(
          THREE_TABS[0],
        ),
      ).toBe(true);
    });

    it('should return true when tab has custom actions', () => {
      configureBase();
      const fixture = TestBed.createComponent(CustomActionsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const tabWithActions = component['tabs']()[0];
      expect(
        (component as unknown as EditableTabsTestSeam).hasActions(
          tabWithActions,
        ),
      ).toBe(true);
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
      expect(
        (component as unknown as EditableTabsTestSeam).hasActions(
          tabWithActions,
        ),
      ).toBe(true);
    });

    it('should return false for disabled tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(DisabledTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).hasActions(
          DISABLED_TABS[1],
        ),
      ).toBe(false);
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
      expect(
        (component as unknown as EditableTabsTestSeam).hasActions(
          THREE_TABS[0],
        ),
      ).toBe(false);
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

  describe('drag to reorder', () => {
    function dragEvent(overrides: Record<string, unknown> = {}): unknown {
      return {
        preventDefault: (): void => undefined,
        clientX: 0,
        clientY: 0,
        currentTarget: null,
        dataTransfer: { effectAllowed: '', dropEffect: '' },
        target: document.createElement('div'),
        ...overrides,
      };
    }

    it('should disable drag reorder by default (opt-in)', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).isDragReorderEnabled(
          THREE_TABS[1],
        ),
      ).toBe(false);
    });

    it('should render draggable="false" by default with no grab affordance', () => {
      configureBase();
      const fixture = TestBed.createComponent(BasicTestHost);
      fixture.detectChanges();
      const tabs = fixture.nativeElement.querySelectorAll('solaris-tab');
      expect(tabs[1]?.getAttribute('draggable')).toBe('false');
      expect(tabs[1]?.hasAttribute('data-draggable')).toBe(false);
    });

    it('should enable drag reorder when dragToReorder is true', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).isDragReorderEnabled(
          THREE_TABS[1],
        ),
      ).toBe(true);
    });

    it('should set draggable attribute on tabs when enabled', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const tabs = fixture.nativeElement.querySelectorAll('solaris-tab');
      expect(tabs[1]?.getAttribute('draggable')).toBe('true');
    });

    it('should disable drag reorder when movable is false', () => {
      configureBase();
      const fixture = TestBed.createComponent(PermissionsTestHost);
      fixture.componentInstance.movable.set(false);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).isDragReorderEnabled(
          THREE_TABS[1],
        ),
      ).toBe(false);
    });

    it('should disable drag reorder with property-bound dragToReorder false', () => {
      configureBase();
      const fixture = TestBed.createComponent(DragDisabledTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).isDragReorderEnabled(
          THREE_TABS[1],
        ),
      ).toBe(false);
    });

    it('should disable drag reorder with static dragToReorder="false" attribute', () => {
      configureBase();
      const fixture = TestBed.createComponent(StaticDragOffTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).isDragReorderEnabled(
          THREE_TABS[1],
        ),
      ).toBe(false);
    });

    it('should render draggable="false" and no grab affordance when disabled', () => {
      configureBase();
      const fixture = TestBed.createComponent(DragDisabledTestHost);
      fixture.detectChanges();
      const tabs = fixture.nativeElement.querySelectorAll('solaris-tab');
      expect(tabs[1]?.getAttribute('draggable')).toBe('false');
      expect(tabs[1]?.hasAttribute('data-draggable')).toBe(false);
    });

    it('should not show a drop indicator for a non-reorderable dragged tab', () => {
      configureBase();
      const fixture = TestBed.createComponent(DragDisabledTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      (component as unknown as EditableTabsTestSeam).draggingTabIndex.set(0);
      (component as unknown as EditableTabsTestSeam).onTabDragOver(
        dragEvent() as DragEvent,
        1,
      );
      expect(
        (component as unknown as EditableTabsTestSeam).dropIndicatorIndex(),
      ).toBeNull();
    });

    it('should disable drag reorder for locked tabs', () => {
      configureBase();
      const fixture = TestBed.createComponent(LockedTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).isDragReorderEnabled(
          LOCKED_TABS[0],
        ),
      ).toBe(false);
    });

    it('should disable drag reorder for disabled tabs', () => {
      configureBase();
      const fixture = TestBed.createComponent(DisabledTabTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      expect(
        (component as unknown as EditableTabsTestSeam).isDragReorderEnabled(
          DISABLED_TABS[1],
        ),
      ).toBe(false);
    });

    it('should not start drag from buttons or inputs', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      const button = document.createElement('button');
      let prevented = false;
      (component as unknown as EditableTabsTestSeam).onTabDragStart(
        {
          preventDefault: (): void => {
            prevented = true;
          },
          target: button,
        },
        component['tabs']()[1],
        1,
      );
      expect(prevented).toBe(true);
      expect(
        (component as unknown as EditableTabsTestSeam).draggingTabIndex(),
      ).toBeNull();
    });

    it('should emit tabMove on drop at a new position', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      (component as unknown as EditableTabsTestSeam).onTabDragStart(
        dragEvent() as DragEvent,
        component['tabs']()[0],
        0,
      );
      const dropEvent = dragEvent({
        clientX: 80,
        currentTarget: {
          getBoundingClientRect: (): DOMRect =>
            ({ left: 0, width: 100 }) as DOMRect,
        },
      });
      (component as unknown as EditableTabsTestSeam).onTabDrop(
        dropEvent as DragEvent,
        component['tabs']()[1],
        1,
      );
      fixture.detectChanges();
      expect(fixture.componentInstance.moveEvent).toBeTruthy();
      expect(
        assertPresent(fixture.componentInstance.moveEvent, 'move event')
          .previousIndex,
      ).toBe(0);
      expect(
        assertPresent(fixture.componentInstance.moveEvent, 'move event')
          .nextIndex,
      ).toBe(1);
      expect(
        assertPresent(fixture.componentInstance.moveEvent, 'move event')
          .direction,
      ).toBe('right');
    });

    it('should not emit tabMove when dropped at the same position', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      (component as unknown as EditableTabsTestSeam).onTabDragStart(
        dragEvent() as DragEvent,
        component['tabs']()[1],
        1,
      );
      (component as unknown as EditableTabsTestSeam).dropIndicatorIndex.set(1);
      (component as unknown as EditableTabsTestSeam).onTabDrop(
        dragEvent() as DragEvent,
        component['tabs']()[1],
        1,
      );
      fixture.detectChanges();
      expect(fixture.componentInstance.moveEvent).toBeNull();
    });

    it('should clear drag state on drag end', () => {
      configureBase();
      const fixture = TestBed.createComponent(EventsTestHost);
      fixture.detectChanges();
      const component = getComponent(fixture);
      (component as unknown as EditableTabsTestSeam).onTabDragStart(
        dragEvent() as DragEvent,
        component['tabs']()[0],
        0,
      );
      (component as unknown as EditableTabsTestSeam).onTabDragEnd();
      expect(
        (component as unknown as EditableTabsTestSeam).draggingTabIndex(),
      ).toBeNull();
      expect(
        (component as unknown as EditableTabsTestSeam).dropIndicatorIndex(),
      ).toBeNull();
    });
  });

  describe('icon swap animation', () => {
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
    class IconSwapTestHost {
      readonly tabs = signal<SolarisEditableTabData[]>([
        { value: 'code', label: 'Code', icon: 'code' },
        { value: 'plain', label: 'Plain' },
      ]);
      value: unknown = 'code';
    }

    it('should render stacked swap layers for tabs with icons', () => {
      configureBase();
      const fixture = TestBed.createComponent(IconSwapTestHost);
      fixture.detectChanges();
      const swap = fixture.nativeElement.querySelector(
        '.solaris-editable-tabs__icon-swap',
      );
      expect(swap).toBeTruthy();
      expect(
        swap.querySelector('.solaris-editable-tabs__swap-icon--icon'),
      ).toBeTruthy();
      expect(
        swap.querySelector('.solaris-editable-tabs__swap-icon--action'),
      ).toBeTruthy();
    });

    it('should keep the plain action area for tabs without icons', () => {
      configureBase();
      const fixture = TestBed.createComponent(IconSwapTestHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(
          '.solaris-editable-tabs__action-area',
        ),
      ).toBeTruthy();
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
