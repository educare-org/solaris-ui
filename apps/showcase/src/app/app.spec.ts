import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { SHELL_TRANSLATIONS } from './shell/translation';
import { App } from './app';
import { flattenTestTranslations } from './shared/testing/flatten-test-translations';

@Component({ standalone: true, template: '' })
class DummyPage {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideSolarisTranslateTesting({
          translations: {
            'en-US': flattenTestTranslations(SHELL_TRANSLATIONS['en-US']),
            'pt-BR': flattenTestTranslations(SHELL_TRANSLATIONS['pt-BR']),
            'es-419': flattenTestTranslations(SHELL_TRANSLATIONS['es-419']),
          },
        }),
        provideRouter([{ path: '**', component: DummyPage }]),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render only the shell', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-shell'))).toBeTruthy();
  });
});
