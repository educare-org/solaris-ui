import { TestBed, ComponentFixture } from '@angular/core/testing';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisDialogRef } from '../../../service/dialog-ref';
import { SOLARIS_DIALOG_REF } from '../../../token/dialog-data.token';
import { SolarisDialogActionsComponent } from '../component/dialog-actions.component';
import type { SolarisDialogAction } from '../../root/model/dialog.types';

function createDialogRef(): SolarisDialogRef<string> {
  return new SolarisDialogRef<string>('test-split');
}

function createFixture(
  actions: SolarisDialogAction<string>[],
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
  fixture.detectChanges();
  return fixture;
}

describe('SolarisDialogActionsComponent split footer', () => {
  it('should not set data-split without start actions', () => {
    const fixture = createFixture([{ label: 'Cancel' }, { label: 'Confirm' }]);
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-split')).toBeNull();
    expect(hostEl.querySelector('.solaris-dialog-actions__group')).toBeNull();
  });

  it('should set data-split and group start/end actions', () => {
    const fixture = createFixture([
      { label: 'Back', position: 'start', close: true },
      { label: 'Help', close: true },
      { label: 'Verify', color: 'primary', close: true },
    ]);
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-split')).toBe('');

    const startGroup = hostEl.querySelector(
      '.solaris-dialog-actions__group--start',
    );
    const endGroup = hostEl.querySelector(
      '.solaris-dialog-actions__group--end',
    );
    expect(startGroup?.textContent?.trim()).toBe('Back');
    expect(endGroup?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Help Verify',
    );
  });

  it('should keep DOM order start group before end group', () => {
    const fixture = createFixture([
      { label: 'Verify', color: 'primary', close: true },
      { label: 'Back', position: 'start', close: true },
    ]);
    const groups = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.solaris-dialog-actions__group',
    );
    expect(groups).toHaveLength(2);
    expect(groups[0].className).toContain('--start');
    expect(groups[1].className).toContain('--end');
  });

  it('should keep buttons clickable in split mode', () => {
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
      { label: 'Back', position: 'start', close: true, result: 'back' },
      { label: 'Verify', close: true, result: 'verify' },
    ]);
    fixture.detectChanges();

    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'button',
    );
    expect(buttons).toHaveLength(2);
    (buttons[0] as HTMLElement).click();
    expect(closeSpy).toHaveBeenCalledWith('back');
  });
});

describe('SolarisDialogActionsComponent split styles', () => {
  let scss = '';

  beforeAll(async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, resolve } = await import('node:path');
    const here = dirname(fileURLToPath(import.meta.url));
    scss = readFileSync(
      resolve(here, '../component/dialog-actions.component.scss'),
      'utf8',
    );
  });

  it('should spread split groups with space-between', () => {
    expect(scss).toContain(':host([data-split])');
    expect(scss).toContain('justify-content: space-between');
  });

  it('should style groups as flex rows with token gap', () => {
    expect(scss).toContain('.solaris-dialog-actions__group');
    expect(scss).toContain('gap: var(--solaris-spacing-5)');
  });
});
