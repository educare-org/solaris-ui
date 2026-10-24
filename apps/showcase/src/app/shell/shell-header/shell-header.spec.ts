import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { SHELL_TRANSLATIONS } from '../translation';
import { ShowcaseShellHeader } from './shell-header';
import { flattenTestTranslations } from '../../shared/testing/flatten-test-translations';

describe('ShowcaseShellHeader', () => {
  let fixture: ComponentFixture<ShowcaseShellHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseShellHeader],
      providers: [
        provideSolarisTranslateTesting({
          translations: {
            'en-US': flattenTestTranslations(SHELL_TRANSLATIONS['en-US']),
            'pt-BR': flattenTestTranslations(SHELL_TRANSLATIONS['pt-BR']),
            'es-419': flattenTestTranslations(SHELL_TRANSLATIONS['es-419']),
          },
        }),
        provideRouter([]),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ShowcaseShellHeader);
    fixture.detectChanges();
  });

  it('should create with brand, search and theme controls', () => {
    expect(
      fixture.debugElement.query(By.css('.shell-header__brand')),
    ).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('input[type="search"]')),
    ).toBeTruthy();
    expect(fixture.debugElement.query(By.css('app-theme-toggle'))).toBeTruthy();
  });

  it('should label the search field for assistive technology', () => {
    const input = fixture.debugElement.query(By.css('input[type="search"]'))
      .nativeElement as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('Filter documentation pages');
    expect(input.placeholder).toBe('Filter pages…');
  });

  it('should update the search model as the user types', () => {
    const input = fixture.debugElement.query(By.css('input[type="search"]'))
      .nativeElement as HTMLInputElement;
    input.value = 'button';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.searchQuery()).toBe('button');
  });

  it('should clear the search on Escape', () => {
    fixture.componentRef.setInput('searchQuery', 'button');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input[type="search"]'));
    input.triggerEventHandler('keydown.escape', new KeyboardEvent('Escape'));
    fixture.detectChanges();

    expect(fixture.componentInstance.searchQuery()).toBe('');
  });

  it('should expose the mobile menu state and emit toggles', () => {
    fixture.componentRef.setInput('menuExpanded', false);
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('.shell-header__menu-button'),
    );
    expect(button.attributes['aria-expanded']).toBe('false');
    expect(button.attributes['aria-controls']).toBe('showcase-sidebar-nav');
    expect(button.nativeElement.getAttribute('aria-label')).toBe(
      'Open navigation menu',
    );

    let toggles = 0;
    fixture.componentInstance.menuToggle.subscribe(() => {
      toggles += 1;
    });
    button.nativeElement.click();
    expect(toggles).toBe(1);

    fixture.componentRef.setInput('menuExpanded', true);
    fixture.detectChanges();
    expect(button.attributes['aria-expanded']).toBe('true');
    expect(button.nativeElement.getAttribute('aria-label')).toBe(
      'Close navigation menu',
    );
  });
});
