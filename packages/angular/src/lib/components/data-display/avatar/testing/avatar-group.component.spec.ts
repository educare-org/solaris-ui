import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { vi } from 'vitest';

import { SolarisAvatarGroupComponent } from '../component/avatar-group.component';
import type { SolarisAvatarGroupUser } from '../model/avatar.types';

const USERS: SolarisAvatarGroupUser[] = [
  { userId: 'user-1', name: 'Amelia Davis' },
  { userId: 'user-2', name: 'Dominic Price' },
  { userId: 'user-3', name: 'Elijah Cooper' },
  { userId: 'user-4', name: 'Henry Nguyen' },
  { userId: 'user-5', name: 'Kaique Ferreira' },
];

describe('SolarisAvatarGroupComponent', () => {
  let fixture: ComponentFixture<SolarisAvatarGroupComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisAvatarGroupComponent);
    fixture.componentRef.setInput('users', USERS);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
    expect(el.getAttribute('role')).toBe('group');
  });

  it('should default to max 4 and md size', () => {
    const el = createFixture();
    expect(el.querySelectorAll('solaris-avatar').length).toBe(4);
    expect(el.getAttribute('data-size')).toBe('md');
  });

  it('should truncate with a focusable +N overflow button', () => {
    const el = createFixture();
    const overflow = el.querySelector(
      '.solaris-avatar-group__overflow',
    ) as HTMLButtonElement;
    expect(overflow).toBeTruthy();
    expect(overflow.textContent).toContain('+1');
    expect(overflow.getAttribute('aria-label')).toBeTruthy();
  });

  it('should hide the overflow button when everyone fits', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisAvatarGroupComponent);
    fixture.componentRef.setInput('users', USERS.slice(0, 2));
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('solaris-avatar').length).toBe(2);
    expect(el.querySelector('.solaris-avatar-group__overflow')).toBeFalsy();
  });

  it('should respect a custom max', () => {
    const el = createFixture();
    fixture.componentRef.setInput('max', 2);
    fixture.detectChanges();
    expect(el.querySelectorAll('solaris-avatar').length).toBe(2);
    expect(
      el.querySelector('.solaris-avatar-group__overflow')?.textContent,
    ).toContain('+3');
  });

  it('should propagate size and radius to avatars', () => {
    const el = createFixture();
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('radius', 'md');
    fixture.detectChanges();
    const first = el.querySelector('solaris-avatar');
    expect(first?.getAttribute('data-size')).toBe('lg');
    expect(first?.getAttribute('data-radius')).toBe('md');
  });

  it('should emit overflowClick on keyboard activation', () => {
    const el = createFixture();
    const spy = vi.fn();
    fixture.componentInstance.overflowClick.subscribe(spy);
    const overflow = el.querySelector(
      '.solaris-avatar-group__overflow',
    ) as HTMLButtonElement;
    overflow.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should expose the overlap as a unitless-safe style variable', () => {
    const el = createFixture();
    fixture.componentRef.setInput('overlap', 10);
    fixture.detectChanges();
    expect(
      (el as HTMLElement).style.getPropertyValue(
        '--solaris-avatar-group-overlap',
      ),
    ).toBe('10px');
  });
});
