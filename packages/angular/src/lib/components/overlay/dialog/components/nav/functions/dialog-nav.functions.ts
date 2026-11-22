import type {
  SolarisDialogNavItem,
  SolarisDialogNavItemState,
} from '../model/dialog-nav.types';

/**
 * Visual state of a nav section.
 * Pure: no Angular imports, independently testable.
 */
export function resolveDialogNavItemState(
  index: number,
  activeStep: number,
): SolarisDialogNavItemState {
  return index === activeStep ? 'active' : 'upcoming';
}

/**
 * Whether a section can be activated by pointer or keyboard.
 * Unlike the wizard breadcrumb, nav sections are freely navigable:
 * every non-disabled section is clickable, including upcoming ones.
 * The active and disabled sections are never clickable.
 */
export function isDialogNavItemClickable(
  index: number,
  activeStep: number,
  item: SolarisDialogNavItem,
): boolean {
  if (item.disabled === true || index === activeStep) {
    return false;
  }
  return true;
}

/**
 * Next enabled section in a direction, for arrow-key focus movement.
 * Returns the origin index when no enabled section exists that way.
 */
export function findDialogNavFocusableSection(
  items: readonly SolarisDialogNavItem[],
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

/**
 * Index of the section matching a select value.
 * Returns null when no section carries the value.
 */
export function findDialogNavIndexByValue(
  items: readonly SolarisDialogNavItem[],
  value: unknown,
): number | null {
  const index = items.findIndex((item) => item.value === value);
  return index >= 0 ? index : null;
}
