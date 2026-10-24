import { Injectable } from '@angular/core';

import type { SolarisAvatarWorkingHours } from '../model/avatar.types';

export const SOLARIS_AVATAR_DEFAULT_WORKING_HOURS: SolarisAvatarWorkingHours =
  Object.freeze({ start: '09:00', end: '18:00' });

function parseHhMm(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function minutesOfDayInTimezone(date: Date, timezone?: string): number {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      ...(timezone ? { timeZone: timezone } : {}),
    }).formatToParts(date);
    const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
    const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
    return (hour % 24) * 60 + minute;
  } catch {
    return date.getHours() * 60 + date.getMinutes();
  }
}

@Injectable({
  providedIn: 'root',
})
export class SolarisAvatarPresenceService {
  isOffHours(
    now: Date,
    workingHours: SolarisAvatarWorkingHours = SOLARIS_AVATAR_DEFAULT_WORKING_HOURS,
    timezone?: string,
  ): boolean {
    const start = parseHhMm(workingHours.start);
    const end = parseHhMm(workingHours.end);
    if (start === null || end === null) return false;
    if (start === end) return false;

    const current = minutesOfDayInTimezone(now, timezone);
    const overnight = end < start;
    const inHours = overnight
      ? current >= start || current < end
      : current >= start && current < end;
    return !inHours;
  }

  resolveInitials(name: string | undefined): string {
    if (!name) return '';
    const words = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    if (words.length === 0) return '';
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }

  resolveGenerativeSeed(userId: string | undefined, name?: string): number {
    const source = userId ?? name ?? '';
    let hash = 0x811c9dc5;
    for (let i = 0; i < source.length; i++) {
      hash ^= source.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
  }

  generatedPaletteIndex(seed: number, paletteCount: number): number {
    if (paletteCount <= 0) return 0;
    return Math.abs(seed) % paletteCount;
  }
}
