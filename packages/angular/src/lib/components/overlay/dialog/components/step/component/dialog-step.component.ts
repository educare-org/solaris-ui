import {
  Component,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'solaris-dialog-step',
  standalone: true,
  template: '<ng-template><ng-content /></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolarisDialogStepComponent {
  @ViewChild(TemplateRef, { static: true })
  templateRef!: TemplateRef<unknown>;
}
