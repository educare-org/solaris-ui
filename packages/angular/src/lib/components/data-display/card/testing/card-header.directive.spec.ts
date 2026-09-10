import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisCardHeaderDirective } from '../directives/card-header.directive';

@Component({
  standalone: true,
  imports: [SolarisCardHeaderDirective],
  template: '<div solaris-card-header><span>Header Content</span></div>',
})
class TestHostComponent {}

@Component({
  standalone: true,
  imports: [SolarisCardHeaderDirective],
  template:
    '<div solaris-card-header [separator]="false"><span>Header</span></div>',
})
class NoSeparatorHostComponent {}

describe('SolarisCardHeaderDirective', () => {
  const createFixture = <T>(component: new () => T) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(component);
    fixture.detectChanges();
    return fixture;
  };

  it('should project content', () => {
    const fixture: ComponentFixture<TestHostComponent> =
      createFixture(TestHostComponent);
    const el = fixture.nativeElement.querySelector('[solaris-card-header]');
    expect(el.textContent).toContain('Header Content');
  });

  it('should have data-separator by default', () => {
    const fixture: ComponentFixture<TestHostComponent> =
      createFixture(TestHostComponent);
    const el = fixture.nativeElement.querySelector('[solaris-card-header]');
    expect(el.hasAttribute('data-separator')).toBe(true);
  });

  it('should not have data-separator when separator is false', () => {
    const noSepFixture = createFixture(NoSeparatorHostComponent);
    const el = noSepFixture.nativeElement.querySelector(
      '[solaris-card-header]',
    );
    expect(el.hasAttribute('data-separator')).toBe(false);
  });
});
