import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { provideSolarisIcons } from '../../../../services/icon/provider/provide-solaris-icons';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisDialogRef } from '../service/dialog-ref';
import { SOLARIS_DIALOG_REF } from '../token/dialog-data.token';
import { SolarisDialogComponent } from './dialog.component';
import type { SolarisDialogOptions } from '../model/dialog.types';

@Component({
  standalone: true,
  imports: [SolarisDialogComponent],
  template: '<solaris-dialog [options]="options" />',
})
class TestHostComponent {
  options: SolarisDialogOptions = { title: 'default' };
}

function createFixture(
  options: SolarisDialogOptions,
): ComponentFixture<TestHostComponent> {
  configureSolarisTesting();
  TestBed.configureTestingModule({
    providers: [
      ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
      {
        provide: SOLARIS_DIALOG_REF,
        useValue: new SolarisDialogRef<string>('test-id'),
      },
    ],
  });

  const host = TestBed.createComponent(TestHostComponent);
  host.componentInstance.options = options;
  host.detectChanges();
  return host;
}

function q(
  fixture: ComponentFixture<unknown>,
  selector: string,
): HTMLElement | null {
  return (fixture.nativeElement as HTMLElement).querySelector(selector);
}

describe('SolarisDialogComponent', () => {
  it('should render title', () => {
    const fixture = createFixture({ title: 'Test Title' });
    const titleEl = q(fixture, '.solaris-dialog-header__title');
    expect(titleEl).toBeTruthy();
    expect(titleEl!.textContent?.trim()).toBe('Test Title');
  });

  it('should render description', () => {
    const fixture = createFixture({ description: 'Test Description' });
    const descEl = q(fixture, '.solaris-dialog-header__description');
    expect(descEl).toBeTruthy();
    expect(descEl!.textContent?.trim()).toBe('Test Description');
  });

  it('should show close button by default', () => {
    const fixture = createFixture({ title: 'Test' });
    const closeBtn = q(fixture, '.solaris-dialog-header__close');
    expect(closeBtn).toBeTruthy();
  });

  it('should hide close button when closeable is false', () => {
    const fixture = createFixture({ title: 'Test', closeable: false });
    const closeBtn = q(fixture, '.solaris-dialog-header__close');
    expect(closeBtn).toBeFalsy();
  });

  it('should render actions with solaris-button directive', () => {
    const fixture = createFixture({
      title: 'Test',
      actions: [
        { label: 'Cancel', appearance: 'ghost', close: true },
        { label: 'Confirm', color: 'primary', close: true },
      ],
    });

    const buttons = fixture.nativeElement.querySelectorAll('[solaris-button]');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent?.trim()).toBe('Cancel');
    expect(buttons[1].textContent?.trim()).toBe('Confirm');
  });

  it('should render icon when provided', () => {
    const fixture = createFixture({ title: 'Test', icon: 'info' });
    const icon = q(fixture, 'solaris-icon');
    expect(icon).toBeTruthy();
  });

  it('should not render actions when actions array is empty', () => {
    const fixture = createFixture({ title: 'Test', actions: [] });
    const actionsEl = q(fixture, 'solaris-dialog-actions');
    expect(actionsEl).toBeFalsy();
  });
});
