import {
  Component,
  inject,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisDialogBreadcrumbComponent,
  SolarisDialogFlowComponent,
  SolarisDialogNavComponent,
  SolarisDialogNavContentDirective,
  SolarisDialogRef,
  SolarisDialogStepComponent,
  SOLARIS_DIALOG_REF,
  SolarisIconComponent,
  SolarisTranslatePipe,
  type SolarisDialogBreadcrumbItem,
  type SolarisDialogNavItem,
  type SolarisDialogNavStepChange,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisDialogBreadcrumbComponent,
    SolarisDialogFlowComponent,
    SolarisDialogNavComponent,
    SolarisDialogNavContentDirective,
    SolarisDialogStepComponent,
    SolarisIconComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './dialog-nav-wizard.component.html',
  styleUrls: ['./dialog-nav-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogNavWizardExampleComponent {
  private readonly dialogRef = inject(
    SOLARIS_DIALOG_REF,
  ) as SolarisDialogRef<string>;

  readonly section = signal(0);
  readonly step = signal(0);

  protected readonly sections: SolarisDialogNavItem[] = [
    {
      value: 'audiobook',
      labelKey: 'dialog.examples.nav.section-audiobook',
      icon: 'notebook-text',
    },
    {
      value: 'publish',
      labelKey: 'dialog.examples.nav.section-publish',
      icon: 'up-arrow',
    },
    {
      value: 'series',
      labelKey: 'dialog.examples.nav.section-series',
      icon: 'square-stack',
    },
  ];

  protected readonly wizardSteps: SolarisDialogBreadcrumbItem[] = [
    { value: 'upload', labelKey: 'dialog.examples.nav.wizard-upload' },
    { value: 'format', labelKey: 'dialog.examples.nav.wizard-format' },
    { value: 'voice', labelKey: 'dialog.examples.nav.wizard-voice' },
  ];

  protected readonly flow = viewChild.required(SolarisDialogFlowComponent);

  onSectionChange(event: SolarisDialogNavStepChange): void {
    if (event.value !== 'audiobook') {
      this.step.set(0);
    }
  }

  next(): void {
    this.flow().next();
  }

  previous(): void {
    this.flow().previous();
  }

  finish(): void {
    this.dialogRef.close('finished');
  }

  publish(): void {
    this.dialogRef.close('published');
  }

  createSeries(): void {
    this.dialogRef.close('series');
  }

  newBlank(): void {
    this.dialogRef.close('blank');
  }
}
