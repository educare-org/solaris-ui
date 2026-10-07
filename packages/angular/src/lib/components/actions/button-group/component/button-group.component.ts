import {
  Component,
  ElementRef,
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
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  ngOnInit(): void {
    // Pre-stamp host attributes before first paint so attached styling
    // (border, orientation) never flashes from the unstyled base. Host
    // bindings remain the source of truth afterwards.
    const el = this.elementRef.nativeElement;
    if (!el.hasAttribute('data-orientation')) {
      el.setAttribute('data-orientation', this.orientation());
    }
    if (!el.hasAttribute('data-size')) {
      el.setAttribute('data-size', this.size());
    }
    if (!el.hasAttribute('data-density')) {
      el.setAttribute('data-density', this.effectiveDensity());
    }
    if (this.attached() && !el.hasAttribute('data-attached')) {
      el.setAttribute('data-attached', '');
    }
    if (this.fullWidth() && !el.hasAttribute('data-full-width')) {
      el.setAttribute('data-full-width', '');
    }
  }
}
