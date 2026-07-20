import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import {
  SolarisDialogRef,
  SOLARIS_DIALOG_REF,
  SOLARIS_DIALOG_DATA,
  SolarisTranslatePipe,
  SolarisIconComponent,
  SolarisButtonDirective,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisButtonDirective, SolarisIconComponent, SolarisTranslatePipe],
  templateUrl: './component-dialog-example.component.html',
  styleUrls: ['./component-dialog-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentDialogExampleComponent {
  readonly data: { title: string } = inject(SOLARIS_DIALOG_DATA) as {
    title: string;
  };
  private readonly dialogRef = inject(
    SOLARIS_DIALOG_REF,
  ) as SolarisDialogRef<string>;

  closeWithPizza(): void {
    this.dialogRef.close('Pizza!');
  }

  close(result: string): void {
    this.dialogRef.close(result);
  }
}
