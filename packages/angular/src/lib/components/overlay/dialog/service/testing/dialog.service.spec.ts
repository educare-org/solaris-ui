import { TestBed } from '@angular/core/testing';
import { ApplicationRef, Component, inject } from '@angular/core';
import { provideSolaris } from '../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../services/icon/icons/solaris-built-in-icons';
import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';

import { SolarisDialogService } from '../dialog.service';
import { SolarisDialogRef } from '../dialog-ref';
import { SOLARIS_DIALOG_DATA } from '../../token/dialog-data.token';
import { SOLARIS_DIALOG_REF } from '../../token/dialog-data.token';

@Component({
  standalone: true,
  template: '<p>Test Component</p>',
})
class TestDialogComponent {
  readonly data = inject(SOLARIS_DIALOG_DATA, { optional: true });
  readonly dialogRef = inject<SolarisDialogRef>(SOLARIS_DIALOG_REF, {
    optional: true,
  });
}

function lastDialogContainer(): Element | null {
  const containers = document.querySelectorAll('.solaris-dialog-container');
  return containers.length > 0 ? containers[containers.length - 1] : null;
}

describe('SolarisDialogService', () => {
  let service: SolarisDialogService;

  beforeEach(() => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris(),
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });
    service = TestBed.inject(SolarisDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a simple dialog', () => {
    const ref = service.open({
      title: 'Test Dialog',
      description: 'Test description',
    });

    expect(ref).toBeTruthy();
    expect(ref.id).toContain('solaris-dialog-');
  });

  it('should return SolarisDialogRef from open()', () => {
    const ref = service.open({
      title: 'Test',
      actions: [{ label: 'OK', close: true }],
    });

    expect(ref).toBeInstanceOf(SolarisDialogRef);
  });

  it('should emit result via afterClosed when close is called', () =>
    new Promise<void>((done) => {
      const ref = service.open<string>({
        title: 'Test',
        actions: [],
      });

      ref.afterClosed().subscribe((result) => {
        expect(result).toBe('test-result');
        done();
      });

      ref.close('test-result');
    }));

  it('should emit undefined via afterClosed when close is called without result', () =>
    new Promise<void>((done) => {
      const ref = service.open({
        title: 'Test',
      });

      ref.afterClosed().subscribe((result) => {
        expect(result).toBeUndefined();
        done();
      });

      ref.close();
    }));

  it('should complete afterClosed after one emission', () => {
    const ref = service.open({ title: 'Test' });
    const spy = vi.fn();

    ref.afterClosed().subscribe(spy);
    ref.close('first');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('first');
  });

  it('should open a component dialog', () => {
    const ref = service.openComponent(TestDialogComponent, {
      data: { foo: 'bar' },
    });

    expect(ref).toBeTruthy();
    expect(ref).toBeInstanceOf(SolarisDialogRef);
  });

  it('should close component dialog via dialogRef', () =>
    new Promise<void>((done) => {
      const ref = service.openComponent(TestDialogComponent);

      ref.afterClosed().subscribe((result) => {
        expect(result).toBe('Pizza!');
        done();
      });

      ref.close('Pizza!');
    }));

  it('should support closeAll()', () => {
    const ref1 = service.open({ title: 'Dialog 1' });
    const ref2 = service.open({ title: 'Dialog 2' });

    const spy1 = vi.fn();
    const spy2 = vi.fn();

    ref1.afterClosed().subscribe(spy1);
    ref2.afterClosed().subscribe(spy2);

    service.closeAll();

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  it('should clean up overlay after close', () =>
    new Promise<void>((done) => {
      const ref = service.open({ title: 'Test' });

      ref.afterClosed().subscribe(() => {
        done();
      });

      ref.close();
    }));

  it('should open a dialog with bottom placement', () => {
    const ref = service.open({ title: 'Test', placement: 'bottom' });

    expect(ref).toBeTruthy();
    expect(ref).toBeInstanceOf(SolarisDialogRef);
  });

  it('should open a component dialog with bottom placement', () => {
    const ref = service.openComponent(TestDialogComponent, {
      placement: 'bottom',
    });

    expect(ref).toBeTruthy();
    expect(ref).toBeInstanceOf(SolarisDialogRef);
    ref.close();
  });

  it.each([
    'center',
    'top',
    'bottom',
    'left',
    'right',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ] as const)('should open a dialog with %s placement', (placement) => {
    const ref = service.open({ title: 'Test', placement });
    TestBed.inject(ApplicationRef).tick();

    const container = lastDialogContainer();
    expect(container?.getAttribute('data-placement')).toBe(placement);
    ref.close();
  });

  it('should apply default separators and radius', () => {
    const ref = service.open({ title: 'Test' });
    TestBed.inject(ApplicationRef).tick();

    const container = lastDialogContainer();
    expect(container?.getAttribute('data-header-separator')).toBe('');
    expect(container?.getAttribute('data-footer-separator')).toBe('');
    expect(container?.getAttribute('data-radius')).toBe('lg');
    expect(container?.getAttribute('data-appearance')).toBe('outline');
    ref.close();
  });

  it('should restore focus to the previously focused element on close', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Trigger';
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const ref = service.open({ title: 'Test', autoFocus: 'panel' });
    TestBed.inject(ApplicationRef).tick();
    expect(document.activeElement).not.toBe(trigger);

    ref.close();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('should not restore focus when restoreFocus is false', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Trigger';
    document.body.appendChild(trigger);
    trigger.focus();

    const ref = service.open({
      title: 'Test',
      autoFocus: 'panel',
      restoreFocus: false,
    });
    TestBed.inject(ApplicationRef).tick();
    expect(document.activeElement).not.toBe(trigger);

    ref.close();
    expect(document.activeElement).not.toBe(trigger);
    trigger.remove();
  });

  it('should respect headerSeparator, footerSeparator and radius options', () => {
    const ref = service.open({
      title: 'Test',
      headerSeparator: false,
      footerSeparator: false,
      radius: 'full',
    });
    TestBed.inject(ApplicationRef).tick();

    const container = lastDialogContainer();
    expect(container?.getAttribute('data-header-separator')).toBeNull();
    expect(container?.getAttribute('data-footer-separator')).toBeNull();
    expect(container?.getAttribute('data-radius')).toBe('full');
    ref.close();
  });

  it('should track stacked dialogs with the last opened as topmost', () => {
    const ref1 = service.open({ title: 'Outer' });
    const ref2 = service.open({ title: 'Inner' });

    expect(service.openCount).toBe(2);
    expect(service.topmostId()).toBe(ref2.id);
    expect(service.isTopmost(ref2)).toBe(true);
    expect(service.isTopmost(ref1)).toBe(false);

    ref2.close();
    expect(service.openCount).toBe(1);
    expect(service.topmostId()).toBe(ref1.id);
    expect(service.isTopmost(ref1)).toBe(true);

    ref1.close();
    expect(service.openCount).toBe(0);
    expect(service.topmostId()).toBeNull();
    expect(service.isTopmost(ref1)).toBe(false);
  });

  it('should hide stacked dialogs below the topmost from assistive technology', () => {
    const ref1 = service.open({ title: 'Outer' });
    TestBed.inject(ApplicationRef).tick();
    const ref2 = service.open({ title: 'Inner' });
    TestBed.inject(ApplicationRef).tick();

    const panels = document.querySelectorAll('.solaris-dialog-panel');
    expect(panels.length).toBe(2);
    expect(panels[0].getAttribute('aria-hidden')).toBe('true');
    expect(panels[1].getAttribute('aria-hidden')).toBeNull();

    ref2.close();
    TestBed.inject(ApplicationRef).tick();
    expect(panels[0].getAttribute('aria-hidden')).toBeNull();

    ref1.close();
  });

  it('should only close the topmost dialog on Escape', () => {
    const ref1 = service.open({ title: 'Outer' });
    TestBed.inject(ApplicationRef).tick();
    const ref2 = service.open({ title: 'Inner' });
    TestBed.inject(ApplicationRef).tick();

    const spy1 = vi.fn();
    const spy2 = vi.fn();
    ref1.afterClosed().subscribe(spy1);
    ref2.afterClosed().subscribe(spy2);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    TestBed.inject(ApplicationRef).tick();

    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy1).not.toHaveBeenCalled();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    TestBed.inject(ApplicationRef).tick();

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(service.openCount).toBe(0);
  });

  it('should render data-sheet for edge-docked sheet dialogs', () => {
    const ref = service.open({
      title: 'Sheet',
      placement: 'bottom',
      sheet: true,
    });
    TestBed.inject(ApplicationRef).tick();

    const container = lastDialogContainer();
    expect(container?.getAttribute('data-sheet')).toBe('');
    expect(container?.getAttribute('data-placement')).toBe('bottom');
    ref.close();
  });

  it('should not render data-sheet for center dialogs', () => {
    const ref = service.open({ title: 'Test', sheet: true });
    TestBed.inject(ApplicationRef).tick();

    // `sheet` only docks edge placements; center keeps the floating panel.
    const container = lastDialogContainer();
    expect(container?.getAttribute('data-sheet')).toBeNull();
    expect(container?.getAttribute('data-placement')).toBe('center');
    ref.close();
  });
});
