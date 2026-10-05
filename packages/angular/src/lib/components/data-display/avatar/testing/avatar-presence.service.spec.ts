import { TestBed } from '@angular/core/testing';

import {
  SOLARIS_AVATAR_DEFAULT_WORKING_HOURS,
  SolarisAvatarPresenceService,
} from '../service/avatar-presence.service';

describe('SolarisAvatarPresenceService', () => {
  let service: SolarisAvatarPresenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolarisAvatarPresenceService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should default working hours to 09:00-18:00', () => {
    expect(SOLARIS_AVATAR_DEFAULT_WORKING_HOURS).toEqual({
      start: '09:00',
      end: '18:00',
    });
  });

  it('should be inside working hours at noon local time', () => {
    const noon = new Date(2026, 4, 6, 12, 0, 0);
    expect(service.isOffHours(noon)).toBe(false);
  });

  it('should be off hours at night local time', () => {
    const night = new Date(2026, 4, 6, 22, 30, 0);
    expect(service.isOffHours(night)).toBe(true);
  });

  it('should respect custom working hours', () => {
    const morning = new Date(2026, 4, 6, 8, 0, 0);
    expect(service.isOffHours(morning, { start: '08:00', end: '12:00' })).toBe(
      false,
    );
    const afternoon = new Date(2026, 4, 6, 13, 0, 0);
    expect(
      service.isOffHours(afternoon, { start: '08:00', end: '12:00' }),
    ).toBe(true);
  });

  it('should handle overnight ranges', () => {
    const range = { start: '22:00', end: '06:00' };
    expect(service.isOffHours(new Date(2026, 4, 6, 23, 0, 0), range)).toBe(
      false,
    );
    expect(service.isOffHours(new Date(2026, 4, 6, 3, 0, 0), range)).toBe(
      false,
    );
    expect(service.isOffHours(new Date(2026, 4, 6, 12, 0, 0), range)).toBe(
      true,
    );
  });

  it('should resolve timezone-aware hours', () => {
    const date = new Date('2026-05-06T12:00:00Z');
    const inHours = service.isOffHours(
      date,
      { start: '09:00', end: '18:00' },
      'America/Sao_Paulo',
    );
    expect(inHours).toBe(false);
    const outOfHours = service.isOffHours(
      date,
      { start: '09:00', end: '18:00' },
      'Pacific/Kiritimati',
    );
    expect(outOfHours).toBe(true);
  });

  it('should return false for invalid working hours', () => {
    const now = new Date(2026, 4, 6, 23, 0, 0);
    expect(service.isOffHours(now, { start: 'xx', end: '18:00' })).toBe(false);
    expect(service.isOffHours(now, { start: '09:00', end: '09:00' })).toBe(
      false,
    );
  });

  it('should resolve initials from first and last name', () => {
    expect(service.resolveInitials('Amelia Davis')).toBe('AD');
  });

  it('should resolve initials from a single name', () => {
    expect(service.resolveInitials('Kaique')).toBe('KA');
  });

  it('should strip accents and ignore extra whitespace', () => {
    expect(service.resolveInitials('  José   da   Silva  ')).toBe('JS');
  });

  it('should return empty initials for empty names', () => {
    expect(service.resolveInitials(undefined)).toBe('');
    expect(service.resolveInitials('   ')).toBe('');
  });

  it('should resolve a deterministic seed per user', () => {
    const first = service.resolveGenerativeSeed('user-1', 'Amelia Davis');
    const second = service.resolveGenerativeSeed('user-1', 'Amelia Davis');
    expect(first).toBe(second);
    expect(service.resolveGenerativeSeed('user-2', 'Amelia Davis')).not.toBe(
      first,
    );
  });

  it('should fall back to name when userId is missing', () => {
    expect(service.resolveGenerativeSeed(undefined, 'Amelia Davis')).toBe(
      service.resolveGenerativeSeed(undefined, 'Amelia Davis'),
    );
  });

  it('should map seeds onto a palette range', () => {
    expect(service.generatedPaletteIndex(7, 5)).toBe(2);
    expect(service.generatedPaletteIndex(0, 0)).toBe(0);
  });
});
