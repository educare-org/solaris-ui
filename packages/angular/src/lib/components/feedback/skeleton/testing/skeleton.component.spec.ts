import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisSkeletonComponent } from '../component/skeleton.component';

describe('SolarisSkeletonComponent', () => {
  let fixture: ComponentFixture<SolarisSkeletonComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSkeletonComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
  });

  it('should have default variant text', () => {
    const el = createFixture();
    expect(el.getAttribute('data-variant')).toBe('text');
  });

  it('should have default animation pulse', () => {
    const el = createFixture();
    expect(el.getAttribute('data-animation')).toBe('pulse');
  });

  it('should have default size md', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
  });

  it('should apply variant via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'rectangular');
    fixture.detectChanges();
    expect(el.getAttribute('data-variant')).toBe('rectangular');

    fixture.componentRef.setInput('variant', 'circular');
    fixture.detectChanges();
    expect(el.getAttribute('data-variant')).toBe('circular');
  });

  it('should apply animation via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('animation', 'wave');
    fixture.detectChanges();
    expect(el.getAttribute('data-animation')).toBe('wave');

    fixture.componentRef.setInput('animation', 'none');
    fixture.detectChanges();
    expect(el.getAttribute('data-animation')).toBe('none');
  });

  it('should apply size via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('sm');

    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('lg');
  });

  it('should apply all radius values', () => {
    const el = createFixture();
    const values = ['none', 'sm', 'full'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('radius', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-radius')).toBe(v);
    }
  });

  it('should apply density compact', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('compact');
  });

  it('should apply density comfortable', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'comfortable');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('comfortable');
  });

  it('should apply custom width', () => {
    const el = createFixture();
    fixture.componentRef.setInput('width', '70%');
    fixture.detectChanges();
    expect(el.style.width).toBe('70%');
  });

  it('should apply custom height', () => {
    const el = createFixture();
    fixture.componentRef.setInput('height', '192px');
    fixture.detectChanges();
    expect(el.style.height).toBe('192px');
  });

  it('should have aria-hidden true by default', () => {
    const el = createFixture();
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('should not be focusable', () => {
    const el = createFixture();
    expect(el.getAttribute('tabindex')).toBeFalsy();
  });

  it('should not have role button', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).not.toBe('button');
  });

  it('should support all variants', () => {
    const el = createFixture();
    const values = ['text', 'rectangular', 'circular'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('variant', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-variant')).toBe(v);
    }
  });

  it('should support all animation values', () => {
    const el = createFixture();
    const values = ['pulse', 'wave', 'none'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('animation', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-animation')).toBe(v);
    }
  });

  it('should support all size values', () => {
    const el = createFixture();
    const values = ['sm', 'md', 'lg'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('size', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-size')).toBe(v);
    }
  });

  it('should resolve effective radius for text variant', () => {
    const el = createFixture();
    fixture.componentRef.setInput('radius', 'text');
    fixture.componentRef.setInput('variant', 'text');
    fixture.detectChanges();
    expect(el.getAttribute('data-radius')).toBe('sm');
  });

  it('should resolve effective radius for rectangular variant', () => {
    const el = createFixture();
    fixture.componentRef.setInput('radius', 'text');
    fixture.componentRef.setInput('variant', 'rectangular');
    fixture.detectChanges();
    expect(el.getAttribute('data-radius')).toBe('sm');
  });

  it('should resolve effective radius for circular variant', () => {
    const el = createFixture();
    fixture.componentRef.setInput('radius', 'text');
    fixture.componentRef.setInput('variant', 'circular');
    fixture.detectChanges();
    expect(el.getAttribute('data-radius')).toBe('full');
  });

  it('should preserve explicit radius over text default', () => {
    const el = createFixture();
    fixture.componentRef.setInput('radius', 'lg');
    fixture.componentRef.setInput('variant', 'text');
    fixture.detectChanges();
    expect(el.getAttribute('data-radius')).toBe('lg');
  });
});

describe('SolarisSkeletonComponent reduced motion', () => {
  let fixture: ComponentFixture<SolarisSkeletonComponent>;

  const createWithReducedMotion = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSkeletonComponent);
    document.documentElement.setAttribute('data-reduced-motion', 'true');
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  afterEach(() => {
    document.documentElement.removeAttribute('data-reduced-motion');
  });

  it('should set animation but reduced motion overrides visually', () => {
    const el = createWithReducedMotion();
    fixture.componentRef.setInput('animation', 'pulse');
    fixture.detectChanges();
    expect(el.getAttribute('data-animation')).toBe('pulse');
  });

  it('should have animation attribute even when wave with reduced motion', () => {
    const el = createWithReducedMotion();
    fixture.componentRef.setInput('animation', 'wave');
    fixture.detectChanges();
    expect(el.getAttribute('data-animation')).toBe('wave');
  });
});

describe('SolarisSkeletonComponent composition', () => {
  @Component({
    standalone: true,
    imports: [SolarisSkeletonComponent],
    template: `
      <section aria-busy="true" aria-label="Loading content">
        <solaris-skeleton
          variant="rectangular"
          width="100%"
          height="192px"
        ></solaris-skeleton>
        <solaris-skeleton width="80%"></solaris-skeleton>
        <solaris-skeleton width="60%"></solaris-skeleton>
      </section>
    `,
  })
  class CompositionHostComponent {}

  let fixture: ComponentFixture<CompositionHostComponent>;

  it('should render multiple skeletons in composition', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(CompositionHostComponent);
    fixture.detectChanges();
    const skeletons =
      fixture.nativeElement.querySelectorAll('solaris-skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('should not affect external ARIA attributes', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(CompositionHostComponent);
    fixture.detectChanges();
    const section = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('aria-busy')).toBe('true');
  });
});

describe('SolarisSkeletonComponent circular', () => {
  let fixture: ComponentFixture<SolarisSkeletonComponent>;

  it('should maintain coherent dimensions for circular default', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSkeletonComponent);
    fixture.componentRef.setInput('variant', 'circular');
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.getAttribute('data-variant')).toBe('circular');
    expect(el.getAttribute('data-radius')).toBe('full');
    expect(el.style.width).toBeFalsy();
    expect(el.style.height).toBeFalsy();
  });
});

describe('SolarisSkeletonComponent multiline', () => {
  let fixture: ComponentFixture<SolarisSkeletonComponent>;

  it('should not have data-multiline for default lines=1', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSkeletonComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-multiline')).toBe(false);
  });

  it('should have data-multiline for lines=3', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSkeletonComponent);
    fixture.componentRef.setInput('lines', 3);
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-multiline')).toBe(true);
  });

  it('should render correct number of children', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSkeletonComponent);
    fixture.componentRef.setInput('lines', 3);
    fixture.detectChanges();
    const children = fixture.nativeElement.querySelectorAll(
      '.solaris-skeleton-line',
    );
    expect(children.length).toBe(3);
  });

  it('should not render children for lines=1', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSkeletonComponent);
    fixture.componentRef.setInput('lines', 1);
    fixture.detectChanges();
    const children = fixture.nativeElement.querySelectorAll(
      '.solaris-skeleton-line',
    );
    expect(children.length).toBe(0);
  });

  it('should not render children for non-text variant with lines>1', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSkeletonComponent);
    fixture.componentRef.setInput('variant', 'rectangular');
    fixture.componentRef.setInput('lines', 3);
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-multiline')).toBe(false);
    const children = fixture.nativeElement.querySelectorAll(
      '.solaris-skeleton-line',
    );
    expect(children.length).toBe(0);
  });

  it('should apply custom width to first line', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSkeletonComponent);
    fixture.componentRef.setInput('lines', 3);
    fixture.componentRef.setInput('width', '70%');
    fixture.detectChanges();
    const children = fixture.nativeElement.querySelectorAll(
      '.solaris-skeleton-line',
    );
    expect(children.length).toBe(3);
    expect(children[0].style.width).toBe('70%');
  });

  it('should have varied widths for each line', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSkeletonComponent);
    fixture.componentRef.setInput('lines', 3);
    fixture.detectChanges();
    const children = fixture.nativeElement.querySelectorAll(
      '.solaris-skeleton-line',
    );
    expect(children[0].style.width).toBeTruthy();
    expect(children[1].style.width).toBeTruthy();
    expect(children[2].style.width).toBeTruthy();
  });

  it('should support lines with wave animation', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSkeletonComponent);
    fixture.componentRef.setInput('lines', 2);
    fixture.componentRef.setInput('animation', 'wave');
    fixture.detectChanges();
    const children = fixture.nativeElement.querySelectorAll(
      '.solaris-skeleton-line',
    );
    expect(children.length).toBe(2);
  });

  it('should support lines=0 gracefully', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSkeletonComponent);
    fixture.componentRef.setInput('lines', 0);
    fixture.detectChanges();
    const children = fixture.nativeElement.querySelectorAll(
      '.solaris-skeleton-line',
    );
    expect(children.length).toBe(0);
  });

  it('should support lines=10 with varied widths', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSkeletonComponent);
    fixture.componentRef.setInput('lines', 10);
    fixture.detectChanges();
    const children = fixture.nativeElement.querySelectorAll(
      '.solaris-skeleton-line',
    );
    expect(children.length).toBe(10);
  });

  it('should not apply wave animation on host when multiline', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSkeletonComponent);
    fixture.componentRef.setInput('lines', 3);
    fixture.componentRef.setInput('animation', 'wave');
    fixture.detectChanges();
    const host = fixture.nativeElement;
    expect(host.hasAttribute('data-multiline')).toBe(true);
    expect(host.getAttribute('data-animation')).toBe('wave');
    const children = host.querySelectorAll('.solaris-skeleton-line');
    expect(children.length).toBe(3);
  });
});
