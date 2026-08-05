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
    const track = el.querySelector('.solaris-spinner__track');
    expect(ring).toBeTruthy();
    expect(indicator).toBeTruthy();
    expect(track).toBeTruthy();
    expect(ring?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should have default variant ring', () => {
    const el = createFixture();
    expect(el.getAttribute('data-variant')).toBe('ring');
  });

  it('should apply all variant values', () => {
    const el = createFixture();
    const values = ['ring', 'stacked', 'progress'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('variant', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-variant')).toBe(v);
    }
  });

  it('should use role status for non-progress variants', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).toBe('status');
    fixture.componentRef.setInput('variant', 'stacked');
    fixture.detectChanges();
    expect(el.getAttribute('role')).toBe('status');
  });

  it('should use role progressbar for progress variant', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'progress');
    fixture.detectChanges();
    expect(el.getAttribute('role')).toBe('progressbar');
    expect(el.hasAttribute('aria-live')).toBe(false);
  });

  it('should expose aria-valuenow for progress variant', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'progress');
    fixture.componentRef.setInput('value', 42);
    fixture.detectChanges();
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
    expect(el.getAttribute('aria-valuenow')).toBe('42');
  });

  it('should clamp progress value to a 0-100 range', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'progress');
    fixture.componentRef.setInput('value', 150);
    fixture.detectChanges();
    expect(el.getAttribute('aria-valuenow')).toBe('100');
    fixture.componentRef.setInput('value', -10);
    fixture.detectChanges();
    expect(el.getAttribute('aria-valuenow')).toBe('0');
  });

  it('should expose no progress aria for non-progress variants', () => {
    const el = createFixture();
    fixture.componentRef.setInput('value', 50);
    fixture.detectChanges();
    expect(el.hasAttribute('aria-valuenow')).toBe(false);
    expect(el.hasAttribute('aria-valuemax')).toBe(false);
    expect(el.hasAttribute('aria-valuemin')).toBe(false);
  });

  it('should render percent text when enabled', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'progress');
    fixture.componentRef.setInput('value', 33);
    fixture.componentRef.setInput('showPercent', true);
    fixture.detectChanges();
    const percent = el.querySelector('.solaris-spinner__percent');
    expect(percent?.textContent?.trim()).toBe('33%');
  });

  it('should omit percent when disabled', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'progress');
    fixture.componentRef.setInput('value', 33);
    fixture.detectChanges();
    const percent = el.querySelector('.solaris-spinner__percent');
    expect(percent).toBeFalsy();
  });

  it('should omit percent for non-progress variants', () => {
    const el = createFixture();
    fixture.componentRef.setInput('showPercent', true);
    fixture.detectChanges();
    const percent = el.querySelector('.solaris-spinner__percent');
    expect(percent).toBeFalsy();
  });

  it('should render description lines for progress variant', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'progress');
    fixture.componentRef.setInput('description', [
      'File size: 12MB',
      'Time left: 30s',
    ]);
    fixture.detectChanges();
    const lines = el.querySelectorAll('.solaris-spinner__description');
    expect(lines.length).toBe(2);
    expect(lines[0]?.textContent?.trim()).toBe('File size: 12MB');
    expect(lines[1]?.textContent?.trim()).toBe('Time left: 30s');
  });

  it('should resolve description lines via i18n keys', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'progress');
    fixture.componentRef.setInput('descriptionKey', [
      'solaris.spinner.loading',
      'solaris.spinner.loading',
    ]);
    fixture.detectChanges();
    const lines = el.querySelectorAll('.solaris-spinner__description');
    expect(lines.length).toBe(2);
    expect(lines[0]?.textContent?.trim()).toBe('Loading...');
  });

  it('should render percent, label, and descriptions in one content wrapper', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'progress');
    fixture.componentRef.setInput('value', 45);
    fixture.componentRef.setInput('showPercent', true);
    fixture.componentRef.setInput('label', 'Downloading');
    fixture.componentRef.setInput('description', [
      'File size: 12 MB',
      'Time left: 30 s',
    ]);
    fixture.detectChanges();
    const content = el.querySelector('.solaris-spinner__content');
    expect(content).toBeTruthy();
    const header = el.querySelector('.solaris-spinner__header');
    expect(header?.querySelector('.solaris-spinner__percent')).toBeTruthy();
    expect(header?.querySelector('.solaris-spinner__label')).toBeTruthy();
    expect(
      header?.querySelector('.solaris-spinner__percent')?.textContent?.trim(),
    ).toBe('45%');
    expect(
      header?.querySelector('.solaris-spinner__label')?.textContent?.trim(),
    ).toBe('Downloading');
    const descriptions = content?.querySelectorAll(
      '.solaris-spinner__description',
    );
    expect(descriptions?.length).toBe(2);
  });

  it('should render progress label and percent without descriptions', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'progress');
    fixture.componentRef.setInput('value', 50);
    fixture.componentRef.setInput('showPercent', true);
    fixture.componentRef.setInput('label', 'Uploading');
    fixture.detectChanges();
    const header = el.querySelector('.solaris-spinner__header');
    expect(header).toBeTruthy();
    expect(
      header?.querySelector('.solaris-spinner__percent')?.textContent?.trim(),
    ).toBe('50%');
    expect(
      header?.querySelector('.solaris-spinner__label')?.textContent?.trim(),
    ).toBe('Uploading');
    expect(el.querySelectorAll('.solaris-spinner__description').length).toBe(0);
  });

  it('should render progress percent without label', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'progress');
    fixture.componentRef.setInput('value', 50);
    fixture.componentRef.setInput('showPercent', true);
    fixture.componentRef.setInput('label', '');
    fixture.detectChanges();
    const header = el.querySelector('.solaris-spinner__header');
    expect(header?.querySelector('.solaris-spinner__percent')).toBeTruthy();
    expect(header?.querySelector('.solaris-spinner__label')).toBeFalsy();
  });

  it('should render non-progress label as a sibling of the ring', () => {
    const el = createFixture();
    fixture.componentRef.setInput('label', 'Loading data');
    fixture.detectChanges();
    const label = el.querySelector('.solaris-spinner__label');
    expect(label?.textContent?.trim()).toBe('Loading data');
    expect(el.querySelector('.solaris-spinner__content')).toBeFalsy();
  });

  it('should combine label, percent, and description in valuetext', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'progress');
    fixture.componentRef.setInput('label', 'Uploading');
    fixture.componentRef.setInput('value', 50);
    fixture.componentRef.setInput('description', ['File size: 12MB']);
    fixture.detectChanges();
    expect(el.getAttribute('aria-valuetext')).toBe(
      'Uploading, 50 percent, File size: 12MB',
    );
  });

  it('should render a stacked spinner with 8 independent bars', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'stacked');
    fixture.detectChanges();
    const bars = el.querySelectorAll('.solaris-spinner__bar');
    expect(bars.length).toBe(8);
    expect(el.querySelector('.solaris-spinner__track')).toBeFalsy();
    expect(el.querySelector('.solaris-spinner__indicator')).toBeFalsy();
    const ring = el.querySelector('.solaris-spinner__ring');
    expect(ring?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should place stacked bars uniformly around the center', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'stacked');
    fixture.detectChanges();
    const bars = Array.from(el.querySelectorAll('.solaris-spinner__bar'));
    expect(bars.length).toBe(8);
    const centers = bars.map((bar) => {
      const x1 = Number(bar.getAttribute('x1'));
      const y1 = Number(bar.getAttribute('y1'));
      const x2 = Number(bar.getAttribute('x2'));
      const y2 = Number(bar.getAttribute('y2'));
      return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
    });
    const distances = centers.map((c) => Math.hypot(c.x - 60, c.y - 60));
    for (const distance of distances) {
      expect(Math.abs(distance - distances[0])).toBeLessThan(0.01);
    }
    const angles = centers.map(
      (c) => ((Math.atan2(c.y - 60, c.x - 60) * 180) / Math.PI + 360) % 360,
    );
    angles.sort((a, b) => a - b);
    for (let i = 1; i < angles.length; i++) {
      expect(Math.abs(angles[i] - angles[i - 1])).toBeCloseTo(45, 1);
    }
  });

  it('should keep all stacked bars inside the SVG geometry', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'stacked');
    fixture.detectChanges();
    const bars = Array.from(el.querySelectorAll('.solaris-spinner__bar'));
    expect(bars.length).toBe(8);
    for (const bar of bars) {
      const coords = ['x1', 'y1', 'x2', 'y2'].map((attr) =>
        Number(bar.getAttribute(attr)),
      );
      for (const value of coords) {
        expect(value).toBeGreaterThan(0);
        expect(value).toBeLessThan(120);
      }
    }
  });

  it('should render ring with one track and one active arc', () => {
    const el = createFixture();
    const tracks = el.querySelectorAll('.solaris-spinner__track');
    const arcs = el.querySelectorAll('.solaris-spinner__arc');
    const indicators = el.querySelectorAll('.solaris-spinner__indicator');
    expect(tracks.length).toBe(1);
    expect(arcs.length).toBe(1);
    expect(indicators.length).toBe(1);
    const arc = arcs[0];
    expect(arc?.getAttribute('d')).toBeTruthy();
  });

  it('should render ring track and indeterminate indicator', () => {
    const el = createFixture();
    expect(el.querySelector('.solaris-spinner__track')).toBeTruthy();
    const indicator = el.querySelector(
      '.solaris-spinner__indicator',
    ) as HTMLElement;
    expect(indicator).toBeTruthy();
    expect(
      indicator.classList.contains('solaris-spinner__indicator--progress'),
    ).toBe(false);
  });

  it('should render progress track and determinate indicator', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'progress');
    fixture.componentRef.setInput('value', 75);
    fixture.detectChanges();
    expect(el.querySelector('.solaris-spinner__track')).toBeTruthy();
    const indicator = el.querySelector('.solaris-spinner__indicator--progress');
    expect(indicator).toBeTruthy();
    expect(indicator?.getAttribute('stroke-dasharray')).toBeTruthy();
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

  it('should stop the stacked animation under reduced motion', () => {
    const el = createWithReducedMotion();
    fixture.componentRef.setInput('variant', 'stacked');
    fixture.detectChanges();
    const bars = Array.from(el.querySelectorAll('.solaris-spinner__bar'));
    expect(bars.length).toBe(8);
    const animation = getComputedStyle(bars[0]).animationName;
    expect(['none', '']).toContain(animation);
    for (const bar of bars) {
      const opacity = parseFloat(getComputedStyle(bar).opacity);
      expect(opacity).toBeGreaterThan(0);
    }
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
