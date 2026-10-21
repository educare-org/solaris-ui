import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SolarisTranslatePipe } from './solaris-translate.pipe';
import { SolarisTranslateService } from '../service/solaris-translate.service';
import { provideSolarisTranslateTesting } from '../testing/solaris-translate-testing.provider';

@Component({
  standalone: true,
  imports: [SolarisTranslatePipe],
  template: `<p>{{ 'greeting' | translate: { name: 'World' } }}</p>`,
})
class TranslateHostComponent {}

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
    TestBed.configureTestingModule({
      providers: [{ provide: SolarisTranslateService, useValue: null }],
    });
    const fallback = TestBed.runInInjectionContext(
      () => new SolarisTranslatePipe(),
    );
    expect(fallback.transform('solaris.calendar.today')).toBe(
      'solaris.calendar.today',
    );
  });

  it('reflects setLocale without recreating the pipe', () => {
    expect(pipe.transform('greeting', { name: 'World' })).toBe('Hello, World');

    TestBed.inject(SolarisTranslateService).setLocale('pt-BR');

    expect(pipe.transform('greeting', { name: 'World' })).toBe('Olá, World');
  });

  it('updates the rendered template after setLocale without reload', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideSolarisTranslateTesting()],
      imports: [TranslateHostComponent],
    });
    const fixture = TestBed.createComponent(TranslateHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Hello, World');

    TestBed.inject(SolarisTranslateService).setLocale('pt-BR');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Olá, World');
  });
});
