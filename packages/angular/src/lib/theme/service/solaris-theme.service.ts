import { Injectable, inject } from '@angular/core';

import { SOLARIS_THEME_CONFIG } from '../token/solaris-theme.tokens';

@Injectable({ providedIn: 'root' })
export class SolarisThemeService {
  private readonly config = inject(SOLARIS_THEME_CONFIG, { optional: true });

  get colorScheme(): string {
    return this.config?.colorScheme ?? 'system';
  }

  get density(): string {
    return this.config?.density ?? 'comfortable';
  }

  get reducedMotion(): string {
    return this.config?.reducedMotion ?? 'auto';
  }
}
