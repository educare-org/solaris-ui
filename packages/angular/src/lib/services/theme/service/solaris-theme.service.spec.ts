import { TestBed } from '@angular/core/testing';

import {
  SolarisThemeService,
  SOLARIS_DENSITY_DEFAULT_ATTRIBUTE,
} from './solaris-theme.service';
import { provideSolarisTheme } from '../provider/provide-solaris-theme';

describe('SolarisThemeService', () => {
  it('should provide default values when no config is provided', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisTheme()],
    });

    const service = TestBed.inject(SolarisThemeService);

    expect(service.colorScheme).toBe('system');
    expect(service.density).toBe('normal');
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
    expect(service.density).toBe('normal');
    expect(service.reducedMotion).toBe('auto');
  });

  it('should fall back to the --solaris-density-default CSS variable', () => {
    document.documentElement.style.setProperty(
      '--solaris-density-default',
      'compact',
    );
    TestBed.configureTestingModule({});

    const service = TestBed.inject(SolarisThemeService);

    expect(service.density).toBe('compact');
    document.documentElement.style.removeProperty('--solaris-density-default');
  });

  it('should read density from the data-density-default attribute', () => {
    document.documentElement.setAttribute(
      SOLARIS_DENSITY_DEFAULT_ATTRIBUTE,
      'comfortable',
    );
    TestBed.configureTestingModule({});

    const service = TestBed.inject(SolarisThemeService);

    expect(service.density).toBe('comfortable');
    document.documentElement.removeAttribute(SOLARIS_DENSITY_DEFAULT_ATTRIBUTE);
  });

  it('should prefer the data-density-default attribute over the CSS variable', () => {
    document.documentElement.setAttribute(
      SOLARIS_DENSITY_DEFAULT_ATTRIBUTE,
      'compact',
    );
    document.documentElement.style.setProperty(
      '--solaris-density-default',
      'comfortable',
    );
    TestBed.configureTestingModule({});

    const service = TestBed.inject(SolarisThemeService);

    expect(service.density).toBe('compact');
    document.documentElement.removeAttribute(SOLARIS_DENSITY_DEFAULT_ATTRIBUTE);
    document.documentElement.style.removeProperty('--solaris-density-default');
  });

  it('should ignore an invalid data-density-default attribute value', () => {
    document.documentElement.setAttribute(
      SOLARIS_DENSITY_DEFAULT_ATTRIBUTE,
      'cozy',
    );
    TestBed.configureTestingModule({});

    const service = TestBed.inject(SolarisThemeService);

    expect(service.density).toBe('normal');
    document.documentElement.removeAttribute(SOLARIS_DENSITY_DEFAULT_ATTRIBUTE);
  });
});
