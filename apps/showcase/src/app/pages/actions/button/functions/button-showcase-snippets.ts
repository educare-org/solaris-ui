export function buildButtonAppearanceColorCode(
  appearance: string,
  color: string,
): string {
  return [
    `<button solaris-button appearance="${appearance}" color="${color}">`,
    '  Action',
    '</button>',
  ].join('\n');
}

export function buildButtonSizeDensityCode(
  size: string,
  density: string,
): string {
  return [
    `<button solaris-button size="${size}" density="${density}" color="primary">`,
    '  Save',
    '</button>',
  ].join('\n');
}

export function buildButtonIconCode(tab: string): string {
  switch (tab) {
    case 'icon-after':
      return [
        '<button solaris-button color="primary">',
        '  Continue',
        '  <solaris-icon solaris-button-icon name="chevron-right" [decorative]="true" />',
        '</button>',
      ].join('\n');
    case 'icon-input-start':
      return [
        '<button solaris-button icon="check" color="primary">',
        '  Confirm',
        '</button>',
      ].join('\n');
    case 'icon-input-end':
      return [
        '<button solaris-button icon="chevron-right" iconPosition="end" color="primary">',
        '  Continue',
        '</button>',
      ].join('\n');
    case 'icon-before':
    default:
      return [
        '<button solaris-button color="primary">',
        '  <solaris-icon solaris-button-icon name="check" [decorative]="true" />',
        '  Confirm',
        '</button>',
      ].join('\n');
  }
}

export function buildButtonProvidersCode(provider: string): string {
  const label = provider.charAt(0).toUpperCase() + provider.slice(1);
  return [
    `<button solaris-button icon="${provider}" appearance="outline">`,
    `  Continue with ${label}`,
    '</button>',
  ].join('\n');
}

export function buildButtonStateCode(tab: string, on: boolean): string {
  const value = on ? 'true' : 'false';
  switch (tab) {
    case 'disabled':
      return [
        `<button solaris-button color="primary" [disabled]="${value}">`,
        '  Disabled',
        '</button>',
      ].join('\n');
    case 'pressed':
      return [
        `<button solaris-button color="primary" [pressed]="${value}">`,
        '  Favorite',
        '</button>',
      ].join('\n');
    case 'loading':
    default:
      return [
        `<button solaris-button color="primary" [loading]="${value}">`,
        '  Save',
        '</button>',
      ].join('\n');
  }
}

export function buildButtonRadiusCode(radius: string): string {
  return [
    `<button solaris-button radius="${radius}" color="primary">`,
    '  Action',
    '</button>',
  ].join('\n');
}

export function buildButtonShapeCode(shape: string): string {
  return [
    `<button solaris-button shape="${shape}" color="primary">`,
    '  Action',
    '</button>',
  ].join('\n');
}
