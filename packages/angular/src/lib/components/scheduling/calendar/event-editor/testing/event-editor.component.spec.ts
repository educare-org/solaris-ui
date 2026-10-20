import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';
import { SolarisDialogService } from '../../../../overlay/dialog/service/dialog.service';
import type {
  SolarisCalendarEvent,
  SolarisCalendarTask,
} from '../../model/calendar.types';
import type { SolarisEventDeleteRequest } from '../model/event-editor.types';
import type { SolarisEventSaveRequest } from '../model/event-editor.types';
import { SolarisCalendarEventEditorComponent } from '../component/event-editor.component';

const SINGLE: SolarisCalendarEvent = {
  id: 'planning',
  kind: 'event',
  title: 'Sprint planning',
  start: '2026-10-15T10:00:00-03:00',
  end: '2026-10-15T12:00:00-03:00',
  color: 'primary',
};

const RECURRING: SolarisCalendarEvent = {
  id: 'standup',
  kind: 'event',
  title: 'Team standup',
  start: '2026-10-15T09:00:00-03:00',
  end: '2026-10-15T09:30:00-03:00',
  color: 'info',
  recurrence: { freq: 'weekly', byWeekday: [4], count: 8 },
};

describe('SolarisCalendarEventEditorComponent', () => {
  let fixture: ComponentFixture<SolarisCalendarEventEditorComponent>;

  const createFixture = (options?: {
    event?: SolarisCalendarEvent | SolarisCalendarTask;
    locale?: string;
    occurrenceStart?: string | null;
    disabled?: boolean;
  }): HTMLElement => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCalendarEventEditorComponent);
    fixture.componentRef.setInput('event', options?.event ?? SINGLE);
    fixture.componentRef.setInput('locale', options?.locale ?? 'en-US');
    fixture.componentRef.setInput('timeZone', 'America/Sao_Paulo');
    if (options?.occurrenceStart !== undefined) {
      fixture.componentRef.setInput('occurrenceStart', options.occurrenceStart);
    }
    if (options?.disabled !== undefined) {
      fixture.componentRef.setInput('disabled', options.disabled);
    }
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const saveButton = (element: HTMLElement): HTMLButtonElement => {
    const buttons = Array.from(element.querySelectorAll('button'));
    const found = buttons.find((button) =>
      button.textContent?.includes('Save'),
    );
    if (!found) throw new Error('save button not found');
    return found as HTMLButtonElement;
  };

  it('hydrates title and dates from the source event without mutating it', () => {
    const source = { ...SINGLE };
    const element = createFixture({ event: source });
    const title = element.querySelector(
      'input[type="text"]',
    ) as HTMLInputElement;
    expect(title.value).toBe('Sprint planning');
    expect(source.title).toBe('Sprint planning');
    expect(
      (fixture.nativeElement as HTMLElement).classList.contains(
        'solaris-calendar-event-editor',
      ),
    ).toBe(true);
  });

  it('exposes host class and data variants with token-only styling', () => {
    createFixture();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList.contains('solaris-calendar-event-editor')).toBe(true);
    expect(host.getAttribute('data-size')).toBe('md');
    expect(host.getAttribute('data-density')).toBe('comfortable');
  });

  it('emits an immutable draft on save', () => {
    const element = createFixture();
    const spy = vi.fn();
    fixture.componentInstance.eventSave.subscribe(spy);
    const title = element.querySelector(
      'input[type="text"]',
    ) as HTMLInputElement;
    title.value = 'Renamed planning';
    title.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    saveButton(element).click();
    expect(spy).toHaveBeenCalledTimes(1);
    const saved = spy.mock.calls[0][0] as SolarisEventSaveRequest;
    const draft = saved.event as SolarisCalendarEvent;
    expect(draft.title).toBe('Renamed planning');
    expect(draft).not.toBe(SINGLE);
    expect(SINGLE.title).toBe('Sprint planning');
  });

  it('disables save while the title is empty', () => {
    const element = createFixture();
    const title = element.querySelector(
      'input[type="text"]',
    ) as HTMLInputElement;
    title.value = '   ';
    title.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(saveButton(element).disabled).toBe(true);
  });

  it('flags an invalid range and blocks save', () => {
    const element = createFixture({
      event: {
        ...SINGLE,
        start: '2026-10-16T10:00:00-03:00',
        end: '2026-10-15T12:00:00-03:00',
      },
    });
    fixture.detectChanges();
    expect(
      element.querySelector('.solaris-calendar-event-editor__error'),
    ).not.toBeNull();
    expect(saveButton(element).disabled).toBe(true);
  });

  it('emits delete with the selected scope and occurrence', () => {
    const element = createFixture({
      event: RECURRING,
      occurrenceStart: '2026-10-22T09:00:00-03:00',
    });
    const spy = vi.fn();
    fixture.componentInstance.eventDelete.subscribe(spy);
    const radios = Array.from(
      element.querySelectorAll('solaris-radio-group solaris-radio'),
    );
    expect(radios.length).toBe(3);
    const followingInput = radios[1].querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
    followingInput.click();
    fixture.detectChanges();
    const buttons = Array.from(element.querySelectorAll('button'));
    const remove = buttons.find((button) =>
      /Delete|Excluir|Eliminar/.test(button.textContent ?? ''),
    );
    if (!remove) throw new Error('delete button not found');
    remove.click();
    expect(spy).toHaveBeenCalledTimes(1);
    const request = spy.mock.calls[0][0] as SolarisEventDeleteRequest;
    expect(request).toEqual({
      scope: 'following',
      eventId: 'standup',
      occurrenceStart: '2026-10-22T09:00:00-03:00',
    });
  });

  it('emits timeZoneChange when the change-zone button is activated', () => {
    const element = createFixture();
    const spy = vi.fn();
    fixture.componentInstance.timeZoneChange.subscribe(spy);
    const buttons = Array.from(element.querySelectorAll('button'));
    const change = buttons.find((button) =>
      /Change time zone|Alterar fuso|Cambiar zona/.test(
        button.textContent ?? '',
      ),
    );
    if (!change) throw new Error('change-zone button not found');
    change.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('hydrates the event color and saves it in the draft', () => {
    const element = createFixture({
      event: { ...SINGLE, color: 'accent' },
    });
    expect(
      (fixture.componentInstance as unknown as { color: () => string }).color(),
    ).toBe('accent');
    const spy = vi.fn();
    fixture.componentInstance.eventSave.subscribe(spy);
    saveButton(element).click();
    const saved = spy.mock.calls[0][0] as SolarisEventSaveRequest;
    const draft = saved.event as SolarisCalendarEvent;
    expect(draft.color).toBe('accent');
  });

  it('updates the draft color when another color is selected', () => {
    const element = createFixture();
    (
      fixture.componentInstance as unknown as {
        onColor: (value: unknown) => void;
      }
    ).onColor('violet');
    fixture.detectChanges();
    const spy = vi.fn();
    fixture.componentInstance.eventSave.subscribe(spy);
    saveButton(element).click();
    const saved = spy.mock.calls[0][0] as SolarisEventSaveRequest;
    const draft = saved.event as SolarisCalendarEvent;
    expect(draft.color).toBe('violet');
  });

  it('renders the color select with one swatch per option', () => {
    createFixture();
    const instance = fixture.componentInstance as unknown as {
      colorOptions: readonly string[];
      colorName: (value: string) => string;
    };
    expect(instance.colorOptions.length).toBe(8);
    expect(instance.colorOptions).toContain('violet');
    expect(instance.colorName('violet')).toBe('Violet');
  });

  it('emits cancel without changes', () => {
    const element = createFixture();
    const spy = vi.fn();
    fixture.componentInstance.eventCancel.subscribe(spy);
    const buttons = Array.from(element.querySelectorAll('button'));
    const cancel = buttons.find((button) =>
      /Cancel|Cancelar/.test(button.textContent ?? ''),
    );
    if (!cancel) throw new Error('cancel button not found');
    cancel.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('renders the all-day checkbox with a visible label', () => {
    const element = createFixture();
    const checkbox = element.querySelector('solaris-checkbox');
    expect(checkbox).not.toBeNull();
    expect(checkbox?.textContent).toContain('All day');
    expect(element.querySelector('solaris-switch')).toBeNull();
  });

  it('toggles weekday chips with aria-pressed', () => {
    const element = createFixture({ event: RECURRING });
    const chips = Array.from(
      element.querySelectorAll('.solaris-calendar-event-editor__chip'),
    );
    expect(chips.length).toBeGreaterThan(0);
    const first = chips[0] as HTMLButtonElement;
    const before = first.getAttribute('aria-pressed');
    first.click();
    fixture.detectChanges();
    expect(first.getAttribute('aria-pressed')).not.toBe(before);
  });

  it('disables every action when disabled', () => {
    const element = createFixture({ disabled: true });
    expect(saveButton(element).disabled).toBe(true);
    const title = element.querySelector(
      'input[type="text"]',
    ) as HTMLInputElement;
    expect(title.disabled).toBe(true);
  });

  it('renders the change-zone action as a button without the current zone', () => {
    const element = createFixture();
    expect(element.querySelector('[data-timezone]')).toBeNull();
    const buttons = Array.from(element.querySelectorAll('button'));
    const change = buttons.find((button) =>
      /Change time zone|Alterar fuso|Cambiar zona/.test(
        button.textContent ?? '',
      ),
    );
    expect(change).not.toBeUndefined();
  });

  it.each(['pt-BR', 'en-US', 'es'] as const)(
    'translates chrome strings for locale %s',
    (locale) => {
      TestBed.resetTestingModule();
      configureSolarisTesting({ translate: { locale } });
      fixture = TestBed.createComponent(SolarisCalendarEventEditorComponent);
      fixture.componentRef.setInput('event', SINGLE);
      fixture.componentRef.setInput('locale', locale);
      fixture.componentRef.setInput('timeZone', 'America/Sao_Paulo');
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      const expected =
        locale === 'pt-BR' ? 'Salvar' : locale === 'es' ? 'Guardar' : 'Save';
      expect(element.textContent).toContain(expected);
    },
  );

  it('renders the segmented item-kind switch with three options', () => {
    const element = createFixture();
    const control = element.querySelector('solaris-segmented-control');
    expect(control).not.toBeNull();
    expect(element.querySelectorAll('solaris-segmented-item').length).toBe(3);
  });

  it('emits a task draft when the task kind is selected', () => {
    const element = createFixture();
    const spy = vi.fn();
    const kindSpy = vi.fn();
    fixture.componentInstance.eventSave.subscribe(spy);
    fixture.componentInstance.itemKindChange.subscribe(kindSpy);
    (
      fixture.componentInstance as unknown as {
        onItemKind: (value: unknown) => void;
      }
    ).onItemKind('task');
    fixture.detectChanges();
    saveButton(element).click();
    expect(spy).toHaveBeenCalledTimes(1);
    const savedTask = spy.mock.calls[0][0] as SolarisEventSaveRequest;
    const draft = savedTask.event as SolarisCalendarTask;
    expect(draft.kind).toBe('task');
    expect(draft.title).toBe('Sprint planning');
    expect(draft.completed).toBe(false);
    expect(kindSpy).toHaveBeenCalledWith('task');
  });

  it('marks schedule drafts without changing the event shape', () => {
    const element = createFixture();
    (
      fixture.componentInstance as unknown as {
        onItemKind: (value: unknown) => void;
      }
    ).onItemKind('schedule');
    fixture.detectChanges();
    const spy = vi.fn();
    fixture.componentInstance.eventSave.subscribe(spy);
    saveButton(element).click();
    const saved = spy.mock.calls[0][0] as SolarisEventSaveRequest;
    const draft = saved.event as SolarisCalendarEvent;
    expect(draft.kind).toBe('event');
    expect(draft.scheduleSlot).toBe(true);
  });

  it('defaults visibility to public with two options', () => {
    const element = createFixture();
    const spy = vi.fn();
    fixture.componentInstance.eventSave.subscribe(spy);
    saveButton(element).click();
    const saved = spy.mock.calls[0][0] as SolarisEventSaveRequest;
    const draft = saved.event as SolarisCalendarEvent;
    expect(draft.visibility).toBe('public');
    expect(element.textContent).not.toContain('Default visibility');
  });

  it('persists description and meeting link in the draft', () => {
    const element = createFixture({
      event: {
        ...SINGLE,
        description: 'Sprint goals',
        meetingUrl: 'https://meet.example/abc',
      },
    });
    const description = element.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    expect(description.value).toBe('Sprint goals');
    const spy = vi.fn();
    fixture.componentInstance.eventSave.subscribe(spy);
    saveButton(element).click();
    const saved = spy.mock.calls[0][0] as SolarisEventSaveRequest;
    const draft = saved.event as SolarisCalendarEvent;
    expect(draft.description).toBe('Sprint goals');
    expect(draft.meetingUrl).toBe('https://meet.example/abc');
  });

  it('applies the dialog time-zone result with separate zones', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const closeWith = {
      start: 'Europe/Lisbon',
      end: 'UTC',
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SolarisDialogService,
          useValue: {
            openComponent: () => ({
              afterClosed: () => of(closeWith),
            }),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(SolarisCalendarEventEditorComponent);
    fixture.componentRef.setInput('event', SINGLE);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('timeZone', 'America/Sao_Paulo');
    fixture.componentRef.setInput('timeZoneEnd', 'UTC');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const startSpy = vi.fn();
    const endSpy = vi.fn();
    fixture.componentInstance.timeZoneChange.subscribe(startSpy);
    fixture.componentInstance.timeZoneEndChange.subscribe(endSpy);
    (
      fixture.componentInstance as unknown as { onTimeZoneChange: () => void }
    ).onTimeZoneChange();
    expect(startSpy).toHaveBeenCalledWith('Europe/Lisbon');
    expect(endSpy).toHaveBeenCalledWith('UTC');
    expect(
      (
        fixture.componentInstance as unknown as { endZone: () => string }
      ).endZone(),
    ).toBe('UTC');
    expect(element.querySelector('[data-timezone]')).toBeNull();
  });

  it('keeps the recurrence series when saving a recurring event', () => {
    const element = createFixture({ event: RECURRING });
    const spy = vi.fn();
    fixture.componentInstance.eventSave.subscribe(spy);
    saveButton(element).click();
    expect(spy).toHaveBeenCalledTimes(1);
    const saved = spy.mock.calls[0][0] as SolarisEventSaveRequest;
    const draft = saved.event as SolarisCalendarEvent;
    expect(draft.recurrence?.freq).toBe('weekly');
    expect(draft.recurrence?.byWeekday).toEqual([4]);
    expect(draft.recurrence?.count).toBe(8);
  });

  it('derives monthDay from the start date for monthly series', () => {
    const element = createFixture({
      event: {
        ...SINGLE,
        start: '2026-10-15T10:00:00-03:00',
        end: '2026-10-15T12:00:00-03:00',
        recurrence: { freq: 'monthly', interval: 2 },
      },
    });
    const spy = vi.fn();
    fixture.componentInstance.eventSave.subscribe(spy);
    saveButton(element).click();
    const saved = spy.mock.calls[0][0] as SolarisEventSaveRequest;
    const draft = saved.event as SolarisCalendarEvent;
    expect(draft.recurrence?.freq).toBe('monthly');
    expect(draft.recurrence?.monthDay).toBe(15);
    expect(draft.recurrence?.interval).toBe(2);
  });

  it('saves all-day events as date-only values', () => {
    const element = createFixture({
      event: {
        id: 'offsite',
        kind: 'event',
        title: 'Design offsite',
        start: '2026-10-20',
        end: '2026-10-22',
        allDay: true,
      },
    });
    const spy = vi.fn();
    fixture.componentInstance.eventSave.subscribe(spy);
    saveButton(element).click();
    const saved = spy.mock.calls[0][0] as SolarisEventSaveRequest;
    const draft = saved.event as SolarisCalendarEvent;
    expect(draft.start).toBe('2026-10-20');
    expect(draft.end).toBe('2026-10-22');
    expect(draft.allDay).toBe(true);
  });

  it('blocks save while the recurrence fields are incomplete', () => {
    const element = createFixture({
      event: { ...RECURRING, recurrence: { freq: 'weekly', count: 2 } },
    });
    const chips = Array.from(
      element.querySelectorAll('.solaris-calendar-event-editor__chip'),
    ) as HTMLButtonElement[];
    for (const chip of chips) {
      if (chip.getAttribute('aria-pressed') === 'true') chip.click();
    }
    fixture.detectChanges();
    expect(saveButton(element).disabled).toBe(true);
  });

  it('hides interval and ends until the custom frequency is selected', () => {
    const element = createFixture();
    expect(element.textContent).not.toContain('Repeat every');
    fixture.componentInstance['freq'].set('custom');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Repeat every',
    );
  });

  it('uses the radio-group component for the delete scope', () => {
    const element = createFixture({
      event: RECURRING,
      occurrenceStart: '2026-10-22T09:00:00-03:00',
    });
    expect(element.querySelector('solaris-radio-group')).not.toBeNull();
    expect(
      element.querySelectorAll('solaris-radio-group solaris-radio').length,
    ).toBe(3);
  });

  it('hydrates visibility and reminders into the draft', () => {
    const element = createFixture({
      event: {
        ...SINGLE,
        visibility: 'private',
        reminders: [{ minutesBefore: 5 }, { minutesBefore: 30 }],
      },
    });
    expect(
      element.querySelectorAll('.solaris-calendar-event-editor__reminder-row')
        .length,
    ).toBe(2);
    const spy = vi.fn();
    fixture.componentInstance.eventSave.subscribe(spy);
    saveButton(element).click();
    const saved = spy.mock.calls[0][0] as SolarisEventSaveRequest;
    const draft = saved.event as SolarisCalendarEvent;
    expect(draft.visibility).toBe('private');
    expect(draft.reminders).toEqual([
      { minutesBefore: 5 },
      { minutesBefore: 30 },
    ]);
  });

  it('emits the current zone as fallback when no dialog service is present', () => {
    createFixture();
    const spy = vi.fn();
    fixture.componentInstance.timeZoneChange.subscribe(spy);
    (
      fixture.componentInstance as unknown as { onTimeZoneChange: () => void }
    ).onTimeZoneChange();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe('America/Sao_Paulo');
  });

  it('hides the scope radios for non-recurring events and saves with scope all', () => {
    const element = createFixture({ event: SINGLE });
    expect(element.querySelector('solaris-radio-group')).toBeNull();
    const spy = vi.fn();
    fixture.componentInstance.eventSave.subscribe(spy);
    saveButton(element).click();
    const saved = spy.mock.calls[0][0] as SolarisEventSaveRequest;
    expect(saved.scope).toBe('all');
    expect(saved.occurrenceStart).toBeNull();
  });

  it('hides the scope radios for recurring series without an occurrence', () => {
    const element = createFixture({ event: RECURRING });
    expect(element.querySelector('solaris-radio-group')).toBeNull();
    const spy = vi.fn();
    fixture.componentInstance.eventSave.subscribe(spy);
    saveButton(element).click();
    const saved = spy.mock.calls[0][0] as SolarisEventSaveRequest;
    expect(saved.scope).toBe('all');
  });

  it('emits the selected scope with save for an edited occurrence', () => {
    const element = createFixture({
      event: RECURRING,
      occurrenceStart: '2026-10-22T09:00:00-03:00',
    });
    expect(element.querySelector('solaris-radio-group')).not.toBeNull();
    const radios = Array.from(
      element.querySelectorAll('solaris-radio-group solaris-radio'),
    );
    expect(radios.length).toBe(3);
    const followingInput = radios[1].querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
    followingInput.click();
    fixture.detectChanges();
    const spy = vi.fn();
    fixture.componentInstance.eventSave.subscribe(spy);
    saveButton(element).click();
    expect(spy).toHaveBeenCalledTimes(1);
    const saved = spy.mock.calls[0][0] as SolarisEventSaveRequest;
    expect(saved.scope).toBe('following');
    expect(saved.occurrenceStart).toBe('2026-10-22T09:00:00-03:00');
    expect((saved.event as SolarisCalendarEvent).id).toBe('standup');
  });
});
