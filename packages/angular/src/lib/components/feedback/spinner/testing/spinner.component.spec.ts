import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisSpinnerComponent } from '../component/spinner.component';
import { configureSolarisTesting } from '../../../../testing';

describe('SolarisSpinnerComponent', () => {
  let fixture: ComponentFixture<SolarisSpinnerComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisSpinnerComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
    expect(el.classList.contains('solaris-spinner')).toBe(true);
  });

  it('should have default size md', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
  });

  it('should have default color primary', () => {
    const el = createFixture();
    expect(el.getAttribute('data-color')).toBe('primary');
  });

  it('should have role status and aria-live polite', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('should apply all size values', () => {
    const el = createFixture();
    const values = ['sm', 'md', 'lg', 'xl'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('size', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-size')).toBe(v);
    }
  });

  it('should apply all speed values', () => {
    const el = createFixture();
    const values = ['slow', 'normal', 'fast'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('speed', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-speed')).toBe(v);
    }
  });

  it('should apply all easing values', () => {
    const el = createFixture();
    const values = [
      'linear',
      'ease',
      'ease-in',
      'ease-out',
      'ease-in-out',
      'spring',
    ] as const;
    for (const v of values) {
      fixture.componentRef.setInput('easing', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-easing')).toBe(v);
    }
  });

  it('should have default speed normal', () => {
    const el = createFixture();
    expect(el.getAttribute('data-speed')).toBe('normal');
  });

  it('should have default easing linear', () => {
    const el = createFixture();
    expect(el.getAttribute('data-easing')).toBe('linear');
  });

  it('should render backdrop attribute when enabled', () => {
    const el = createFixture();
    fixture.componentRef.setInput('backdrop', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-backdrop')).toBe(true);
  });

  it('should not render backdrop attribute by default', () => {
    const el = createFixture();
    expect(el.hasAttribute('data-backdrop')).toBe(false);
  });

  it('should apply all color values', () => {
    const el = createFixture();
    const values = [
      'neutral',
      'primary',
      'success',
      'warning',
      'danger',
      'info',
      'custom',
    ] as const;
    for (const v of values) {
      fixture.componentRef.setInput('color', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-color')).toBe(v);
    }
  });

  it('should render a decorative indicator', () => {
    const el = createFixture();
    const ring = el.querySelector('.solaris-spinner__ring');
    const indicator = el.querySelector('.solaris-spinner__indicator');
    expect(ring).toBeTruthy();
    expect(indicator).toBeTruthy();
    expect(ring?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render default loading label', () => {
    const el = createFixture();
    const label = el.querySelector('.solaris-spinner__label');
    expect(label?.textContent?.trim()).toBe('Loading...');
  });

  it('should render explicit label', () => {
    const el = createFixture();
    fixture.componentRef.setInput('label', 'Saving');
    fixture.detectChanges();
    const label = el.querySelector('.solaris-spinner__label');
    expect(label?.textContent?.trim()).toBe('Saving');
  });

  it('should render label from key', () => {
    const el = createFixture();
    fixture.componentRef.setInput('labelKey', 'solaris.button.loading');
    fixture.detectChanges();
    const label = el.querySelector('.solaris-spinner__label');
    expect(label?.textContent?.trim()).toBe('Loading...');
  });

  it('should omit label when no label is available', () => {
    const el = createFixture();
    fixture.componentRef.setInput('label', '');
    fixture.detectChanges();
    const label = el.querySelector('.solaris-spinner__label');
    expect(label).toBeFalsy();
  });

  it('should expose accessible name via aria-label', () => {
    const el = createFixture();
    fixture.componentRef.setInput('ariaLabel', 'Please wait');
    fixture.detectChanges();
    expect(el.getAttribute('aria-label')).toBe('Please wait');
  });

  it('should fall back to resolved label as accessible name', () => {
    const el = createFixture();
    fixture.componentRef.setInput('label', 'Saving');
    fixture.detectChanges();
    expect(el.getAttribute('aria-label')).toBe('Saving');
  });

  it('should support custom color token variable', () => {
    const el = createFixture();
    fixture.componentRef.setInput('color', 'custom');
    fixture.detectChanges();
    expect(el.getAttribute('data-color')).toBe('custom');
  });
});

describe('SolarisSpinnerComponent reduced motion', () => {
  let fixture: ComponentFixture<SolarisSpinnerComponent>;

  const createWithReducedMotion = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisSpinnerComponent);
    document.documentElement.setAttribute('data-reduced-motion', 'true');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  afterEach(() => {
    document.documentElement.removeAttribute('data-reduced-motion');
  });

  it('should render static indicator under reduced motion', () => {
    const el = createWithReducedMotion();
    const indicator = el.querySelector('.solaris-spinner__indicator');
    expect(indicator).toBeTruthy();
  });
});

describe('SolarisSpinnerComponent in host', () => {
  @Component({
    standalone: true,
    imports: [SolarisSpinnerComponent],
    template: '<solaris-spinner label="Loading data" color="success" />',
  })
  class TestHostComponent {}

  it('should compose inside a host', () => {
    configureSolarisTesting(undefined, { imports: [TestHostComponent] });
    const host = TestBed.createComponent(TestHostComponent);
    host.detectChanges();
    const spinner = host.nativeElement.querySelector(
      'solaris-spinner',
    ) as HTMLElement;
    expect(spinner).toBeTruthy();
    expect(spinner.getAttribute('data-color')).toBe('success');
    expect(spinner.textContent).toContain('Loading data');
  });
});
