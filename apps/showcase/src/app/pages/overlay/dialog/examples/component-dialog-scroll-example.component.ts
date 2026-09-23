import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  SolarisDialogRef,
  SOLARIS_DIALOG_REF,
  SOLARIS_DIALOG_DATA,
  SolarisDialogHeaderComponent,
  SolarisDialogContentComponent,
  SolarisDialogFooterComponent,
  SolarisDialogCloseDirective,
  SolarisTranslatePipe,
  SolarisButtonDirective,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisDialogHeaderComponent,
    SolarisDialogContentComponent,
    SolarisDialogFooterComponent,
    SolarisDialogCloseDirective,
    SolarisButtonDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './component-dialog-scroll-example.component.html',
  styleUrls: ['./component-dialog-scroll-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentDialogScrollExampleComponent {
  readonly data: { title: string; description: string } = inject(
    SOLARIS_DIALOG_DATA,
  ) as { title: string; description: string };
  private readonly dialogRef = inject(
    SOLARIS_DIALOG_REF,
  ) as SolarisDialogRef<string>;

  readonly sections = signal(Array.from({ length: 20 }, (_, index) => index));

  closeWithResult(result: string): void {
    this.dialogRef.close(result);
  }
}
