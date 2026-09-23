import { Directive, HostListener, inject, input } from '@angular/core';

import { SOLARIS_DIALOG_REF } from '../../../token/dialog-data.token';
import type { SolarisDialogRef } from '../../../service/dialog-ref';

@Directive({
  selector: '[solaris-dialog-close]',
  standalone: true,
})
export class SolarisDialogCloseDirective<TResult = unknown> {
  private readonly dialogRef = inject(SOLARIS_DIALOG_REF, {
    optional: true,
  }) as SolarisDialogRef<TResult> | null;

  readonly closeResult = input<TResult | undefined>(undefined, {
    alias: 'solarisDialogClose',
  });

  @HostListener('click')
  protected onClick(): void {
    this.dialogRef?.close(this.closeResult());
  }
}
