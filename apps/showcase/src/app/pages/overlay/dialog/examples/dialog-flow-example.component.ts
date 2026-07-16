import {
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  SolarisDialogFlowComponent,
  SolarisDialogStepComponent,
  SolarisDialogRef,
  SOLARIS_DIALOG_REF,
  SolarisTranslatePipe,
  SolarisButtonDirective,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisDialogFlowComponent,
    SolarisDialogStepComponent,
    SolarisButtonDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './dialog-flow-example.component.html',
  styleUrls: ['./dialog-flow-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogFlowExampleComponent {
  private readonly dialogRef = inject(
    SOLARIS_DIALOG_REF,
  ) as SolarisDialogRef<void>;

  readonly activeStep = signal(0);

  next(): void {
    this.activeStep.update((v) => Math.min(v + 1, 2));
  }

  previous(): void {
    this.activeStep.update((v) => Math.max(v - 1, 0));
  }

  close(): void {
    this.dialogRef.close();
  }
}
