import { TestBed } from '@angular/core/testing';

import { SolarisThemeService } from './solaris-theme.service';
import { provideSolarisTheme } from '../provider/provide-solaris-theme';

describe('SolarisThemeService', () => {
  it('should provide default values when no config is provided', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisTheme()],
    });

    const service = TestBed.inject(SolarisThemeService);

    expect(service.colorScheme).toBe('system');
    expect(service.density).toBe('comfortable');
    expect(service.reducedMotion).toBe('auto');
  });

  it('should use provided config values', () => {
    TestBed.configureTestingModule({
      providers: [
        provideSolarisTheme({
          colorScheme: 'dark',
          density: 'compact',
          reducedMotion: 'reduce',
        }),
      ],
    });

    const service = TestBed.inject(SolarisThemeService);

    expect(service.colorScheme).toBe('dark');
    expect(service.density).toBe('compact');
    expect(service.reducedMotion).toBe('reduce');
  });

  it('should return system when only some config values are set', () => {
    TestBed.configureTestingModule({
      providers: [
        provideSolarisTheme({
          density: 'compact',
        }),
      ],
    });

    const service = TestBed.inject(SolarisThemeService);

    expect(service.colorScheme).toBe('system');
    expect(service.density).toBe('compact');
    expect(service.reducedMotion).toBe('auto');
  });

  it('should be injectable without any provider', () => {
    TestBed.configureTestingModule({});

    const service = TestBed.inject(SolarisThemeService);

    expect(service.colorScheme).toBe('system');
    expect(service.density).toBe('comfortable');
    expect(service.reducedMotion).toBe('auto');
  });
});
