import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisIconButtonDirective } from '../directives/icon-button.directive';
import { SolarisIconButtonBadgeDirective } from '../directives/icon-button-badge.directive';

@Component({
  standalone: true,
  imports: [SolarisIconButtonDirective, SolarisIconButtonBadgeDirective],
  template: `<button solaris-icon-button aria-label="Notifications">
    N<span solaris-icon-button-badge>3</span>
  </button>`,
})
class DefaultBadgeHost {}

@Component({
  standalone: true,
  imports: [SolarisIconButtonDirective, SolarisIconButtonBadgeDirective],
  template: `<button
    solaris-icon-button
    [chromeless]="true"
    aria-label="Notifications"
  >
    N<span solaris-icon-button-badge>3</span>
  </button>`,
})
class ChromelessBadgeHost {}

function readIconButtonScss(): string {
  return iconButtonScss;
}

let iconButtonScss = '';

beforeAll(async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const url = await import('node:url');
  const here = path.dirname(url.fileURLToPath(import.meta.url));
  iconButtonScss = fs.readFileSync(
    path.resolve(here, '../../../../../styles/_icon-button.scss'),
    'utf8',
  );
});

function badgeRect(el: Element): DOMRect {
  return el.getBoundingClientRect();
}

describe('SolarisIconButton badge press stability', () => {
  it('keeps badge exemption from host scale in SCSS', () => {
    const scss = readIconButtonScss();
    expect(scss).toContain(
      '[solaris-icon-button]:has(.solaris-icon-button-badge):active',
    );
    expect(scss).toContain(
      '[solaris-icon-button]:has(.solaris-icon-button-badge)[data-active]',
    );
    expect(scss).toContain(
      '[solaris-icon-button]:has(.solaris-icon-button-badge)[data-pressed]',
    );
  });

  it('removes chromeless icon scale when badge is present in SCSS', () => {
    const scss = readIconButtonScss();
    expect(scss).toContain('[solaris-icon-button][data-chromeless]:has(');
    expect(scss).toContain('.solaris-icon-button-badge');
  });

  it('keeps badge rect stable on press without chromeless', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(DefaultBadgeHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      '[solaris-icon-button]',
    ) as HTMLElement;
    const badge = host.querySelector(
      '.solaris-icon-button-badge',
    ) as HTMLElement;
    expect(badge).toBeTruthy();
    const before = badgeRect(badge);
    host.setAttribute('data-active', '');
    fixture.detectChanges();
    const after = badgeRect(badge);
    expect(after.width).toBe(before.width);
    expect(after.height).toBe(before.height);
    expect(after.x).toBe(before.x);
    expect(after.y).toBe(before.y);
  });

  it('keeps badge rect stable on press with chromeless', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(ChromelessBadgeHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      '[solaris-icon-button]',
    ) as HTMLElement;
    const badge = host.querySelector(
      '.solaris-icon-button-badge',
    ) as HTMLElement;
    expect(badge).toBeTruthy();
    expect(host.hasAttribute('data-chromeless')).toBe(true);
    const before = badgeRect(badge);
    host.setAttribute('data-active', '');
    fixture.detectChanges();
    const after = badgeRect(badge);
    expect(after.width).toBe(before.width);
    expect(after.height).toBe(before.height);
    expect(after.x).toBe(before.x);
    expect(after.y).toBe(before.y);
  });
});
