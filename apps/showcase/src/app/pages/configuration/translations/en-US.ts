export const EN_US_CONFIG: Record<string, string> = {
  'configuration.eyebrow': 'Configuration',
  'configuration.hero-title': 'Solaris setup contracts',
  'configuration.hero-description':
    'This area demonstrates providers, tokens, themes, i18n, accessibility, and icons that define the Solaris foundation.',
  'configuration.meta.locale': 'Locale',
  'configuration.meta.fallback-locale': 'Fallback',
  'configuration.meta.color-scheme': 'Color scheme',
  'configuration.meta.density': 'Density',
  'configuration.meta.reduced-motion': 'Reduced motion',
  'configuration.section.i18n': 'Internationalization',
  'configuration.section.i18n-desc':
    'Translation foundation with locale detection, interpolation, and fallback resolution.',
  'configuration.section.a11y': 'Accessibility',
  'configuration.section.a11y-desc':
    'Reduced motion support and visually hidden content for assistive technologies.',
  'configuration.section.theme': 'Theme',
  'configuration.section.theme-desc':
    'Color scheme, density, reduced motion preference, and root font-size strategy.',
  'configuration.section.typography': 'Typography',
  'configuration.section.typography-desc':
    'Font family and size tokens that define the Solaris typographic scale.',
  'configuration.section.tokens': 'Tokens',
  'configuration.section.tokens-desc':
    'Visual preview of design tokens available through the Solaris theme system.',
  'configuration.section.icons': 'Icons',
  'configuration.section.icons-desc':
    'Icons are registered by structured definition, not by raw SVG string.',
  'configuration.section.setup': 'Consumer setup',
  'configuration.section.setup-desc':
    'Recommended setup for applications consuming Solaris.',
  'configuration.label.locale': 'Current locale',
  'configuration.label.fallback-locale': 'Fallback locale',
  'configuration.label.interpolation': 'Translate: greeting with interpolation',
  'configuration.label.fallback':
    'Translate: missing key (falls back to fallbackLocale)',
  'configuration.label.missing': 'Translate: nonexistent key (returns key)',
  'configuration.label.reduced-motion': 'Reduced motion',
  'configuration.label.reduced-motion-value':
    'Reduced motion enabled: {{value}}',
  'configuration.label.visually-hidden': 'Visually hidden directive example',
  'configuration.label.color-scheme': 'Color scheme',
  'configuration.label.density': 'Density',
  'configuration.label.reduced-motion-pref': 'Reduced motion preference',
  'configuration.label.root-font-size': 'Root font-size strategy',
  'configuration.label.font-size-tokens': 'Font size tokens',
  'configuration.label.font-family-tokens': 'Font family tokens',
  'configuration.label.font-sans': 'Sans (UI)',
  'configuration.label.font-mono': 'Mono (code)',
  'configuration.label.font-display': 'Display (brand)',
  'configuration.label.font-serif': 'Serif (editorial)',
  'configuration.text.visible': 'This text is visible.',
  'configuration.text.sr-only':
    'This text is only available to screen readers.',
  'configuration.text.root-font-size':
    'Solaris uses 100% root font-size (browser default). Tokens use rem units and scale with user font-size preferences. Opt-in rem-10 strategy available via @include solaris.core((root-font-size: rem-10)).',
  'configuration.text.font-size-demo':
    'The quick brown fox jumps over the lazy dog.',
  'configuration.text.font-demo': 'Solaris demonstrates its font tokens.',
  'configuration.a11y-note':
    'Visually hidden content remains available to screen readers and is not removed from the accessibility tree.',
  'configuration.typography-note':
    'Solaris defines font tokens; the consuming application decides how to load the font files.',
};
