import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisTabsComponent } from '../component/tabs.component';
import { SolarisTabComponent } from '../../tab/component/tab.component';

@Component({
  standalone: true,
  imports: [SolarisTabsComponent, SolarisTabComponent],
  template: `
    <solaris-tabs [(value)]="active">
      <solaris-tab value="a" label="Tab A" />
      <solaris-tab value="b" label="Tab B" />
    </solaris-tabs>
  `,
})
class BananaSignalHostComponent {
  readonly active = signal<string | number | undefined>('a');
}

describe('SolarisTabsComponent signal two-way binding', () => {
  it('should write back to a readonly parent signal via [(value)]', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });
    const fixture = TestBed.createComponent(BananaSignalHostComponent);
    fixture.detectChanges();

    const tabs = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'solaris-tab',
    );
    (tabs[1] as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.active()).toBe('b');
  });

  it('should reflect parent signal updates in the active tab', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });
    const fixture = TestBed.createComponent(BananaSignalHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.active.set('b');
    fixture.detectChanges();

    const activeTab = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-tab[data-active="true"]',
    );
    expect(activeTab?.getAttribute('value')).toBe('b');
  });
});
