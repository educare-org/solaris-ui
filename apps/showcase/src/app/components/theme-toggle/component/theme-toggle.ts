import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import {
  SolarisIconButtonDirective,
  SolarisIconComponent,
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
  SolarisTranslatePipe,
  type SolarisSegmentedControlDensity,
  type SolarisSegmentedControlSize,
} from '@solaris-ui/angular';

import type { ShowcaseBaseTheme } from '../model/theme-toggle.model';
import { ShowcaseThemeService } from '../service/showcase-theme.service';

function isBaseTheme(value: unknown): value is ShowcaseBaseTheme {
  return value === 'light' || value === 'dark' || value === 'system';
}

@Component({
  standalone: true,
  imports: [
    SolarisSegmentedControlComponent,
    SolarisSegmentedItemComponent,
    SolarisIconButtonDirective,
    SolarisIconComponent,
    SolarisTranslatePipe,
  ],
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.html',
  styleUrls: ['./theme-toggle.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-full-width]': 'fullWidth() || undefined',
  },
})
export class ShowcaseThemeToggle {
  private readonly themeService = inject(ShowcaseThemeService);

  readonly showScheme = input<boolean>(true);
  readonly showHighContrast = input<boolean>(true);
  readonly schemeDisplay = input<'icons' | 'labels'>('icons');
  readonly fullWidth = input<boolean>(false);
  readonly size = input<SolarisSegmentedControlSize>('md');
  readonly density = input<SolarisSegmentedControlDensity | undefined>(
    undefined,
  );

  protected readonly baseTheme = this.themeService.baseTheme;
  protected readonly highContrast = this.themeService.highContrast;

  constructor() {
    this.themeService.ensureInitialized();
  }

  protected setTheme(theme: unknown): void {
    if (!isBaseTheme(theme)) {
      return;
    }
    this.themeService.setBaseTheme(theme);
  }

  protected toggleHighContrast(): void {
    this.themeService.toggleHighContrast();
  }
}
