import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import type { SolarisDialogDensity } from '../../root/model/dialog.types';

@Component({
  selector: 'solaris-dialog-content',
  standalone: true,
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-dialog-content',
    '[attr.data-density]': 'density()',
  },
})
export class SolarisDialogContentComponent {
  readonly density = input<SolarisDialogDensity>();
}
