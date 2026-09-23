import {
  Component,
  input,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core';

import type {
  SolarisDialogActionsAlign,
  SolarisDialogDensity,
} from '../../root/model/dialog.types';

@Component({
  selector: 'solaris-dialog-footer',
  standalone: true,
  templateUrl: './dialog-footer.component.html',
  styleUrls: ['./dialog-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-dialog-footer',
    '[attr.data-align]': 'align()',
    '[attr.data-separator]': "separator() ? '' : null",
    '[attr.data-density]': 'density()',
  },
})
export class SolarisDialogFooterComponent {
  readonly align = input<SolarisDialogActionsAlign>('end');
  readonly separator = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly density = input<SolarisDialogDensity>();
}
