import { Component } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { SolarisIconButtonDirective } from '../directives/icon-button.directive';
import { SolarisMenuToggleDirective } from '../directives/menu-toggle.directive';
import { SolarisAnimatedIconComponent } from '../../../icon/component/solaris-animated-icon.component';

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
      [(solarisMenuToggleOpen)]="open"
      [solarisMenuToggleControls]="controls"
      [solarisMenuToggleOpenLabel]="openLabel"
      [solarisMenuToggleCloseLabel]="closeLabel"
      [disabled]="disabled"
      [loading]="loading"
    >
      <solaris-animated-icon name="menu" [active]="open" [decorative]="true" />
    </button>
  `,
})
class TestHost {
  open = false;
  controls: string | undefined = 'sidebar';
  openLabel: string | undefined;
  closeLabel: string | undefined;
  disabled = false;
  loading = false;
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

    expect(fixture.componentInstance.open).toBe(true);
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

    fixture.componentInstance.open = true;
    detectExternalChange();

    expect(button.getAttribute('data-state')).toBe('open');
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('should use custom labels for each state', () => {
    createFixture();
    fixture.componentInstance.openLabel = 'Open navigation';
    fixture.componentInstance.closeLabel = 'Close navigation';
    detectExternalChange();

    expect(button.getAttribute('aria-label')).toBe('Open navigation');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-label')).toBe('Close navigation');
  });

  it('should omit aria-controls when no controlled element is provided', () => {
    createFixture();
    fixture.componentInstance.controls = undefined;
    detectExternalChange();

    expect(button.hasAttribute('aria-controls')).toBe(false);
  });

  it('should not toggle while disabled', () => {
    createFixture();
    fixture.componentInstance.disabled = true;
    detectExternalChange();

    button.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.open).toBe(false);
  });

  it('should not toggle while loading', () => {
    createFixture();
    fixture.componentInstance.loading = true;
    detectExternalChange();

    button.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(fixture.componentInstance.open).toBe(false);
  });
});
