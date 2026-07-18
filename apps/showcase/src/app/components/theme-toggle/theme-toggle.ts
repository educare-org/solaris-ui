import { Component, inject, PLATFORM_ID } from '@angular/core';

import {
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
} from '@solaris-ui/angular';

const STORAGE_KEY = 'solaris-theme';

@Component({
  standalone: true,
  imports: [SolarisSegmentedControlComponent, SolarisSegmentedItemComponent],
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.html',
  styleUrls: ['./theme-toggle.scss'],
})
export class ShowcaseThemeToggle {
  private readonly platformId = inject(PLATFORM_ID);
  protected activeTheme: 'light' | 'dark' | 'system' = 'system';

  constructor() {
    const isBrowser = this.platformId === 'browser';
    if (!isBrowser) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      this.activeTheme = stored;
    } else {
      const current = document.documentElement.getAttribute('data-theme');
      if (current === 'light' || current === 'dark') {
        this.activeTheme = current;
      }
    }

    this.applyTheme(this.activeTheme);
  }

  protected setTheme(theme: unknown): void {
    if (theme !== 'light' && theme !== 'dark' && theme !== 'system') return;
    this.activeTheme = theme;
    const isBrowser = this.platformId === 'browser';
    if (!isBrowser) return;

    localStorage.setItem(STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: 'light' | 'dark' | 'system'): void {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
}
