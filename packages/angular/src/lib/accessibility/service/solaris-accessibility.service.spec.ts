import { TestBed } from '@angular/core/testing';
import { SolarisAccessibilityService } from './solaris-accessibility.service';
import { provideSolarisAccessibility } from '../provider/provide-solaris-accessibility';
import { provideSolarisAccessibilityTesting } from '../testing/solaris-accessibility-testing.provider';

describe('SolarisAccessibilityService', () => {
  describe('with default config', () => {
    let service: SolarisAccessibilityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideSolarisAccessibilityTesting()],
      });
      service = TestBed.inject(SolarisAccessibilityService);
    });

    it('creates service with testing config', () => {
      expect(service).toBeTruthy();
    });

    it('reducedMotion returns false by default', () => {
      expect(service.reducedMotion()).toBe(false);
      expect(service.reducedMotionValue).toBe(false);
    });

    it('generateId returns a non-empty string with prefix', () => {
      const id = service.generateId('test');
      expect(id).toMatch(/^test-\d+-\d+$/);
    });

    it('generateId returns unique values on successive calls', () => {
      const id1 = service.generateId('test');
      const id2 = service.generateId('test');
      expect(id1).not.toBe(id2);
    });

    it('generateDescriptionId returns an ID with solaris-desc prefix', () => {
      const result = service.generateDescriptionId();
      expect(result).toMatch(/^solaris-desc-\d+-\d+$/);
    });

    it('generateDescriptionId returns unique IDs on successive calls', () => {
      const id1 = service.generateDescriptionId();
      const id2 = service.generateDescriptionId();
      expect(id1).not.toBe(id2);
    });

    it('labelledBy returns null for empty array', () => {
      expect(service.labelledBy()).toBeNull();
    });

    it('labelledBy joins ids with space', () => {
      expect(service.labelledBy('x', 'y')).toBe('x y');
    });
  });

  describe('with forceReducedMotion', () => {
    it('reducedMotion returns true when forced', () => {
      TestBed.configureTestingModule({
        providers: [
          provideSolarisAccessibilityTesting({ forceReducedMotion: true }),
        ],
      });

      const service = TestBed.inject(SolarisAccessibilityService);
      expect(service.reducedMotion()).toBe(true);
    });
  });

  describe('provideSolarisAccessibility', () => {
    it('public provider works', () => {
      TestBed.configureTestingModule({
        providers: [provideSolarisAccessibility()],
      });

      const service = TestBed.inject(SolarisAccessibilityService);
      expect(service).toBeTruthy();
    });
  });

  describe('provideSolarisAccessibilityTesting', () => {
    it('testing provider works', () => {
      TestBed.configureTestingModule({
        providers: [provideSolarisAccessibilityTesting()],
      });

      const service = TestBed.inject(SolarisAccessibilityService);
      expect(service.reducedMotion()).toBe(false);
    });
  });
});
