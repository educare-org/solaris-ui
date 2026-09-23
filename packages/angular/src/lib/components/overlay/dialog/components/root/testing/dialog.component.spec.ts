import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisDialogRef } from '../../../service/dialog-ref';
import { SOLARIS_DIALOG_REF } from '../../../token/dialog-data.token';
import { SolarisDialogComponent } from '../component/dialog.component';
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
      ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
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

function mockScrollMetrics(
  element: HTMLElement,
  metrics: { scrollTop: number; clientHeight: number; scrollHeight: number },
): void {
  element.scrollTop = metrics.scrollTop;
  Object.defineProperty(element, 'clientHeight', {
    value: metrics.clientHeight,
    configurable: true,
  });
  Object.defineProperty(element, 'scrollHeight', {
    value: metrics.scrollHeight,
    configurable: true,
  });
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

  it('should set data-separator on header by default', () => {
    const fixture = createFixture({ title: 'Test' });
    const headerEl = q(fixture, 'solaris-dialog-header');
    expect(headerEl?.getAttribute('data-separator')).toBe('');
  });

  it('should remove data-separator from header when headerSeparator is false', () => {
    const fixture = createFixture({ title: 'Test', headerSeparator: false });
    const headerEl = q(fixture, 'solaris-dialog-header');
    expect(headerEl?.getAttribute('data-separator')).toBeNull();
  });

  it('should set data-separator on actions by default', () => {
    const fixture = createFixture({
      title: 'Test',
      actions: [{ label: 'Ok', close: true }],
    });
    const actionsEl = q(fixture, 'solaris-dialog-actions');
    expect(actionsEl?.getAttribute('data-separator')).toBe('');
  });

  it('should remove data-separator from actions when footerSeparator is false', () => {
    const fixture = createFixture({
      title: 'Test',
      actions: [{ label: 'Ok', close: true }],
      footerSeparator: false,
    });
    const actionsEl = q(fixture, 'solaris-dialog-actions');
    expect(actionsEl?.getAttribute('data-separator')).toBeNull();
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

  it('should render the close button inside the header by default', () => {
    const fixture = createFixture({ title: 'Test' });
    const closeBtn = q(fixture, '.solaris-dialog-header__close');
    expect(closeBtn).toBeTruthy();
    expect(closeBtn?.getAttribute('aria-label')).toBe('Close');
  });

  it('should hide the close button when closeable is false', () => {
    const fixture = createFixture({ title: 'Test', closeable: false });
    expect(q(fixture, '[data-dialog-close]')).toBeFalsy();
  });

  it('should use a custom close label', () => {
    const fixture = createFixture({ title: 'Test', closeLabel: 'Fechar' });
    expect(q(fixture, '[data-dialog-close]')?.getAttribute('aria-label')).toBe(
      'Fechar',
    );
  });

  it('should mark actions as scrolled while the body has content below', () => {
    const fixture = createFixture({
      title: 'Test',
      actions: [{ label: 'Ok', close: true }],
    });
    const body = q(fixture, '.solaris-dialog__body') as HTMLElement;
    mockScrollMetrics(body, {
      scrollTop: 0,
      clientHeight: 400,
      scrollHeight: 1000,
    });
    body.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    const actionsEl = q(fixture, 'solaris-dialog-actions');
    expect(actionsEl?.getAttribute('data-scrolled')).toBe('');

    body.scrollTop = 600;
    body.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(actionsEl?.getAttribute('data-scrolled')).toBeNull();
  });

  it('should not render actions when actions array is empty', () => {
    const fixture = createFixture({ title: 'Test', actions: [] });
    const actionsEl = q(fixture, 'solaris-dialog-actions');
    expect(actionsEl).toBeFalsy();
  });

  it('should resolve titleKey and descriptionKey via translations', () => {
    configureSolarisTesting(
      {
        translate: {
          translations: {
            'en-US': {
              'dlg.title': 'Translated Title',
              'dlg.desc': 'Translated Description',
            },
          },
        },
      },
      {
        imports: [TestHostComponent],
        providers: [
          ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
          {
            provide: SOLARIS_DIALOG_REF,
            useValue: new SolarisDialogRef<string>('test-id'),
          },
        ],
      },
    );

    const host = TestBed.createComponent(TestHostComponent);
    host.componentInstance.options = {
      titleKey: 'dlg.title',
      descriptionKey: 'dlg.desc',
    };
    host.detectChanges();

    expect(q(host, '.solaris-dialog-header__title')?.textContent?.trim()).toBe(
      'Translated Title',
    );
    expect(
      q(host, '.solaris-dialog-header__description')?.textContent?.trim(),
    ).toBe('Translated Description');
  });
});
