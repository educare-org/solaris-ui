import { TestBed } from '@angular/core/testing';

import { SolarisToastService } from './toast.service';
import { provideSolaris } from '../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../services/icon/icons/solaris-built-in-icons';

describe('SolarisToastService', () => {
  let service: SolarisToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris(),
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });
    service = TestBed.inject(SolarisToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('show should create a toast entry', () => {
    const ref = service.show({ title: 'Test' });
    expect(ref.id).toBeTruthy();
    expect(service.entries().length).toBe(1);
  });

  it('success should set variant to success', () => {
    const ref = service.success({ title: 'OK' });
    const entry = service.entries()[0];
    expect(entry.resolvedVariant).toBe('success');
  });

  it('info should set variant to info', () => {
    service.info({ title: 'Info' });
    expect(service.entries()[0].resolvedVariant).toBe('info');
  });

  it('warning should set variant to warning', () => {
    service.warning({ title: 'Warn' });
    expect(service.entries()[0].resolvedVariant).toBe('warning');
  });

  it('danger should set variant to danger', () => {
    service.danger({ title: 'Danger' });
    expect(service.entries()[0].resolvedVariant).toBe('danger');
  });

  it('loading should set variant to loading', () => {
    service.loading({ title: 'Loading' });
    expect(service.entries()[0].resolvedVariant).toBe('loading');
  });

  it('neutral should set variant to neutral', () => {
    service.neutral({ title: 'Neutral' });
    expect(service.entries()[0].resolvedVariant).toBe('neutral');
  });

  it('dismiss should remove toast by id', () => {
    const ref = service.show({ title: 'Test' });
    expect(service.entries().length).toBe(1);
    service.dismiss(ref.id);
    expect(service.entries().length).toBe(0);
  });

  it('dismissAll should remove all toasts', () => {
    service.show({ title: 'A' });
    service.show({ title: 'B' });
    expect(service.entries().length).toBe(2);
    service.dismissAll();
    expect(service.entries().length).toBe(0);
  });

  it('update should modify existing toast', () => {
    const ref = service.show({ title: 'Original' });
    service.update(ref.id, { title: 'Updated' });
    const entry = service.entries()[0];
    expect(entry.options.title).toBe('Updated');
  });

  it('should not auto-dismiss persistent toasts', () => {
    service.show({
      title: 'Persistent',
      persistent: true,
      duration: 100,
    });
    expect(service.entries().length).toBe(1);
    const entry = service.entries()[0];
    expect(entry.resolvedPersistent).toBe(true);
    expect(entry.resolvedDuration).toBe(Infinity);
  });

  it('should treat duration 0 as persistent', () => {
    service.show({ title: 'Zero', duration: 0 });
    const entry = service.entries()[0];
    expect(entry.resolvedPersistent).toBe(true);
  });

  it('should allow per-toast appearance override', () => {
    service.show({ title: 'Surface', appearance: 'surface' });
    service.show({ title: 'Outline', appearance: 'outline' });
    const entries = service.entries();
    const surface = entries.find((e) => e.resolvedAppearance === 'surface');
    const outline = entries.find((e) => e.resolvedAppearance === 'outline');
    expect(surface).toBeTruthy();
    expect(outline).toBeTruthy();
  });

  it('should resolve role as alert for danger', () => {
    service.danger({ title: 'Danger' });
    expect(service.entries()[0].resolvedRole).toBe('alert');
  });

  it('should resolve aria-live as assertive for warning', () => {
    service.warning({ title: 'Warning' });
    expect(service.entries()[0].resolvedAriaLive).toBe('assertive');
  });

  it('should resolve role as status for neutral', () => {
    service.neutral({ title: 'Neutral' });
    expect(service.entries()[0].resolvedRole).toBe('status');
  });

  it('should resolve aria-live as polite for info', () => {
    service.info({ title: 'Info' });
    expect(service.entries()[0].resolvedAriaLive).toBe('polite');
  });

  it('should allow aria override', () => {
    service.show({
      title: 'Custom Aria',
      ariaLive: 'off',
      role: 'status',
    });
    const entry = service.entries()[0];
    expect(entry.resolvedAriaLive).toBe('off');
    expect(entry.resolvedRole).toBe('status');
  });

  it('should resolve closeable default to true', () => {
    service.show({ title: 'Test' });
    expect(service.entries()[0].resolvedCloseable).toBe(true);
  });

  it('should allow closeable=false', () => {
    service.show({ title: 'No Close', closeable: false });
    expect(service.entries()[0].resolvedCloseable).toBe(false);
  });

  it('should default size to md and countdown to text', () => {
    service.show({ title: 'Test' });
    const entry = service.entries()[0];
    expect(entry.resolvedSize).toBe('md');
    expect(entry.resolvedCountdown).toBe('text');
  });

  it('should resolve per-toast size and countdown override', () => {
    service.show({ title: 'Test', size: 'lg', countdown: 'text' });
    const entry = service.entries()[0];
    expect(entry.resolvedSize).toBe('lg');
    expect(entry.resolvedCountdown).toBe('text');
  });

  it('should generate ids via nextIdFor', () => {
    const a = service.show({ title: 'A' });
    const b = service.show({ title: 'B' });
    expect(a.id).toContain('solaris-toast-');
    expect(b.id).toContain('solaris-toast-');
    expect(a.id).not.toBe(b.id);
  });

  it('promise should resolve to success toast', async () => {
    const ref = service.promise(Promise.resolve('ok'), {
      loading: { title: 'Loading' },
      success: { title: 'Done', variant: 'success' },
      error: { title: 'Fail', variant: 'danger' },
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(service.entries().length).toBe(1);
    expect(service.entries()[0].id).toBe(ref.id);
  });
});

describe('SolarisToastService - with custom config', () => {
  let service: SolarisToastService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({
          toast: { limit: 2, appearance: 'outline' },
          icons: { extraIcons: SOLARIS_BUILT_IN_ICONS },
        }),
      ],
    });
    service = TestBed.inject(SolarisToastService);
  });

  it('should respect limit config', () => {
    service.show({ title: 'A' });
    service.show({ title: 'B' });
    service.show({ title: 'C' });
    expect(service.entries().length).toBe(2);
  });

  it('should resolve default appearance from config', () => {
    service.show({ title: 'Test' });
    expect(service.entries()[0].resolvedAppearance).toBe('outline');
  });
});
