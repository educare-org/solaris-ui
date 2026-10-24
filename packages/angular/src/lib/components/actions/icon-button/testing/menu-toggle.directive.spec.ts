import { Component, signal } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { SolarisAnimatedIconComponent } from '../../../icon/component/solaris-animated-icon.component';
import { SolarisIconButtonDirective } from '../directives/icon-button.directive';
import { SolarisMenuToggleDirective } from '../directives/menu-toggle.directive';

@Component({
  standalone: true,
  imports: [
    SolarisAnimatedIconComponent,
    SolarisIconButtonDirective,
    SolarisMenuToggleDirective,
  ],
  template: `
    <button
      solaris-icon-button
      solaris-menu-toggle
      [solarisMenuToggleOpen]="open()"
      (solarisMenuToggleOpenChange)="open.set($event)"
      [solarisMenuToggleControls]="controls()"
      [solarisMenuToggleOpenLabel]="openLabel()"
      [solarisMenuToggleCloseLabel]="closeLabel()"
      [solarisMenuToggleOpenLabelKey]="openLabelKey()"
      [solarisMenuToggleCloseLabelKey]="closeLabelKey()"
      [disabled]="disabled()"
      [loading]="loading()"
    >
      <solaris-animated-icon
        name="menu"
        [active]="open()"
        [decorative]="true"
      />
    </button>
  `,
})
class TestHost {
  readonly open = signal(false);
  readonly controls = signal<string | undefined>('sidebar');
  readonly openLabel = signal<string | undefined>(undefined);
  readonly closeLabel = signal<string | undefined>(undefined);
  readonly openLabelKey = signal<string | undefined>(undefined);
  readonly closeLabelKey = signal<string | undefined>(undefined);
  readonly disabled = signal(false);
  readonly loading = signal(false);
}

describe('SolarisMenuToggleDirective', () => {
  let fixture: ComponentFixture<TestHost>;
  let button: HTMLButtonElement;

  const createFixture = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
  };

  const detectExternalChange = () => {
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
  };

  it('should expose the closed state by default', () => {
    createFixture();

    expect(button.getAttribute('data-state')).toBe('closed');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe('sidebar');
    expect(button.getAttribute('aria-label')).toBe('Open menu');
    expect(
      button
        .querySelector('solaris-animated-icon')
        ?.hasAttribute('data-active'),
    ).toBe(false);
  });

  it('should toggle the state and update the two-way binding', () => {
    createFixture();

    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(true);
    expect(button.getAttribute('data-state')).toBe('open');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.getAttribute('aria-label')).toBe('Close menu');
    expect(
      button
        .querySelector('solaris-animated-icon')
        ?.getAttribute('data-active'),
    ).toBe('');
  });

  it('should reflect an externally controlled state', () => {
    createFixture();

    fixture.componentInstance.open.set(true);
    detectExternalChange();

    expect(button.getAttribute('data-state')).toBe('open');
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('should use custom labels for each state', () => {
    createFixture();
    fixture.componentInstance.openLabel.set('Open navigation');
    fixture.componentInstance.closeLabel.set('Close navigation');
    detectExternalChange();

    expect(button.getAttribute('aria-label')).toBe('Open navigation');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-label')).toBe('Close navigation');
  });

  it('should resolve labels through custom translation keys', () => {
    createFixture();
    fixture.componentInstance.openLabelKey.set('solaris.dialog.close');
    fixture.componentInstance.closeLabelKey.set('solaris.dialog.confirm');
    detectExternalChange();

    expect(button.getAttribute('aria-label')).toBe('Close');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-label')).toBe('Confirm');
  });

  it('should prefer a direct label over its translation key', () => {
    createFixture();
    fixture.componentInstance.openLabel.set('Open navigation');
    fixture.componentInstance.openLabelKey.set('solaris.dialog.close');
    detectExternalChange();

    expect(button.getAttribute('aria-label')).toBe('Open navigation');
  });

  it('should omit aria-controls when no controlled element is provided', () => {
    createFixture();
    fixture.componentInstance.controls.set(undefined);
    detectExternalChange();

    expect(button.hasAttribute('aria-controls')).toBe(false);
  });

  it('should not toggle while disabled', () => {
    createFixture();
    fixture.componentInstance.disabled.set(true);
    detectExternalChange();

    button.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('should not toggle while loading', () => {
    createFixture();
    fixture.componentInstance.loading.set(true);
    detectExternalChange();

    button.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
  });
});
