import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { SolarisLoadingZoneDirective } from '../directives/loading-zone.directive';
import { configureSolarisTesting } from '../../../../testing';

describe('SolarisLoadingZoneDirective', () => {
  @Component({
    standalone: true,
    imports: [SolarisLoadingZoneDirective],
    template:
      '<form [solaris-loading-zone]="loading()"><input type="text" /></form>',
  })
  class TestHostComponent {
    readonly loading = signal(false);
  }

  let host: ComponentFixture<TestHostComponent>;

  const createHost = () => {
    configureSolarisTesting(undefined, { imports: [TestHostComponent] });
    host = TestBed.createComponent(TestHostComponent);
    host.detectChanges();
    return host.nativeElement.querySelector('form') as HTMLElement;
  };

  it('should mark the zone as a loading zone', () => {
    const form = createHost();
    expect(form.classList.contains('solaris-loading-zone')).toBe(true);
  });

  it('should expose no busy state when idle', () => {
    const form = createHost();
    expect(form.hasAttribute('aria-busy')).toBe(false);
    expect(form.hasAttribute('inert')).toBe(false);
    expect(form.hasAttribute('data-loading')).toBe(false);
  });

  it('should expose aria-busy and inert while loading', () => {
    const form = createHost();
    host.componentInstance.loading.set(true);
    host.detectChanges();
    expect(form.getAttribute('aria-busy')).toBe('true');
    expect(form.hasAttribute('inert')).toBe(true);
    expect(form.hasAttribute('data-loading')).toBe(true);
  });

  it('should release the zone when loading finishes', () => {
    const form = createHost();
    host.componentInstance.loading.set(true);
    host.detectChanges();
    host.componentInstance.loading.set(false);
    host.detectChanges();
    expect(form.hasAttribute('aria-busy')).toBe(false);
    expect(form.hasAttribute('inert')).toBe(false);
    expect(form.hasAttribute('data-loading')).toBe(false);
  });
});
