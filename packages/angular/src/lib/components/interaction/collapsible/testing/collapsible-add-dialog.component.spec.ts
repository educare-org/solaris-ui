import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { vi } from 'vitest';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';

import {
  SOLARIS_DIALOG_DATA,
  SOLARIS_DIALOG_REF,
} from '../../../overlay/dialog/token/dialog-data.token';
import { SolarisCollapsibleAddDialogComponent } from '../dialog/component/collapsible-add-dialog.component';

describe('SolarisCollapsibleAddDialogComponent', () => {
  let fixture: ComponentFixture<SolarisCollapsibleAddDialogComponent>;
  let close: ReturnType<typeof vi.fn>;

  const setup = () => {
    TestBed.resetTestingModule();
    close = vi.fn();
    configureSolarisTesting(undefined, {
      providers: [
        {
          provide: SOLARIS_DIALOG_DATA,
          useValue: {
            iconOptions: [{ value: 'file-text', label: 'Document' }],
            title: 'Add section',
          },
        },
        { provide: SOLARIS_DIALOG_REF, useValue: { close } },
      ],
    });
    fixture = TestBed.createComponent(SolarisCollapsibleAddDialogComponent);
    fixture.detectChanges();
  };

  const getConfirm = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector(
      '.solaris-collapsible-add-dialog__footer-confirm, solaris-dialog-footer button:last-child',
    ) as HTMLButtonElement;

  const setField = (name: string, value: string): void => {
    const input = fixture.nativeElement.querySelector(
      `[formControlName="${name}"]`,
    ) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  it('should create', () => {
    setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should require title and description', () => {
    setup();
    expect(getConfirm().disabled).toBe(true);
    setField('label', 'New section');
    expect(getConfirm().disabled).toBe(true);
    setField('description', 'Section body');
    expect(getConfirm().disabled).toBe(false);
  });

  it('should close with the result and no icon by default', () => {
    setup();
    setField('label', '  New section  ');
    setField('description', 'Section body');
    getConfirm().click();
    fixture.detectChanges();
    expect(close).toHaveBeenCalledWith({
      label: 'New section',
      description: 'Section body',
      leadingIcon: null,
    });
  });

  it('should render the icon select with a none option', () => {
    setup();
    const select = fixture.nativeElement.querySelector(
      'solaris-select',
    ) as HTMLElement;
    expect(select).toBeTruthy();
    expect(select.textContent ?? '').toContain('Icon');
    const trigger = select.querySelector(
      '.solaris-select__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    const options = Array.from(document.querySelectorAll('solaris-option')).map(
      (el) => (el.textContent ?? '').replace(/\s+/g, ' ').trim(),
    );
    expect(options).toContain('None');
    expect(options).toContain('Document');
  });

  it('should show the icon inside each option', () => {
    setup();
    const trigger = fixture.nativeElement.querySelector(
      'solaris-select .solaris-select__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    const documentOption = Array.from(
      document.querySelectorAll('solaris-option'),
    ).find((el) => (el.textContent ?? '').includes('Document'));
    expect(documentOption).toBeTruthy();
    expect(documentOption?.querySelector('solaris-icon')).toBeTruthy();
  });

  it('should list all built-in icons when no options are provided', () => {
    TestBed.resetTestingModule();
    close = vi.fn();
    configureSolarisTesting(undefined, {
      providers: [
        {
          provide: SOLARIS_DIALOG_DATA,
          useValue: { iconOptions: [], title: 'Add section' },
        },
        { provide: SOLARIS_DIALOG_REF, useValue: { close } },
      ],
    });
    fixture = TestBed.createComponent(SolarisCollapsibleAddDialogComponent);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector(
      'solaris-select .solaris-select__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    const options = document.querySelectorAll('solaris-option');
    expect(options.length).toBeGreaterThan(100);
  });
});
