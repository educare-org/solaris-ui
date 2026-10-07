import {
  Injectable,
  inject,
  signal,
  type Signal,
  PLATFORM_ID,
  DOCUMENT,
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
  private readonly document = inject(DOCUMENT);
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
      // SECURITY_EXCEPTION: reduced-motion detection uses matchMedia via the Angular DOCUMENT token (defaultView) instead of the global window; SSR-safe via isPlatformBrowser guard; matchMedia has no Renderer2 alternative; read-only query with the change listener removed on destroy; covered by accessibility service tests.
      const view = this.document.defaultView;
      const mql =
        view && typeof view.matchMedia === 'function'
          ? view.matchMedia('(prefers-reduced-motion: reduce)')
          : null;
      this.reducedMotionSignal = signal(mql?.matches ?? false);

      const handler = (event: MediaQueryListEvent): void => {
        this.reducedMotionSignal.set(event.matches);
      };
      mql?.addEventListener('change', handler);

      inject(DestroyRef).onDestroy(() => {
        mql?.removeEventListener('change', handler);
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
