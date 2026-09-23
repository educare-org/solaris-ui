import { TestBed, ComponentFixture } from '@angular/core/testing';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisDialogRef } from '../../../service/dialog-ref';
import { SOLARIS_DIALOG_REF } from '../../../token/dialog-data.token';
import { SolarisDialogHeaderComponent } from '../component/dialog-header.component';

function createDialogRef(): SolarisDialogRef {
  return new SolarisDialogRef('test-header');
}

function q(
  fixture: ComponentFixture<unknown>,
  selector: string,
): HTMLElement | null {
  return (fixture.nativeElement as HTMLElement).querySelector(selector);
}

function createFixture(
  inputs: Partial<{
    icon: string;
    title: string;
    description: string;
    iconDecorative: boolean;
    variant: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
    separator: boolean;
    closeable: boolean;
    closeLabel: string;
    scrolled: boolean;
  }>,
): ComponentFixture<SolarisDialogHeaderComponent> {
  configureSolarisTesting();
  TestBed.configureTestingModule({
    providers: [
      ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      { provide: SOLARIS_DIALOG_REF, useValue: createDialogRef() },
    ],
  });

  const fixture = TestBed.createComponent(SolarisDialogHeaderComponent);
  if (inputs.icon !== undefined)
    fixture.componentRef.setInput('icon', inputs.icon);
  if (inputs.title !== undefined)
    fixture.componentRef.setInput('title', inputs.title);
  if (inputs.description !== undefined)
    fixture.componentRef.setInput('description', inputs.description);
  if (inputs.iconDecorative !== undefined)
    fixture.componentRef.setInput('iconDecorative', inputs.iconDecorative);
  if (inputs.variant !== undefined)
    fixture.componentRef.setInput('variant', inputs.variant);
  if (inputs.separator !== undefined)
    fixture.componentRef.setInput('separator', inputs.separator);
  if (inputs.closeable !== undefined)
    fixture.componentRef.setInput('closeable', inputs.closeable);
  if (inputs.closeLabel !== undefined)
    fixture.componentRef.setInput('closeLabel', inputs.closeLabel);
  if (inputs.scrolled !== undefined)
    fixture.componentRef.setInput('scrolled', inputs.scrolled);
  fixture.detectChanges();
  return fixture;
}

describe('SolarisDialogHeaderComponent', () => {
  it('should create', () => {
    const fixture = createFixture({});
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render title when provided', () => {
    const fixture = createFixture({ title: 'Dialog Title' });
    const titleEl = q(fixture, '.solaris-dialog-header__title');
    expect(titleEl).toBeTruthy();
    expect(titleEl?.textContent?.trim()).toBe('Dialog Title');
    expect(titleEl?.id).toBe('test-header-title');
  });

  it('should derive title id from the dialog ref id', () => {
    const fixture = createFixture({ title: 'Dialog Title' });
    const titleEl = q(fixture, '.solaris-dialog-header__title');
    expect(titleEl?.id).toBe('test-header-title');
  });

  it('should generate unique ids when no dialog ref is provided', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    const first = TestBed.createComponent(SolarisDialogHeaderComponent);
    first.componentRef.setInput('title', 'First');
    first.detectChanges();
    const second = TestBed.createComponent(SolarisDialogHeaderComponent);
    second.componentRef.setInput('title', 'Second');
    second.detectChanges();

    const firstId = first.nativeElement.querySelector(
      '.solaris-dialog-header__title',
    )?.id;
    const secondId = second.nativeElement.querySelector(
      '.solaris-dialog-header__title',
    )?.id;
    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).not.toBe(secondId);
  });

  it('should not render title when not provided', () => {
    const fixture = createFixture({});
    const titleEl = q(fixture, '.solaris-dialog-header__title');
    expect(titleEl).toBeFalsy();
  });

  it('should render description when provided', () => {
    const fixture = createFixture({ description: 'Dialog Description' });
    const descEl = q(fixture, '.solaris-dialog-header__description');
    expect(descEl).toBeTruthy();
    expect(descEl?.textContent?.trim()).toBe('Dialog Description');
    expect(descEl?.id).toBe('test-header-description');
  });

  it('should not render description when not provided', () => {
    const fixture = createFixture({});
    const descEl = q(fixture, '.solaris-dialog-header__description');
    expect(descEl).toBeFalsy();
  });

  it('should render icon when provided', () => {
    const fixture = createFixture({ icon: 'info' });
    const iconEl = q(fixture, '.solaris-dialog-header__icon solaris-icon');
    expect(iconEl).toBeTruthy();
  });

  it('should not render icon when not provided', () => {
    const fixture = createFixture({});
    const iconEl = q(fixture, '.solaris-dialog-header__icon');
    expect(iconEl).toBeFalsy();
  });

  it('should not render a close button by default', () => {
    const fixture = createFixture({ title: 'Test' });
    const closeBtn = q(fixture, '[data-dialog-close]');
    expect(closeBtn).toBeNull();
  });

  it('should render an in-flow close button when closeable', () => {
    const fixture = createFixture({ title: 'Test', closeable: true });
    const closeBtn = q(
      fixture,
      '.solaris-dialog-header__row [data-dialog-close]',
    );
    expect(closeBtn).toBeTruthy();
    expect(closeBtn?.getAttribute('aria-label')).toBe('Close');
  });

  it('should use a custom close label', () => {
    const fixture = createFixture({
      title: 'Test',
      closeable: true,
      closeLabel: 'Fechar',
    });
    const closeBtn = q(fixture, '[data-dialog-close]');
    expect(closeBtn?.getAttribute('aria-label')).toBe('Fechar');
  });

  it('should close the dialog when the close button is clicked', () => {
    const ref = createDialogRef();
    const closeSpy = vi.spyOn(ref, 'close');

    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
        { provide: SOLARIS_DIALOG_REF, useValue: ref },
      ],
    });

    const fixture = TestBed.createComponent(SolarisDialogHeaderComponent);
    fixture.componentRef.setInput('title', 'Test');
    fixture.componentRef.setInput('closeable', true);
    fixture.detectChanges();

    const closeBtn = q(fixture, '[data-dialog-close]') as HTMLElement;
    closeBtn.click();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should not set data-scrolled by default', () => {
    const fixture = createFixture({ title: 'Test' });
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-scrolled')).toBeNull();
  });

  it('should set data-scrolled when scrolled input is true', () => {
    const fixture = createFixture({ title: 'Test', scrolled: true });
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-scrolled')).toBe('');
  });

  it('should set data-scrolled when the scroll parent is scrolled', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
        { provide: SOLARIS_DIALOG_REF, useValue: createDialogRef() },
      ],
    });

    const fixture = TestBed.createComponent(SolarisDialogHeaderComponent);
    fixture.componentRef.setInput('title', 'Test');
    const hostEl = fixture.nativeElement as HTMLElement;
    const scrollParent = hostEl.parentElement as HTMLElement;
    scrollParent.style.overflowY = 'auto';
    fixture.detectChanges();

    scrollParent.scrollTop = 48;
    scrollParent.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(hostEl.getAttribute('data-scrolled')).toBe('');
  });

  it('should set data-separator by default', () => {
    const fixture = createFixture({ title: 'Test' });
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-separator')).toBe('');
  });

  it('should remove data-separator when separator is false', () => {
    const fixture = createFixture({ title: 'Test', separator: false });
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-separator')).toBeNull();
  });

  it('should set host data-variant attribute', () => {
    const fixture = createFixture({ title: 'Test', variant: 'info' });
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-variant')).toBe('info');
  });

  it('should default host data-variant to neutral', () => {
    const fixture = createFixture({ title: 'Test' });
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-variant')).toBe('neutral');
  });

  it('should render icon as decorative when iconDecorative is true', () => {
    const fixture = createFixture({ icon: 'info', iconDecorative: true });
    const iconEl = q(fixture, 'solaris-icon');
    const svg = iconEl?.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('role')).toBe('presentation');
  });

  it('should render icon as non-decorative by default', () => {
    const fixture = createFixture({ icon: 'info' });
    const iconEl = q(fixture, 'solaris-icon');
    const svg = iconEl?.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
  });
});
