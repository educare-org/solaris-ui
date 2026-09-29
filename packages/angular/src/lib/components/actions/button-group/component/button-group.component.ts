import {
  Component,
  input,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisThemeService } from '../../../../services/theme';

import { SOLARIS_BUTTON_GROUP_CONTEXT } from '../model/button-group-context';
import type {
  SolarisButtonGroupOrientation,
  SolarisButtonGroupDensity,
  SolarisButtonGroupSize,
} from '../model/button-group.types';

@Component({
  selector: 'solaris-button-group',
  standalone: true,
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SOLARIS_BUTTON_GROUP_CONTEXT,
      useExisting: SolarisButtonGroupComponent,
    },
  ],
  host: {
    role: 'group',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-attached]': 'attached() ? "" : null',
    '[attr.data-full-width]': 'fullWidth() ? "" : null',
  },
})
export class SolarisButtonGroupComponent {
  readonly orientation = input<SolarisButtonGroupOrientation>('horizontal');
  readonly size = input<SolarisButtonGroupSize>('md');
  readonly density = input<SolarisButtonGroupDensity | undefined>(undefined);
  readonly fullWidth = input<boolean>(false);
  readonly attached = input<boolean>(true);

  protected readonly themeService = inject(SolarisThemeService);

  readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });
}
