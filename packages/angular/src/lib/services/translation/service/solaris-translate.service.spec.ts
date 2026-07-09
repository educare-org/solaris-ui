import { TestBed } from '@angular/core/testing';

import { SolarisTranslateService } from './solaris-translate.service';
import { provideSolarisTranslate } from '../provider/provide-solaris-translate';
import { provideSolarisTranslateTesting } from '../testing/solaris-translate-testing.provider';

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
            locale: 'es',
            translations: {
              es: {},
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
      expect(service.locale).toBe('en-US');
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
      expect(service.locale).toBe('en-US');
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
});
