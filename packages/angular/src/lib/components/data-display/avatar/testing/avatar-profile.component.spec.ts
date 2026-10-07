import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { vi } from 'vitest';

import { SolarisAvatarProfileComponent } from '../component/avatar-profile.component';

@Component({
  standalone: true,
  imports: [SolarisAvatarProfileComponent],
  template: `
    <solaris-avatar-profile
      name="Amelia Davis"
      title="Amelia Davis"
      subtitle="davis@example.com"
      badgeText="PRO"
      [verified]="true"
    >
      <button type="button" solaris-avatar-profile-actions>...</button>
    </solaris-avatar-profile>
  `,
})
class AvatarProfileActionsHost {}

@Component({
  standalone: true,
  imports: [SolarisAvatarProfileComponent],
  template: `
    <solaris-avatar-profile
      name="Amelia Davis"
      title="Amelia Davis"
      subtitle="davis@example.com"
      href="/users/amelia-davis"
    >
      <button type="button" solaris-avatar-profile-actions>...</button>
    </solaris-avatar-profile>
  `,
})
class AvatarProfileLinkActionsHost {}

describe('SolarisAvatarProfileComponent', () => {
  let fixture: ComponentFixture<SolarisAvatarProfileComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisAvatarProfileComponent);
    fixture.componentRef.setInput('title', 'Amelia Davis');
    fixture.componentRef.setInput('subtitle', 'davis@example.com');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
    expect(el.getAttribute('role')).toBe('group');
  });

  it('should render title, subtitle and badge text', () => {
    const el = createFixture();
    fixture.componentRef.setInput('badgeText', 'PRO');
    fixture.detectChanges();
    expect(
      el.querySelector('.solaris-avatar-profile__title')?.textContent,
    ).toContain('Amelia Davis');
    expect(
      el.querySelector('.solaris-avatar-profile__subtitle')?.textContent,
    ).toContain('davis@example.com');
    const badge = el.querySelector('solaris-badge');
    expect(badge?.textContent).toContain('PRO');
    expect(badge?.getAttribute('data-color')).toBe('primary');
  });

  it('should default the accessible name to the title', () => {
    const el = createFixture();
    expect(el.getAttribute('aria-label')).toBe('Amelia Davis');
  });

  it('should collapse to avatar only in compact mode', () => {
    const el = createFixture();
    expect(el.querySelector('solaris-avatar')).toBeTruthy();
    expect(el.querySelector('.solaris-avatar-profile__title')).toBeTruthy();
    fixture.componentRef.setInput('compact', true);
    fixture.detectChanges();
    expect(el.getAttribute('data-compact')).toBeTruthy();
    expect(el.querySelector('.solaris-avatar-profile__title')).toBeFalsy();
    expect(el.querySelector('solaris-avatar')).toBeTruthy();
  });

  it('should pass status and count to the inner avatar', () => {
    const el = createFixture();
    fixture.componentRef.setInput('status', 'online');
    fixture.componentRef.setInput('showStatus', true);
    fixture.componentRef.setInput('count', 2);
    fixture.detectChanges();
    const avatar = el.querySelector('solaris-avatar');
    expect(avatar?.getAttribute('data-status')).toBe('online');
    expect(avatar?.querySelector('.solaris-avatar__count')?.textContent).toBe(
      '2',
    );
  });

  it('should render a link identity when href is set', () => {
    const el = createFixture();
    fixture.componentRef.setInput('href', '/users/amelia-davis');
    fixture.detectChanges();
    const link = el.querySelector(
      '.solaris-avatar-profile__identity',
    ) as HTMLAnchorElement;
    expect(link?.tagName).toBe('A');
    expect(link?.getAttribute('href')).toBe('/users/amelia-davis');
    expect(link?.getAttribute('aria-label')).toBe('Amelia Davis');
    expect(el.getAttribute('role')).toBeFalsy();
    expect(el.getAttribute('aria-label')).toBeFalsy();
  });

  it('should emit profileClick from the link identity', () => {
    createFixture();
    fixture.componentRef.setInput('href', '/users/amelia-davis');
    fixture.detectChanges();
    const spy = vi.fn();
    fixture.componentInstance.profileClick.subscribe(spy);
    const link = fixture.nativeElement.querySelector(
      '.solaris-avatar-profile__identity',
    ) as HTMLAnchorElement;
    link.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render a button identity when actionAriaLabel is set', () => {
    const el = createFixture();
    fixture.componentRef.setInput('actionAriaLabel', 'Open profile');
    fixture.detectChanges();
    const action = el.querySelector(
      '.solaris-avatar-profile__identity',
    ) as HTMLButtonElement;
    expect(action?.tagName).toBe('BUTTON');
    expect(action?.getAttribute('aria-label')).toBe('Open profile');
  });

  it('should keep actions outside the clickable identity', () => {
    const host = TestBed.createComponent(AvatarProfileLinkActionsHost);
    host.detectChanges();
    const el = host.nativeElement as HTMLElement;
    const link = el.querySelector('.solaris-avatar-profile__identity');
    expect(link?.tagName).toBe('A');
    expect(link?.querySelector('.solaris-avatar-profile__actions')).toBeFalsy();
    expect(
      el.querySelector('.solaris-avatar-profile__actions button'),
    ).toBeTruthy();
  });

  it('should project profile actions', () => {
    const host = TestBed.createComponent(AvatarProfileActionsHost);
    host.detectChanges();
    const el = host.nativeElement as HTMLElement;
    expect(
      el.querySelector('.solaris-avatar-profile__actions button'),
    ).toBeTruthy();
  });

  it('should map image size to text size by default', () => {
    const fixture = TestBed.createComponent(SolarisAvatarProfileComponent);
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).getAttribute('data-text-size'),
    ).toBe('xs');
  });

  it('should allow an explicit text size override', () => {
    const fixture = TestBed.createComponent(SolarisAvatarProfileComponent);
    fixture.componentRef.setInput('size', 'sm');
    fixture.componentRef.setInput('textSize', 'sm');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).getAttribute('data-text-size'),
    ).toBe('sm');
  });
});
