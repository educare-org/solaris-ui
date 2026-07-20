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

export type SolarisToastCountdownMode = 'bar' | 'text' | 'both';

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
  showProgress?: boolean;
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
  showCountdown?: boolean;
  showCountdownText?: boolean;
  countdownMode?: SolarisToastCountdownMode;
  actionsAlign?: SolarisToastActionsAlign;
  iconSize?: SolarisToastIconSize;
  mediaShape?: SolarisToastMediaShape;
}

export interface SolarisToastConfig {
  position?: SolarisToastPosition;
  duration?: number;
  limit?: number;
  appearance?: SolarisToastAppearance;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  newestOnTop?: boolean;
  showCountdown?: boolean;
  showCountdownText?: boolean;
  countdownMode?: SolarisToastCountdownMode;
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

export interface SolarisToastEntry {
  id: string;
  options: SolarisToastOptions;
  createdAt: number;
  resolvedVariant: SolarisToastVariant;
  resolvedAppearance: SolarisToastAppearance;
  resolvedPosition: SolarisToastPosition;
  resolvedDuration: number;
  resolvedPersistent: boolean;
  resolvedCloseable: boolean;
  resolvedAriaLive: 'polite' | 'assertive' | 'off';
  resolvedRole: 'status' | 'alert';
  resolvedIcon: string;
  resolvedTitle: string | undefined;
  resolvedDescription: string | undefined;
  resolvedCloseLabel: string;
  resolvedProgress: number | undefined;
  resolvedShowProgress: boolean;
  resolvedActions: SolarisToastOptions['actions'];
  resolvedExpandable: boolean;
  resolvedDefaultExpanded: boolean;
  resolvedMaxCollapsedLines: number;
  resolvedExpandLabel: string;
  resolvedCollapseLabel: string;
  resolvedShowCountdown: boolean;
  resolvedShowCountdownText: boolean;
  resolvedCountdownMode: SolarisToastCountdownMode;
  resolvedActionsAlign: SolarisToastActionsAlign;
  resolvedIconSize: SolarisToastIconSize;
  resolvedMediaShape: SolarisToastMediaShape;
}
