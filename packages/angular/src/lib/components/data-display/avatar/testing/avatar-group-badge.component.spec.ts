import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { vi } from 'vitest';

import { SolarisAvatarGroupBadgeComponent } from '../component/avatar-group-badge.component';

describe('SolarisAvatarGroupBadgeComponent', () => {
  let fixture: ComponentFixture<SolarisAvatarGroupBadgeComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisAvatarGroupBadgeComponent);
    fixture.componentRef.setInput('users', [
      { userId: 'user-1', name: 'Amelia Davis' },
      { userId: 'user-2', name: 'Dominic Price' },
    ]);
    fixture.componentRef.setInput('label', 'Design team');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
    expect(el.getAttribute('role')).toBe('group');
  });

  it('should render member avatars and the label', () => {
    const el = createFixture();
    expect(el.querySelectorAll('solaris-avatar').length).toBe(2);
    expect(
      el.querySelector('.solaris-avatar-group-badge__label')?.textContent,
    ).toContain('Design team');
    expect(el.getAttribute('aria-label')).toBe('Design team');
  });

  it('should render a static +N marker instead of a button when truncated', () => {
    const el = createFixture();
    fixture.componentRef.setInput('users', [
      { userId: 'user-1', name: 'Amelia Davis' },
      { userId: 'user-2', name: 'Dominic Price' },
      { userId: 'user-3', name: 'Elijah Cooper' },
      { userId: 'user-4', name: 'Henry Nguyen' },
    ]);
    fixture.componentRef.setInput('max', 2);
    fixture.detectChanges();
    const more = el.querySelector('.solaris-avatar-group-badge__more');
    expect(more?.tagName).toBe('SPAN');
    expect(more?.textContent).toBe('+2');
    expect(el.querySelector('button')).toBeFalsy();
  });

  it('should fall back to max 3 for non-positive values', () => {
    const el = createFixture();
    fixture.componentRef.setInput('users', [
      { userId: 'user-1', name: 'Amelia Davis' },
      { userId: 'user-2', name: 'Dominic Price' },
      { userId: 'user-3', name: 'Elijah Cooper' },
      { userId: 'user-4', name: 'Henry Nguyen' },
    ]);
    fixture.componentRef.setInput('max', 0);
    fixture.detectChanges();
    expect(el.querySelectorAll('solaris-avatar').length).toBe(3);
    expect(
      el.querySelector('.solaris-avatar-group-badge__more')?.textContent,
    ).toBe('+1');
  });

  it('should render a link pill when href is set', () => {
    const el = createFixture();
    fixture.componentRef.setInput('href', '/teams/design');
    fixture.detectChanges();
    const pill = el.querySelector('.solaris-avatar-group-badge__pill');
    expect(pill?.tagName).toBe('A');
    expect(pill?.getAttribute('href')).toBe('/teams/design');
    expect(el.getAttribute('role')).toBeFalsy();
  });

  it('should emit badgeClick from the pill', () => {
    createFixture();
    fixture.componentRef.setInput('href', '/teams/design');
    fixture.detectChanges();
    const spy = vi.fn();
    fixture.componentInstance.badgeClick.subscribe(spy);
    const pill = fixture.nativeElement.querySelector(
      '.solaris-avatar-group-badge__pill',
    ) as HTMLAnchorElement;
    pill.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render a button pill when actionAriaLabel is set', () => {
    const el = createFixture();
    fixture.componentRef.setInput('actionAriaLabel', 'Open team');
    fixture.detectChanges();
    const pill = el.querySelector('.solaris-avatar-group-badge__pill');
    expect(pill?.tagName).toBe('BUTTON');
    expect(pill?.getAttribute('aria-label')).toBe('Open team');
  });

  it('should emit memberClick when a member action fires and pill is static', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisAvatarGroupBadgeComponent);
    fixture.componentRef.setInput('users', [
      {
        userId: 'user-1',
        name: 'Amelia Davis',
        actionAriaLabel: 'Open Amelia Davis profile',
      },
      { userId: 'user-2', name: 'Dominic Price' },
    ]);
    fixture.componentRef.setInput('label', 'Design team');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const spy = vi.fn();
    fixture.componentInstance.memberClick.subscribe(spy);
    const action = el.querySelector(
      'solaris-avatar .solaris-avatar__action',
    ) as HTMLButtonElement;
    expect(action?.getAttribute('aria-label')).toBe(
      'Open Amelia Davis profile',
    );
    action.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toEqual({
      user: expect.objectContaining({ userId: 'user-1' }),
      index: 0,
    });
  });

  it('should suppress member actions when the pill itself is interactive', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisAvatarGroupBadgeComponent);
    fixture.componentRef.setInput('users', [
      {
        userId: 'user-1',
        name: 'Amelia Davis',
        actionAriaLabel: 'Open Amelia Davis profile',
      },
    ]);
    fixture.componentRef.setInput('label', 'Design team');
    fixture.componentRef.setInput('href', '/teams/design');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(
      el.querySelector('solaris-avatar .solaris-avatar__action'),
    ).toBeFalsy();
  });

  it('should omit the label title when nothing overflows', () => {
    const el = createFixture();
    expect(
      el
        .querySelector('.solaris-avatar-group-badge__label')
        ?.getAttribute('title'),
    ).toBeFalsy();
  });

  it('should move focus between member actions with arrows', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisAvatarGroupBadgeComponent);
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
    fixture.componentRef.setInput('label', 'Design team');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const actions = Array.from(
      el.querySelectorAll<HTMLButtonElement>(
        'solaris-avatar .solaris-avatar__action',
      ),
    );
    expect(actions.length).toBe(2);
    expect(actions[0]?.tabIndex).toBe(0);
    const first = actions[0] as HTMLButtonElement;
    const second = actions[1] as HTMLButtonElement;
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(document.activeElement).toBe(second);
  });
});
