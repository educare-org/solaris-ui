import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import type { SolarisTranslateConfig } from '../model/solaris-translate-config.interface';
import { SOLARIS_TRANSLATE_DEFAULT_CONFIG } from '../model/solaris-translate-defaults';
import { SOLARIS_TRANSLATE_CONFIG } from '../token/solaris-translate.tokens';
import type { SolarisLocale } from '../model/solaris-locale.types';
import type { SolarisTranslateParams } from '../model/solaris-translation.types';

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
      ...(SOLARIS_TRANSLATE_DEFAULT_CONFIG.translations[locale] ?? {}),
      ...(injected.translations?.[locale] ?? {}),
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

  get locale(): SolarisLocale {
    return this.resolveLocale();
  }

  get fallbackLocale(): SolarisLocale {
    return this.config.fallbackLocale;
  }

  translate(key: string, params?: SolarisTranslateParams): string {
    const translations = this.config.translations;
    const locale = this.resolveLocale() as string;
    const fallbackLocale = this.config.fallbackLocale as string;

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

    const defaultMap = translations['en-US'];
    if (defaultMap && key in defaultMap) {
      return this.interpolate(defaultMap[key], params);
    }

    return key;
  }

  private resolveLocale(): SolarisLocale {
    if (this.config.useBrowserLocale && isPlatformBrowser(this.platformId)) {
      const browserLocale = navigator.language;
      if (browserLocale) {
        return browserLocale;
      }
    }
    return this.config.locale;
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
