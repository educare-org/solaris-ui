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

  it('should create with brand, search, icon theme toggle and high-contrast on desktop', () => {
    expect(
      fixture.debugElement.query(By.css('.shell-header__brand')),
    ).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('.shell-header__menu-button')),
    ).toBeNull();
    expect(
      fixture.debugElement.query(
        By.css('.shell-header__actions input[type="search"]'),
      ),
    ).toBeTruthy();
    const schemeToggle = fixture.debugElement.query(
      By.css('.shell-header__actions app-theme-toggle'),
    );
    expect(schemeToggle).toBeTruthy();
    expect(
      schemeToggle.queryAll(By.css('solaris-segmented-item')),
    ).toHaveLength(3);
    expect(schemeToggle.query(By.css('button'))).toBeNull();
    const contrastToggle = fixture.debugElement.query(
      By.css('app-theme-toggle.shell-header__contrast'),
    );
    expect(contrastToggle).toBeTruthy();
    expect(
      contrastToggle.query(By.css('solaris-segmented-control')),
    ).toBeNull();
  });

  it('should hide search, scheme toggle and contrast on mobile, keeping spacers', () => {
    fixture.componentRef.setInput('isMobile', true);
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.shell-header__actions')),
    ).toBeNull();
    expect(fixture.debugElement.query(By.css('app-theme-toggle'))).toBeNull();
    expect(
      fixture.debugElement.query(By.css('.shell-header__menu-spacer')),
    ).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('.shell-header__contrast-spacer')),
    ).toBeTruthy();
  });

  it('should label the search field for assistive technology', () => {
    const input = fixture.debugElement.query(
      By.css('.shell-header__actions input[type="search"]'),
    ).nativeElement as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('Filter documentation pages');
    expect(input.placeholder).toBe('Filter pages…');
  });

  it('should update the search model as the user types', () => {
    const input = fixture.debugElement.query(
      By.css('.shell-header__actions input[type="search"]'),
    ).nativeElement as HTMLInputElement;
    input.value = 'button';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.searchQuery()).toBe('button');
  });

  it('should clear the search on Escape', () => {
    fixture.componentRef.setInput('searchQuery', 'button');
    fixture.detectChanges();

    const input = fixture.debugElement.query(
      By.css('.shell-header__actions input[type="search"]'),
    );
    input.triggerEventHandler('keydown.escape', new KeyboardEvent('Escape'));
    fixture.detectChanges();

    expect(fixture.componentInstance.searchQuery()).toBe('');
  });

  it('should reserve the fixed toggle slot with a spacer on mobile', () => {
    expect(
      fixture.debugElement.query(By.css('.shell-header__menu-spacer')),
    ).toBeNull();

    fixture.componentRef.setInput('isMobile', true);
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.shell-header__menu-spacer')),
    ).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('.shell-header__menu-button')),
    ).toBeNull();
  });
});
