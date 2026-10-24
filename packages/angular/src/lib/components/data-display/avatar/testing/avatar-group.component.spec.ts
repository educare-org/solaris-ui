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

  it('should emit memberClick with user and index when a member action fires', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisAvatarGroupComponent);
    fixture.componentRef.setInput('users', [
      {
        userId: 'user-1',
        name: 'Amelia Davis',
        actionAriaLabel: 'Open Amelia Davis profile',
      },
      { userId: 'user-2', name: 'Dominic Price' },
    ]);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const spy = vi.fn();
    fixture.componentInstance.memberClick.subscribe(spy);
    const action = el.querySelector(
      'solaris-avatar .solaris-avatar__action',
    ) as HTMLButtonElement;
    expect(action).toBeTruthy();
    expect(action.getAttribute('aria-label')).toBe('Open Amelia Davis profile');
    action.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      user: {
        userId: 'user-1',
        name: 'Amelia Davis',
        actionAriaLabel: 'Open Amelia Davis profile',
      },
      index: 0,
    });
  });

  it('should keep members non-interactive without an action label', () => {
    const el = createFixture();
    expect(
      el.querySelector('solaris-avatar .solaris-avatar__action'),
    ).toBeFalsy();
  });

  it('should keep a single tab stop with roving tabindex', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisAvatarGroupComponent);
    fixture.componentRef.setInput('users', [
      {
        userId: 'user-1',
        name: 'Amelia Davis',
        actionAriaLabel: 'Open Amelia Davis profile',
        tooltip: 'Amelia Davis',
      },
      {
        userId: 'user-2',
        name: 'Dominic Price',
        actionAriaLabel: 'Open Dominic Price profile',
      },
    ]);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const actions = Array.from(
      el.querySelectorAll<HTMLButtonElement>(
        'solaris-avatar .solaris-avatar__action',
      ),
    );
    expect(actions.length).toBe(2);
    expect(actions[0]?.tabIndex).toBe(0);
    expect(actions[1]?.tabIndex).toBe(-1);
  });

  it('should move focus with arrows, Home and End', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisAvatarGroupComponent);
    fixture.componentRef.setInput('users', [
      {
        userId: 'user-1',
        name: 'Amelia Davis',
        actionAriaLabel: 'Open Amelia Davis profile',
      },
      {
        userId: 'user-2',
        name: 'Dominic Price',
        actionAriaLabel: 'Open Dominic Price profile',
      },
    ]);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const actions = Array.from(
      el.querySelectorAll<HTMLButtonElement>(
        'solaris-avatar .solaris-avatar__action',
      ),
    );
    const first = actions[0] as HTMLButtonElement;
    const second = actions[1] as HTMLButtonElement;

    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(second);
    expect(second.tabIndex).toBe(0);
    expect(first.tabIndex).toBe(-1);

    second.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(first);

    second.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(first);

    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(second);
  });
});
