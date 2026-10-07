// SECURITY_EXCEPTION_FILE: getComputedStyle(document.documentElement) reads the --solaris-density-default CSS custom property set by the theme() SCSS mixin. This is the only way to connect SCSS-configured density to the runtime; it is SSR-safe via the injected DOCUMENT token and isPlatformBrowser guard.
// SECURITY_EXCEPTION_FILE: documentElement.getAttribute(data-density-default) reads the SSR-safe density default written by the consumer server, so server and client resolve the same density before styles load.
import { Injectable, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, DOCUMENT } from '@angular/core';

import type { SolarisDensity } from '../model/solaris-theme.types';
import { SOLARIS_THEME_CONFIG } from '../token/solaris-theme.tokens';

export const SOLARIS_DENSITY_DEFAULT_ATTRIBUTE = 'data-density-default';

const DENSITIES: ReadonlySet<string> = new Set([
  'compact',
  'normal',
  'comfortable',
]);

@Injectable({ providedIn: 'root' })
export class SolarisThemeService {
  private readonly config = inject(SOLARIS_THEME_CONFIG, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  get colorScheme(): string {
    return this.config?.colorScheme ?? 'system';
  }

  get density(): SolarisDensity {
    const explicit = this.config?.density;
    if (explicit) {
      return explicit;
    }
    return (
      this.readDensityDefaultAttribute() ??
      this.readDensityDefaultCss() ??
      'normal'
    );
  }

  get reducedMotion(): string {
    return this.config?.reducedMotion ?? 'auto';
  }

  private readDensityDefaultAttribute(): SolarisDensity | null {
    const value = this.document.documentElement
      .getAttribute(SOLARIS_DENSITY_DEFAULT_ATTRIBUTE)
      ?.trim();
    if (value && DENSITIES.has(value)) {
      return value as SolarisDensity;
    }
    return null;
  }

  private readDensityDefaultCss(): SolarisDensity | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const value = getComputedStyle(this.document.documentElement)
      .getPropertyValue('--solaris-density-default')
      .trim();
    if (DENSITIES.has(value)) {
      return value as SolarisDensity;
    }
    return null;
  }
}
