import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { SHELL_TRANSLATIONS } from '../translation';
import { ShowcaseDocsSection } from './docs-section';
import { flattenTestTranslations } from '../../shared/testing/flatten-test-translations';

describe('ShowcaseDocsSection', () => {
  let fixture: ComponentFixture<ShowcaseDocsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseDocsSection],
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
    fixture = TestBed.createComponent(ShowcaseDocsSection);
    fixture.componentRef.setInput('anchor', 'overview');
    fixture.componentRef.setInput('title', 'Overview');
    fixture.detectChanges();
  });

  it('should render an anchored section labelled by its heading', () => {
    const section = fixture.debugElement.query(By.css('section.docs-section'));
    expect(section.attributes['id']).toBe('overview');
    expect(section.attributes['aria-labelledby']).toBe('overview-title');

    const heading = fixture.debugElement.query(By.css('#overview-title'))
      .nativeElement as HTMLHeadingElement;
    expect(heading.tagName).toBe('H2');
    expect(heading.textContent?.trim()).toBe('Overview');
  });
});
