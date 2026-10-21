import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { SHELL_TRANSLATIONS } from '../translation';
import { ShowcaseShell } from './shell';
import { flattenTestTranslations } from '../../shared/testing/flatten-test-translations';

@Component({ standalone: true, template: '<h1>Dummy page</h1>' })
class DummyPage {}

describe('ShowcaseShell', () => {
  let fixture: ComponentFixture<ShowcaseShell>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseShell],
      providers: [
        provideSolarisTranslateTesting({
          translations: {
            'en-US': flattenTestTranslations(SHELL_TRANSLATIONS['en-US']),
            'pt-BR': flattenTestTranslations(SHELL_TRANSLATIONS['pt-BR']),
            'es-419': flattenTestTranslations(SHELL_TRANSLATIONS['es-419']),
          },
        }),
        provideRouter([
          { path: 'actions/button', component: DummyPage },
          { path: 'feedback/alert', component: DummyPage },
          { path: '**', component: DummyPage },
        ]),
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ShowcaseShell);
    fixture.detectChanges();
  });

  it('should create the shell with header, sidebar and routed main content', async () => {
    await router.navigateByUrl('/actions/button');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-shell-header'))).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('app-shell-sidebar')),
    ).toBeTruthy();

    const main = fixture.debugElement.query(By.css('main#main-content'));
    expect(main).toBeTruthy();
    expect(main.attributes['tabindex']).toBe('-1');
    expect(main.nativeElement.textContent).toContain('Dummy page');
  });

  it('should expose a skip link to the main content', () => {
    const skip = fixture.debugElement.query(By.css('.shell__skip-link'));
    expect(skip).toBeTruthy();
    expect(skip.attributes['href']).toBe('#main-content');
    expect(skip.nativeElement.textContent.trim()).toBe('Skip to content');
  });

  it('should filter the sidebar through the header search', () => {
    const input = fixture.debugElement.query(By.css('input[type="search"]'))
      .nativeElement as HTMLInputElement;
    input.value = 'dialog';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const links = fixture.debugElement
      .queryAll(By.css('.shell-sidebar__link'))
      .map((el) => el.nativeElement.textContent.trim());
    expect(links).toEqual(['Dialog']);
  });

  it('should open and close the mobile navigation from the header', () => {
    const menuButton = fixture.debugElement.query(
      By.css('.shell-header__menu-button'),
    );
    const sidebar = (): HTMLElement =>
      fixture.debugElement.query(By.css('nav.shell-sidebar')).nativeElement;

    expect(sidebar().getAttribute('data-open')).toBe('false');

    menuButton.nativeElement.click();
    fixture.detectChanges();

    expect(sidebar().getAttribute('data-open')).toBe('true');
    expect(menuButton.attributes['aria-expanded']).toBe('true');

    menuButton.nativeElement.click();
    fixture.detectChanges();

    expect(sidebar().getAttribute('data-open')).toBe('false');
  });

  it('should close the mobile navigation after navigating', async () => {
    const menuButton = fixture.debugElement.query(
      By.css('.shell-header__menu-button'),
    );
    menuButton.nativeElement.click();
    fixture.detectChanges();
    expect(
      fixture.debugElement
        .query(By.css('nav.shell-sidebar'))
        .nativeElement.getAttribute('data-open'),
    ).toBe('true');

    const link = fixture.debugElement.query(
      By.css('a[href="/feedback/alert"]'),
    );
    link.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(
      fixture.debugElement
        .query(By.css('nav.shell-sidebar'))
        .nativeElement.getAttribute('data-open'),
    ).toBe('false');
  });
});
