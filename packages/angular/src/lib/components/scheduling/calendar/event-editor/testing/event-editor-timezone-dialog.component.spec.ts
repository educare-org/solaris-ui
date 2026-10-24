import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';
import {
  SOLARIS_DIALOG_DATA,
  SOLARIS_DIALOG_REF,
} from '../../../../overlay/dialog/token/dialog-data.token';
import {
  SolarisEventEditorTimezoneDialogComponent,
  type SolarisEventEditorTimezoneData,
  type SolarisEventEditorTimezoneResult,
} from '../component/event-editor-timezone-dialog.component';

const DATA: SolarisEventEditorTimezoneData = {
  current: 'America/Sao_Paulo',
  endCurrent: 'America/Sao_Paulo',
  separate: false,
  locale: 'pt-BR',
  options: ['America/Sao_Paulo', 'Europe/Lisbon', 'UTC'],
};

describe('SolarisEventEditorTimezoneDialogComponent', () => {
  let fixture: ComponentFixture<SolarisEventEditorTimezoneDialogComponent>;

  const createFixture = (
    data: SolarisEventEditorTimezoneData = DATA,
  ): HTMLElement => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const close = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: SOLARIS_DIALOG_DATA, useValue: data },
        { provide: SOLARIS_DIALOG_REF, useValue: { close } },
      ],
    });
    fixture = TestBed.createComponent(
      SolarisEventEditorTimezoneDialogComponent,
    );
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const instance = (): SolarisEventEditorTimezoneDialogComponent =>
    fixture.componentInstance;

  const dialogRef = (): { close: ReturnType<typeof vi.fn> } =>
    TestBed.inject(SOLARIS_DIALOG_REF) as unknown as {
      close: ReturnType<typeof vi.fn>;
    };

  const saveButton = (element: HTMLElement): HTMLButtonElement => {
    const buttons = Array.from(element.querySelectorAll('button'));
    const found = buttons.find((button) =>
      /Save|Salvar|Guardar/.test(button.textContent ?? ''),
    );
    if (!found) throw new Error('save button not found');
    return found as HTMLButtonElement;
  };

  it('renders two searchable selects with every option', () => {
    const element = createFixture();
    const selects = Array.from(element.querySelectorAll('solaris-select'));
    expect(selects.length).toBe(2);
    expect(
      (
        instance() as unknown as {
          choices: () => Array<{ zone: string }>;
        }
      )
        .choices()
        .map((choice) => choice.zone),
    ).toEqual(['America/Sao_Paulo', 'Europe/Lisbon', 'UTC']);
  });

  const endSelectDisabled = (index: number): boolean => {
    const selects = fixture.debugElement.queryAll(
      (debug) =>
        debug.nativeElement instanceof HTMLElement &&
        (debug.nativeElement as HTMLElement).tagName === 'SOLARIS-SELECT',
    );
    const component = selects[index]?.componentInstance as unknown as
      | { disabledInput: () => boolean }
      | undefined;
    return component?.disabledInput() ?? false;
  };

  it('keeps the end select disabled with the start value mirrored', () => {
    createFixture();
    expect(endSelectDisabled(1)).toBe(true);
    expect(
      (instance() as unknown as { endValue: () => string }).endValue(),
    ).toBe('America/Sao_Paulo');
  });

  it('enables the end select once separate zones are checked', () => {
    const element = createFixture();
    const checkbox = element.querySelector(
      'solaris-checkbox input[type="checkbox"]',
    ) as HTMLInputElement;
    checkbox.click();
    fixture.detectChanges();
    expect(endSelectDisabled(1)).toBe(false);
  });

  it('closes with null on cancel', () => {
    const element = createFixture();
    const buttons = Array.from(element.querySelectorAll('button'));
    const cancel = buttons.find((button) =>
      /Cancel|Cancelar/.test(button.textContent ?? ''),
    );
    if (!cancel) throw new Error('cancel button not found');
    cancel.click();
    expect(dialogRef().close).toHaveBeenCalledWith(null);
  });

  it('closes with a single zone when zones are not separate', () => {
    const element = createFixture();
    (
      instance() as unknown as {
        choose: (value: unknown) => void;
      }
    ).choose('Europe/Lisbon');
    fixture.detectChanges();
    saveButton(element).click();
    expect(dialogRef().close).toHaveBeenCalledWith({
      start: 'Europe/Lisbon',
      end: null,
    } satisfies SolarisEventEditorTimezoneResult);
  });

  it('closes with both zones when zones are separate', () => {
    const element = createFixture();
    const component = instance() as unknown as {
      choose: (value: unknown) => void;
      chooseEnd: (value: unknown) => void;
      onToggleSeparate: (value: boolean) => void;
    };
    component.onToggleSeparate(true);
    component.choose('Europe/Lisbon');
    component.chooseEnd('UTC');
    fixture.detectChanges();
    saveButton(element).click();
    expect(dialogRef().close).toHaveBeenCalledWith({
      start: 'Europe/Lisbon',
      end: 'UTC',
    } satisfies SolarisEventEditorTimezoneResult);
  });

  it('swaps the start and end zones', () => {
    createFixture();
    const component = instance() as unknown as {
      choose: (value: unknown) => void;
      chooseEnd: (value: unknown) => void;
      onToggleSeparate: (value: boolean) => void;
      onSwap: () => void;
      selected: () => string;
      selectedEnd: () => string;
    };
    component.onToggleSeparate(true);
    component.choose('Europe/Lisbon');
    component.chooseEnd('UTC');
    component.onSwap();
    expect(component.selected()).toBe('UTC');
    expect(component.selectedEnd()).toBe('Europe/Lisbon');
  });
});
