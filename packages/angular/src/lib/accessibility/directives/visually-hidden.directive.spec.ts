import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SolarisVisuallyHiddenDirective } from './visually-hidden.directive';

@Component({
  standalone: true,
  imports: [SolarisVisuallyHiddenDirective],
  template: `<span solaris-visually-hidden>Screen reader only text</span>`,
})
class TestHostComponent {}

@Component({
  standalone: true,
  imports: [SolarisVisuallyHiddenDirective],
  template: `<div><span solaris-visually-hidden>Hidden inside div</span></div>`,
})
class TestNestedHostComponent {}

describe('SolarisVisuallyHiddenDirective', () => {
  it('applies visually hidden styles to host element', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement.querySelector(
      '[solaris-visually-hidden]',
    );
    expect(element).toBeTruthy();
    expect(element.style.position).toBe('absolute');
    expect(element.style.width).toBe('1px');
    expect(element.style.height).toBe('1px');
    expect(element.style.overflow).toBe('hidden');
  });

  it('does not remove content from DOM', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement.querySelector(
      '[solaris-visually-hidden]',
    );
    expect(element.textContent).toBe('Screen reader only text');
  });

  it('does not use display none', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement.querySelector(
      '[solaris-visually-hidden]',
    );
    expect(element.style.display).not.toBe('none');
  });

  it('does not use visibility hidden', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement.querySelector(
      '[solaris-visually-hidden]',
    );
    expect(element.style.visibility).not.toBe('hidden');
  });

  it('works inside nested DOM structure', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestNestedHostComponent],
    }).createComponent(TestNestedHostComponent);

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement.querySelector(
      '[solaris-visually-hidden]',
    );
    expect(element).toBeTruthy();
    expect(element.style.position).toBe('absolute');
    expect(element.textContent).toBe('Hidden inside div');
  });
});
