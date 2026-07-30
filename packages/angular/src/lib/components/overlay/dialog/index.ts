export { SolarisDialogService } from './service/dialog.service';
export { SolarisDialogRef } from './service/dialog-ref';
export { SolarisDialogContainerComponent } from './components/container/component/dialog-container.component';
export { SolarisDialogComponent } from './components/root/component/dialog.component';
export { SolarisDialogHeaderComponent } from './components/header/component/dialog-header.component';
export { SolarisDialogContentComponent } from './components/content/component/dialog-content.component';
export { SolarisDialogActionsComponent } from './components/actions/component/dialog-actions.component';
export { SolarisDialogFlowComponent } from './components/flow/component/dialog-flow.component';
export { SolarisDialogStepComponent } from './components/step/component/dialog-step.component';
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
} from './components/root/model/dialog.types';
