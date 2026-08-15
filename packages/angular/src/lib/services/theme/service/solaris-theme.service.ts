import { Injectable, inject } from '@angular/core';

import type { SolarisDensity } from '../model/solaris-theme.types';
import { SOLARIS_THEME_CONFIG } from '../token/solaris-theme.tokens';

@Injectable({ providedIn: 'root' })
export class SolarisThemeService {
  private readonly config = inject(SOLARIS_THEME_CONFIG, { optional: true });

  get colorScheme(): string {
    return this.config?.colorScheme ?? 'system';
  }

  get density(): SolarisDensity {
    return this.config?.density ?? 'normal';
  }

  get reducedMotion(): string {
    return this.config?.reducedMotion ?? 'auto';
  }
}
