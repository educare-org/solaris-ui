export function buildIconButtonAppearanceColorCode(
  appearance: string,
  color: string,
): string {
  return [
    `<button solaris-icon-button appearance="${appearance}" color="${color}" aria-label="Check">`,
    '  <solaris-icon name="check" [decorative]="true" />',
    '</button>',
  ].join('\n');
}

export function buildIconButtonSizeDensityCode(
  size: string,
  density: string,
): string {
  return [
    `<button solaris-icon-button size="${size}" density="${density}" color="primary" aria-label="Check">`,
    '  <solaris-icon name="check" [decorative]="true" />',
    '</button>',
  ].join('\n');
}

export function buildIconButtonChromelessCode(size: string): string {
  return [
    `<button solaris-icon-button [chromeless]="true" size="${size}" aria-label="Notifications, 3 new">`,
    '  <solaris-icon name="notification" [decorative]="true" />',
    '  <solaris-badge solaris-icon-button-badge variant="count" color="danger" size="sm">3</solaris-badge>',
    '</button>',
  ].join('\n');
}

export function buildIconButtonRadiusCode(radius: string): string {
  return [
    `<button solaris-icon-button radius="${radius}" color="primary" aria-label="Check">`,
    '  <solaris-icon name="check" [decorative]="true" />',
    '</button>',
  ].join('\n');
}

export function buildIconButtonShapeCode(shape: string): string {
  return [
    `<button solaris-icon-button shape="${shape}" color="primary" aria-label="Check">`,
    '  <solaris-icon name="check" [decorative]="true" />',
    '</button>',
  ].join('\n');
}

export function buildIconButtonStateCode(tab: string, on: boolean): string {
  const value = on ? 'true' : 'false';
  if (tab === 'disabled') {
    return [
      `<button solaris-icon-button color="primary" [disabled]="${value}" aria-label="Info">`,
      '  <solaris-icon name="info" [decorative]="true" />',
      '</button>',
    ].join('\n');
  }
  return [
    `<button solaris-icon-button color="primary" [loading]="${value}" aria-label="Info">`,
    '  <solaris-icon name="info" [decorative]="true" />',
    '</button>',
  ].join('\n');
}
