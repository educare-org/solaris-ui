import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { SHELL_TRANSLATIONS } from '../translations';
import { ShowcaseDocsOnThisPage } from './docs-on-this-page';

describe('ShowcaseDocsOnThisPage', () => {
  let fixture: ComponentFixture<ShowcaseDocsOnThisPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseDocsOnThisPage],
      providers: [
        provideSolarisTranslateTesting({ translations: SHELL_TRANSLATIONS }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ShowcaseDocsOnThisPage);
    fixture.componentRef.setInput('items', [
      { anchor: 'overview', label: 'Overview' },
      { anchor: 'api', label: 'API', level: 3 },
    ]);
    fixture.detectChanges();
  });

  it('should create a labelled navigation landmark', () => {
    const nav = fixture.debugElement.query(By.css('nav.docs-on-this-page'));
    expect(nav).toBeTruthy();
    expect(nav.nativeElement.getAttribute('aria-label')).toBe('On this page');
  });

  it('should render anchor links for every item', () => {
    const links = fixture.debugElement.queryAll(
      By.css('.docs-on-this-page__link'),
    );
    expect(links.map((link) => link.attributes['href'])).toEqual([
      '#overview',
      '#api',
    ]);
    expect(links.map((link) => link.nativeElement.textContent.trim())).toEqual([
      'Overview',
      'API',
    ]);
  });

  it('should activate the clicked anchor without scrolling motion', () => {
    const links = fixture.debugElement.queryAll(
      By.css('.docs-on-this-page__link'),
    );
    links[1].nativeElement.click();
    fixture.detectChanges();

    const active = fixture.debugElement.queryAll(
      By.css('.docs-on-this-page__item[data-active="true"]'),
    );
    expect(active).toHaveLength(1);
    expect(
      active[0].query(By.css('.docs-on-this-page__link')).attributes[
        'aria-current'
      ],
    ).toBe('true');
    expect(
      active[0].query(By.css('.docs-on-this-page__link')).attributes['href'],
    ).toBe('#api');
  });

  it('should respect the active fallback when no anchor was selected', () => {
    fixture.componentRef.setInput('items', [
      { anchor: 'overview', label: 'Overview', active: true },
      { anchor: 'api', label: 'API' },
    ]);
    fixture.detectChanges();

    const active = fixture.debugElement.queryAll(
      By.css('.docs-on-this-page__item[data-active="true"]'),
    );
    expect(active).toHaveLength(1);
  });
});
