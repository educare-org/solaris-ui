import { Component, inject, input, computed, output } from '@angular/core';

import { SolarisIconComponent } from '../../../icon/component/solaris-icon.component';
import { SolarisTranslateService } from '../../../../services/translation/service/solaris-translate.service';

import type {
  SolarisAlertVariant,
  SolarisAlertAppearance,
  SolarisAlertRadius,
  SolarisAlertDensity,
  SolarisAlertLive,
} from '../model/alert.types';

@Component({
  selector: 'solaris-alert',
  standalone: true,
  imports: [SolarisIconComponent],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-density]': 'density()',
    '[attr.data-closable]': 'closable() ? "" : null',
    '[attr.role]': 'liveRole()',
    '[attr.aria-live]': 'ariaLive()',
  },
})
export class SolarisAlertComponent {
  private readonly translateService = inject(SolarisTranslateService);

  readonly variant = input<SolarisAlertVariant>('info');
  readonly appearance = input<SolarisAlertAppearance>('tonal');
  readonly radius = input<SolarisAlertRadius>('md');
  readonly density = input<SolarisAlertDensity>();
  readonly closable = input<boolean>(false);
  readonly live = input<SolarisAlertLive>('off');
  readonly showIcon = input<boolean>(true);
  readonly icon = input<string>();
  readonly closeLabel = input<string>();
  readonly closeLabelKey = input<string>();

  readonly dismissed = output<void>();

  protected readonly iconName = computed<string>(() => {
    const custom = this.icon();
    if (custom) {
      return custom;
    }
    const v = this.variant();
    switch (v) {
      case 'neutral':
        return 'info';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'danger';
      default:
        return 'info';
    }
  });

  protected readonly liveRole = computed<string | null>(() => {
    const l = this.live();
    if (l === 'assertive') {
      return 'alert';
    }
    if (l === 'polite') {
      return 'status';
    }
    return null;
  });

  protected readonly ariaLive = computed<string | null>(() => {
    const l = this.live();
    if (l === 'polite') {
      return 'polite';
    }
    if (l === 'assertive') {
      return 'assertive';
    }
    return null;
  });

  private readonly defaultCloseKey = 'solaris.alert.close';
  private readonly defaultCloseLabel = 'Close alert';

  protected readonly closeButtonLabel = computed<string>(() => {
    const explicit = this.closeLabel();
    if (explicit) {
      return explicit;
    }

    const key = this.closeLabelKey() ?? this.defaultCloseKey;
    const translated = this.translateService.translate(key);

    return translated !== key ? translated : this.defaultCloseLabel;
  });

  protected handleClose(): void {
    this.dismissed.emit();
  }
}
