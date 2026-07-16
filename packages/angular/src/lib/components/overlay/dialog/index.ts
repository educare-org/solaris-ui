export { SolarisDialogService } from './service/dialog.service';
export { SolarisDialogRef } from './service/dialog-ref';
export { SolarisDialogContainerComponent } from './container/dialog-container.component';
export { SolarisDialogComponent } from './component/dialog.component';
export { SolarisDialogHeaderComponent } from './components/dialog-header.component';
export { SolarisDialogContentComponent } from './components/dialog-content.component';
export { SolarisDialogActionsComponent } from './components/dialog-actions.component';
export { SolarisDialogFlowComponent } from './flow/dialog-flow.component';
export { SolarisDialogStepComponent } from './flow/dialog-step.component';
export { provideSolarisDialog } from './provider/provide-solaris-dialog';
export { SOLARIS_DIALOG_CONFIG } from './token/dialog.tokens';
export {
  SOLARIS_DIALOG_DATA,
  SOLARIS_DIALOG_REF,
} from './token/dialog-data.token';

export type {
  SolarisDialogAppearance,
  SolarisDialogVariant,
  SolarisDialogSize,
  SolarisDialogActionsAlign,
  SolarisDialogActionsStack,
  SolarisDialogAutoFocus,
  SolarisDialogRole,
  SolarisDialogAction,
  SolarisDialogOptions,
  SolarisDialogComponentConfig,
  SolarisDialogConfig,
} from './model/dialog.types';
