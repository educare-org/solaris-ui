import { TestBed, ComponentFixture } from '@angular/core/testing';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { provideSolarisIcons } from '../../../../../../services/icon/provider/provide-solaris-icons';
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
    closeable: boolean;
    closeLabel: string;
    iconDecorative: boolean;
    size: string;
    variant: string;
  }>,
): ComponentFixture<SolarisDialogHeaderComponent> {
  configureSolarisTesting();
  TestBed.configureTestingModule({
    providers: [
      ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
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
  if (inputs.closeable !== undefined)
    fixture.componentRef.setInput('closeable', inputs.closeable);
  if (inputs.closeLabel !== undefined)
    fixture.componentRef.setInput('closeLabel', inputs.closeLabel);
  if (inputs.iconDecorative !== undefined)
    fixture.componentRef.setInput('iconDecorative', inputs.iconDecorative);
  if (inputs.size !== undefined)
    fixture.componentRef.setInput('size', inputs.size);
  if (inputs.variant !== undefined)
    fixture.componentRef.setInput('variant', inputs.variant);
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
    expect(titleEl?.id).toBe('solaris-dialog-title');
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
    expect(descEl?.id).toBe('solaris-dialog-description');
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

  it('should call dialogRef.close when close button is clicked', () => {
    const ref = createDialogRef();
    const closeSpy = vi.spyOn(ref, 'close');

    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
        { provide: SOLARIS_DIALOG_REF, useValue: ref },
      ],
    });

    const fixture = TestBed.createComponent(SolarisDialogHeaderComponent);
    fixture.componentRef.setInput('title', 'Test');
    fixture.detectChanges();

    const closeBtn = q(fixture, '.solaris-dialog-header__close') as HTMLElement;
    closeBtn.click();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should set aria-label on close button', () => {
    const fixture = createFixture({ title: 'Test', closeLabel: 'Fechar' });
    const closeBtn = q(fixture, '.solaris-dialog-header__close');
    expect(closeBtn?.getAttribute('aria-label')).toBe('Fechar');
  });

  it('should set aria-label default to Close', () => {
    const fixture = createFixture({ title: 'Test' });
    const closeBtn = q(fixture, '.solaris-dialog-header__close');
    expect(closeBtn?.getAttribute('aria-label')).toBe('Close');
  });

  it('should set data-size on close button', () => {
    const fixture = createFixture({ title: 'Test', size: 'lg' });
    const closeBtn = q(fixture, '.solaris-dialog-header__close');
    expect(closeBtn?.getAttribute('data-size')).toBe('lg');
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
