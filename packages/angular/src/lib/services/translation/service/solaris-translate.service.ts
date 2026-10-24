import {
  Injectable,
  PLATFORM_ID,
  inject,
  signal,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import type { SolarisTranslateConfig } from '../model/solaris-translate-config.interface';
import { SOLARIS_TRANSLATE_DEFAULT_CONFIG } from '../model/solaris-translate-defaults';
import { SOLARIS_TRANSLATE_CONFIG } from '../token/solaris-translate.tokens';
import type { SolarisLocale } from '../model/solaris-locale.types';
import type {
  SolarisTranslateParams,
  SolarisTranslationMap,
} from '../model/solaris-translation.types';

export const SOLARIS_TRANSLATE_PERSIST_KEY = 'solaris:locale';
export const SOLARIS_TRANSLATE_CANONICAL_LOCALE = 'en-US';

function mergeConfigs(
  injected?: SolarisTranslateConfig,
): SolarisTranslateConfig {
  if (!injected) return SOLARIS_TRANSLATE_DEFAULT_CONFIG;
  const merged: SolarisTranslateConfig = {
    ...SOLARIS_TRANSLATE_DEFAULT_CONFIG,
    ...injected,
    translations: {},
  };
  const allLocales = new Set([
    ...Object.keys(SOLARIS_TRANSLATE_DEFAULT_CONFIG.translations),
    ...Object.keys(injected.translations ?? {}),
  ]);
  for (const locale of allLocales) {
    merged.translations[locale] = {
      ...SOLARIS_TRANSLATE_DEFAULT_CONFIG.translations[locale],
      ...injected.translations?.[locale],
    };
  }
  return merged;
}

@Injectable({
  providedIn: 'root',
})
export class SolarisTranslateService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly config: SolarisTranslateConfig = mergeConfigs(
    inject(SOLARIS_TRANSLATE_CONFIG, { optional: true }) ?? undefined,
  );

  private readonly _locale: WritableSignal<SolarisLocale>;
  readonly locale: Signal<SolarisLocale>;

  constructor() {
    this._locale = signal(this.resolveInitialLocale());
    this.locale = this._locale.asReadonly();
  }

  get fallbackLocale(): SolarisLocale {
    return this.config.fallbackLocale;
  }

  normalizeLocale(raw: string): SolarisLocale {
    const base = raw.trim().toLowerCase().replace(/_/g, '-');
    if (base.startsWith('pt')) {
      return 'pt-BR';
    }
    if (base.startsWith('es')) {
      return 'es-419';
    }
    if (base.startsWith('en')) {
      return 'en-US';
    }
    return (base || SOLARIS_TRANSLATE_CANONICAL_LOCALE) as SolarisLocale;
  }

  setLocale(locale: string): void {
    const normalized = this.normalizeLocale(locale);
    this._locale.set(normalized);
    this.writeStoredLocale(normalized);
  }

  resetLocale(): void {
    this.clearStoredLocale();
    this._locale.set(this.resolveAutomaticLocale());
  }

  availableLocales(): readonly SolarisLocale[] {
    if (this.config.availableLocales) {
      return this.config.availableLocales;
    }
    return Object.keys(this.config.translations) as SolarisLocale[];
  }

  has(key: string, locale?: string): boolean {
    const target = (
      locale ? this.normalizeLocale(locale) : this._locale()
    ) as string;
    const map = this.config.translations[target];
    return !!map && key in map;
  }

  addTranslations(locale: string, map: SolarisTranslationMap): void {
    const normalized = this.normalizeLocale(locale) as string;
    this.config.translations[normalized] = {
      ...this.config.translations[normalized],
      ...map,
    };
  }

  translate(key: string, params?: SolarisTranslateParams): string {
    const translations = this.config.translations;
    const locale = this._locale() as string;
    const fallbackLocale = this.normalizeLocale(
      this.config.fallbackLocale,
    ) as string;

    const localeMap = translations[locale];
    if (localeMap && key in localeMap) {
      return this.interpolate(localeMap[key], params);
    }

    if (fallbackLocale) {
      const fallbackMap = translations[fallbackLocale];
      if (fallbackMap && key in fallbackMap) {
        return this.interpolate(fallbackMap[key], params);
      }
    }

    const defaultMap = translations[SOLARIS_TRANSLATE_CANONICAL_LOCALE];
    if (defaultMap && key in defaultMap) {
      return this.interpolate(defaultMap[key], params);
    }

    const resolved = this.config.resolver?.(key, params);
    if (resolved !== undefined && resolved !== key) {
      return resolved;
    }

    return key;
  }

  /** Alias for `translate()`, matching common i18n service conventions. */
  instant(key: string, params?: SolarisTranslateParams): string {
    return this.translate(key, params);
  }

  private resolveInitialLocale(): SolarisLocale {
    return this.readStoredLocale() ?? this.resolveAutomaticLocale();
  }

  private resolveAutomaticLocale(): SolarisLocale {
    const browser = this.resolveBrowserLocale();
    if (browser) {
      return browser;
    }
    if (this.config.locale) {
      return this.normalizeLocale(this.config.locale);
    }
    if (this.config.fallbackLocale) {
      return this.normalizeLocale(this.config.fallbackLocale);
    }
    return SOLARIS_TRANSLATE_CANONICAL_LOCALE;
  }

  private resolveBrowserLocale(): SolarisLocale | null {
    if (!this.config.useBrowserLocale) {
      return null;
    }
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    if (typeof navigator === 'undefined') {
      return null;
    }
    const candidates = [
      ...(navigator.languages ?? []),
      navigator.language,
    ].filter(
      (candidate): candidate is string =>
        typeof candidate === 'string' && candidate.length > 0,
    );
    for (const candidate of candidates) {
      const normalized = this.normalizeLocale(candidate) as string;
      if (this.config.translations[normalized]) {
        return normalized as SolarisLocale;
      }
    }
    return null;
  }

  private persistKey(): string | null {
    const key = this.config.persistKey ?? SOLARIS_TRANSLATE_PERSIST_KEY;
    return key === false ? null : key;
  }

  private storage(): Storage | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    if (typeof localStorage === 'undefined') {
      return null;
    }
    try {
      return localStorage;
    } catch {
      return null;
    }
  }

  private readStoredLocale(): SolarisLocale | null {
    const key = this.persistKey();
    const storage = this.storage();
    if (!key || !storage) {
      return null;
    }
    try {
      const raw = storage.getItem(key);
      return raw ? this.normalizeLocale(raw) : null;
    } catch {
      return null;
    }
  }

  private writeStoredLocale(locale: SolarisLocale): void {
    const key = this.persistKey();
    const storage = this.storage();
    if (!key || !storage) {
      return;
    }
    try {
      storage.setItem(key, locale);
    } catch {
      // Persistence is best-effort (private mode, quota): locale still applies in memory.
    }
  }

  private clearStoredLocale(): void {
    const key = this.persistKey();
    const storage = this.storage();
    if (!key || !storage) {
      return;
    }
    try {
      storage.removeItem(key);
    } catch {
      // Best-effort cleanup; the in-memory locale is already reset.
    }
  }

  private escapeRegExp(value: string): string {
    return value.replace(
      new RegExp(String.raw`[.*+?^\${}()|[\]\\]`, 'g'),
      String.raw`\$&`,
    );
  }

  private interpolate(value: string, params?: SolarisTranslateParams): string {
    if (!params) {
      return value;
    }

    let result = value;

    for (const [paramKey, paramValue] of Object.entries(params)) {
      const escapedParamKey = this.escapeRegExp(paramKey);

      result = result.replace(
        new RegExp(String.raw`\{\{\s*${escapedParamKey}\s*}}`, 'g'),
        String(paramValue),
      );
    }

    return result;
  }
}
