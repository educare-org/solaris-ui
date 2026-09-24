import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import {
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
} from '@solaris-ui/angular';

import { ShowcaseColorScheme, STORAGE_KEY } from '../model/theme-toggle.model';

function isColorScheme(value: unknown): value is ShowcaseColorScheme {
  return value === 'light' || value === 'dark' || value === 'system';
}

@Component({
  standalone: true,
  imports: [SolarisSegmentedControlComponent, SolarisSegmentedItemComponent],
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.html',
  styleUrls: ['./theme-toggle.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseThemeToggle {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly activeTheme = signal<ShowcaseColorScheme>('system');

  constructor() {
    if (!this.isBrowser) {
      return;
    }
    const initial = this.readStoredTheme();
    this.activeTheme.set(initial);
    this.applyTheme(initial);
  }

  protected setTheme(theme: unknown): void {
    if (!isColorScheme(theme)) {
      return;
    }
    this.activeTheme.set(theme);
    if (!this.isBrowser) {
      return;
    }
    this.writeStoredTheme(theme);
    this.applyTheme(theme);
  }

  private readStoredTheme(): ShowcaseColorScheme {
    try {
      const stored =
        this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      if (isColorScheme(stored)) {
        return stored;
      }
    } catch {
      // Storage unavailable (e.g. private mode) — fall through to DOM state.
    }
    const current = this.document.documentElement.dataset['theme'];
    if (current === 'light' || current === 'dark') {
      return current;
    }
    return 'system';
  }

  private writeStoredTheme(theme: ShowcaseColorScheme): void {
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage unavailable — theme still applies for this session.
    }
  }

  private applyTheme(theme: ShowcaseColorScheme): void {
    if (theme === 'system') {
      delete this.document.documentElement.dataset['theme'];
    } else {
      this.document.documentElement.dataset['theme'] = theme;
    }
  }
}
