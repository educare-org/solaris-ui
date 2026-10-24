import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { TranslateShowcasePage } from '../component/translate-showcase';

describe('TranslateShowcasePage', () => {
  let fixture: ComponentFixture<TranslateShowcasePage>;

  const translations = {
    'en-US': {
      'translate.title': 'Translation service',
      'translate.demo.greeting': 'Hello, {{name}}!',
      'translate.demo.items.singular': '1 item',
      'translate.demo.items.plural': '{{count}} items',
      'translate.demo.nameLabel': 'Name',
      'translate.demo.countLabel': 'Count',
    },
    'pt-BR': {
      'translate.title': 'Serviço de translation',
      'translate.demo.greeting': 'Olá, {{name}}!',
      'translate.demo.items.singular': '1 item',
      'translate.demo.items.plural': '{{count}} itens',
      'translate.demo.nameLabel': 'Nome',
      'translate.demo.countLabel': 'Quantidade',
    },
    'es-419': {
      'translate.title': 'Servicio de traducción',
      'translate.demo.greeting': '¡Hola, {{name}}!',
      'translate.demo.items.singular': '1 elemento',
      'translate.demo.items.plural': '{{count}} elementos',
      'translate.demo.nameLabel': 'Nombre',
      'translate.demo.countLabel': 'Cantidad',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateShowcasePage],
      providers: [provideSolarisTranslateTesting({ translations })],
    }).compileComponents();
    fixture = TestBed.createComponent(TranslateShowcasePage);
    fixture.detectChanges();
  });

  function text(testId: string): string {
    return (
      fixture.debugElement
        .query(By.css(`[data-testid="${testId}"]`))
        ?.nativeElement.textContent.trim() ?? ''
    );
  }

  it('creates the page with the English title by default', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(text('page-title')).toBe('Translation service');
    expect(text('greeting')).toContain('Hello, Kaique!');
  });

  it('re-renders translated text after setLocale without reload', () => {
    fixture.debugElement
      .query(By.css('[data-testid="locale-pt-BR"]'))
      .nativeElement.click();
    fixture.detectChanges();

    expect(text('page-title')).toBe('Serviço de translation');
    expect(text('greeting')).toContain('Olá, Kaique!');
  });

  it('falls back to en-US for keys missing in the current locale', () => {
    fixture.debugElement
      .query(By.css('[data-testid="locale-pt-BR"]'))
      .nativeElement.click();
    fixture.detectChanges();

    expect(text('fallback-text')).toBe('This sentence only exists in en-US.');
  });

  it('switches singular and plural forms with the count', () => {
    expect(text('items')).toContain('1 item');

    fixture.debugElement
      .query(By.css('[data-testid="count-inc"]'))
      .nativeElement.click();
    fixture.detectChanges();

    expect(text('items')).toContain('2 items');
  });
});
