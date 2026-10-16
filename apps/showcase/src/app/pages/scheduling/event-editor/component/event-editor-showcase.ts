import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCalendarEventEditorComponent,
  SolarisCodeBlockComponent,
  SolarisButtonDirective,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  resolveSolarisEventDelete,
  SolarisDialogService,
  type SolarisCalendarEvent,
  type SolarisCalendarTask,
  type SolarisEventDeleteRequest,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  EVENT_EDITOR_SHOWCASE_BASIC_CODE,
  EVENT_EDITOR_SHOWCASE_BREADCRUMBS,
  EVENT_EDITOR_SHOWCASE_DIALOG_CODE,
  EVENT_EDITOR_SHOWCASE_IMPORT_CODE,
  EVENT_EDITOR_SHOWCASE_INSTALL_COMMANDS,
  EVENT_EDITOR_SHOWCASE_NEXT,
  EVENT_EDITOR_SHOWCASE_PREV,
  EVENT_EDITOR_SHOWCASE_SLUG,
  EVENT_EDITOR_SHOWCASE_TOC_ITEMS,
  EVENT_EDITOR_TRANSLATION_PREFIX,
} from '../model/event-editor-showcase.data';
import { EventEditorDemoDialogComponent } from './event-editor-demo-dialog.component';
import type { EventEditorDemoData } from './event-editor-demo-dialog.component';
import type { EventEditorDemoResult } from './event-editor-demo-dialog.component';

const SHOWCASE_SINGLE: SolarisCalendarEvent = {
  id: 'planning',
  kind: 'event',
  title: 'Sprint planning',
  start: '2026-10-15T10:00:00-03:00',
  end: '2026-10-15T12:00:00-03:00',
  color: 'primary',
};

const SHOWCASE_RECURRING: SolarisCalendarEvent = {
  id: 'standup',
  kind: 'event',
  title: 'Team standup',
  start: '2026-10-15T09:00:00-03:00',
  end: '2026-10-15T09:30:00-03:00',
  color: 'info',
  recurrence: { freq: 'weekly', byWeekday: [4], count: 8 },
};

type DemoLocale = 'pt-BR' | 'en-US' | 'es';

@Component({
  standalone: true,
  imports: [
    SolarisCalendarEventEditorComponent,
    SolarisButtonDirective,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './event-editor-showcase.html',
  styleUrls: ['./event-editor-showcase.scss'],
})
export class EventEditorShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly dialogService = inject(SolarisDialogService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = EVENT_EDITOR_SHOWCASE_BREADCRUMBS;
  protected readonly prev = EVENT_EDITOR_SHOWCASE_PREV;
  protected readonly next = EVENT_EDITOR_SHOWCASE_NEXT;
  protected readonly tocItems = EVENT_EDITOR_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = EVENT_EDITOR_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = EVENT_EDITOR_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = EVENT_EDITOR_SHOWCASE_BASIC_CODE;
  protected readonly dialogCode = EVENT_EDITOR_SHOWCASE_DIALOG_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: EVENT_EDITOR_TRANSLATION_PREFIX,
      slug: EVENT_EDITOR_SHOWCASE_SLUG,
      importCode: EVENT_EDITOR_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly demoLocale = signal<DemoLocale>('pt-BR');
  protected readonly log = signal('');
  protected readonly events = signal<SolarisCalendarEvent[]>([
    SHOWCASE_SINGLE,
    SHOWCASE_RECURRING,
  ]);

  protected readonly previewEvent = computed(
    () =>
      this.events().find((item) => item.recurrence !== undefined) ??
      this.events()[0],
  );

  protected async selectLocale(locale: unknown): Promise<void> {
    if (locale !== 'pt-BR' && locale !== 'en-US' && locale !== 'es') return;
    this.demoLocale.set(locale);
  }

  protected openSingle(): void {
    this.openEditor(SHOWCASE_SINGLE, null);
  }

  protected openRecurring(): void {
    this.openEditor(SHOWCASE_RECURRING, '2026-10-22T09:00:00-03:00');
  }

  protected openNew(): void {
    this.openEditor(
      {
        id: 'new-event',
        kind: 'event',
        title: '',
        start: '2026-10-15T09:00:00-03:00',
        end: '2026-10-15T10:00:00-03:00',
      },
      null,
    );
  }

  protected onInlineSave(
    event: SolarisCalendarEvent | SolarisCalendarTask,
  ): void {
    const color = event.kind === 'event' ? (event.color ?? 'none') : 'none';
    this.log.set(`save:${event.id}:${event.title}:${color}`);
  }

  protected onInlineDelete(request: SolarisEventDeleteRequest): void {
    this.applyDelete(request);
  }

  protected onInlineCancel(): void {
    this.log.set('cancel');
  }

  private openEditor(
    event: SolarisCalendarEvent,
    occurrenceStart: string | null,
  ): void {
    const ref = this.dialogService.openComponent<
      EventEditorDemoDialogComponent,
      EventEditorDemoResult,
      EventEditorDemoData
    >(EventEditorDemoDialogComponent, {
      title:
        event.title ||
        this.translateService.translate('event-editor.dialog.new'),
      width: '560px',
      data: {
        event,
        occurrenceStart,
        locale: this.demoLocale(),
        timeZone: 'America/Sao_Paulo',
      },
    });
    ref.afterClosed().subscribe((result) => {
      if (result?.kind === 'save' && result.event) {
        const color =
          result.event.kind === 'event'
            ? (result.event.color ?? 'none')
            : 'none';
        this.log.set(`save:${result.event.id}:${result.event.title}:${color}`);
      } else if (result?.kind === 'delete' && result.request) {
        this.applyDelete(result.request);
      } else {
        this.log.set('cancel');
      }
    });
  }

  private applyDelete(request: SolarisEventDeleteRequest): void {
    const source = this.events().find((item) => item.id === request.eventId);
    if (!source) {
      this.log.set(`delete:${request.eventId}:${request.scope}:missing`);
      return;
    }
    const resolved = resolveSolarisEventDelete(
      source,
      request.occurrenceStart,
      request.scope,
      'America/Sao_Paulo',
    );
    if (resolved.action === 'remove') {
      this.events.update((items) =>
        items.filter((item) => item.id !== source.id),
      );
      this.log.set(`delete:${request.eventId}:${request.scope}:removed`);
    } else {
      this.events.update((items) =>
        items.map((item) => (item.id === source.id ? resolved.event : item)),
      );
      const detail =
        request.scope === 'this'
          ? (resolved.event.recurrenceExceptionDates ?? []).join(',')
          : (resolved.event.recurrence?.until ?? '');
      this.log.set(`delete:${request.eventId}:${request.scope}:${detail}`);
    }
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
}
