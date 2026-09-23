export type SolarisDialogAppearance = 'surface' | 'outline';

export type SolarisDialogVariant =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export type SolarisDialogPlacement =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type SolarisDialogActionsAlign =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between';

export type SolarisDialogActionsStack = 'auto' | 'horizontal' | 'vertical';

export type SolarisDialogAutoFocus = 'first-tabbable' | 'panel' | false;

export type SolarisDialogRole = 'dialog' | 'alertdialog';

export type SolarisDialogButtonAppearance =
  | 'solid'
  | 'outline'
  | 'ghost'
  | 'tonal'
  | 'surface';

export type SolarisDialogButtonColor =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'custom';

export type SolarisDialogButtonShape = 'normal' | 'wide';

export type SolarisDialogButtonDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisDialogButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export type SolarisDialogButtonIconPosition = 'start' | 'end';

export type SolarisDialogRadius = SolarisDialogButtonRadius;

export type SolarisDialogDensity = SolarisDialogButtonDensity;

export interface SolarisDialogAction<TResult = unknown> {
  label: string;
  labelKey?: string;
  appearance?: SolarisDialogButtonAppearance;
  color?: SolarisDialogButtonColor;
  shape?: SolarisDialogButtonShape;
  density?: SolarisDialogButtonDensity;
  radius?: SolarisDialogButtonRadius;
  icon?: string;
  iconPosition?: SolarisDialogButtonIconPosition;
  loading?: boolean;
  disabled?: boolean;
  close?: boolean;
  result?: TResult;
  action?: (
    dialogRef: SolarisDialogRefInterface<TResult>,
  ) => void | Promise<void>;
  autoFocus?: boolean;
}

export interface SolarisDialogOptions<TResult = unknown> {
  title?: string;
  titleKey?: string;
  description?: string;
  descriptionKey?: string;
  icon?: string;
  iconDecorative?: boolean;
  variant?: SolarisDialogVariant;
  appearance?: SolarisDialogAppearance;
  fullscreen?: boolean;
  placement?: SolarisDialogPlacement;
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  closeable?: boolean;
  closeLabel?: string;
  closeLabelKey?: string;
  backdrop?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  autoFocus?: SolarisDialogAutoFocus;
  restoreFocus?: boolean;
  role?: SolarisDialogRole;
  ariaLabel?: string;
  ariaLabelKey?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  headerSeparator?: boolean;
  footerSeparator?: boolean;
  radius?: SolarisDialogRadius;
  density?: SolarisDialogDensity;
  actionsShape?: SolarisDialogButtonShape;
  actionsDensity?: SolarisDialogButtonDensity;
  actionsRadius?: SolarisDialogButtonRadius;
  actions?: SolarisDialogAction<TResult>[];
  actionsAlign?: SolarisDialogActionsAlign;
  actionsStack?: SolarisDialogActionsStack;
  data?: unknown;
}

export interface SolarisDialogComponentConfig<
  TData = unknown,
  TResult = unknown,
> {
  title?: string;
  titleKey?: string;
  description?: string;
  descriptionKey?: string;
  icon?: string;
  iconDecorative?: boolean;
  variant?: SolarisDialogVariant;
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  data?: TData;
  closeable?: boolean;
  closeLabel?: string;
  closeLabelKey?: string;
  backdrop?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  autoFocus?: SolarisDialogAutoFocus;
  restoreFocus?: boolean;
  role?: SolarisDialogRole;
  ariaLabel?: string;
  ariaLabelKey?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  appearance?: SolarisDialogAppearance;
  fullscreen?: boolean;
  placement?: SolarisDialogPlacement;
  headerSeparator?: boolean;
  footerSeparator?: boolean;
  radius?: SolarisDialogRadius;
  density?: SolarisDialogDensity;
  actionsShape?: SolarisDialogButtonShape;
  actionsDensity?: SolarisDialogButtonDensity;
  actionsRadius?: SolarisDialogButtonRadius;
  actions?: SolarisDialogAction<TResult>[];
  actionsAlign?: SolarisDialogActionsAlign;
  actionsStack?: SolarisDialogActionsStack;
}

export interface SolarisDialogConfig {
  appearance?: SolarisDialogAppearance;
  fullscreen?: boolean;
  placement?: SolarisDialogPlacement;
  closeable?: boolean;
  backdrop?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  autoFocus?: SolarisDialogAutoFocus;
  restoreFocus?: boolean;
  role?: SolarisDialogRole;
  headerSeparator?: boolean;
  footerSeparator?: boolean;
  radius?: SolarisDialogRadius;
  density?: SolarisDialogDensity;
  actionsShape?: SolarisDialogButtonShape;
  actionsDensity?: SolarisDialogButtonDensity;
  actionsRadius?: SolarisDialogButtonRadius;
  actionsAlign?: SolarisDialogActionsAlign;
  actionsStack?: SolarisDialogActionsStack;
}

export interface SolarisDialogRefInterface<TResult = unknown> {
  id: string;
  close(result?: TResult): void;
  afterClosed(): import('rxjs').Observable<TResult | undefined>;
}
