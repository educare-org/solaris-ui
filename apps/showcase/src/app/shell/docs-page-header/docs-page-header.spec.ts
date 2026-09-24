import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { SHELL_TRANSLATIONS } from '../translations';
import { ShowcaseDocsPageHeader } from './docs-page-header';

describe('ShowcaseDocsPageHeader', () => {
  let fixture: ComponentFixture<ShowcaseDocsPageHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseDocsPageHeader],
      providers: [
        provideSolarisTranslateTesting({ translations: SHELL_TRANSLATIONS }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ShowcaseDocsPageHeader);
    fixture.componentRef.setInput('eyebrow', 'Data display');
    fixture.componentRef.setInput('title', 'Badge');
    fixture.componentRef.setInput('description', 'Status labels.');
    fixture.componentRef.setInput('breadcrumbs', [
      { label: 'Components', route: '/configuration' },
      { label: 'Badge' },
    ]);
    fixture.detectChanges();
  });

  it('should render eyebrow, title and description', () => {
    expect(
      fixture.debugElement
        .query(By.css('.docs-page-header__eyebrow'))
        .nativeElement.textContent.trim(),
    ).toBe('Data display');
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

  it('should render breadcrumbs with the current page marked', () => {
    const nav = fixture.debugElement.query(
      By.css('nav.docs-page-header__breadcrumbs'),
    );
    expect(nav.nativeElement.getAttribute('aria-label')).toBe('Breadcrumb');

    const current = fixture.debugElement.query(By.css('[aria-current="page"]'));
    expect(current.nativeElement.textContent.trim()).toBe('Badge');
  });

  it('should omit optional blocks when no input is provided', () => {
    fixture.componentRef.setInput('eyebrow', undefined);
    fixture.componentRef.setInput('description', undefined);
    fixture.componentRef.setInput('breadcrumbs', []);
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.docs-page-header__eyebrow')),
    ).toBeNull();
    expect(
      fixture.debugElement.query(By.css('.docs-page-header__description')),
    ).toBeNull();
    expect(
      fixture.debugElement.query(By.css('nav.docs-page-header__breadcrumbs')),
    ).toBeNull();
  });
});
