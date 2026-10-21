import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { SHELL_TRANSLATIONS } from '../translation';
import { ShowcaseDocsPageLayout } from './docs-page-layout';
import { flattenTestTranslations } from '../../shared/testing/flatten-test-translations';

@Component({
  standalone: true,
  imports: [ShowcaseDocsPageLayout],
  template: `
    <app-docs-page-layout [items]="items">
      <p>Page content</p>
    </app-docs-page-layout>
  `,
})
class LayoutHost {
  items = [
    { anchor: 'overview', label: 'Overview' },
    { anchor: 'api', label: 'API' },
  ];
}

describe('ShowcaseDocsPageLayout', () => {
  let fixture: ComponentFixture<LayoutHost>;

  async function setup(
    items: { anchor: string; label: string }[],
  ): Promise<ComponentFixture<LayoutHost>> {
    await TestBed.configureTestingModule({
      imports: [LayoutHost],
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
    const layoutFixture = TestBed.createComponent(LayoutHost);
    layoutFixture.componentInstance.items = items;
    layoutFixture.detectChanges();
    return layoutFixture;
  }

  it('should project content and render the aside navigation', async () => {
    fixture = await setup([
      { anchor: 'overview', label: 'Overview' },
      { anchor: 'api', label: 'API' },
    ]);
    expect(
      fixture.debugElement.query(By.css('.docs-page-layout__content'))
        .nativeElement.textContent,
    ).toContain('Page content');
    expect(
      fixture.debugElement.query(By.css('.docs-page-layout__aside')),
    ).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('app-docs-on-this-page')),
    ).toBeTruthy();
  });

  it('should not render the aside when there are no items', async () => {
    fixture = await setup([]);

    expect(
      fixture.debugElement.query(By.css('.docs-page-layout__aside')),
    ).toBeNull();
    expect(
      fixture.debugElement.query(By.css('app-docs-on-this-page')),
    ).toBeNull();
  });
});
