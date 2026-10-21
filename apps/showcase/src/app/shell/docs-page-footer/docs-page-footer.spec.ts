import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { SHELL_TRANSLATIONS } from '../translation';
import { ShowcaseDocsPageFooter } from './docs-page-footer';
import { flattenTestTranslations } from '../../shared/testing/flatten-test-translations';

describe('ShowcaseDocsPageFooter', () => {
  let fixture: ComponentFixture<ShowcaseDocsPageFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseDocsPageFooter],
      providers: [
        provideSolarisTranslateTesting({
          translations: {
            'en-US': flattenTestTranslations(SHELL_TRANSLATIONS['en-US']),
            'pt-BR': flattenTestTranslations(SHELL_TRANSLATIONS['pt-BR']),
            'es-419': flattenTestTranslations(SHELL_TRANSLATIONS['es-419']),
          },
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ShowcaseDocsPageFooter);
    fixture.componentRef.setInput('prev', {
      label: 'Card',
      route: '/data-display/card',
    });
    fixture.componentRef.setInput('next', {
      label: 'Alert',
      route: '/feedback/alert',
    });
    fixture.detectChanges();
  });

  it('should render previous and next links with routes', () => {
    const links = fixture.debugElement.queryAll(By.css('a[href]'));
    expect(links.length).toBe(2);
    expect(links[0].nativeElement.getAttribute('href')).toBe(
      '/data-display/card',
    );
    expect(links[1].nativeElement.getAttribute('href')).toBe('/feedback/alert');
    expect(links[0].nativeElement.textContent).toContain('Card');
    expect(links[1].nativeElement.textContent).toContain('Alert');
  });

  it('should render nothing when there is no prev or next', () => {
    fixture.componentRef.setInput('prev', undefined);
    fixture.componentRef.setInput('next', undefined);
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('nav.docs-page-footer')),
    ).toBeNull();
  });
});
