import {
  Component,
  computed,
  inject,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisDialogFlowComponent,
  SolarisDialogRef,
  SolarisDialogStepComponent,
  SOLARIS_DIALOG_REF,
  SolarisFormFieldComponent,
  SolarisInputDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisDialogFlowComponent,
    SolarisDialogStepComponent,
    SolarisFormFieldComponent,
    SolarisInputDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './validated-flow.component.html',
  styleUrls: ['./validated-flow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidatedFlowExampleComponent {
  private readonly dialogRef = inject(
    SOLARIS_DIALOG_REF,
  ) as SolarisDialogRef<string>;

  protected readonly flow = viewChild.required(SolarisDialogFlowComponent);

  readonly activeStep = signal(0);
  readonly name = signal('');

  protected readonly isNameValid = computed(
    () => this.name().trim().length > 0,
  );

  next(): void {
    this.flow().next();
  }

  previous(): void {
    this.flow().previous();
  }

  finish(): void {
    this.dialogRef.close(this.name().trim());
  }
}
