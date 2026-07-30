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

  describe('with respectSystemPreference', () => {
    it('reducedMotion reflects system preference when matchMedia is available', () => {
      const originalMatchMedia = window.matchMedia;
      const addEventListener = vi.fn();
      const removeEventListener = vi.fn();

      const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        addEventListener,
        removeEventListener,
      }));
      window.matchMedia = mockMatchMedia as typeof window.matchMedia;

      try {
        TestBed.configureTestingModule({
          providers: [
            provideSolarisAccessibilityTesting({ respectSystemPreference: true }),
          ],
        });

        const service = TestBed.inject(SolarisAccessibilityService);
        expect(service.reducedMotion()).toBe(true);
        expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
      } finally {
        window.matchMedia = originalMatchMedia;
      }
    });

    it('reducedMotion is false when matchMedia reports no preference', () => {
      const originalMatchMedia = window.matchMedia;
      const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      window.matchMedia = mockMatchMedia as typeof window.matchMedia;

      try {
        TestBed.configureTestingModule({
          providers: [
            provideSolarisAccessibilityTesting({ respectSystemPreference: true }),
          ],
        });

        const service = TestBed.inject(SolarisAccessibilityService);
        expect(service.reducedMotion()).toBe(false);
      } finally {
        window.matchMedia = originalMatchMedia;
      }
    });

    it('cleans up matchMedia listener on destroy', () => {
      const originalMatchMedia = window.matchMedia;
      const removeEventListener = vi.fn();
      const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener,
      }));
      window.matchMedia = mockMatchMedia as typeof window.matchMedia;

      try {
        TestBed.configureTestingModule({
          providers: [
            provideSolarisAccessibilityTesting({ respectSystemPreference: true }),
          ],
        });

        const service = TestBed.inject(SolarisAccessibilityService);
        const mockMql = mockMatchMedia.mock.results[0].value;
        expect(mockMql.addEventListener).toHaveBeenCalled();

        TestBed.resetTestingModule();
        expect(removeEventListener).toHaveBeenCalled();
      } finally {
        window.matchMedia = originalMatchMedia;
      }
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

    it('public provider accepts custom config', () => {
      TestBed.configureTestingModule({
        providers: [
          provideSolarisAccessibility({ forceReducedMotion: true }),
        ],
      });

      const service = TestBed.inject(SolarisAccessibilityService);
      expect(service.reducedMotion()).toBe(true);
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
