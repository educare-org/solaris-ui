import { TestBed, ComponentFixture } from '@angular/core/testing';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisDialogRef } from '../../../service/dialog-ref';
import { SOLARIS_DIALOG_REF } from '../../../token/dialog-data.token';
import { SolarisDialogActionsComponent } from '../component/dialog-actions.component';
import type { SolarisDialogAction } from '../../root/model/dialog.types';

function createDialogRef(): SolarisDialogRef<string> {
  return new SolarisDialogRef<string>('test-actions');
}

function createFixture(
  actions: SolarisDialogAction<string>[],
  align?: string,
  stack?: string,
): ComponentFixture<SolarisDialogActionsComponent> {
  configureSolarisTesting();
  TestBed.configureTestingModule({
    providers: [
      ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      { provide: SOLARIS_DIALOG_REF, useValue: createDialogRef() },
    ],
  });

  const fixture = TestBed.createComponent(SolarisDialogActionsComponent);
  fixture.componentRef.setInput('actions', actions);
  if (align) {
    fixture.componentRef.setInput('align', align as never);
  }
  if (stack) {
    fixture.componentRef.setInput('stack', stack as never);
  }
  fixture.detectChanges();
  return fixture;
}

describe('SolarisDialogActionsComponent', () => {
  it('should create', () => {
    const fixture = createFixture([]);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not render buttons when actions array is empty', () => {
    const fixture = createFixture([]);
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'button',
    );
    expect(buttons).toHaveLength(0);
  });

  it('should render buttons for each action', () => {
    const fixture = createFixture([{ label: 'Cancel' }, { label: 'Confirm' }]);
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'button',
    );
    expect(buttons).toHaveLength(2);
    expect(buttons[0].textContent?.trim()).toBe('Cancel');
    expect(buttons[1].textContent?.trim()).toBe('Confirm');
  });

  it('should have solaris-button directive on each button', () => {
    const fixture = createFixture([{ label: 'Cancel' }, { label: 'Confirm' }]);
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[solaris-button]',
    );
    expect(buttons).toHaveLength(2);
  });

  it('should emit actionExecuted when a button is clicked', () => {
    const fixture = createFixture([{ label: 'Click Me' }]);
    const spy = vi.fn();
    fixture.componentInstance.actionExecuted.subscribe(spy);

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    )!;
    button.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Click Me' }),
    );
  });

  it('should call action callback when action has an action function', () => {
    const actionFn = vi.fn();
    const fixture = createFixture([{ label: 'Action', action: actionFn }]);

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    )!;
    button.click();
    expect(actionFn).toHaveBeenCalledTimes(1);
  });

  it('should close dialog when action has close=true', () => {
    const ref = createDialogRef();
    const closeSpy = vi.spyOn(ref, 'close');

    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
        { provide: SOLARIS_DIALOG_REF, useValue: ref },
      ],
    });

    const fixture = TestBed.createComponent(SolarisDialogActionsComponent);
    fixture.componentRef.setInput('actions', [
      { label: 'Close', close: true, result: 'closed-value' },
    ]);
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    )!;
    button.click();
    expect(closeSpy).toHaveBeenCalledWith('closed-value');
  });

  it('should not close dialog when action has close=false', () => {
    const ref = createDialogRef();
    const closeSpy = vi.spyOn(ref, 'close');

    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
        { provide: SOLARIS_DIALOG_REF, useValue: ref },
      ],
    });

    const fixture = TestBed.createComponent(SolarisDialogActionsComponent);
    fixture.componentRef.setInput('actions', [
      { label: 'No Close', close: false },
    ]);
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    )!;
    button.click();
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should not crash when action callback returns a promise', () => {
    const fixture = createFixture([
      { label: 'Async', action: () => Promise.resolve() },
    ]);

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    )!;
    expect(() => button.click()).not.toThrow();
  });

  it('should set host data-align attribute', () => {
    const fixture = createFixture([{ label: 'Test' }], 'center');
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-align')).toBe('center');
  });

  it('should set host data-stack attribute', () => {
    const fixture = createFixture([{ label: 'Test' }], undefined, 'vertical');
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-stack')).toBe('vertical');
  });

  it('should default data-align to end', () => {
    const fixture = createFixture([{ label: 'Test' }]);
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-align')).toBe('end');
  });

  it('should default data-stack to auto', () => {
    const fixture = createFixture([{ label: 'Test' }]);
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-stack')).toBe('auto');
  });

  it('should set data-separator by default', () => {
    const fixture = createFixture([{ label: 'Test' }]);
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-separator')).toBe('');
  });

  it('should remove data-separator when separator is false', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
        { provide: SOLARIS_DIALOG_REF, useValue: createDialogRef() },
      ],
    });

    const fixture = TestBed.createComponent(SolarisDialogActionsComponent);
    fixture.componentRef.setInput('actions', [{ label: 'Test' }]);
    fixture.componentRef.setInput('separator', false);
    fixture.detectChanges();

    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-separator')).toBeNull();
  });

  it('should resolve action labelKey via translations', () => {
    configureSolarisTesting({
      translate: {
        translations: { 'en-US': { 'dlg.ok': 'OK translated' } },
      },
    });
    TestBed.configureTestingModule({
      providers: [{ provide: SOLARIS_DIALOG_REF, useValue: createDialogRef() }],
    });

    const fixture = TestBed.createComponent(SolarisDialogActionsComponent);
    fixture.componentRef.setInput('actions', [
      { label: 'Ok', labelKey: 'dlg.ok' },
    ]);
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[solaris-button]',
    )!;
    expect(button.textContent?.trim()).toBe('OK translated');
  });

  it('should forward shape, radius, icon and loading to solaris-button', () => {
    const fixture = createFixture([
      {
        label: 'Confirm',
        shape: 'wide',
        radius: 'full',
        icon: 'check',
        loading: true,
      },
    ]);
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[solaris-button]',
    )!;
    expect(button.getAttribute('data-shape')).toBe('wide');
    expect(button.getAttribute('data-radius')).toBe('full');
    expect(button.getAttribute('data-loading')).toBe('');
  });

  it('should not set data-scrolled by default', () => {
    const fixture = createFixture([{ label: 'Ok' }]);
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-scrolled')).toBeNull();
  });

  it('should set data-scrolled when scrolled input is true', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
        { provide: SOLARIS_DIALOG_REF, useValue: createDialogRef() },
      ],
    });

    const fixture = TestBed.createComponent(SolarisDialogActionsComponent);
    fixture.componentRef.setInput('actions', [{ label: 'Ok' }]);
    fixture.componentRef.setInput('scrolled', true);
    fixture.detectChanges();

    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-scrolled')).toBe('');
  });

  it('should set data-scrolled while the scroll parent has content below', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
        { provide: SOLARIS_DIALOG_REF, useValue: createDialogRef() },
      ],
    });

    const fixture = TestBed.createComponent(SolarisDialogActionsComponent);
    fixture.componentRef.setInput('actions', [{ label: 'Ok' }]);
    const hostEl = fixture.nativeElement as HTMLElement;
    const scrollParent = hostEl.parentElement as HTMLElement;
    const prevOverflowY = scrollParent.style.overflowY;
    const prevScrollTop = scrollParent.scrollTop;
    const prevClientHeight = Object.getOwnPropertyDescriptor(
      scrollParent,
      'clientHeight',
    );
    const prevScrollHeight = Object.getOwnPropertyDescriptor(
      scrollParent,
      'scrollHeight',
    );
    scrollParent.style.overflowY = 'auto';
    try {
      mockScrollMetrics(scrollParent, {
        scrollTop: 0,
        clientHeight: 400,
        scrollHeight: 1000,
      });
      fixture.detectChanges();

      expect(hostEl.getAttribute('data-scrolled')).toBe('');

      scrollParent.scrollTop = 600;
      scrollParent.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(hostEl.getAttribute('data-scrolled')).toBeNull();
    } finally {
      scrollParent.style.overflowY = prevOverflowY;
      scrollParent.scrollTop = prevScrollTop;
      restoreScrollMetrics(scrollParent, prevClientHeight, prevScrollHeight);
    }
  });
});

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

function restoreScrollMetrics(
  element: HTMLElement,
  clientHeight: PropertyDescriptor | undefined,
  scrollHeight: PropertyDescriptor | undefined,
): void {
  if (clientHeight) {
    Object.defineProperty(element, 'clientHeight', clientHeight);
  } else {
    Reflect.deleteProperty(element, 'clientHeight');
  }
  if (scrollHeight) {
    Object.defineProperty(element, 'scrollHeight', scrollHeight);
  } else {
    Reflect.deleteProperty(element, 'scrollHeight');
  }
}
