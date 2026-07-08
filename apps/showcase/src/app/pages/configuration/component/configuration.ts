import { Component, inject } from '@angular/core';

import {
  SolarisTranslateService,
  SolarisTranslatePipe,
  SolarisAccessibilityService,
  SolarisVisuallyHiddenDirective,
  SolarisThemeService,
  SolarisIconComponent,
} from '@solaris-ui/angular';
import {
  FontFamilySample,
  FontSizeSample,
  IconItem,
  TokenGroup,
} from '../model/configuration-page.interface';

@Component({
  standalone: true,
  imports: [
    SolarisVisuallyHiddenDirective,
    SolarisTranslatePipe,
    SolarisIconComponent,
  ],
  templateUrl: './configuration.html',
  styleUrls: ['./configuration.scss'],
})
export class ConfigurationPage {
  private readonly accessibilityService = inject(SolarisAccessibilityService);
  private readonly translateService = inject(SolarisTranslateService);
  private readonly themeService = inject(SolarisThemeService);

  readonly icons: IconItem[] = [
    { name: 'check' },
    { name: 'x' },
    { name: 'chevron-down' },
    { name: 'chevron-left' },
    { name: 'chevron-right' },
    { name: 'chevron-up' },
    { name: 'chevron-forward' },
    { name: 'chevron-backward' },
    { name: 'chevron-first' },
    { name: 'chevron-last' },
    { name: 'info' },
    { name: 'warning' },
    { name: 'danger' },
    { name: 'caution' },
    { name: 'success' },
    { name: 'shield-check' },
  ];

  readonly tokenGroups: TokenGroup[] = [
    {
      label: 'Surface',
      type: 'color',
      tokens: [
        { name: 'surface-base', cssVar: '--solaris-surface-base' },
        { name: 'surface-subtle', cssVar: '--solaris-surface-subtle' },
        { name: 'surface-muted', cssVar: '--solaris-surface-muted' },
        { name: 'surface-raised', cssVar: '--solaris-surface-raised' },
      ],
    },
    {
      label: 'Text',
      type: 'color',
      tokens: [
        { name: 'text-strong', cssVar: '--solaris-text-strong' },
        { name: 'text-default', cssVar: '--solaris-text-default' },
        { name: 'text-muted', cssVar: '--solaris-text-muted' },
        { name: 'text-subtle', cssVar: '--solaris-text-subtle' },
        { name: 'text-inverse', cssVar: '--solaris-text-inverse' },
      ],
    },
    {
      label: 'Border',
      type: 'border',
      tokens: [
        { name: 'border-subtle', cssVar: '--solaris-border-subtle' },
        { name: 'border-default', cssVar: '--solaris-border-default' },
        { name: 'border-strong', cssVar: '--solaris-border-strong' },
      ],
    },
    {
      label: 'Primary',
      type: 'color',
      tokens: [
        { name: 'primary-base', cssVar: '--solaris-primary-base' },
        { name: 'primary-surface', cssVar: '--solaris-primary-surface' },
        { name: 'primary-border', cssVar: '--solaris-primary-border' },
      ],
    },
    {
      label: 'Spacing',
      type: 'spacing',
      tokens: [
        { name: 'space-2', cssVar: '--solaris-spacing-2' },
        { name: 'space-4', cssVar: '--solaris-spacing-4' },
        { name: 'space-8', cssVar: '--solaris-spacing-8' },
        { name: 'space-12', cssVar: '--solaris-spacing-12' },
      ],
    },
    {
      label: 'Radius',
      type: 'radius',
      tokens: [
        { name: 'radius-sm', cssVar: '--solaris-radius-sm' },
        { name: 'radius-md', cssVar: '--solaris-radius-md' },
        { name: 'radius-lg', cssVar: '--solaris-radius-lg' },
        { name: 'radius-xl', cssVar: '--solaris-radius-xl' },
      ],
    },
  ];

  readonly fontSizes: FontSizeSample[] = [
    {
      token: 'xs',
      cssVar: '--solaris-font-size-xs',
      size: '0.75rem',
      className: 'configuration-font-sample--xs',
    },
    {
      token: 'sm',
      cssVar: '--solaris-font-size-sm',
      size: '0.875rem',
      className: 'configuration-font-sample--sm',
    },
    {
      token: 'md',
      cssVar: '--solaris-font-size-md',
      size: '1rem',
      className: 'configuration-font-sample--md',
    },
    {
      token: 'lg',
      cssVar: '--solaris-font-size-lg',
      size: '1.125rem',
      className: 'configuration-font-sample--lg',
    },
    {
      token: 'xl',
      cssVar: '--solaris-font-size-xl',
      size: '1.25rem',
      className: 'configuration-font-sample--xl',
    },
    {
      token: '2xl',
      cssVar: '--solaris-font-size-2xl',
      size: '1.5rem',
      className: 'configuration-font-sample--2xl',
    },
    {
      token: '3xl',
      cssVar: '--solaris-font-size-3xl',
      size: '1.875rem',
      className: 'configuration-font-sample--3xl',
    },
    {
      token: '4xl',
      cssVar: '--solaris-font-size-4xl',
      size: '2.25rem',
      className: 'configuration-font-sample--4xl',
    },
  ];

  readonly fontFamilies: FontFamilySample[] = [
    {
      label: 'Sans (UI)',
      cssVar: '--solaris-font-family-sans',
      fontName: 'Inter, system-ui, sans-serif',
      className: 'configuration-font-sample--sans',
    },
    {
      label: 'Mono (code)',
      cssVar: '--solaris-font-family-mono',
      fontName: 'JetBrains Mono, monospace',
      className: 'configuration-font-sample--mono',
    },
    {
      label: 'Display (brand)',
      cssVar: '--solaris-font-family-display',
      fontName: 'Space Grotesk, display',
      className: 'configuration-font-sample--display',
    },
    {
      label: 'Serif (editorial)',
      cssVar: '--solaris-font-family-serif',
      fontName: 'IBM Plex Serif, serif',
      className: 'configuration-font-sample--serif',
    },
  ];

  readonly metadataItems: { labelKey: string; value: string }[] = [
    { labelKey: 'configuration.meta.locale', value: this.locale },
    {
      labelKey: 'configuration.meta.fallback-locale',
      value: this.fallbackLocale,
    },
    { labelKey: 'configuration.meta.color-scheme', value: this.colorScheme },
    { labelKey: 'configuration.meta.density', value: this.density },
    {
      labelKey: 'configuration.meta.reduced-motion',
      value: this.reducedMotion ? 'true' : 'false',
    },
  ];

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

  getInterpolationValue(): string {
    return this.translateService.translate('greeting', { name: 'Kaique' });
  }

  getFallbackValue(): string {
    return this.translateService.translate('farewell');
  }

  getMissingValue(): string {
    return this.translateService.translate('nonexistent_key');
  }
}
