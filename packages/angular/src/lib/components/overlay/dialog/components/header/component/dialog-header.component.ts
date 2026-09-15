import {
  Component,
  input,
  inject,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core';

import type { SolarisDialogVariant } from '../../root/model/dialog.types';
import { SOLARIS_DIALOG_REF } from '../../../token/dialog-data.token';
import type { SolarisDialogRef } from '../../../service/dialog-ref';
import { SolarisIconComponent } from '../../../../../icon';

let nextDialogHeaderId = 0;

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
    '[attr.data-separator]': "separator() ? '' : null",
  },
})
export class SolarisDialogHeaderComponent {
  private readonly dialogRef = inject(SOLARIS_DIALOG_REF, {
    optional: true,
  }) as SolarisDialogRef | null;

  readonly icon = input<string>();
  readonly title = input<string>();
  readonly description = input<string>();
  readonly iconDecorative = input<boolean>(false);
  readonly variant = input<SolarisDialogVariant>('neutral');
  readonly separator = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });

  private readonly idPrefix =
    this.dialogRef?.id ?? `solaris-dialog-${++nextDialogHeaderId}`;

  protected readonly titleId = `${this.idPrefix}-title`;
  protected readonly descriptionId = `${this.idPrefix}-description`;

  protected readonly hasTitle = () => !!this.title();
  protected readonly hasDescription = () => !!this.description();
  protected readonly hasIcon = () => !!this.icon();
}
