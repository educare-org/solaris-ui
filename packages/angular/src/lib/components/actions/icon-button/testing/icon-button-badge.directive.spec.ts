import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisIconButtonBadgeDirective } from '../directives/icon-button-badge.directive';

describe('SolarisIconButtonBadgeDirective', () => {
  @Component({
    standalone: true,
    imports: [SolarisIconButtonBadgeDirective],
    template: `<span solaris-icon-button-badge>3</span>`,
  })
  class TestHost {}

  it('should apply directive to element', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '[solaris-icon-button-badge]',
    );
    expect(el).toBeTruthy();
  });

  it('should apply solaris-icon-button-badge class', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '[solaris-icon-button-badge]',
    );
    expect(el.classList.contains('solaris-icon-button-badge')).toBe(true);
  });
});
