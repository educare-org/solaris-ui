export type SolarisDialogNavItemState = 'active' | 'upcoming';

export interface SolarisDialogNavItem {
  /** Stable id used in the `stepChange` event and matched with `solaris-dialog-nav-content`. */
  value: string;
  /** Visible label (direct text). */
  label?: string;
  /** Translation key resolved through `SolarisTranslateService`. */
  labelKey?: string;
  /** Optional secondary line under the label (desktop only). */
  description?: string;
  /** Translation key for the description. */
  descriptionKey?: string;
  /** Leading icon name. */
  icon?: string;
  /** Disabled sections are rendered but never clickable. */
  disabled?: boolean;
  /** Validation error: rendered with icon + text, never color alone. */
  error?: boolean;
}

export interface SolarisDialogNavStepChange {
  index: number;
  previousIndex: number;
  value: string;
}
