import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisLoadingTextComponent } from '../component/loading-text.component';
import { configureSolarisTesting } from '../../../../testing';

describe('SolarisLoadingTextComponent', () => {
  let fixture: ComponentFixture<SolarisLoadingTextComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisLoadingTextComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
    expect(el.classList.contains('solaris-loading-text')).toBe(true);
  });

  it('should have role status', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).toBe('status');
  });

  it('should be live polite', () => {
    const el = createFixture();
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('should have default size md', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
  });

  it('should have default color primary', () => {
    const el = createFixture();
    expect(el.getAttribute('data-color')).toBe('primary');
  });

  it('should have default speed normal', () => {
    const el = createFixture();
    expect(el.getAttribute('data-speed')).toBe('normal');
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

  it('should apply all speed values', () => {
    const el = createFixture();
    const values = ['slow', 'normal', 'fast'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('speed', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-speed')).toBe(v);
    }
  });

  it('should render the visible text', () => {
    const el = createFixture();
    fixture.componentRef.setInput('text', 'Loading report...');
    fixture.detectChanges();
    const text = el.querySelector('.solaris-loading-text__text');
    expect(text?.textContent?.trim()).toBe('Loading report...');
  });

  it('should render default loading text', () => {
    const el = createFixture();
    const text = el.querySelector('.solaris-loading-text__text');
    expect(text?.textContent?.trim()).toBe('Loading...');
  });

  it('should resolve text via i18n key', () => {
    const el = createFixture();
    fixture.componentRef.setInput('textKey', 'solaris.loadingText.loading');
    fixture.detectChanges();
    const text = el.querySelector('.solaris-loading-text__text');
    expect(text?.textContent?.trim()).toBe('Loading...');
  });

  it('should expose accessible name from text', () => {
    const el = createFixture();
    fixture.componentRef.setInput('text', 'Preparing workspace');
    fixture.detectChanges();
    expect(el.getAttribute('aria-label')).toBe('Preparing workspace');
  });

  it('should expose accessible name via ariaLabel', () => {
    const el = createFixture();
    fixture.componentRef.setInput('ariaLabel', 'Loading data');
    fixture.detectChanges();
    expect(el.getAttribute('aria-label')).toBe('Loading data');
  });

  it('should expose default loading text as accessible name', () => {
    const el = createFixture();
    expect(el.getAttribute('aria-label')).toBe('Loading...');
  });

  it('should support custom color token variable', () => {
    const el = createFixture();
    fixture.componentRef.setInput('color', 'custom');
    fixture.detectChanges();
    expect(el.getAttribute('data-color')).toBe('custom');
  });
});

describe('SolarisLoadingTextComponent in host', () => {
  @Component({
    standalone: true,
    imports: [SolarisLoadingTextComponent],
    template:
      '<solaris-loading-text text="Syncing" color="success" size="lg" />',
  })
  class TestHostComponent {}

  it('should compose inside a host', () => {
    configureSolarisTesting(undefined, { imports: [TestHostComponent] });
    const host = TestBed.createComponent(TestHostComponent);
    host.detectChanges();
    const loadingText = host.nativeElement.querySelector(
      'solaris-loading-text',
    ) as HTMLElement;
    expect(loadingText).toBeTruthy();
    expect(loadingText.getAttribute('data-color')).toBe('success');
    expect(loadingText.getAttribute('data-size')).toBe('lg');
    expect(loadingText.textContent).toContain('Syncing');
  });
});
