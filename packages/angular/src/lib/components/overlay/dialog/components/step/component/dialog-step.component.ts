import {
  booleanAttribute,
  Component,
  TemplateRef,
  input,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'solaris-dialog-step',
  standalone: true,
  template: '<ng-template><ng-content /></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-disabled]': "disabled() ? '' : null",
  },
})
export class SolarisDialogStepComponent {
  readonly templateRef = viewChild.required(TemplateRef);

  /**
   * Disabled steps are skipped by `next()` / `previous()` and rejected by
   * `goTo()`. Use with form validity to gate step navigation.
   */
  readonly disabled = input(false, { transform: booleanAttribute });
}
