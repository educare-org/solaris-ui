import {
  Component,
  input,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisThemeService } from '../../../../services/theme';

import type {
  SolarisButtonGroupOrientation,
  SolarisButtonGroupDensity,
} from '../model/button-group.types';

@Component({
  selector: 'solaris-button-group',
  standalone: true,
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-attached]': 'attached() ? "" : null',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-full-width]': 'fullWidth() ? "" : null',
  },
})
export class SolarisButtonGroupComponent {
  readonly orientation = input<SolarisButtonGroupOrientation>('horizontal');
  readonly attached = input<boolean>(true);
  readonly density = input<SolarisButtonGroupDensity>();
  readonly fullWidth = input<boolean>(false);

  protected readonly themeService = inject(SolarisThemeService);

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });
}
