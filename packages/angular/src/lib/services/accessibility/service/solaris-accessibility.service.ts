import {
  Injectable,
  inject,
  signal,
  type Signal,
  PLATFORM_ID,
  type WritableSignal,
  DestroyRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SOLARIS_ACCESSIBILITY_CONFIG } from '../token/solaris-accessibility.tokens';
import type { SolarisAccessibilityConfig } from '../model/solaris-accessibility-config.interface';

let nextId = 0;

@Injectable({
  providedIn: 'root',
})
export class SolarisAccessibilityService {
  private readonly config: SolarisAccessibilityConfig;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly reducedMotionSignal: WritableSignal<boolean>;

  constructor() {
    this.config =
      inject(SOLARIS_ACCESSIBILITY_CONFIG, { optional: true }) ?? {};

    if (this.config.forceReducedMotion) {
      this.reducedMotionSignal = signal(true);
    } else if (
      this.config.respectSystemPreference &&
      isPlatformBrowser(this.platformId)
    ) {
      // SECURITY_EXCEPTION: window.matchMedia is the only browser API for reduced motion detection. Guarded by isPlatformBrowser. Tested.
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotionSignal = signal(mql.matches);

      const handler = (event: MediaQueryListEvent): void => {
        this.reducedMotionSignal.set(event.matches);
      };
      mql.addEventListener('change', handler);

      inject(DestroyRef).onDestroy(() => {
        mql.removeEventListener('change', handler);
      });
    } else {
      this.reducedMotionSignal = signal(false);
    }
  }

  get reducedMotion(): Signal<boolean> {
    return this.reducedMotionSignal.asReadonly();
  }

  get reducedMotionValue(): boolean {
    return this.reducedMotionSignal();
  }

  generateId(prefix: string): string {
    return `${prefix}-${++nextId}-${Date.now()}`;
  }

  generateDescriptionId(): string {
    return this.generateId('solaris-desc');
  }

  labelledBy(...ids: string[]): string | null {
    if (ids.length === 0) {
      return null;
    }
    return ids.join(' ');
  }
}
