import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { SHELL_TRANSLATIONS } from '../translation';
import { ShowcaseDocsPageHeader } from './docs-page-header';
import { flattenTestTranslations } from '../../shared/testing/flatten-test-translations';

describe('ShowcaseDocsPageHeader', () => {
  let fixture: ComponentFixture<ShowcaseDocsPageHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseDocsPageHeader],
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
    fixture = TestBed.createComponent(ShowcaseDocsPageHeader);
    fixture.componentRef.setInput('title', 'Badge');
    fixture.componentRef.setInput('description', 'Status labels.');
    fixture.componentRef.setInput('breadcrumbs', [
      { label: 'Components', route: '/configuration' },
      { label: 'Badge' },
    ]);
    fixture.detectChanges();
  });

  it('should render title and description', () => {
    expect(
      fixture.debugElement
        .query(By.css('.docs-page-header__title'))
        .nativeElement.textContent.trim(),
    ).toBe('Badge');
    expect(
      fixture.debugElement
        .query(By.css('.docs-page-header__description'))
        .nativeElement.textContent.trim(),
    ).toBe('Status labels.');
  });

  it('should render breadcrumbs with chevron separators and current page marked', () => {
    const nav = fixture.debugElement.query(
      By.css('nav.docs-page-header__breadcrumbs'),
    );
    expect(nav.nativeElement.getAttribute('aria-label')).toBe('Breadcrumb');

    const current = fixture.debugElement.query(By.css('[aria-current="page"]'));
    expect(current.nativeElement.textContent.trim()).toBe('Badge');

    const separator = fixture.debugElement.query(
      By.css('.docs-page-header__breadcrumb-separator'),
    );
    expect(separator).toBeTruthy();
  });

  it('should omit optional blocks when no input is provided', () => {
    fixture.componentRef.setInput('description', undefined);
    fixture.componentRef.setInput('breadcrumbs', []);
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.docs-page-header__description')),
    ).toBeNull();
    expect(
      fixture.debugElement.query(By.css('nav.docs-page-header__breadcrumbs')),
    ).toBeNull();
    expect(
      fixture.debugElement.query(By.css('.docs-page-header__actions')),
    ).toBeNull();
  });

  it('should render page actions with prev/next navigation', () => {
    fixture.componentRef.setInput('copyable', true);
    fixture.componentRef.setInput('prev', {
      label: 'Card',
      route: '/data-display/card',
    });
    fixture.componentRef.setInput('next', {
      label: 'Alert',
      route: '/feedback/alert',
    });
    fixture.detectChanges();

    const actions = fixture.debugElement.query(
      By.css('.docs-page-header__actions'),
    );
    expect(actions).toBeTruthy();
    const navLinks = fixture.debugElement.queryAll(
      By.css('.docs-page-header__actions a[href]'),
    );
    expect(navLinks.length).toBe(2);
    expect(navLinks[0].nativeElement.getAttribute('href')).toBe(
      '/data-display/card',
    );
    expect(navLinks[1].nativeElement.getAttribute('href')).toBe(
      '/feedback/alert',
    );
  });

  it('should emit copyPage when the copy button is clicked', () => {
    fixture.componentRef.setInput('copyable', true);
    fixture.detectChanges();

    let emitted = 0;
    fixture.componentInstance.copyPage.subscribe(() => {
      emitted += 1;
    });
    const copyButton = fixture.debugElement.query(
      By.css('.docs-page-header__actions solaris-button-group button'),
    );
    copyButton.nativeElement.click();
    expect(emitted).toBe(1);
  });
});
