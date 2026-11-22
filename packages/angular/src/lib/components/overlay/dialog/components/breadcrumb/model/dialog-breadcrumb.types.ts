export type SolarisDialogBreadcrumbStepState =
  | 'completed'
  | 'current'
  | 'upcoming';

export interface SolarisDialogBreadcrumbItem {
  /** Stable id used in the `stepChange` event. */
  value: string;
  /** Visible label (direct text). */
  label?: string;
  /** Translation key resolved through `SolarisTranslateService`. */
  labelKey?: string;
  /** Disabled steps are rendered but never clickable. */
  disabled?: boolean;
  /** Validation error: rendered with icon + text, never color alone. */
  error?: boolean;
  /** Finished steps stay clickable without a visual marker. */
  completed?: boolean;
}

export interface SolarisDialogBreadcrumbStepChange {
  index: number;
  previousIndex: number;
  value: string;
}
