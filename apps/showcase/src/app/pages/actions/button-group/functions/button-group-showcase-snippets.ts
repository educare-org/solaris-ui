export function buildButtonGroupSizeDensityCode(
  size: string,
  density: string,
): string {
  return [
    `<solaris-button-group size="${size}" density="${density}" [aria-label]="'button-group.example.editorActions' | translate">`,
    `  <button solaris-button>{{ 'button-group.example.edit' | translate }}</button>`,
    `  <button solaris-button>{{ 'button-group.example.duplicate' | translate }}</button>`,
    `  <button solaris-button>{{ 'button-group.example.delete' | translate }}</button>`,
    '</solaris-button-group>',
  ].join('\n');
}

export function buildButtonGroupAttachedCode(attached: boolean): string {
  const value = attached ? 'true' : 'false';
  return [
    `<solaris-button-group [attached]="${value}" [aria-label]="'button-group.example.separatedActions' | translate">`,
    `  <button solaris-button>{{ 'button-group.example.edit' | translate }}</button>`,
    `  <button solaris-button>{{ 'button-group.example.duplicate' | translate }}</button>`,
    `  <button solaris-button [disabled]="true">{{ 'button-group.example.delete' | translate }}</button>`,
    '</solaris-button-group>',
  ].join('\n');
}

const ORIENTATION_ICON_BUTTONS: readonly string[] = ['happy', 'neutral', 'sad'];

const ORIENTATION_ICON_NAMES: Record<string, string> = {
  happy: 'success',
  neutral: 'info',
  sad: 'danger',
};

export function buildButtonGroupOrientationCode(orientation: string): string {
  const lines: string[] = ['<solaris-button-group'];
  if (orientation === 'vertical') {
    lines.push('  orientation="vertical"');
  }
  lines.push(`  [aria-label]="'button-group.example.mood' | translate"`, '>');
  for (const mood of ORIENTATION_ICON_BUTTONS) {
    const icon = ORIENTATION_ICON_NAMES[mood] ?? 'info';
    lines.push(
      '  <button',
      '    solaris-icon-button',
      `    [aria-label]="'button-group.example.${mood}' | translate"`,
      '  >',
      `    <solaris-icon name="${icon}" [decorative]="true" />`,
      '  </button>',
    );
  }
  lines.push('</solaris-button-group>');
  return lines.join('\n');
}
