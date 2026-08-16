// SECURITY_EXCEPTION_FILE: getComputedStyle(document.documentElement) reads the --solaris-density-default CSS custom property set by the theme() SCSS mixin. This is the only way to connect SCSS-configured density to the runtime; it is SSR-safe via the injected DOCUMENT token and isPlatformBrowser guard.
import { Injectable, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, DOCUMENT } from '@angular/core';

import type { SolarisDensity } from '../model/solaris-theme.types';
import { SOLARIS_THEME_CONFIG } from '../token/solaris-theme.tokens';

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
    return this.readDensityDefault() ?? 'normal';
  }

  get reducedMotion(): string {
    return this.config?.reducedMotion ?? 'auto';
  }

  private readDensityDefault(): SolarisDensity | null {
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
