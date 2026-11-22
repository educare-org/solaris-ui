import type {
  SolarisDialogBreadcrumbItem,
  SolarisDialogBreadcrumbStepState,
} from '../model/dialog-breadcrumb.types';

/**
 * Visual + interaction state of a wizard step.
 * Pure: no Angular imports, independently testable.
 */
export function resolveDialogBreadcrumbStepState(
  index: number,
  activeStep: number,
  item: SolarisDialogBreadcrumbItem,
): SolarisDialogBreadcrumbStepState {
  if (index === activeStep) {
    return 'current';
  }
  if (index < activeStep || item.completed === true) {
    return 'completed';
  }
  return 'upcoming';
}

/**
 * Whether a step can be reached by pointer or keyboard.
 *
 * Linear wizards (default) only allow going back to past steps; steps
 * carrying `error` stay clickable even when upcoming so the user can
 * jump back to fix validation. `linear: false` opens every non-disabled
 * step. Disabled and current steps are never clickable.
 */
export function isDialogBreadcrumbStepClickable(
  index: number,
  activeStep: number,
  item: SolarisDialogBreadcrumbItem,
  linear: boolean,
): boolean {
  if (item.disabled === true || index === activeStep) {
    return false;
  }
  if (item.error === true) {
    return true;
  }
  if (!linear) {
    return true;
  }
  return index < activeStep || item.completed === true;
}

/**
 * Next enabled step in a direction, for arrow-key focus movement.
 * Returns the origin index when no enabled step exists that way.
 */
export function findDialogBreadcrumbFocusableStep(
  items: readonly SolarisDialogBreadcrumbItem[],
  from: number,
  direction: 1 | -1,
): number {
  let index = from + direction;
  while (index >= 0 && index < items.length) {
    if (items[index].disabled !== true) {
      return index;
    }
    index += direction;
  }
  return from;
}
