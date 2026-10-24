import { Injectable, inject } from '@angular/core';

import type { SolarisIconDefinition } from '../model/solaris-icon-definition.interface';
import { SOLARIS_ICONS_CONFIG } from '../token/solaris-icon.tokens';
import { SOLARIS_BUILT_IN_ICONS } from '../icons';

const NAME_RE = /^[a-z0-9-]+$/;
const UNSAFE_RE =
  /<\s*script|javascript:|data:text\/html|expression\s*\(|on\w+\s*=/i;

function hasUnsafeValue(value: unknown): boolean {
  return typeof value === 'string' && UNSAFE_RE.test(value);
}

function isValidDefinition(icon: SolarisIconDefinition): boolean {
  if (!icon || !NAME_RE.test(icon.name)) return false;
  if (hasUnsafeValue(icon.viewBox)) return false;
  if (
    hasUnsafeValue(icon.fill) ||
    hasUnsafeValue(icon.stroke) ||
    hasUnsafeValue(icon.strokeLinecap) ||
    hasUnsafeValue(icon.strokeLinejoin)
  ) {
    return false;
  }
  if (!Array.isArray(icon.elements) || icon.elements.length === 0) return false;
  return !icon.elements.some((el) => Object.values(el).some(hasUnsafeValue));
}

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
        if (!this.registry.has(icon.name) && isValidDefinition(icon)) {
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
    if (!this.registry.has(icon.name) && isValidDefinition(icon)) {
      this.registry.set(icon.name, icon);
    }
  }

  registerIcons(icons: SolarisIconDefinition[]): void {
    for (const icon of icons) {
      this.registerIcon(icon);
    }
  }
}
