import type { SolarisDialogAction } from '../../root/model/dialog.types';

export interface SolarisDialogWizardActionsConfig {
  /** Zero-based index of the visible step. */
  activeStep: number;
  /** Total number of steps. */
  totalSteps: number;
  /** Hide the back button on the first step (default true). */
  hideBackOnFirstStep?: boolean;
  /** Disable the back button. */
  backDisabled?: boolean;
  /** Disable the continue/finish button (e.g. invalid step). */
  continueDisabled?: boolean;
  /** Loading state of the continue/finish button. */
  continueLoading?: boolean;
}

/**
 * Builds the standard wizard footer (`Voltar / Continuar`, `Finalizar`
 * on the last step) as `SolarisDialogAction[]` for `openComponent`
 * chrome actions or `solaris-dialog-actions`.
 *
 * Labels resolve through `SolarisTranslateService` via `*Key` entries;
 * direct-text fallbacks stay English-free of hardcoded pt-BR. Pure: no
 * Angular imports, independently testable.
 */
export function buildDialogWizardActions<TResult = string>(
  config: SolarisDialogWizardActionsConfig,
): SolarisDialogAction<TResult>[] {
  const {
    activeStep,
    totalSteps,
    hideBackOnFirstStep = true,
    backDisabled = false,
    continueDisabled = false,
    continueLoading = false,
  } = config;

  const isLastStep = activeStep >= totalSteps - 1;
  const actions: SolarisDialogAction<TResult>[] = [];

  if (!(hideBackOnFirstStep && activeStep <= 0)) {
    actions.push({
      label: 'Back',
      labelKey: 'solaris.dialog.back',
      appearance: 'ghost',
      disabled: backDisabled,
      result: 'wizard:back' as unknown as TResult,
    });
  }

  actions.push({
    label: isLastStep ? 'Finish' : 'Continue',
    labelKey: isLastStep ? 'solaris.dialog.finish' : 'solaris.dialog.continue',
    appearance: 'solid',
    color: 'primary',
    disabled: continueDisabled,
    loading: continueLoading,
    result: (isLastStep
      ? 'wizard:finish'
      : 'wizard:continue') as unknown as TResult,
  });

  return actions;
}
