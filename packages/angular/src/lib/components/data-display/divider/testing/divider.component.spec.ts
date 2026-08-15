import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisDividerComponent } from '../component/divider.component';

import type {
  SolarisDividerOrientation,
  SolarisDividerAppearance,
  SolarisDividerSpacing,
  SolarisDividerInset,
} from '../model/divider.types';

describe('SolarisDividerComponent', () => {
  describe('defaults', () => {
    @Component({
      standalone: true,
      imports: [SolarisDividerComponent],
      template: '<solaris-divider />',
    })
    class TestHost {}

    let fixture: ComponentFixture<TestHost>;
    let el: HTMLElement;

    const createFixture = () => {
      TestBed.configureTestingModule({});
      fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      return fixture.nativeElement.querySelector('solaris-divider');
    };

    it('should render', () => {
      el = createFixture();
      expect(el).toBeTruthy();
    });

    it('should have default orientation horizontal', () => {
      el = createFixture();
      expect(el.getAttribute('data-orientation')).toBe('horizontal');
    });

    it('should have default appearance subtle', () => {
      el = createFixture();
      expect(el.getAttribute('data-appearance')).toBe('subtle');
    });

    it('should have default spacing md', () => {
      el = createFixture();
      expect(el.getAttribute('data-spacing')).toBe('md');
    });

    it('should have default inset none', () => {
      el = createFixture();
      expect(el.getAttribute('data-inset')).toBe('none');
    });

    it('should have decorative true by default', () => {
      el = createFixture();
      expect(el.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('orientation', () => {
    @Component({
      standalone: true,
      imports: [SolarisDividerComponent],
      template: '<solaris-divider [orientation]="orientation" />',
    })
    class TestHost {
      orientation: SolarisDividerOrientation = 'horizontal';
    }

    it('should support horizontal', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('data-orientation')).toBe('horizontal');
    });

    it('should support vertical', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.orientation = 'vertical';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('data-orientation')).toBe('vertical');
    });
  });

  describe('appearance', () => {
    @Component({
      standalone: true,
      imports: [SolarisDividerComponent],
      template: '<solaris-divider [appearance]="appearance" />',
    })
    class TestHost {
      appearance: SolarisDividerAppearance = 'subtle';
    }

    it('should support subtle', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('data-appearance')).toBe('subtle');
    });

    it('should support strong', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'strong';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('data-appearance')).toBe('strong');
    });
  });

  describe('spacing', () => {
    @Component({
      standalone: true,
      imports: [SolarisDividerComponent],
      template: '<solaris-divider [spacing]="spacing" />',
    })
    class TestHost {
      spacing: SolarisDividerSpacing = 'md';
    }

    it('should support none', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.spacing = 'none';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('data-spacing')).toBe('none');
    });

    it('should support sm', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.spacing = 'sm';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('data-spacing')).toBe('sm');
    });

    it('should support md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('data-spacing')).toBe('md');
    });

    it('should support lg', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.spacing = 'lg';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('data-spacing')).toBe('lg');
    });
  });

  describe('inset', () => {
    @Component({
      standalone: true,
      imports: [SolarisDividerComponent],
      template: '<solaris-divider [inset]="inset" />',
    })
    class TestHost {
      inset: SolarisDividerInset = 'none';
    }

    it('should support none', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('data-inset')).toBe('none');
    });

    it('should support start', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.inset = 'start';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('data-inset')).toBe('start');
    });

    it('should support end', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.inset = 'end';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('data-inset')).toBe('end');
    });

    it('should support both', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.inset = 'both';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('data-inset')).toBe('both');
    });
  });

  describe('accessibility', () => {
    @Component({
      standalone: true,
      imports: [SolarisDividerComponent],
      template:
        '<solaris-divider [decorative]="decorative" [orientation]="orientation" />',
    })
    class TestHost {
      decorative = true;
      orientation: SolarisDividerOrientation = 'horizontal';
    }

    it('should set aria-hidden when decorative is true', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('aria-hidden')).toBe('true');
    });

    it('should not set role when decorative is true', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('role')).toBeNull();
    });

    it('should set role separator when decorative is false', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.decorative = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('role')).toBe('separator');
    });

    it('should not set aria-hidden when decorative is false', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.decorative = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('aria-hidden')).toBeNull();
    });

    it('should set aria-orientation for vertical when decorative is false', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.decorative = false;
      fixture.componentInstance.orientation = 'vertical';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('should not set aria-orientation for horizontal when decorative is false', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.decorative = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.getAttribute('aria-orientation')).toBeNull();
    });
  });

  describe('custom length', () => {
    @Component({
      standalone: true,
      imports: [SolarisDividerComponent],
      template:
        '<solaris-divider [width]="w" [height]="h" [orientation]="o" />',
    })
    class TestHost {
      w = '';
      h = '';
      o: SolarisDividerOrientation = 'horizontal';
    }

    it('should set custom width on horizontal', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.w = '50%';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.style.getPropertyValue('--solaris-divider-width')).toBe('50%');
    });

    it('should not set width var when empty', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.style.getPropertyValue('--solaris-divider-width')).toBe('');
    });

    it('should set custom height on vertical', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.h = '160px';
      fixture.componentInstance.o = 'vertical';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('solaris-divider');
      expect(el.style.getPropertyValue('--solaris-divider-height')).toBe(
        '160px',
      );
    });
  });
});
