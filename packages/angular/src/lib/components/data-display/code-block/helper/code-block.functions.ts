import type {
  SolarisCodeBlockAppearance,
  SolarisCodeBlockLanguage,
  SolarisCodeBlockLayout,
  SolarisCodeBlockRadius,
  SolarisCodeBlockResolvedCommand,
  SolarisCodeBlockSize,
  SolarisCodeBlockVariant,
  SolarisCodeHighlightContext,
  SolarisCodeHighlighter,
  SolarisCodeHighlightResult,
} from '../model/code-block.types';
import {
  APPEARANCES,
  LAYOUTS,
  RADII,
  SIZES,
  VARIANTS,
} from '../model/code-block.defaults';
import {
  isPromiseLike,
  normalizeHighlightResult,
} from '../runtime/code-block-highlighting';

export function normalizeLayout(
  value: string | null | undefined,
): SolarisCodeBlockLayout {
  return typeof value === 'string' && LAYOUTS.has(value)
    ? (value as SolarisCodeBlockLayout)
    : 'block';
}

export function normalizeVariant(
  value: string | null | undefined,
): SolarisCodeBlockVariant {
  return typeof value === 'string' && VARIANTS.has(value)
    ? (value as SolarisCodeBlockVariant)
    : 'code';
}

export function normalizeAppearance(
  value: string | null | undefined,
): SolarisCodeBlockAppearance {
  return typeof value === 'string' && APPEARANCES.has(value)
    ? (value as SolarisCodeBlockAppearance)
    : 'surface';
}

export function normalizeSize(
  value: string | null | undefined,
): SolarisCodeBlockSize {
  return typeof value === 'string' && SIZES.has(value)
    ? (value as SolarisCodeBlockSize)
    : 'md';
}

export function normalizeRadius(
  value: string | null | undefined,
): SolarisCodeBlockRadius | null {
  if (value == null) {
    return null;
  }
  return RADII.has(value) ? (value as SolarisCodeBlockRadius) : null;
}

export function normalizePositiveInt(
  value: number | null | undefined,
  fallback: number,
): number {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
    return fallback;
  }
  return Math.floor(value);
}

export function normalizeMinOneInt(
  value: number | null | undefined,
  fallback: number,
): number {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 1) {
    return fallback;
  }
  return Math.floor(value);
}

export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === 'Enter' || event.key === ' ';
}

export function resolveSelectedCommandId(
  commands: readonly SolarisCodeBlockResolvedCommand[],
  selected: string | null,
  current: string | null,
): string | null {
  if (commands.length === 0) {
    return null;
  }
  if (selected && commands.some((command) => command.id === selected)) {
    return selected;
  }
  if (current && commands.some((command) => command.id === current)) {
    return current;
  }
  return commands[0]?.id ?? null;
}

export function runHighlight(
  highlighter: SolarisCodeHighlighter,
  code: string,
  language: SolarisCodeBlockLanguage | null,
  context: SolarisCodeHighlightContext,
  fallback: SolarisCodeHighlightResult,
): SolarisCodeHighlightResult | Promise<SolarisCodeHighlightResult> {
  try {
    const result = highlighter.highlight(code, language, context);
    if (!isPromiseLike(result)) {
      return normalizeHighlightResult(result, code, language);
    }
    return result
      .then((resolved) => normalizeHighlightResult(resolved, code, language))
      .catch(() => fallback);
  } catch {
    return fallback;
  }
}
