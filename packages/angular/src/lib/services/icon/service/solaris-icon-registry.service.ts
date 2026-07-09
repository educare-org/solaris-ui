import { Injectable, inject } from '@angular/core';

import type { SolarisIconDefinition } from '../model/solaris-icon-definition.interface';
import { SOLARIS_ICONS_CONFIG } from '../token/solaris-icon.tokens';
import { SOLARIS_BUILT_IN_ICONS } from '../icons';

@Injectable({ providedIn: 'root' })
export class SolarisIconRegistryService {
  private readonly registry = new Map<string, SolarisIconDefinition>();

  constructor() {
    const config = inject(SOLARIS_ICONS_CONFIG, { optional: true });

    for (const icon of SOLARIS_BUILT_IN_ICONS) {
      this.registry.set(icon.name, icon);
    }

    if (config?.extraIcons) {
      for (const icon of config.extraIcons) {
        if (!this.registry.has(icon.name)) {
          this.registry.set(icon.name, icon);
        }
      }
    }
  }

  getIcon(name: string): SolarisIconDefinition | undefined {
    return this.registry.get(name);
  }

  hasIcon(name: string): boolean {
    return this.registry.has(name);
  }

  registerIcon(icon: SolarisIconDefinition): void {
    if (!this.registry.has(icon.name)) {
      this.registry.set(icon.name, icon);
    }
  }

  registerIcons(icons: SolarisIconDefinition[]): void {
    for (const icon of icons) {
      this.registerIcon(icon);
    }
  }
}
