import { SolarisDialogRef } from './dialog-ref';

describe('SolarisDialogRef', () => {
  it('should create with id', () => {
    const ref = new SolarisDialogRef<string>('test-id');
    expect(ref.id).toBe('test-id');
  });

  it('should emit result via afterClosed when close is called', () =>
    new Promise<void>((done) => {
      const ref = new SolarisDialogRef<string>('test-id');
      ref.afterClosed().subscribe((result) => {
        expect(result).toBe('Pizza!');
        done();
      });
      ref.close('Pizza!');
    }));

  it('should emit undefined when close is called without result', () =>
    new Promise<void>((done) => {
      const ref = new SolarisDialogRef('test-id');
      ref.afterClosed().subscribe((result) => {
        expect(result).toBeUndefined();
        done();
      });
      ref.close();
    }));

  it('should complete afterClosed after one emission', () => {
    const ref = new SolarisDialogRef('test-id');
    const spy = vi.fn();

    ref.afterClosed().subscribe(spy);
    ref.close('first');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('first');
  });

  it('should not emit again after complete', () => {
    const ref = new SolarisDialogRef('test-id');
    const spy = vi.fn();

    ref.afterClosed().subscribe(spy);
    ref.close('first');
    ref.close('second');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should allow setting componentInstance', () => {
    const ref = new SolarisDialogRef('test-id');
    const instance = { foo: 'bar' };
    ref.componentInstance = instance;
    expect(ref.componentInstance).toBe(instance);
  });
});
