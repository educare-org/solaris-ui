import {
  Component,
  computed,
  inject,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';

import type { SolarisDialogDensity } from '../../root/model/dialog.types';
import { SolarisThemeService } from '../../../../../../services/theme';

@Component({
  selector: 'solaris-dialog-content',
  standalone: true,
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-dialog-content',
    '[attr.data-density]': 'effectiveDensity()',
  },
})
export class SolarisDialogContentComponent {
  private readonly themeService = inject(SolarisThemeService, {
    optional: true,
  });

  readonly density = input<SolarisDialogDensity>();

  protected readonly effectiveDensity = computed(
    () => this.density() ?? this.themeService?.density ?? 'normal',
  );
}
