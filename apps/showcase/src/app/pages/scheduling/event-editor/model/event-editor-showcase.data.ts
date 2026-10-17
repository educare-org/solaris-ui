import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';
import { SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';

export const EVENT_EDITOR_SHOWCASE_SLUG = 'event-editor';

export const EVENT_EDITOR_TRANSLATION_PREFIX = 'event-editor';

export const EVENT_EDITOR_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.calendar', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.event-editor' },
  ];

export const EVENT_EDITOR_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.print',
  route: '/scheduling/print',
};

export const EVENT_EDITOR_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.divider',
  route: '/content/divider',
};

export const EVENT_EDITOR_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'event-editor.section.examples' },
  { anchor: 'locales', labelKey: 'event-editor.section.locales' },
  { anchor: 'installation', labelKey: 'event-editor.section.installation' },
  { anchor: 'props', labelKey: 'event-editor.section.props' },
];

export const EVENT_EDITOR_SHOWCASE_IMPORT_CODE =
  "import { SolarisCalendarEventEditorComponent, resolveSolarisEventDelete } from '@solaris-ui/angular';";

export const EVENT_EDITOR_SHOWCASE_BASIC_CODE = [
  '<solaris-calendar-event-editor',
  '  locale="pt-BR"',
  '  timeZone="America/Sao_Paulo"',
  '  [event]="draft"',
  '  [occurrenceStart]="occurrence"',
  '  (eventSave)="onSave($event)"',
  '  (eventDelete)="onDelete($event)"',
  '  (eventCancel)="onCancel()"',
  '/>',
].join('\n');

export const EVENT_EDITOR_SHOWCASE_DIALOG_CODE = [
  'this.dialogService.openComponent(EventEditorDemoDialogComponent, {',
  "  title: 'Edit event',",
  "  width: '560px',",
  '  data: { event: draft, occurrenceStart, locale, timeZone },',
  '});',
].join('\n');

export const EVENT_EDITOR_SHOWCASE_INSTALL_COMMANDS = SHOWCASE_INSTALL_COMMANDS;
