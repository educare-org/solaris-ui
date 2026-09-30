export type SolarisToastPosition =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end';

export type SolarisToastAppearance = 'surface' | 'outline';

export type SolarisToastVariant =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'loading'
  | 'custom';

export type SolarisToastActionsAlign = 'start' | 'center' | 'end' | 'stretch';

export type SolarisToastIconSize = 'sm' | 'md' | 'lg';

export type SolarisToastMediaShape = 'circle' | 'rounded' | 'square';

export type SolarisToastSize = 'sm' | 'md' | 'lg';

export type SolarisToastDensity = 'compact' | 'normal' | 'comfortable';

/** Unified countdown display. `false` hides the countdown. */
export type SolarisToastCountdown = 'bar' | 'text' | 'both' | false;

export interface SolarisToastAction {
  label: string;
  labelKey?: string;
  appearance?: 'solid' | 'outline' | 'ghost' | 'surface';
  color?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  closeOnClick?: boolean;
  disabled?: boolean;
  action: (toast: SolarisToastRef) => void;
}

export interface SolarisToastOptions {
  id?: string;
  variant?: SolarisToastVariant;
  appearance?: SolarisToastAppearance;
  position?: SolarisToastPosition;
  size?: SolarisToastSize;
  density?: SolarisToastDensity;
  title?: string;
  titleKey?: string;
  description?: string;
  descriptionKey?: string;
  icon?: string;
  iconDecorative?: boolean;
  closeable?: boolean;
  closeLabel?: string;
  closeLabelKey?: string;
  duration?: number;
  persistent?: boolean;
  progress?: number;
  actions?: SolarisToastAction[];
  data?: unknown;
  ariaLive?: 'polite' | 'assertive' | 'off';
  role?: 'status' | 'alert';
  expandable?: boolean;
  defaultExpanded?: boolean;
  maxCollapsedLines?: number;
  expandLabel?: string;
  expandLabelKey?: string;
  collapseLabel?: string;
  collapseLabelKey?: string;
  countdown?: SolarisToastCountdown;
  actionsAlign?: SolarisToastActionsAlign;
  iconSize?: SolarisToastIconSize;
  mediaShape?: SolarisToastMediaShape;
}

export interface SolarisToastConfig {
  position?: SolarisToastPosition;
  duration?: number;
  limit?: number;
  appearance?: SolarisToastAppearance;
  size?: SolarisToastSize;
  density?: SolarisToastDensity;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  newestOnTop?: boolean;
  countdown?: SolarisToastCountdown;
  actionsAlign?: SolarisToastActionsAlign;
  iconSize?: SolarisToastIconSize;
  mediaShape?: SolarisToastMediaShape;
}

export interface SolarisToastSetup {
  autoContainer?: boolean;
}

export interface SolarisToastRef {
  id: string;
  dismiss(): void;
  update(patch: Partial<SolarisToastOptions>): void;
}

export interface SolarisToastPromiseMessages {
  loading: SolarisToastOptions;
  success: SolarisToastOptions | ((value: unknown) => SolarisToastOptions);
  error: SolarisToastOptions | ((reason: unknown) => SolarisToastOptions);
}

export interface SolarisToastEntry {
  id: string;
  options: SolarisToastOptions;
  createdAt: number;
  resolvedVariant: SolarisToastVariant;
  resolvedAppearance: SolarisToastAppearance;
  resolvedPosition: SolarisToastPosition;
  resolvedSize: SolarisToastSize;
  resolvedDensity: SolarisToastDensity | undefined;
  resolvedDuration: number;
  resolvedPersistent: boolean;
  resolvedCloseable: boolean;
  resolvedAriaLive: 'polite' | 'assertive' | 'off';
  resolvedRole: 'status' | 'alert';
  resolvedIcon: string;
  resolvedTitle: string | undefined;
  resolvedDescription: string | undefined;
  resolvedCloseLabel: string | undefined;
  resolvedCloseLabelKey: string | undefined;
  resolvedProgress: number | undefined;
  resolvedActions: SolarisToastOptions['actions'];
  resolvedExpandable: boolean;
  resolvedDefaultExpanded: boolean;
  resolvedMaxCollapsedLines: number;
  resolvedExpandLabel: string | undefined;
  resolvedExpandLabelKey: string | undefined;
  resolvedCollapseLabel: string | undefined;
  resolvedCollapseLabelKey: string | undefined;
  resolvedCountdown: SolarisToastCountdown;
  resolvedActionsAlign: SolarisToastActionsAlign;
  resolvedIconSize: SolarisToastIconSize;
  resolvedMediaShape: SolarisToastMediaShape;
}
