import { DOCUMENT } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import {
  SolarisCalendarMonthViewComponent,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  builtInHolidays,
  preloadBuiltInHolidays,
  type SolarisHoliday,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  HOLIDAYS_SHOWCASE_BASIC_CODE,
  HOLIDAYS_SHOWCASE_BREADCRUMBS,
  HOLIDAYS_SHOWCASE_IMPORT_CODE,
  HOLIDAYS_SHOWCASE_INSTALL_COMMANDS,
  HOLIDAYS_SHOWCASE_NEXT,
  HOLIDAYS_SHOWCASE_PREV,
  HOLIDAYS_SHOWCASE_SLUG,
  HOLIDAYS_SHOWCASE_TOC_ITEMS,
  HOLIDAYS_TRANSLATION_PREFIX,
} from '../model/holidays-showcase.data';

type DemoLocale = 'pt-BR' | 'en-US' | 'es';

@Component({
  standalone: true,
  imports: [
    SolarisCalendarMonthViewComponent,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './holidays-showcase.html',
  styleUrls: ['./holidays-showcase.scss'],
})
export class HolidaysShowcasePage implements OnInit {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = HOLIDAYS_SHOWCASE_BREADCRUMBS;
  protected readonly prev = HOLIDAYS_SHOWCASE_PREV;
  protected readonly next = HOLIDAYS_SHOWCASE_NEXT;
  protected readonly tocItems = HOLIDAYS_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = HOLIDAYS_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = HOLIDAYS_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = HOLIDAYS_SHOWCASE_BASIC_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: HOLIDAYS_TRANSLATION_PREFIX,
      slug: HOLIDAYS_SHOWCASE_SLUG,
      importCode: HOLIDAYS_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly holidays = signal<SolarisHoliday[]>([]);
  protected readonly focusedDate = signal('2026-10-15');
  protected readonly demoLocale = signal<DemoLocale>('pt-BR');

  ngOnInit(): void {
    void this.refreshHolidays();
  }

  protected async selectLocale(locale: unknown): Promise<void> {
    if (locale !== 'pt-BR' && locale !== 'en-US' && locale !== 'es') return;
    this.demoLocale.set(locale);
    await this.refreshHolidays();
  }

  protected copyPageAsMarkdown(): void {
    this.pageActions.copyPageAsMarkdown();
  }

  protected downloadPageAsMarkdown(): void {
    this.pageActions.downloadPageAsMarkdown();
  }

  protected openInChatGpt(): void {
    this.pageActions.openInChatGpt();
  }

  protected openInClaude(): void {
    this.pageActions.openInClaude();
  }

  private async refreshHolidays(): Promise<void> {
    const locale = this.demoLocale();
    await preloadBuiltInHolidays(locale);
    this.holidays.set(
      builtInHolidays().holidays(
        { start: '2026-01-01', end: '2026-12-31' },
        locale,
      ),
    );
  }
}
