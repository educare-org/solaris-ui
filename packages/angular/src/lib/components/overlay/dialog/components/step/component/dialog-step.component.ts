import {
  Component,
  TemplateRef,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'solaris-dialog-step',
  standalone: true,
  template: '<ng-template><ng-content /></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolarisDialogStepComponent {
  readonly templateRef = viewChild.required(TemplateRef);
}
