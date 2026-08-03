import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisTabsComponent } from '../../root/component/tabs.component';
import { SolarisTabComponent } from '../../tab/component/tab.component';
import { SolarisTabPanelComponent } from '../component/tab-panel.component';

@Component({
  standalone: true,
  imports: [
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
  ],
  template: `
    <solaris-tabs [value]="value()">
      <solaris-tab value="a">Tab A</solaris-tab>
      <solaris-tab value="b">Tab B</solaris-tab>
      <solaris-tab-panel value="a">Panel A</solaris-tab-panel>
      <solaris-tab-panel value="b">Panel B</solaris-tab-panel>
    </solaris-tabs>
  `,
})
class TestHostComponent {
  readonly value = signal<string | number>('a');
}

function configureBase() {
  configureSolarisTesting();
  TestBed.configureTestingModule({
    providers: [
      ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
    ],
  });
}

describe('SolarisTabPanelComponent', () => {
  it('should render active panel content', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const panels = fixture.nativeElement.querySelectorAll('solaris-tab-panel');
    expect(panels.length).toBe(2);
    const activePanel = fixture.nativeElement.querySelector(
      'solaris-tab-panel[data-active="true"]',
    );
    expect(activePanel).toBeTruthy();
    expect(activePanel?.textContent?.trim()).toBe('Panel A');
  });

  it('should hide inactive panels', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inactivePanels = fixture.nativeElement.querySelectorAll(
      'solaris-tab-panel:not([data-active="true"])',
    );
    expect(inactivePanels.length).toBe(1);
    expect(inactivePanels[0].hasAttribute('hidden')).toBe(true);
  });

  it('should show new panel when value changes', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.value.set('b');
    fixture.detectChanges();
    const activePanel = fixture.nativeElement.querySelector(
      'solaris-tab-panel[data-active="true"]',
    );
    expect(activePanel?.textContent?.trim()).toBe('Panel B');
  });

  it('should have role="tabpanel"', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const panels = fixture.nativeElement.querySelectorAll('solaris-tab-panel');
    panels.forEach((panel: HTMLElement) => {
      expect(panel.getAttribute('role')).toBe('tabpanel');
    });
  });

  it('should have aria-labelledby attribute', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const panels = fixture.nativeElement.querySelectorAll('solaris-tab-panel');
    panels.forEach((panel: HTMLElement) => {
      expect(panel.hasAttribute('aria-labelledby')).toBe(true);
    });
  });
});
