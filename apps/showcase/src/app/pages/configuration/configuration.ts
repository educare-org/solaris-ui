import { Component, inject } from '@angular/core';

import {
  SolarisTranslateService,
  SolarisTranslatePipe,
  SolarisAccessibilityService,
  SolarisVisuallyHiddenDirective,
  SolarisThemeService,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisVisuallyHiddenDirective, SolarisTranslatePipe],
  templateUrl: './configuration.html',
})
export class ConfigurationPage {
  private readonly accessibilityService = inject(SolarisAccessibilityService);
  private readonly translateService = inject(SolarisTranslateService);
  private readonly themeService = inject(SolarisThemeService);

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
}
