import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

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
    expect(
      el.querySelector('.solaris-avatar-profile__badge')?.textContent,
    ).toContain('PRO');
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

  it('should project profile actions', () => {
    const host = TestBed.createComponent(AvatarProfileActionsHost);
    host.detectChanges();
    const el = host.nativeElement as HTMLElement;
    expect(
      el.querySelector('.solaris-avatar-profile__actions button'),
    ).toBeTruthy();
  });
});
