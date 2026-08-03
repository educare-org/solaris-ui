// SECURITY_EXCEPTION_FILE: nativeElement.getAttribute('id') is the standard DOM API to check existing ID before generating one. Same approach used by Angular CDK form controls.
import type { ElementRef } from '@angular/core';

let nextId = 0;

/**
 * Generates a deterministic, unique DOM id for the given prefix.
 *
 * Replaces the per-component `let nextId` + `generateId()` boilerplate.
 * IDs are unique per prefix, mirroring the previous module-local counters.
 */
export function nextIdFor(prefix: string): string {
  return `${prefix}-${++nextId}`;
}

/**
 * Resolves the id for a host element, preferring an existing `id` attribute
 * and falling back to a generated one.
 */
export function resolveElementId<T extends HTMLElement>(
  ref: ElementRef<T>,
  prefix: string,
): string {
  const existingId = ref.nativeElement.getAttribute('id');
  return existingId || nextIdFor(prefix);
}
