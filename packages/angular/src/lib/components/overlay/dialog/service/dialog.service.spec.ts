import { TestBed } from '@angular/core/testing';
import { Component, inject } from '@angular/core';
import { provideSolarisIcons } from '../../../../services/icon/provider/provide-solaris-icons';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../services/icon/icons/solaris-built-in-icons';
import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';

import { SolarisDialogService } from './dialog.service';
import { provideSolarisDialog } from '../provider/provide-solaris-dialog';
import { SolarisDialogRef } from './dialog-ref';
import { SOLARIS_DIALOG_DATA } from '../token/dialog-data.token';
import { SOLARIS_DIALOG_REF } from '../token/dialog-data.token';

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

describe('SolarisDialogService', () => {
  let service: SolarisDialogService;

  beforeEach(() => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolarisDialog(),
        ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
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
});
