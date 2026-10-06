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
      label: 'Neutral surfaces',
      type: 'color',
      tokens: [
        { name: 'neutral-page', cssVar: '--solaris-neutral-page' },
        { name: 'neutral-default', cssVar: '--solaris-neutral-default' },
        { name: 'neutral-subtle', cssVar: '--solaris-neutral-subtle' },
        { name: 'neutral-sunken', cssVar: '--solaris-neutral-sunken' },
        { name: 'neutral-overlay', cssVar: '--solaris-neutral-overlay' },
      ],
    },
    {
      label: 'Neutral text',
      type: 'color',
      tokens: [
        {
          name: 'neutral-text-heading',
          cssVar: '--solaris-neutral-text-heading',
        },
        { name: 'neutral-text-body', cssVar: '--solaris-neutral-text-body' },
        {
          name: 'neutral-text-secondary',
          cssVar: '--solaris-neutral-text-secondary',
        },
        {
          name: 'neutral-text-tertiary',
          cssVar: '--solaris-neutral-text-tertiary',
        },
        {
          name: 'neutral-text-inverse',
          cssVar: '--solaris-neutral-text-inverse',
        },
      ],
    },
    {
      label: 'Neutral borders',
      type: 'border',
      tokens: [
        {
          name: 'neutral-border-subtle',
          cssVar: '--solaris-neutral-border-subtle',
        },
        {
          name: 'neutral-border-default',
          cssVar: '--solaris-neutral-border-default',
        },
        {
          name: 'neutral-border-strong',
          cssVar: '--solaris-neutral-border-strong',
        },
      ],
    },
    {
      label: 'Primary',
      type: 'color',
      tokens: [
        { name: 'primary-solid', cssVar: '--solaris-primary-solid' },
        { name: 'primary-soft', cssVar: '--solaris-primary-soft' },
        { name: 'primary-border', cssVar: '--solaris-primary-border' },
        { name: 'primary-foreground', cssVar: '--solaris-primary-foreground' },
      ],
    },
    {
      label: 'Accent',
      type: 'color',
      tokens: [
        { name: 'accent-solid', cssVar: '--solaris-accent-solid' },
        { name: 'accent-soft', cssVar: '--solaris-accent-soft' },
        { name: 'accent-border', cssVar: '--solaris-accent-border' },
        { name: 'accent-foreground', cssVar: '--solaris-accent-foreground' },
      ],
    },
    {
      label: 'Violet',
      type: 'color',
      tokens: [
        { name: 'violet-solid', cssVar: '--solaris-violet-solid' },
        { name: 'violet-soft', cssVar: '--solaris-violet-soft' },
        { name: 'violet-border', cssVar: '--solaris-violet-border' },
        { name: 'violet-foreground', cssVar: '--solaris-violet-foreground' },
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
      size: '12px',
      className: 'configuration-font-sample--xs',
    },
    {
      token: 'sm',
      cssVar: '--solaris-font-size-sm',
      size: '14px',
      className: 'configuration-font-sample--sm',
    },
    {
      token: 'md',
      cssVar: '--solaris-font-size-md',
      size: '16px',
      className: 'configuration-font-sample--md',
    },
    {
      token: 'lg',
      cssVar: '--solaris-font-size-lg',
      size: '18px',
      className: 'configuration-font-sample--lg',
    },
    {
      token: 'xl',
      cssVar: '--solaris-font-size-xl',
      size: '20px',
      className: 'configuration-font-sample--xl',
    },
    {
      token: '2xl',
      cssVar: '--solaris-font-size-2xl',
      size: '24px',
      className: 'configuration-font-sample-2xl',
    },
    {
      token: '3xl',
      cssVar: '--solaris-font-size-3xl',
      size: '30px',
      className: 'configuration-font-sample-3xl',
    },
    {
      token: '4xl',
      cssVar: '--solaris-font-size-4xl',
      size: '36px',
      className: 'configuration-font-sample-4xl',
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
