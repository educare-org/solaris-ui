export type SolarisDialogAppearance = 'surface' | 'outline';

export type SolarisDialogVariant =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export type SolarisDialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

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

export interface SolarisDialogAction<TResult = unknown> {
  label: string;
  labelKey?: string;
  appearance?: SolarisDialogButtonAppearance;
  color?: SolarisDialogButtonColor;
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
  size?: SolarisDialogSize;
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  closeable?: boolean;
  closeLabel?: string;
  closeLabelKey?: string;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  autoFocus?: SolarisDialogAutoFocus;
  restoreFocus?: boolean;
  role?: SolarisDialogRole;
  ariaLabel?: string;
  ariaLabelKey?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  actions?: SolarisDialogAction<TResult>[];
  actionsAlign?: SolarisDialogActionsAlign;
  actionsStack?: SolarisDialogActionsStack;
  data?: unknown;
}

export interface SolarisDialogComponentConfig<TData = unknown> {
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  data?: TData;
  closeable?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  autoFocus?: SolarisDialogAutoFocus;
  restoreFocus?: boolean;
  role?: SolarisDialogRole;
  appearance?: SolarisDialogAppearance;
  size?: SolarisDialogSize;
}

export interface SolarisDialogConfig {
  appearance?: SolarisDialogAppearance;
  size?: SolarisDialogSize;
  closeable?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  autoFocus?: SolarisDialogAutoFocus;
  restoreFocus?: boolean;
  role?: SolarisDialogRole;
  actionsAlign?: SolarisDialogActionsAlign;
  actionsStack?: SolarisDialogActionsStack;
}

export interface SolarisDialogRefInterface<TResult = unknown> {
  id: string;
  close(result?: TResult): void;
  afterClosed(): import('rxjs').Observable<TResult | undefined>;
}
