import {
  resolveDialogBreadcrumbStepState,
  isDialogBreadcrumbStepClickable,
  findDialogBreadcrumbFocusableStep,
} from '../functions/dialog-breadcrumb.functions';
import { buildDialogWizardActions } from '../functions/dialog-wizard-actions.functions';

import type { SolarisDialogBreadcrumbItem } from '../model/dialog-breadcrumb.types';

describe('dialog-breadcrumb.functions', () => {
  const item = (overrides?: Partial<SolarisDialogBreadcrumbItem>) =>
    ({
      value: 'step',
      ...overrides,
    }) as SolarisDialogBreadcrumbItem;

  describe('resolveDialogBreadcrumbStepState', () => {
    it('should return current for the active index', () => {
      expect(resolveDialogBreadcrumbStepState(1, 1, item())).toBe('current');
    });

    it('should return completed for past steps', () => {
      expect(resolveDialogBreadcrumbStepState(0, 2, item())).toBe('completed');
    });

    it('should return completed for future steps flagged completed', () => {
      expect(
        resolveDialogBreadcrumbStepState(3, 1, item({ completed: true })),
      ).toBe('completed');
    });

    it('should return upcoming otherwise', () => {
      expect(resolveDialogBreadcrumbStepState(2, 1, item())).toBe('upcoming');
    });
  });

  describe('isDialogBreadcrumbStepClickable', () => {
    it('should never allow the current step', () => {
      expect(isDialogBreadcrumbStepClickable(1, 1, item(), true)).toBe(false);
    });

    it('should never allow disabled steps', () => {
      expect(
        isDialogBreadcrumbStepClickable(0, 1, item({ disabled: true }), true),
      ).toBe(false);
      expect(
        isDialogBreadcrumbStepClickable(0, 1, item({ disabled: true }), false),
      ).toBe(false);
    });

    it('should allow past steps in linear mode', () => {
      expect(isDialogBreadcrumbStepClickable(0, 2, item(), true)).toBe(true);
    });

    it('should block future steps in linear mode', () => {
      expect(isDialogBreadcrumbStepClickable(2, 0, item(), true)).toBe(false);
    });

    it('should allow error steps even when upcoming', () => {
      expect(
        isDialogBreadcrumbStepClickable(2, 0, item({ error: true }), true),
      ).toBe(true);
    });

    it('should allow every non-disabled step when linear is false', () => {
      expect(isDialogBreadcrumbStepClickable(3, 0, item(), false)).toBe(true);
    });
  });

  describe('findDialogBreadcrumbFocusableStep', () => {
    const items: SolarisDialogBreadcrumbItem[] = [
      item({ value: 'a' }),
      item({ value: 'b', disabled: true }),
      item({ value: 'c' }),
    ];

    it('should skip disabled steps', () => {
      expect(findDialogBreadcrumbFocusableStep(items, 0, 1)).toBe(2);
      expect(findDialogBreadcrumbFocusableStep(items, 2, -1)).toBe(0);
    });

    it('should stay on the origin when nothing is focusable that way', () => {
      expect(findDialogBreadcrumbFocusableStep(items, 2, 1)).toBe(2);
      expect(findDialogBreadcrumbFocusableStep(items, 0, -1)).toBe(0);
    });
  });
});

describe('buildDialogWizardActions', () => {
  it('should render only continue on the first step', () => {
    const actions = buildDialogWizardActions({
      activeStep: 0,
      totalSteps: 3,
    });
    expect(actions.length).toBe(1);
    expect(actions[0].labelKey).toBe('solaris.dialog.continue');
    expect(actions[0].appearance).toBe('solid');
  });

  it('should render back + continue on middle steps', () => {
    const actions = buildDialogWizardActions({
      activeStep: 1,
      totalSteps: 3,
    });
    expect(actions.length).toBe(2);
    expect(actions[0].labelKey).toBe('solaris.dialog.back');
    expect(actions[0].appearance).toBe('ghost');
    expect(actions[1].labelKey).toBe('solaris.dialog.continue');
  });

  it('should render finish on the last step', () => {
    const actions = buildDialogWizardActions({
      activeStep: 2,
      totalSteps: 3,
    });
    expect(actions[1].labelKey).toBe('solaris.dialog.finish');
    expect(actions[1].result).toBe('wizard:finish');
  });

  it('should forward disabled and loading flags', () => {
    const actions = buildDialogWizardActions({
      activeStep: 1,
      totalSteps: 3,
      backDisabled: true,
      continueDisabled: true,
      continueLoading: true,
    });
    expect(actions[0].disabled).toBe(true);
    expect(actions[1].disabled).toBe(true);
    expect(actions[1].loading).toBe(true);
  });

  it('should keep back on the first step when configured', () => {
    const actions = buildDialogWizardActions({
      activeStep: 0,
      totalSteps: 3,
      hideBackOnFirstStep: false,
    });
    expect(actions.length).toBe(2);
    expect(actions[0].labelKey).toBe('solaris.dialog.back');
  });
});
