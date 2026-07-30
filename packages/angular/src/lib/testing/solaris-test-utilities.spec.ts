import { TestBed } from '@angular/core/testing';
import { SOLARIS_ACCESSIBILITY_CONFIG } from '../services/accessibility/token/solaris-accessibility.tokens';
import { SOLARIS_THEME_CONFIG } from '../services/theme/token/solaris-theme.tokens';
import { SOLARIS_TRANSLATE_CONFIG } from '../services/translation/token/solaris-translate.tokens';
import { configureSolarisTesting } from './solaris-test-utilities';
import { provideSolarisTesting } from './provide-solaris-testing';
import type { SolarisTestingOptions } from './provide-solaris-testing';
import type { SolarisAccessibilityConfig } from '../services/accessibility/model/solaris-accessibility-config.interface';
import type { SolarisThemeConfig } from '../services/theme/model/solaris-theme-config.interface';

describe('configureSolarisTesting', () => {
  it('should configure TestBed with default providers', () => {
    configureSolarisTesting();

    const accessibilityConfig = TestBed.inject(SOLARIS_ACCESSIBILITY_CONFIG);
    expect(accessibilityConfig).toEqual({});
  });

  it('should configure TestBed with accessibility options', () => {
    const accessConfig: SolarisAccessibilityConfig = {
      respectSystemPreference: true,
      forceReducedMotion: true,
    };

    configureSolarisTesting({ accessibility: accessConfig });

    const config = TestBed.inject(SOLARIS_ACCESSIBILITY_CONFIG);
    expect(config).toEqual(accessConfig);
  });

  it('should configure TestBed with theme options', () => {
    const themeConfig: Partial<SolarisThemeConfig> = {
      colorScheme: 'dark',
    };

    configureSolarisTesting({ theme: themeConfig });

    const config = TestBed.inject(SOLARIS_THEME_CONFIG);
    expect(config).toEqual(themeConfig);
  });

  it('should configure TestBed with translate options', () => {
    configureSolarisTesting({
      translate: { locale: 'pt-BR' },
    });

    const config = TestBed.inject(SOLARIS_TRANSLATE_CONFIG);
    expect(config.locale).toBe('pt-BR');
  });

  it('should merge translate defaults with provided options', () => {
    configureSolarisTesting({
      translate: { locale: 'es-ES' },
    });

    const config = TestBed.inject(SOLARIS_TRANSLATE_CONFIG);
    expect(config.locale).toBe('es-ES');
    expect(config.fallbackLocale).toBe('pt-BR');
  });

  it('should accept extra TestBed configuration', () => {
    const extraProviders = [{ provide: 'TEST_TOKEN', useValue: 'test-value' }];

    configureSolarisTesting(undefined, { providers: extraProviders });

    const value = TestBed.inject('TEST_TOKEN' as never);
    expect(value).toBe('test-value');
  });

  it('should merge extra providers with testing providers', () => {
    const extraProviders = [{ provide: 'EXTRA', useValue: 'extra-value' }];

    configureSolarisTesting(
      { accessibility: { forceReducedMotion: true } },
      { providers: extraProviders },
    );

    const extraValue = TestBed.inject('EXTRA' as never);
    expect(extraValue).toBe('extra-value');

    const accessConfig = TestBed.inject(SOLARIS_ACCESSIBILITY_CONFIG);
    expect(accessConfig.forceReducedMotion).toBe(true);
  });

  it('should accept extraConfig with imports', () => {
    configureSolarisTesting(undefined, { imports: [] } as any);

    const accessConfig = TestBed.inject(SOLARIS_ACCESSIBILITY_CONFIG);
    expect(accessConfig).toBeDefined();
  });

  it('should work when called multiple times', () => {
    configureSolarisTesting({ accessibility: { forceReducedMotion: true } });
    configureSolarisTesting({
      accessibility: { respectSystemPreference: true },
    });

    const config = TestBed.inject(SOLARIS_ACCESSIBILITY_CONFIG);
    expect(config.respectSystemPreference).toBe(true);
  });
});

describe('provideSolarisTesting', () => {
  it('should return provider array without options', () => {
    const providers = provideSolarisTesting();
    expect(Array.isArray(providers)).toBe(true);
    expect(providers.length).toBeGreaterThan(0);
  });

  it('should return provider array with accessibility options', () => {
    const providers = provideSolarisTesting({
      accessibility: { forceReducedMotion: true },
    });
    expect(providers.length).toBeGreaterThan(0);
  });

  it('should return provider array with theme options', () => {
    const providers = provideSolarisTesting({
      theme: { colorScheme: 'dark' },
    });
    expect(providers.length).toBeGreaterThan(0);
  });

  it('should return provider array with translate options', () => {
    const providers = provideSolarisTesting({
      translate: { locale: 'en-US' },
    });
    expect(providers.length).toBeGreaterThan(0);
  });

  it('should return provider array with all options', () => {
    const providers = provideSolarisTesting({
      accessibility: { forceReducedMotion: true },
      theme: { colorScheme: 'dark' },
      translate: { locale: 'en-US' },
    });
    expect(providers.length).toBeGreaterThan(0);
  });

  it('should provide valid provider objects', () => {
    const providers = provideSolarisTesting();
    providers.forEach((provider) => {
      expect(provider).toBeDefined();
    });
  });
});

describe('SolarisTestingOptions', () => {
  it('should accept partial options', () => {
    const options: SolarisTestingOptions = {};
    expect(options).toBeDefined();
  });

  it('should accept accessibility only', () => {
    const options: SolarisTestingOptions = {
      accessibility: { forceReducedMotion: true },
    };
    expect(options.accessibility?.forceReducedMotion).toBe(true);
  });

  it('should accept theme only', () => {
    const options: SolarisTestingOptions = {
      theme: { colorScheme: 'dark' },
    };
    expect(options.theme?.colorScheme).toBe('dark');
  });

  it('should accept translate only', () => {
    const options: SolarisTestingOptions = {
      translate: { locale: 'pt-BR' },
    };
    expect(options.translate?.locale).toBe('pt-BR');
  });
});
