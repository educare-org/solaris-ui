import { Component, inject } from '@angular/core';

import {
  SolarisTranslateService,
  SolarisTranslatePipe,
  SolarisAccessibilityService,
  SolarisVisuallyHiddenDirective,
  SolarisThemeService,
  SolarisIconRegistryService,
  SolarisIconComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisVisuallyHiddenDirective,
    SolarisTranslatePipe,
    SolarisIconComponent,
  ],
  templateUrl: './configuration.html',
})
export class ConfigurationPage {
  private readonly accessibilityService = inject(SolarisAccessibilityService);
  private readonly iconRegistry = inject(SolarisIconRegistryService);
  private readonly translateService = inject(SolarisTranslateService);
  private readonly themeService = inject(SolarisThemeService);

  readonly builtInIconNames = [
    'check',
    'x',
    'chevron-down',
    'chevron-right',
    'info',
    'warning',
    'danger',
    'success',
    'loader',
  ] as const;

  get locale(): string {
    return this.translateService.locale as string;
  }

  get fallbackLocale(): string {
    return this.translateService.fallbackLocale as string;
  }

  get reducedMotion(): boolean {
    return this.accessibilityService.reducedMotionValue;
  }

  get colorScheme(): string {
    return this.themeService.colorScheme;
  }

  get density(): string {
    return this.themeService.density;
  }

  get reducedMotionPref(): string {
    return this.themeService.reducedMotion;
  }

  get builtInIconCount(): number {
    let count = 0;
    for (const name of this.builtInIconNames) {
      if (this.iconRegistry.hasIcon(name)) {
        count++;
      }
    }
    return count;
  }
}
