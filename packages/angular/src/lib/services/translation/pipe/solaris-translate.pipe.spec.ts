import { SolarisTranslatePipe } from './solaris-translate.pipe';
import { TestBed } from '@angular/core/testing';
import { provideSolarisTranslateTesting } from '../testing/solaris-translate-testing.provider';

describe('SolarisTranslatePipe', () => {
  let pipe: SolarisTranslatePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideSolarisTranslateTesting()],
    });
    pipe = TestBed.runInInjectionContext(() => new SolarisTranslatePipe());
  });

  it('translates key with params', () => {
    const result = pipe.transform('greeting', { name: 'World' });
    expect(result).toBe('Hello, World');
  });

  it('translates key without params', () => {
    const result = pipe.transform('farewell');
    expect(result).toBe('Goodbye');
  });

  it('returns key when translation is missing', () => {
    const result = pipe.transform('nonexistent');
    expect(result).toBe('nonexistent');
  });

  it('returns key when the translate service is absent', () => {
    TestBed.resetTestingModule();
    const fallback = TestBed.runInInjectionContext(
      () => new SolarisTranslatePipe(),
    );
    expect(fallback.transform('solaris.calendar.today')).toBe(
      'solaris.calendar.today',
    );
  });
});
