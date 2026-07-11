import type { SolarisPasswordStrength } from './password-field.types';
import {
  ALPHABET,
  DIGITS,
  SEQUENTIAL_MIN_LENGTH,
  REPEAT_MIN_COUNT,
} from './password-field-constants';

export function calculatePasswordStrength(
  value: string,
): SolarisPasswordStrength {
  if (!value) {
    return 'empty';
  }

  const score =
    scoreLength(value.length) + scoreDiversity(value) - scorePenalties(value);

  if (score <= 2) {
    return 'weak';
  }
  if (score <= 4) {
    return 'medium';
  }
  return 'strong';
}

function scoreLength(len: number): number {
  if (len >= 16) {
    return 3;
  }
  if (len >= 12) {
    return 2;
  }
  if (len >= 8) {
    return 1;
  }
  return 0;
}

function scoreDiversity(value: string): number {
  const types = [
    /[a-z]/.test(value),
    /[A-Z]/.test(value),
    /\d/.test(value),
    /[^a-zA-Z0-9]/.test(value),
  ].filter(Boolean).length;

  return Math.max(0, types - 1);
}

function scorePenalties(value: string): number {
  let penalty = 0;

  if (hasRepeatedChars(value)) {
    penalty += 1;
  }
  if (hasSequentialChars(value, ALPHABET)) {
    penalty += 1;
  }
  if (hasSequentialChars(value, DIGITS)) {
    penalty += 1;
  }

  return penalty;
}

function hasRepeatedChars(value: string): boolean {
  return new RegExp(String.raw`(.)\1{${REPEAT_MIN_COUNT - 1},}`).test(value);
}

function hasSequentialChars(value: string, charset: string): boolean {
  const lower = value.toLowerCase();
  const max = charset.length - SEQUENTIAL_MIN_LENGTH;

  for (let i = 0; i <= max; i++) {
    if (lower.includes(charset.slice(i, i + SEQUENTIAL_MIN_LENGTH))) {
      return true;
    }
  }

  return false;
}
