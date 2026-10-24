import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { SolarisTranslateService } from './solaris-translate.service';
import { provideSolarisTranslate } from '../provider/provide-solaris-translate';
import { provideSolarisTranslateTesting } from '../testing/solaris-translate-testing.provider';
import { SOLARIS_TRANSLATE_DEFAULT_CONFIG } from '../model/solaris-translate-defaults';
import type { SolarisTranslateConfig } from '../model/solaris-translate-config.interface';

describe('SolarisTranslateService', () => {
  describe('with default config', () => {
    let service: SolarisTranslateService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideSolarisTranslateTesting()],
      });
      service = TestBed.inject(SolarisTranslateService);
    });

    it('creates service with testing config', () => {
      expect(service).toBeTruthy();
    });

    it('translates existing key in current locale', () => {
      const result = service.translate('greeting', { name: 'Kaique' });
      expect(result).toBe('Hello, Kaique');
    });

    it('uses fallbackLocale when key does not exist in current locale', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideSolarisTranslateTesting({
            locale: 'es-419',
            translations: {
              'es-419': {},
              'pt-BR': { greeting: 'Olá, {{name}}' },
            },
          }),
        ],
      });
      service = TestBed.inject(SolarisTranslateService);

      const result = service.translate('greeting', { name: 'Kaique' });
      expect(result).toBe('Olá, Kaique');
    });

    it('returns the key when not found in any locale', () => {
      const result = service.translate('nonexistent_key');
      expect(result).toBe('nonexistent_key');
    });

    it('delegates unknown keys to the custom resolver', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideSolarisTranslate({
            locale: 'en-US',
            fallbackLocale: 'en-US',
            useBrowserLocale: false,
            translations: {},
            resolver: (key) =>
              key === 'app.login.email.label' ? 'Email' : undefined,
          }),
        ],
      });
      service = TestBed.inject(SolarisTranslateService);

      expect(service.translate('app.login.email.label')).toBe('Email');
      expect(service.translate('still.missing')).toBe('still.missing');
    });

    it('supports simple interpolation', () => {
      const result = service.translate('greeting', { name: 'World' });
      expect(result).toBe('Hello, World');
    });

    it('accepts custom locale as string', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideSolarisTranslate({
            locale: 'custom-locale',
            fallbackLocale: 'en-US',
            useBrowserLocale: false,
            translations: {
              'custom-locale': { hello: 'Custom Hello' },
            },
          }),
        ],
      });
      service = TestBed.inject(SolarisTranslateService);

      const result = service.translate('hello');
      expect(result).toBe('Custom Hello');
    });

    it('does not break without translations', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideSolarisTranslate({
            locale: 'en-US',
            fallbackLocale: 'en-US',
            translations: {},
          }),
        ],
      });
      service = TestBed.inject(SolarisTranslateService);

      const result = service.translate('greeting');
      expect(result).toBe('greeting');
    });

    it('returns configured locale when useBrowserLocale is false', () => {
      expect(service.locale()).toBe('en-US');
    });
  });

  describe('without any provider', () => {
    let service: SolarisTranslateService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(SolarisTranslateService);
    });

    it('uses defaults and returns key when no translations', () => {
      const result = service.translate('anything');
      expect(result).toBe('anything');
    });

    it('uses default locale from SOLARIS_TRANSLATE_DEFAULT_CONFIG', () => {
      expect(service.locale()).toBe('en-US');
      expect(service.fallbackLocale).toBe('en-US');
    });
  });

  describe('provideSolarisTranslate', () => {
    it('public provider works', () => {
      TestBed.configureTestingModule({
        providers: [
          provideSolarisTranslate({
            locale: 'pt-BR',
            fallbackLocale: 'en-US',
            useBrowserLocale: false,
            translations: {
              'pt-BR': { label: 'Rótulo' },
              'en-US': { label: 'Label' },
            },
          }),
        ],
      });

      const service = TestBed.inject(SolarisTranslateService);
      expect(service.translate('label')).toBe('Rótulo');
    });
  });

  describe('provideSolarisTranslateTesting', () => {
    it('testing provider works', () => {
      TestBed.configureTestingModule({
        providers: [provideSolarisTranslateTesting()],
      });

      const service = TestBed.inject(SolarisTranslateService);
      expect(service.translate('greeting', { name: 'Test' })).toBe(
        'Hello, Test',
      );
    });
  });

  describe('normalizeLocale', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideSolarisTranslateTesting()],
      });
    });

    it.each([
      ['pt', 'pt-BR'],
      ['PT', 'pt-BR'],
      ['pt-PT', 'pt-BR'],
      ['pt-BR', 'pt-BR'],
      ['PT-br', 'pt-BR'],
      ['pt_br', 'pt-BR'],
      ['en', 'en-US'],
      ['EN', 'en-US'],
      ['en-GB', 'en-US'],
      ['en-US', 'en-US'],
      ['en_us', 'en-US'],
      ['es', 'es-419'],
      ['ES', 'es-419'],
      ['es-ES', 'es-419'],
      ['es-MX', 'es-419'],
      ['es-419', 'es-419'],
      ['ES-419', 'es-419'],
      ['es_419', 'es-419'],
    ])('normalizes %s to %s', (raw, expected) => {
      const service = TestBed.inject(SolarisTranslateService);
      expect(service.normalizeLocale(raw)).toBe(expected);
    });

    it('passes custom locales through lowercased with dashes', () => {
      const service = TestBed.inject(SolarisTranslateService);
      expect(service.normalizeLocale('custom-locale')).toBe('custom-locale');
      expect(service.normalizeLocale('FR')).toBe('fr');
    });
  });

  describe('locale signal', () => {
    it('exposes locale as a signal updated by setLocale', () => {
      TestBed.configureTestingModule({
        providers: [provideSolarisTranslateTesting()],
      });
      const service = TestBed.inject(SolarisTranslateService);

      expect(typeof service.locale).toBe('function');
      expect(service.locale()).toBe('en-US');

      service.setLocale('pt-BR');

      expect(service.locale()).toBe('pt-BR');
      expect(service.translate('greeting', { name: 'Kaique' })).toBe(
        'Olá, Kaique',
      );
    });

    it('normalizes the locale set via setLocale', () => {
      TestBed.configureTestingModule({
        providers: [provideSolarisTranslateTesting()],
      });
      const service = TestBed.inject(SolarisTranslateService);

      service.setLocale('es-MX');

      expect(service.locale()).toBe('es-419');
    });

    it('resetLocale restores the automatic resolution', () => {
      TestBed.configureTestingModule({
        providers: [
          provideSolarisTranslateTesting({
            locale: 'en-US',
            persistKey: 'solaris:locale',
          }),
        ],
      });
      const service = TestBed.inject(SolarisTranslateService);

      service.setLocale('pt-BR');
      expect(service.locale()).toBe('pt-BR');

      service.resetLocale();

      expect(service.locale()).toBe('en-US');
    });
  });

  describe('persistence', () => {
    const persistKey = 'solaris:locale';
    const customKey = 'custom:locale';

    afterEach(() => {
      localStorage.removeItem(persistKey);
      localStorage.removeItem(customKey);
    });

    function createServiceWith(config?: Partial<SolarisTranslateConfig>) {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideSolarisTranslateTesting({
            persistKey,
            ...config,
          }),
        ],
      });
      return TestBed.inject(SolarisTranslateService);
    }

    it('persists setLocale to localStorage under the default key', () => {
      const service = createServiceWith();

      service.setLocale('pt-BR');

      expect(localStorage.getItem(persistKey)).toBe('pt-BR');
    });

    it('reads the stored locale on creation (reload)', () => {
      localStorage.setItem(persistKey, 'pt-BR');
      const service = createServiceWith();

      expect(service.locale()).toBe('pt-BR');
      expect(service.translate('greeting', { name: 'Kaique' })).toBe(
        'Olá, Kaique',
      );
    });

    it('normalizes the stored value before using it', () => {
      localStorage.setItem(persistKey, 'es-MX');
      const service = createServiceWith();

      expect(service.locale()).toBe('es-419');
    });

    it('prefers the explicit locale over the stored one', () => {
      localStorage.setItem(persistKey, 'en-US');
      const service = createServiceWith();

      service.setLocale('pt');

      expect(service.locale()).toBe('pt-BR');
      expect(localStorage.getItem(persistKey)).toBe('pt-BR');
    });

    it('supports a custom persistKey', () => {
      const service = createServiceWith({ persistKey: customKey });

      service.setLocale('pt-BR');

      expect(localStorage.getItem(customKey)).toBe('pt-BR');
      expect(localStorage.getItem(persistKey)).toBeNull();
    });

    it('does not read or write storage when persistKey is false', () => {
      localStorage.setItem(persistKey, 'es-419');
      const service = createServiceWith({ persistKey: false });

      expect(service.locale()).toBe('en-US');

      service.setLocale('pt-BR');

      expect(service.locale()).toBe('pt-BR');
      expect(localStorage.getItem(persistKey)).toBe('es-419');
    });

    it('resetLocale clears the persisted choice', () => {
      const service = createServiceWith();
      service.setLocale('pt-BR');
      expect(localStorage.getItem(persistKey)).toBe('pt-BR');

      service.resetLocale();

      expect(localStorage.getItem(persistKey)).toBeNull();
      expect(service.locale()).toBe('en-US');
    });
  });

  describe('browser locale resolution', () => {
    function createServiceWithBrowser(
      languages: string[],
      language: string,
      config?: Partial<SolarisTranslateConfig>,
    ) {
      vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(languages);
      vi.spyOn(window.navigator, 'language', 'get').mockReturnValue(language);
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideSolarisTranslate({
            locale: 'en-US',
            fallbackLocale: 'en-US',
            useBrowserLocale: true,
            persistKey: false,
            translations: {
              'en-US': { greeting: 'Hello' },
              'pt-BR': { greeting: 'Olá' },
              'es-419': { greeting: 'Hola' },
            },
            ...config,
          }),
        ],
      });
      return TestBed.inject(SolarisTranslateService);
    }

    it('uses the first navigator language with a loaded map', () => {
      const service = createServiceWithBrowser(['es-MX', 'en-GB'], 'es-MX');

      expect(service.locale()).toBe('es-419');
    });

    it('normalizes browser tags before matching', () => {
      const service = createServiceWithBrowser(['pt-PT'], 'pt-PT');

      expect(service.locale()).toBe('pt-BR');
    });

    it('skips browser languages without a loaded map', () => {
      const service = createServiceWithBrowser(['fr', 'de'], 'fr');

      expect(service.locale()).toBe('en-US');
    });

    it('ignores the browser locale when useBrowserLocale is false', () => {
      const service = createServiceWithBrowser(['es-MX'], 'es-MX', {
        locale: 'pt-BR',
        useBrowserLocale: false,
      });

      expect(service.locale()).toBe('pt-BR');
    });
  });

  describe('fallback chain', () => {
    function createService() {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideSolarisTranslate({
            locale: 'es-419',
            fallbackLocale: 'pt-BR',
            useBrowserLocale: false,
            persistKey: false,
            translations: {
              'es-419': { onlyEs: 'Solo ES' },
              'pt-BR': {
                onlyEs: 'Só ES',
                onlyFallback: 'Só fallback',
                shared: 'Compartilhado',
              },
              'en-US': {
                onlyEs: 'Only ES',
                onlyFallback: 'Only fallback',
                onlyEn: 'Only EN',
                shared: 'Shared',
              },
            },
          }),
        ],
      });
      return TestBed.inject(SolarisTranslateService);
    }

    it('prefers the current locale map', () => {
      expect(createService().translate('onlyEs')).toBe('Solo ES');
    });

    it('falls back to fallbackLocale when the key is missing', () => {
      expect(createService().translate('onlyFallback')).toBe('Só fallback');
    });

    it('falls back to en-US when both locale and fallback miss', () => {
      expect(createService().translate('onlyEn')).toBe('Only EN');
    });

    it('returns the raw key when nothing matches', () => {
      expect(createService().translate('missing.key')).toBe('missing.key');
    });

    it('checks en-US before delegating to the resolver', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideSolarisTranslate({
            locale: 'es-419',
            fallbackLocale: 'pt-BR',
            useBrowserLocale: false,
            persistKey: false,
            translations: { 'en-US': { shared: 'Shared' } },
            resolver: (key) => (key === 'shared' ? 'Resolved' : undefined),
          }),
        ],
      });
      const service = TestBed.inject(SolarisTranslateService);

      expect(service.translate('shared')).toBe('Shared');
      expect(service.translate('app.unknown')).toBe('app.unknown');
    });

    it('instant() aliases translate()', () => {
      TestBed.configureTestingModule({
        providers: [provideSolarisTranslateTesting()],
      });
      const service = TestBed.inject(SolarisTranslateService);

      expect(service.instant('farewell')).toBe(service.translate('farewell'));
    });
  });

  describe('runtime extension', () => {
    it('has() checks the current locale by default', () => {
      TestBed.configureTestingModule({
        providers: [provideSolarisTranslateTesting()],
      });
      const service = TestBed.inject(SolarisTranslateService);

      expect(service.has('greeting')).toBe(true);
      expect(service.has('missing')).toBe(false);
    });

    it('has() accepts an explicit locale and normalizes it', () => {
      TestBed.configureTestingModule({
        providers: [provideSolarisTranslateTesting()],
      });
      const service = TestBed.inject(SolarisTranslateService);

      expect(service.has('greeting', 'pt')).toBe(true);
      expect(service.has('greeting', 'es')).toBe(false);
    });

    it('addTranslations() registers keys without a reload', () => {
      TestBed.configureTestingModule({
        providers: [provideSolarisTranslateTesting()],
      });
      const service = TestBed.inject(SolarisTranslateService);

      service.addTranslations('es', { greeting: 'Hola, {{name}}' });

      expect(service.has('greeting', 'es-419')).toBe(true);
      service.setLocale('es-MX');
      expect(service.translate('greeting', { name: 'Kaique' })).toBe(
        'Hola, Kaique',
      );
    });

    it('availableLocales() lists locales with loaded maps', () => {
      TestBed.configureTestingModule({
        providers: [provideSolarisTranslateTesting()],
      });
      const service = TestBed.inject(SolarisTranslateService);

      expect(service.availableLocales()).toEqual(['en-US', 'pt-BR', 'es-419']);

      service.addTranslations('fr', { greeting: 'Bonjour' });

      expect(service.availableLocales()).toContain('fr');
    });

    it('availableLocales() honors the configured allowlist', () => {
      TestBed.configureTestingModule({
        providers: [
          provideSolarisTranslateTesting({
            availableLocales: ['en-US'],
          }),
        ],
      });
      const service = TestBed.inject(SolarisTranslateService);

      expect(service.availableLocales()).toEqual(['en-US']);
    });
  });

  describe('SSR safety', () => {
    it('resolves the configured locale without touching browser APIs', () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: 'server' },
          provideSolarisTranslateTesting({ locale: 'pt-BR' }),
        ],
      });
      const service = TestBed.inject(SolarisTranslateService);

      expect(service.locale()).toBe('pt-BR');
      expect(service.translate('greeting', { name: 'Kaique' })).toBe(
        'Olá, Kaique',
      );

      service.setLocale('es');
      expect(service.locale()).toBe('es-419');
    });
  });

  describe('dictionary parity', () => {
    it('ships identical keys in en-US, pt-BR and es-419', () => {
      const maps = SOLARIS_TRANSLATE_DEFAULT_CONFIG.translations;
      const expected = Object.keys(maps['en-US']).sort();

      expect(Object.keys(maps['pt-BR']).sort()).toEqual(expected);
      expect(Object.keys(maps['es-419']).sort()).toEqual(expected);
    });
  });
});
