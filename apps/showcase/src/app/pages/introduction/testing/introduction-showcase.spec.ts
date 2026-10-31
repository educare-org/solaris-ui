import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { flattenTestTranslations } from '../../../shared/testing/flatten-test-translations';
import { SHELL_TRANSLATIONS } from '../../../shell/translation';
import { INTRODUCTION_TRANSLATIONS } from '../translation';
import { buildIntroductionMarkdown } from '../functions/introduction-showcase-markdown';
import {
  INTRODUCTION_SHOWCASE_CONTRACTS,
  INTRODUCTION_SHOWCASE_NEXT_ITEMS,
  INTRODUCTION_SHOWCASE_PRINCIPLES,
} from '../model/introduction-showcase.data';
import { IntroductionShowcasePage } from '../component/introduction';

function flattenAll(
  locale: 'en-US' | 'pt-BR' | 'es-419',
): Record<string, string> {
  return {
    ...flattenTestTranslations(SHELL_TRANSLATIONS[locale]),
    ...flattenTestTranslations(INTRODUCTION_TRANSLATIONS[locale]),
  };
}

describe('IntroductionShowcasePage', () => {
  let fixture: ComponentFixture<IntroductionShowcasePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroductionShowcasePage],
      providers: [
        provideSolarisTranslateTesting({
          translations: {
            'en-US': flattenAll('en-US'),
            'pt-BR': flattenAll('pt-BR'),
            'es-419': flattenAll('es-419'),
          },
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(IntroductionShowcasePage);
    fixture.detectChanges();
  });

  it('creates the page with the English title by default', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(
      fixture.debugElement
        .query(By.css('h1'))
        ?.nativeElement.textContent.trim(),
    ).toBe('Introduction');
  });

  it('renders the copy page action like other showcase pages', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(
      buttons.some((button) =>
        button.nativeElement.textContent.includes('Copy Page'),
      ),
    ).toBe(true);
  });

  it('renders one block per principle and contract', () => {
    const blocks = fixture.debugElement.queryAll(
      By.css('.introduction-showcase__block'),
    );
    expect(blocks.length).toBe(
      INTRODUCTION_SHOWCASE_PRINCIPLES.length +
        INTRODUCTION_SHOWCASE_CONTRACTS.length,
    );
  });

  it('renders next steps as links to real routes', () => {
    const links = fixture.debugElement.queryAll(
      By.css('.introduction-showcase__link'),
    );
    expect(
      links.map((link) => link.nativeElement.getAttribute('href')),
    ).toEqual(['/installation', '/icons']);
  });

  it('exposes one rendered section per table of contents anchor', () => {
    const ids = fixture.debugElement
      .queryAll(By.css('section.docs-section'))
      .map((section) => section.nativeElement.getAttribute('id'));
    expect(ids).toEqual(['principles', 'contracts', 'next']);
  });
});

describe('buildIntroductionMarkdown', () => {
  it('serializes title, sections, and items in order', () => {
    const flat = flattenAll('en-US');
    const markdown = buildIntroductionMarkdown((key) => flat[key] ?? key, {
      principles: INTRODUCTION_SHOWCASE_PRINCIPLES,
      contracts: INTRODUCTION_SHOWCASE_CONTRACTS,
      next: INTRODUCTION_SHOWCASE_NEXT_ITEMS,
    });

    expect(markdown).toContain('# Introduction');
    expect(markdown).toContain('## Principles');
    expect(markdown).toContain('### Design builds trust');
    expect(markdown).toContain('## Contracts');
    expect(markdown).toContain('### Standalone only');
    expect(markdown).toContain('## Where to go next');
    expect(markdown).toContain('### Install Solaris');
  });
});
