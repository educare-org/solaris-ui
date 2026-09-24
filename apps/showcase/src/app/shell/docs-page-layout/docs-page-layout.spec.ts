import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { SHELL_TRANSLATIONS } from '../translations';
import { ShowcaseDocsPageLayout } from './docs-page-layout';

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
        provideSolarisTranslateTesting({ translations: SHELL_TRANSLATIONS }),
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
