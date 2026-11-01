import {
  DOCUMENT,
  Injectable,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import {
  HIGH_CONTRAST_STORAGE_KEY,
  STORAGE_KEY,
  type ShowcaseBaseTheme,
} from '../model/theme-toggle.model';

function isBaseTheme(value: unknown): value is ShowcaseBaseTheme {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Shared theme state for every `app-theme-toggle` instance.
 *
 * The shell renders several toggles at once (header scheme control +
 * header contrast button, mobile nav contrast button + sidebar scheme
 * control). Each toggle used to own its `baseTheme`/`highContrast`
 * signals, so picking "Claro" in the sidebar and then pressing HC in
 * the top bar combined a stale base (`system`) with HC — resolving to
 * `high-contrast-dark` on dark-preferring devices. Centralizing the
 * signals here keeps all instances in sync.
 */
@Injectable({ providedIn: 'root' })
export class ShowcaseThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly baseTheme = signal<ShowcaseBaseTheme>('system');
  readonly highContrast = signal<boolean>(false);

  private initialized = false;

  ensureInitialized(): void {
    if (!this.isBrowser || this.initialized) {
      return;
    }
    this.initialized = true;
    const { base, highContrast } = this.readStoredTheme();
    this.baseTheme.set(base);
    this.highContrast.set(highContrast);
    this.applyTheme(base, highContrast);
  }

  setBaseTheme(theme: ShowcaseBaseTheme): void {
    this.ensureInitialized();
    this.baseTheme.set(theme);
    this.persistAndApply();
  }

  toggleHighContrast(): void {
    this.ensureInitialized();
    this.highContrast.update((value) => !value);
    this.persistAndApply();
  }

  private persistAndApply(): void {
    if (!this.isBrowser) {
      return;
    }
    const base = this.baseTheme();
    const highContrast = this.highContrast();
    this.writeStoredTheme(base, highContrast);
    this.applyTheme(base, highContrast);
  }

  private readStoredTheme(): {
    base: ShowcaseBaseTheme;
    highContrast: boolean;
  } {
    let base: ShowcaseBaseTheme = 'system';
    let highContrast = false;

    try {
      const stored =
        this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      if (isBaseTheme(stored)) {
        base = stored;
      } else if (stored === 'high-contrast') {
        base = 'light';
        highContrast = true;
      } else if (stored === 'high-contrast-dark') {
        base = 'dark';
        highContrast = true;
      } else {
        const current = this.document.documentElement.dataset['theme'];
        if (isBaseTheme(current)) {
          base = current;
        } else if (current === 'high-contrast') {
          base = 'light';
          highContrast = true;
        } else if (current === 'high-contrast-dark') {
          base = 'dark';
          highContrast = true;
        }
      }
    } catch {
      // no-op
    }

    try {
      const storedContrast = this.document.defaultView?.localStorage.getItem(
        HIGH_CONTRAST_STORAGE_KEY,
      );
      if (storedContrast === 'true') {
        highContrast = true;
      } else if (storedContrast === 'false') {
        highContrast = false;
      }
    } catch {
      // no-op
    }

    return { base, highContrast };
  }

  private writeStoredTheme(
    base: ShowcaseBaseTheme,
    highContrast: boolean,
  ): void {
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, base);
      this.document.defaultView?.localStorage.setItem(
        HIGH_CONTRAST_STORAGE_KEY,
        String(highContrast),
      );
    } catch {
      // no-op
    }
  }

  private applyTheme(base: ShowcaseBaseTheme, highContrast: boolean): void {
    if (!highContrast) {
      if (base === 'system') {
        delete this.document.documentElement.dataset['theme'];
      } else {
        this.document.documentElement.dataset['theme'] = base;
      }
      return;
    }

    if (base === 'light') {
      this.document.documentElement.dataset['theme'] = 'high-contrast';
      return;
    }
    if (base === 'dark') {
      this.document.documentElement.dataset['theme'] = 'high-contrast-dark';
      return;
    }
    const prefersDark = this.document.defaultView?.matchMedia?.(
      '(prefers-color-scheme: dark)',
    )?.matches;
    this.document.documentElement.dataset['theme'] = prefersDark
      ? 'high-contrast-dark'
      : 'high-contrast';
  }
}
