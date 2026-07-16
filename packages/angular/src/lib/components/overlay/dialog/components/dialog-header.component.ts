import {
  Component,
  input,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SOLARIS_DIALOG_REF } from '../token/dialog-data.token';
import { SolarisDialogRef } from '../service/dialog-ref';
import { SolarisIconComponent } from '../../../icon';

@Component({
  selector: 'solaris-dialog-header',
  standalone: true,
  imports: [SolarisIconComponent],
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-dialog-header',
    '[attr.data-variant]': 'variant()',
  },
})
export class SolarisDialogHeaderComponent {
  private readonly dialogRef = inject(SOLARIS_DIALOG_REF) as SolarisDialogRef;

  readonly icon = input<string>();
  readonly title = input<string>();
  readonly description = input<string>();
  readonly closeable = input<boolean>(true);
  readonly closeLabel = input<string>('Close');
  readonly iconDecorative = input<boolean>(false);
  readonly size = input<string>('md');
  readonly variant = input<string>('neutral');

  protected readonly showCloseButton = () => this.closeable();
  protected readonly hasTitle = () => !!this.title();
  protected readonly hasDescription = () => !!this.description();
  protected readonly hasIcon = () => !!this.icon();

  protected close(): void {
    this.dialogRef.close();
  }
}
