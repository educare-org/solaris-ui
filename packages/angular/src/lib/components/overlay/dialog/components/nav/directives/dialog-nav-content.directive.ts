import { Directive, TemplateRef, inject, input } from '@angular/core';

/**
 * Projects section content into `solaris-dialog-nav`.
 * The template renders in the nav content region when its `value`
 * matches the active nav item.
 *
 * ```html
 * <solaris-dialog-nav [items]="sections" [(activeStep)]="section">
 *   <ng-template solaris-dialog-nav-content="audiobook">…</ng-template>
 *   <ng-template solaris-dialog-nav-content="publish">…</ng-template>
 * </solaris-dialog-nav>
 * ```
 */
@Directive({
  selector: '[solaris-dialog-nav-content]',
  standalone: true,
})
export class SolarisDialogNavContentDirective {
  readonly templateRef = inject(TemplateRef);

  /** Section value this template belongs to (matches `SolarisDialogNavItem.value`). */
  readonly value = input.required<string>({
    alias: 'solaris-dialog-nav-content',
  });
}
