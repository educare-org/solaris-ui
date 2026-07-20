import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { provideSolarisIcons } from '../../../../services/icon/provider/provide-solaris-icons';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisTabsComponent } from '../component/tabs.component';
import { SolarisTabComponent } from './tab.component';
import { SolarisTabPanelComponent } from '../tab-panel/tab-panel.component';

@Component({
  standalone: true,
  imports: [
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
  ],
  template: `
    <solaris-tabs [value]="value()" (valueChange)="value.set($event)">
      <solaris-tab value="a" label="Tab A" icon="check" [badge]="5" />
      <solaris-tab value="b" label="Tab B" />
      <solaris-tab value="c" label="Tab C" [disabled]="true" />
      <solaris-tab-panel value="a">A</solaris-tab-panel>
      <solaris-tab-panel value="b">B</solaris-tab-panel>
      <solaris-tab-panel value="c">C</solaris-tab-panel>
    </solaris-tabs>
  `,
})
class TestHostComponent {
  readonly value = signal<string | number | undefined>('a');
}

@Component({
  standalone: true,
  imports: [SolarisTabsComponent, SolarisTabComponent],
  template: `
    <solaris-tabs [value]="value()">
      <solaris-tab value="x">Projected X</solaris-tab>
      <solaris-tab value="y">Projected Y</solaris-tab>
    </solaris-tabs>
  `,
})
class ProjectedLabelTestHostComponent {
  readonly value = signal<string | number | undefined>('x');
}

function configureBase() {
  configureSolarisTesting();
  TestBed.configureTestingModule({
    providers: [...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS })],
  });
}

describe('SolarisTabComponent', () => {
  it('should render label from input', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('solaris-tab');
    expect(tabs[0].textContent?.trim()).toContain('Tab A');
  });

  it('should render projected content', () => {
    configureBase();
    const fixture = TestBed.createComponent(ProjectedLabelTestHostComponent);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('solaris-tab');
    expect(tabs[0].textContent?.trim()).toContain('Projected X');
  });

  it('should render icon when provided', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const firstTab = fixture.nativeElement.querySelector('solaris-tab');
    const icon = firstTab?.querySelector('solaris-icon');
    expect(icon).toBeTruthy();
  });

  it('should render badge when provided', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const firstTab = fixture.nativeElement.querySelector('solaris-tab');
    const badge = firstTab?.querySelector('solaris-badge');
    expect(badge).toBeTruthy();
    expect(badge?.textContent?.trim()).toBe('5');
  });

  it('should have role="tab"', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('solaris-tab');
    tabs.forEach((tab: HTMLElement) => {
      expect(tab.getAttribute('role')).toBe('tab');
    });
  });

  it('should set aria-selected on active tab', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('solaris-tab');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });

  it('should set aria-disabled on disabled tab', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('solaris-tab');
    expect(tabs[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('should set tabindex correctly', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('solaris-tab');
    expect(tabs[0].getAttribute('tabindex')).toBe('0');
    expect(tabs[1].getAttribute('tabindex')).toBe('-1');
  });

  it('should not activate disabled tab on click', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('solaris-tab');
    tabs[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('a');
  });

  it('should activate tab on click', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('solaris-tab');
    tabs[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('b');
  });
});
