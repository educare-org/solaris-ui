import { Directive, booleanAttribute, input } from '@angular/core';

/**
 * Loading zone: marks a region (form, card, section) as busy while an
 * async operation runs. When `loading` is true the host exposes
 * `aria-busy="true"` and becomes `inert`, so form fields and actions
 * underneath cannot receive focus or assistive-technology interaction.
 *
 * Pair it with an inline `<solaris-spinner overlay />` rendered
 * conditionally inside the zone for the centered visual feedback:
 *
 * ```html
 * <form [solaris-loading-zone]="saving()">
 *   <!-- fields… -->
 *   @if (saving()) {
 *     <solaris-spinner overlay label="Saving…" />
 *   }
 * </form>
 * ```
 */
@Directive({
  selector: '[solaris-loading-zone]',
  standalone: true,
  host: {
    class: 'solaris-loading-zone',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.inert]': 'loading() ? "" : null',
    '[attr.data-loading]': 'loading() || undefined',
  },
})
export class SolarisLoadingZoneDirective {
  readonly loading = input<boolean, boolean | ''>(false, {
    alias: 'solaris-loading-zone',
    transform: booleanAttribute,
  });
}
