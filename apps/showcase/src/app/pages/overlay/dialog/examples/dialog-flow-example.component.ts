import {
  Component,
  signal,
  inject,
  viewChild,
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
  protected readonly flow = viewChild.required(SolarisDialogFlowComponent);

  next(): void {
    this.flow().next();
  }

  previous(): void {
    this.flow().previous();
  }

  close(): void {
    this.dialogRef.close();
  }
}
