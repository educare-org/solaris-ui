import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { vi } from 'vitest';

import { SolarisAvatarComponent } from '../component/avatar.component';
import {
  SOLARIS_AVATAR_GENERATIVE_PALETTE_COUNT,
  buildAvatarMeshSpots,
} from '../model/avatar-generative';

describe('SolarisAvatarComponent', () => {
  let fixture: ComponentFixture<SolarisAvatarComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisAvatarComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
  });

  it('should default to md size, full radius and generative fallback', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
    expect(el.getAttribute('data-radius')).toBe('full');
    expect(el.getAttribute('data-fallback')).toBe('generative');
  });

  it('should apply size and radius via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('radius', 'md');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('lg');
    expect(el.getAttribute('data-radius')).toBe('md');
  });

  it('should render initials and generative art without src', () => {
    const el = createFixture();
    fixture.componentRef.setInput('name', 'Amelia Davis');
    fixture.detectChanges();
    expect(el.querySelector('.solaris-avatar__initials')?.textContent).toBe(
      'AD',
    );
    expect(el.querySelector('.solaris-avatar__generative')).toBeTruthy();
    expect(el.getAttribute('aria-label')).toContain('Amelia Davis');
  });

  it('should resolve the same palette for the same user', () => {
    const el = createFixture();
    fixture.componentRef.setInput('userId', 'user-1');
    fixture.componentRef.setInput('name', 'Amelia Davis');
    fixture.detectChanges();
    const first = el.getAttribute('data-palette');
    fixture.componentRef.setInput('userId', 'user-2');
    fixture.detectChanges();
    const second = el.getAttribute('data-palette');
    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    fixture.componentRef.setInput('userId', 'user-1');
    fixture.detectChanges();
    expect(el.getAttribute('data-palette')).toBe(first);
  });

  it('should render the photo when src is provided', () => {
    const el = createFixture();
    fixture.componentRef.setInput('src', 'https://example.com/photo.jpg');
    fixture.componentRef.setInput('name', 'Amelia Davis');
    fixture.detectChanges();
    const img = el.querySelector('.solaris-avatar__image');
    expect(img?.getAttribute('src')).toBe('https://example.com/photo.jpg');
    expect(el.querySelector('.solaris-avatar__initials')).toBeFalsy();
  });

  it('should omit srcset when no candidates are provided', () => {
    const el = createFixture();
    fixture.componentRef.setInput('src', 'https://example.com/photo.jpg');
    fixture.componentRef.setInput('name', 'Amelia Davis');
    fixture.detectChanges();
    const img = el.querySelector('.solaris-avatar__image');
    expect(img?.hasAttribute('srcset')).toBe(false);
  });

  it('should forward srcset candidates when provided', () => {
    const el = createFixture();
    fixture.componentRef.setInput('src', 'https://example.com/photo.jpg');
    fixture.componentRef.setInput(
      'srcset',
      'https://example.com/photo-2x.jpg 2x',
    );
    fixture.detectChanges();
    expect(
      el.querySelector('.solaris-avatar__image')?.getAttribute('srcset'),
    ).toBe('https://example.com/photo-2x.jpg 2x');
  });

  it('should fall back to generative art on image error', () => {
    const el = createFixture();
    fixture.componentRef.setInput('src', 'https://example.com/broken.jpg');
    fixture.componentRef.setInput('name', 'Amelia Davis');
    fixture.detectChanges();
    const img = el.querySelector('.solaris-avatar__image') as HTMLElement;
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(el.querySelector('.solaris-avatar__image')).toBeFalsy();
    expect(el.querySelector('.solaris-avatar__generative')).toBeTruthy();
  });

  it('should expose status via data-status only when showStatus is set', () => {
    const el = createFixture();
    fixture.componentRef.setInput('status', 'online');
    fixture.detectChanges();
    expect(el.getAttribute('data-status')).toBeFalsy();
    fixture.componentRef.setInput('showStatus', true);
    fixture.detectChanges();
    expect(el.getAttribute('data-status')).toBe('online');
    expect(el.querySelector('.solaris-avatar__status')).toBeTruthy();
  });

  it('should render the off-hours badge when outside working hours', () => {
    const el = createFixture();
    fixture.componentRef.setInput('name', 'Amelia Davis');
    fixture.componentRef.setInput('status', 'online');
    fixture.componentRef.setInput('showStatus', true);
    fixture.componentRef.setInput('offHoursOverride', true);
    fixture.detectChanges();
    expect(el.getAttribute('data-off-hours')).toBeTruthy();
    const offHours = el.querySelector('.solaris-avatar__off-hours');
    expect(offHours?.tagName).toBe('svg');
    expect(
      offHours?.querySelector('.solaris-avatar__off-hours-glyph'),
    ).toBeTruthy();
    expect(el.getAttribute('aria-label')).toContain('Amelia Davis');
  });

  it('should hide the off-hours badge when showOffHours is false', () => {
    const el = createFixture();
    fixture.componentRef.setInput('status', 'online');
    fixture.componentRef.setInput('showStatus', true);
    fixture.componentRef.setInput('offHoursOverride', true);
    fixture.componentRef.setInput('showOffHours', false);
    fixture.detectChanges();
    expect(el.getAttribute('data-off-hours')).toBeFalsy();
    expect(el.querySelector('.solaris-avatar__off-hours')).toBeFalsy();
  });

  it('should cap counts like solaris-badge and expose the full value', () => {
    const el = createFixture();
    fixture.componentRef.setInput('count', 103);
    fixture.detectChanges();
    expect(el.querySelector('.solaris-avatar__count')?.textContent).toBe('99+');
    expect(
      el.querySelector('.solaris-avatar__count')?.getAttribute('title'),
    ).toBe('103');
  });

  it('should hide zero counts unless showZero is set', () => {
    const el = createFixture();
    fixture.componentRef.setInput('count', 0);
    fixture.detectChanges();
    expect(el.querySelector('.solaris-avatar__count')).toBeFalsy();
    fixture.componentRef.setInput('showZero', true);
    fixture.detectChanges();
    expect(el.querySelector('.solaris-avatar__count')?.textContent).toBe('0');
  });

  it('should render verified seal and shift status placement', () => {
    const el = createFixture();
    fixture.componentRef.setInput('status', 'online');
    fixture.componentRef.setInput('showStatus', true);
    fixture.componentRef.setInput('verified', true);
    fixture.detectChanges();
    expect(el.getAttribute('data-verified')).toBeTruthy();
    expect(el.querySelector('.solaris-avatar__verified')).toBeTruthy();
    expect(el.getAttribute('data-status-placement')).toBe('bottom-left');
  });

  it('should apply loading and active markers with the presence pattern', () => {
    const el = createFixture();
    expect(el.getAttribute('data-loading')).toBeFalsy();
    expect(el.getAttribute('data-active')).toBeFalsy();
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();
    expect(el.getAttribute('data-loading')).toBeTruthy();
    expect(el.getAttribute('data-active')).toBeTruthy();
    expect(el.querySelector('.solaris-avatar__ring')).toBeTruthy();
    expect(el.querySelector('.solaris-avatar__track')).toBeTruthy();
    expect(el.querySelector('.solaris-avatar__bar')).toBeTruthy();
  });

  it('should mark single-digit counts for circular rendering', () => {
    const el = createFixture();
    fixture.componentRef.setInput('count', 2);
    fixture.detectChanges();
    expect(el.getAttribute('data-count-single')).toBeTruthy();
    fixture.componentRef.setInput('count', 103);
    fixture.detectChanges();
    expect(el.getAttribute('data-count-single')).toBeFalsy();
  });

  it('should render the scalloped verified seal', () => {
    const el = createFixture();
    fixture.componentRef.setInput('verified', true);
    fixture.detectChanges();
    const seal = el.querySelector('.solaris-avatar__seal');
    expect(seal?.getAttribute('d')).toContain('M');
    expect(el.querySelector('.solaris-avatar__seal-check')).toBeTruthy();
  });

  it('should render mesh gradient spots', () => {
    const el = createFixture();
    fixture.componentRef.setInput('name', 'Amelia Davis');
    fixture.detectChanges();
    expect(el.querySelector('.solaris-avatar__mesh-base')).toBeTruthy();
    expect(el.querySelector('.solaris-avatar__mesh-a')).toBeTruthy();
    expect(el.querySelector('.solaris-avatar__mesh-b')).toBeTruthy();
    expect(el.querySelector('.solaris-avatar__mesh-c')).toBeTruthy();
  });

  it('should render empty state with role img and empty label', () => {
    const el = createFixture();
    fixture.componentRef.setInput('empty', true);
    fixture.componentRef.setInput('emptyAriaLabel', 'Add member');
    fixture.detectChanges();
    expect(el.getAttribute('data-empty')).toBeTruthy();
    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('aria-label')).toBe('Add member');
    expect(el.querySelector('.solaris-avatar__empty-icon')).toBeTruthy();
  });

  it('should render an inner button with action label when interactive', () => {
    const el = createFixture();
    fixture.componentRef.setInput('actionAriaLabel', 'Change photo');
    fixture.detectChanges();
    expect(el.getAttribute('role')).toBeFalsy();
    const action = el.querySelector(
      '.solaris-avatar__action',
    ) as HTMLButtonElement;
    expect(action?.getAttribute('aria-label')).toBe('Change photo');
  });

  it('should emit actionClick on keyboard activation', () => {
    createFixture();
    fixture.componentRef.setInput('actionAriaLabel', 'Change photo');
    fixture.detectChanges();
    const spy = vi.fn();
    fixture.componentInstance.actionClick.subscribe(spy);
    const action = fixture.nativeElement.querySelector(
      '.solaris-avatar__action',
    ) as HTMLButtonElement;
    action.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should expose ten generative palettes', () => {
    expect(SOLARIS_AVATAR_GENERATIVE_PALETTE_COUNT).toBe(10);
  });

  it('should build deterministic mesh spots with shape variation', () => {
    const first = buildAvatarMeshSpots(123456);
    const second = buildAvatarMeshSpots(123456);
    expect(second).toEqual(first);
    const counts = new Set<number>();
    for (let seed = 0; seed < 40; seed++) {
      counts.add(buildAvatarMeshSpots(seed).length);
    }
    expect(counts.has(3)).toBe(true);
    expect(counts.has(4)).toBe(true);
  });

  it('should render dnd status as danger', () => {
    const el = createFixture();
    fixture.componentRef.setInput('status', 'dnd');
    fixture.componentRef.setInput('showStatus', true);
    fixture.detectChanges();
    expect(el.getAttribute('data-status')).toBe('dnd');
    expect(el.querySelector('.solaris-avatar__status')).toBeTruthy();
  });

  it('should prefer explicit aria labels over composite names', () => {
    const el = createFixture();
    fixture.componentRef.setInput('name', 'Amelia Davis');
    fixture.componentRef.setInput('ariaLabel', 'Custom label');
    fixture.detectChanges();
    expect(el.getAttribute('aria-label')).toBe('Custom label');
  });

  it('should lazy-load photos with async decoding by default', () => {
    const el = createFixture();
    fixture.componentRef.setInput('src', 'https://example.com/photo.jpg');
    fixture.detectChanges();
    const img = el.querySelector(
      '.solaris-avatar__image',
    ) as HTMLImageElement | null;
    expect(img?.getAttribute('loading')).toBe('lazy');
    expect(img?.getAttribute('decoding')).toBe('async');
  });

  it('should respect custom image loading and decoding', () => {
    const el = createFixture();
    fixture.componentRef.setInput('src', 'https://example.com/photo.jpg');
    fixture.componentRef.setInput('imageLoading', 'eager');
    fixture.componentRef.setInput('imageDecoding', 'sync');
    fixture.detectChanges();
    const img = el.querySelector(
      '.solaris-avatar__image',
    ) as HTMLImageElement | null;
    expect(img?.getAttribute('loading')).toBe('eager');
    expect(img?.getAttribute('decoding')).toBe('sync');
  });
});
