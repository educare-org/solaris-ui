import {
  type EnvironmentProviders,
  makeEnvironmentProviders,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import type {
  SolarisCodeBlockLanguage,
  SolarisCodeHighlightContext,
  SolarisCodeHighlightResult,
  SolarisCodeHighlightToken,
  SolarisCodeHighlighter,
} from '../model/code-block.types';
import {
  createFallbackHighlight,
  createPlainHighlight,
  normalizeCodeBlockLanguage,
  resolveHighlightLanguage,
  splitIntoLines,
} from '../runtime/code-block-highlighting';
import { SOLARIS_CODE_HIGHLIGHTER } from '../model/code-block.tokens';

const DEFAULT_LIGHT_THEME = 'github-light';
const DEFAULT_DARK_THEME = 'github-dark';
const RESULT_CACHE_LIMIT = 250;

const SUPPORTED_LANGUAGES = [
  'bash',
  'css',
  'html',
  'java',
  'javascript',
  'json',
  'powershell',
  'scss',
  'typescript',
] as const;

type SolarisShikiLanguage = (typeof SUPPORTED_LANGUAGES)[number];

interface SolarisShikiToken {
  readonly content: string;
  readonly color?: string;
  readonly fontStyle?: number;
}

interface SolarisShikiTokenizedLines {
  readonly tokens: readonly (readonly SolarisShikiToken[])[];
}

interface SolarisShikiInstance {
  codeToTokens(
    code: string,
    options: { readonly lang: SolarisShikiLanguage; readonly theme: string },
  ): SolarisShikiTokenizedLines;
}

export interface SolarisShikiHighlighterConfig {
  readonly lightTheme?: string;
  readonly darkTheme?: string;
}

export function provideSolarisShikiHighlighter(
  config: SolarisShikiHighlighterConfig = {},
): EnvironmentProviders {
  const resolved: Required<SolarisShikiHighlighterConfig> = {
    lightTheme: config.lightTheme ?? DEFAULT_LIGHT_THEME,
    darkTheme: config.darkTheme ?? DEFAULT_DARK_THEME,
  };
  return makeEnvironmentProviders([
    {
      provide: SOLARIS_CODE_HIGHLIGHTER,
      useFactory: (platformId: object): SolarisCodeHighlighter =>
        new SolarisShikiCodeHighlighter(platformId, resolved),
      deps: [PLATFORM_ID],
    },
  ]);
}

class SolarisShikiCodeHighlighter implements SolarisCodeHighlighter {
  private readonly resultCache = new Map<string, SolarisCodeHighlightResult>();
  private readonly pendingCache = new Map<
    string,
    Promise<SolarisCodeHighlightResult>
  >();
  private instancePromise: Promise<SolarisShikiInstance | null> | null = null;

  constructor(
    private readonly platformId: object,
    private readonly config: Required<SolarisShikiHighlighterConfig>,
  ) {}

  highlight(
    code: string,
    language: SolarisCodeBlockLanguage | null,
    context?: SolarisCodeHighlightContext,
  ): SolarisCodeHighlightResult | Promise<SolarisCodeHighlightResult> {
    const identityLanguage = normalizeCodeBlockLanguage(language);
    const shikiLanguage = toShikiLanguage(identityLanguage);
    if (!isPlatformBrowser(this.platformId)) {
      return createFallbackHighlight(code, identityLanguage);
    }
    if (!shikiLanguage) {
      return createPlainHighlight(code, identityLanguage);
    }
    const theme =
      context?.colorScheme === 'dark'
        ? this.config.darkTheme
        : this.config.lightTheme;
    const cacheKey = `${theme}::${shikiLanguage}::${code}`;
    const cached = this.resultCache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const pending = this.pendingCache.get(cacheKey);
    if (pending) {
      return pending;
    }
    const highlight = this.highlightWithShiki(
      code,
      identityLanguage,
      shikiLanguage,
      theme,
      cacheKey,
    );
    this.pendingCache.set(cacheKey, highlight);
    return highlight.finally(() => {
      if (this.pendingCache.get(cacheKey) === highlight) {
        this.pendingCache.delete(cacheKey);
      }
    });
  }

  private async highlightWithShiki(
    code: string,
    identityLanguage: SolarisCodeBlockLanguage,
    shikiLanguage: SolarisShikiLanguage,
    theme: string,
    cacheKey: string,
  ): Promise<SolarisCodeHighlightResult> {
    try {
      const instance = await this.loadInstance();
      if (!instance) {
        return createFallbackHighlight(code, identityLanguage);
      }
      const tokenized = instance.codeToTokens(code, {
        lang: shikiLanguage,
        theme,
      });
      const result: SolarisCodeHighlightResult = {
        language: identityLanguage,
        lines: mapTokenLines(code, tokenized.tokens),
      };
      this.resultCache.set(cacheKey, result);
      if (this.resultCache.size > RESULT_CACHE_LIMIT) {
        const oldest = this.resultCache.keys().next().value;
        if (oldest) {
          this.resultCache.delete(oldest);
        }
      }
      return result;
    } catch {
      return createFallbackHighlight(code, identityLanguage);
    }
  }

  private loadInstance(): Promise<SolarisShikiInstance | null> {
    if (!this.instancePromise) {
      this.instancePromise = loadShiki(this.config).catch(() => null);
    }
    return this.instancePromise;
  }
}

async function loadShiki(
  config: Required<SolarisShikiHighlighterConfig>,
): Promise<SolarisShikiInstance> {
  const shiki = await import('shiki');
  return shiki.createHighlighter({
    themes: [config.lightTheme, config.darkTheme],
    langs: [...SUPPORTED_LANGUAGES],
  });
}

function toShikiLanguage(language: string): SolarisShikiLanguage | null {
  const resolved = resolveHighlightLanguage(language);
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(resolved)
    ? (resolved as SolarisShikiLanguage)
    : null;
}

function mapTokenLines(
  code: string,
  lines: readonly (readonly SolarisShikiToken[])[],
): SolarisCodeHighlightResult['lines'] {
  return splitIntoLines(code).map((originalLine, index) => {
    const tokenLine = lines[index] ?? [];
    if (tokenLine.length === 0) {
      return { tokens: [{ text: originalLine, kind: 'plain' }] };
    }
    return { tokens: tokenLine.map(toHighlightToken) };
  });
}

function toHighlightToken(token: SolarisShikiToken): SolarisCodeHighlightToken {
  const style = token.fontStyle ?? 0;
  return {
    text: token.content,
    kind: 'plain',
    color: token.color ?? null,
    fontStyle: (style & 1) !== 0 ? 'italic' : null,
    fontWeight: (style & 2) !== 0 ? '700' : null,
    textDecoration: (style & 4) !== 0 ? 'underline' : null,
  };
}
