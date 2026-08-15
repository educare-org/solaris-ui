import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisTabsComponent } from '../component/tabs.component';
import { SolarisTabComponent } from '../../tab/component/tab.component';
import { SolarisTabPanelComponent } from '../../tab-panel/component/tab-panel.component';

@Component({
  standalone: true,
  imports: [
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
  ],
  template: `
    <solaris-tabs
      [value]="value()"
      (valueChange)="value.set($event)"
      [defaultValue]="'a'"
    >
      <solaris-tab value="a" label="Tab A" />
      <solaris-tab value="b" label="Tab B" />
      <solaris-tab value="c" label="Tab C" />
      <solaris-tab-panel value="a">A</solaris-tab-panel>
      <solaris-tab-panel value="b">B</solaris-tab-panel>
      <solaris-tab-panel value="c">C</solaris-tab-panel>
    </solaris-tabs>
  `,
})
class BasicTabsTestHostComponent {
  readonly value = signal<string | number | undefined>(undefined);
}

@Component({
  standalone: true,
  imports: [
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
  ],
  template: `
    <solaris-tabs
      [value]="value()"
      (valueChange)="value.set($event)"
      [orientation]="'vertical'"
    >
      <solaris-tab value="a" label="A" />
      <solaris-tab value="b" label="B" />
      <solaris-tab-panel value="a">A</solaris-tab-panel>
      <solaris-tab-panel value="b">B</solaris-tab-panel>
    </solaris-tabs>
  `,
})
class VerticalTabsTestHostComponent {
  readonly value = signal<string | number | undefined>('a');
}

@Component({
  standalone: true,
  imports: [SolarisTabsComponent, SolarisTabComponent],
  template: `
    <solaris-tabs
      [value]="value()"
      (valueChange)="value.set($event)"
      [fullWidth]="true"
    >
      <solaris-tab value="a" label="A" />
      <solaris-tab value="b" label="B" />
    </solaris-tabs>
  `,
})
class FullWidthTabsTestHostComponent {
  readonly value = signal<string | number | undefined>('a');
}

@Component({
  standalone: true,
  imports: [SolarisTabsComponent, SolarisTabComponent],
  template: `
    <solaris-tabs
      [value]="value()"
      (valueChange)="value.set($event)"
      [showIndicator]="false"
    >
      <solaris-tab value="a" label="A" />
      <solaris-tab value="b" label="B" />
    </solaris-tabs>
  `,
})
class NoIndicatorTabsTestHostComponent {
  readonly value = signal<string | number | undefined>('a');
}

@Component({
  standalone: true,
  imports: [SolarisTabsComponent, SolarisTabComponent],
  template: `
    <solaris-tabs
      [value]="value()"
      (valueChange)="value.set($event)"
      [scrollable]="false"
    >
      <solaris-tab value="a" label="A" />
      <solaris-tab value="b" label="B" />
    </solaris-tabs>
  `,
})
class ScrollableTabsTestHostComponent {
  readonly value = signal<string | number | undefined>('a');
}

@Component({
  standalone: true,
  imports: [SolarisTabsComponent, SolarisTabComponent],
  template: `
    <solaris-tabs
      [value]="value()"
      (valueChange)="value.set($event)"
      [activationMode]="'manual'"
    >
      <solaris-tab value="a" label="A" />
      <solaris-tab value="b" label="B" />
      <solaris-tab value="c" label="C" />
    </solaris-tabs>
  `,
})
class ManualActivationTabsTestHostComponent {
  readonly value = signal<string | number | undefined>('a');
}

@Component({
  standalone: true,
  imports: [
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
  ],
  template: `
    <solaris-tabs
      [value]="value()"
      (valueChange)="value.set($event)"
      [orientation]="'horizontal'"
      [appearance]="'pills'"
      [density]="'compact'"
      [shape]="'wide'"
    >
      <solaris-tab value="a" label="A" />
      <solaris-tab value="b" label="B" />
      <solaris-tab-panel value="a">A</solaris-tab-panel>
      <solaris-tab-panel value="b">B</solaris-tab-panel>
    </solaris-tabs>
  `,
})
class ConfigurableTabsTestHostComponent {
  readonly value = signal<string | number | undefined>('a');
}

@Component({
  standalone: true,
  imports: [
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
  ],
  template: `
    <solaris-tabs [value]="value()" (valueChange)="value.set($event)">
      <solaris-tab value="a" label="A" />
      <solaris-tab value="b" label="B" [disabled]="true" />
      <solaris-tab value="c" label="C" />
      <solaris-tab-panel value="a">A</solaris-tab-panel>
      <solaris-tab-panel value="b">B</solaris-tab-panel>
      <solaris-tab-panel value="c">C</solaris-tab-panel>
    </solaris-tabs>
  `,
})
class DisabledTabTestHostComponent {
  readonly value = signal<string | number | undefined>('a');
}

function qAll(
  fixture: ComponentFixture<unknown>,
  selector: string,
): NodeListOf<HTMLElement> {
  return (fixture.nativeElement as HTMLElement).querySelectorAll(selector);
}

function configureBase() {
  configureSolarisTesting();
  TestBed.configureTestingModule({
    providers: [
      ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
    ],
  });
}

describe('SolarisTabsComponent', () => {
  it('should render tablist', () => {
    configureBase();
    const fixture = TestBed.createComponent(BasicTabsTestHostComponent);
    fixture.detectChanges();
    const tablist = fixture.nativeElement.querySelector('.solaris-tabs');
    expect(tablist).toBeTruthy();
  });

  it('should apply horizontal orientation by default', () => {
    configureBase();
    const fixture = TestBed.createComponent(BasicTabsTestHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('solaris-tabs');
    expect(host?.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('should apply vertical orientation', () => {
    configureBase();
    const fixture = TestBed.createComponent(VerticalTabsTestHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('solaris-tabs');
    expect(host?.getAttribute('data-orientation')).toBe('vertical');
  });

  it('should apply underline appearance by default', () => {
    configureBase();
    const fixture = TestBed.createComponent(BasicTabsTestHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('solaris-tabs');
    expect(host?.getAttribute('data-appearance')).toBe('underline');
  });

  it('should apply pills appearance', () => {
    configureBase();
    const fixture = TestBed.createComponent(ConfigurableTabsTestHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('solaris-tabs');
    expect(host?.getAttribute('data-appearance')).toBe('pills');
  });

  it('should apply density attribute', () => {
    configureBase();
    const fixture = TestBed.createComponent(ConfigurableTabsTestHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('solaris-tabs');
    expect(host?.getAttribute('data-density')).toBe('compact');
  });

  it('should apply shape attribute', () => {
    configureBase();
    const fixture = TestBed.createComponent(ConfigurableTabsTestHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('solaris-tabs');
    expect(host?.getAttribute('data-shape')).toBe('wide');
  });

  it('should use defaultValue when value is not set', async () => {
    configureBase();
    const fixture = TestBed.createComponent(BasicTabsTestHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const tabsEl = fixture.nativeElement.querySelector('solaris-tabs');
    const activeTab = tabsEl?.querySelector('solaris-tab[data-active="true"]');
    expect(activeTab?.getAttribute('value')).toBe('a');
  });

  it('should emit valueChange on tab click', () => {
    configureBase();
    const fixture = TestBed.createComponent(BasicTabsTestHostComponent);
    fixture.detectChanges();
    const tabs = qAll(fixture, 'solaris-tab');
    tabs[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('b');
  });

  it('should apply fullWidth attribute', () => {
    configureBase();
    const fixture = TestBed.createComponent(FullWidthTabsTestHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('solaris-tabs');
    expect(host?.getAttribute('data-full-width')).toBe('true');
  });

  it('should apply scrollable attribute', () => {
    configureBase();
    const fixture = TestBed.createComponent(ScrollableTabsTestHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('solaris-tabs');
    expect(host?.getAttribute('data-scrollable')).toBe('false');
  });

  it('should apply showIndicator attribute', () => {
    configureBase();
    const fixture = TestBed.createComponent(NoIndicatorTabsTestHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('solaris-tabs');
    expect(host?.getAttribute('data-show-indicator')).toBe('false');
  });

  it('should have tablist with role and aria-orientation', () => {
    configureBase();
    const fixture = TestBed.createComponent(BasicTabsTestHostComponent);
    fixture.detectChanges();
    const tablist = fixture.nativeElement.querySelector(
      '.solaris-tabs__tablist',
    );
    expect(tablist?.getAttribute('role')).toBe('tablist');
    expect(tablist?.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('should navigate with ArrowRight key', () => {
    configureBase();
    const fixture = TestBed.createComponent(BasicTabsTestHostComponent);
    fixture.detectChanges();
    const tabs = qAll(fixture, 'solaris-tab');
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('b');
  });

  it('should navigate with ArrowLeft key', () => {
    configureBase();
    const fixture = TestBed.createComponent(BasicTabsTestHostComponent);
    fixture.componentInstance.value.set('b');
    fixture.detectChanges();
    const tabs = qAll(fixture, 'solaris-tab');
    tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('a');
  });

  it('should navigate with Home key', () => {
    configureBase();
    const fixture = TestBed.createComponent(BasicTabsTestHostComponent);
    fixture.componentInstance.value.set('c');
    fixture.detectChanges();
    const tabs = qAll(fixture, 'solaris-tab');
    tabs[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('a');
  });

  it('should navigate with End key', () => {
    configureBase();
    const fixture = TestBed.createComponent(BasicTabsTestHostComponent);
    fixture.detectChanges();
    const tabs = qAll(fixture, 'solaris-tab');
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('c');
  });

  it('should ignore disabled tabs in keyboard navigation', () => {
    configureBase();
    const fixture = TestBed.createComponent(DisabledTabTestHostComponent);
    fixture.detectChanges();
    const tabs = qAll(fixture, 'solaris-tab');
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('c');
  });

  it('should work with ArrowDown in vertical orientation', () => {
    configureBase();
    const fixture = TestBed.createComponent(VerticalTabsTestHostComponent);
    fixture.detectChanges();
    const tabs = qAll(fixture, 'solaris-tab');
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('b');
  });

  it('should work with ArrowUp in vertical orientation', () => {
    configureBase();
    const fixture = TestBed.createComponent(VerticalTabsTestHostComponent);
    fixture.componentInstance.value.set('b');
    fixture.detectChanges();
    const tabs = qAll(fixture, 'solaris-tab');
    tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('a');
  });

  it('should not change value on manual keyboard navigation', () => {
    configureBase();
    const fixture = TestBed.createComponent(
      ManualActivationTabsTestHostComponent,
    );
    fixture.detectChanges();
    const tabs = qAll(fixture, 'solaris-tab');
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('a');
  });

  it('should activate on click in manual mode', () => {
    configureBase();
    const fixture = TestBed.createComponent(
      ManualActivationTabsTestHostComponent,
    );
    fixture.detectChanges();
    const tabs = qAll(fixture, 'solaris-tab');
    tabs[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('b');
  });

  it('should not activate on click of disabled tab', () => {
    configureBase();
    const fixture = TestBed.createComponent(DisabledTabTestHostComponent);
    fixture.detectChanges();
    const tabs = qAll(fixture, 'solaris-tab');
    tabs[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('a');
  });

  it('should activate enclosed appearance', () => {
    configureBase();
    const fixture = TestBed.createComponent(BasicTabsTestHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('solaris-tabs');
    expect(host?.getAttribute('data-appearance')).toBe('underline');
  });
});
