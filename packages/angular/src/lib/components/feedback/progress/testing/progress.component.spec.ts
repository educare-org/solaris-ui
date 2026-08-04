import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisProgressComponent } from '../component/progress.component';
import { configureSolarisTesting } from '../../../../testing';

describe('SolarisProgressComponent', () => {
  let fixture: ComponentFixture<SolarisProgressComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisProgressComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
    expect(el.classList.contains('solaris-progress')).toBe(true);
  });

  it('should have role progressbar', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).toBe('progressbar');
  });

  it('should have default size md', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
  });

  it('should have default color primary', () => {
    const el = createFixture();
    expect(el.getAttribute('data-color')).toBe('primary');
  });

  it('should apply all size values', () => {
    const el = createFixture();
    const values = ['sm', 'md', 'lg'] as const;
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

  it('should expose aria-valuenow for determinate progress', () => {
    const el = createFixture();
    fixture.componentRef.setInput('value', 42);
    fixture.detectChanges();
    expect(el.getAttribute('aria-valuenow')).toBe('42');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
  });

  it('should clamp value to a 0-100 range', () => {
    const el = createFixture();
    fixture.componentRef.setInput('value', 150);
    fixture.detectChanges();
    expect(el.getAttribute('aria-valuenow')).toBe('100');
    fixture.componentRef.setInput('value', -10);
    fixture.detectChanges();
    expect(el.getAttribute('aria-valuenow')).toBe('0');
  });

  it('should expose no valuenow for indeterminate progress', () => {
    const el = createFixture();
    fixture.componentRef.setInput('indeterminate', true);
    fixture.componentRef.setInput('value', 50);
    fixture.detectChanges();
    expect(el.hasAttribute('data-indeterminate')).toBe(true);
    expect(el.hasAttribute('aria-valuenow')).toBe(false);
    expect(el.hasAttribute('aria-valuemin')).toBe(false);
    expect(el.hasAttribute('aria-valuemax')).toBe(false);
  });

  it('should render a fill with the value width', () => {
    const el = createFixture();
    fixture.componentRef.setInput('value', 75);
    fixture.detectChanges();
    const fill = el.querySelector('.solaris-progress__fill') as HTMLElement;
    expect(fill.style.getPropertyValue('--solaris-progress-fill-width')).toBe(
      '75%',
    );
  });

  it('should render an indeterminate fill', () => {
    const el = createFixture();
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();
    const fill = el.querySelector('.solaris-progress__fill') as HTMLElement;
    expect(
      fill.classList.contains('solaris-progress__fill--indeterminate'),
    ).toBe(true);
  });

  it('should not expose aria-label when none is provided', () => {
    const el = createFixture();
    expect(el.hasAttribute('aria-label')).toBe(false);
  });

  it('should expose accessible name via aria-label', () => {
    const el = createFixture();
    fixture.componentRef.setInput('ariaLabel', 'Upload progress');
    fixture.detectChanges();
    expect(el.getAttribute('aria-label')).toBe('Upload progress');
  });

  it('should expose accessible name from visible label', () => {
    const el = createFixture();
    fixture.componentRef.setInput('label', 'Uploading');
    fixture.detectChanges();
    expect(el.getAttribute('aria-label')).toBe('Uploading');
  });

  it('should render a visible label', () => {
    const el = createFixture();
    fixture.componentRef.setInput('label', 'Uploading');
    fixture.detectChanges();
    const label = el.querySelector('.solaris-progress__label');
    expect(label?.textContent?.trim()).toBe('Uploading');
  });

  it('should omit label when no label is available', () => {
    const el = createFixture();
    const label = el.querySelector('.solaris-progress__label');
    expect(label).toBeFalsy();
  });

  it('should render percent text when enabled', () => {
    const el = createFixture();
    fixture.componentRef.setInput('value', 33);
    fixture.componentRef.setInput('showPercent', true);
    fixture.detectChanges();
    const percent = el.querySelector('.solaris-progress__percent');
    expect(percent?.textContent?.trim()).toBe('33%');
  });

  it('should omit percent when disabled', () => {
    const el = createFixture();
    fixture.componentRef.setInput('value', 33);
    fixture.detectChanges();
    const percent = el.querySelector('.solaris-progress__percent');
    expect(percent).toBeFalsy();
  });

  it('should omit percent in indeterminate mode', () => {
    const el = createFixture();
    fixture.componentRef.setInput('indeterminate', true);
    fixture.componentRef.setInput('showPercent', true);
    fixture.detectChanges();
    const percent = el.querySelector('.solaris-progress__percent');
    expect(percent).toBeFalsy();
  });

  it('should expose value text for determinate progress', () => {
    const el = createFixture();
    fixture.componentRef.setInput('value', 42);
    fixture.detectChanges();
    expect(el.getAttribute('aria-valuetext')).toBe('42 percent');
  });

  it('should support custom color token variable', () => {
    const el = createFixture();
    fixture.componentRef.setInput('color', 'custom');
    fixture.detectChanges();
    expect(el.getAttribute('data-color')).toBe('custom');
  });
});

describe('SolarisProgressComponent in host', () => {
  @Component({
    standalone: true,
    imports: [SolarisProgressComponent],
    template:
      '<solaris-progress label="Uploading" color="success" [value]="50" />',
  })
  class TestHostComponent {}

  it('should compose inside a host', () => {
    configureSolarisTesting(undefined, { imports: [TestHostComponent] });
    const host = TestBed.createComponent(TestHostComponent);
    host.detectChanges();
    const progress = host.nativeElement.querySelector(
      'solaris-progress',
    ) as HTMLElement;
    expect(progress).toBeTruthy();
    expect(progress.getAttribute('data-color')).toBe('success');
    expect(progress.getAttribute('aria-valuenow')).toBe('50');
    expect(progress.textContent).toContain('Uploading');
  });
});
