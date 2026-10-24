import {
  Component,
  inject,
  input,
  computed,
  output,
  contentChild,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisIconComponent } from '../../../icon';
import { SolarisAlertTitleDirective } from '../directives/alert-title.directive';

import type {
  SolarisAlertVariant,
  SolarisAlertAppearance,
  SolarisAlertRadius,
  SolarisAlertSize,
  SolarisAlertDensity,
  SolarisAlertLive,
  SolarisAlertTextPosition,
} from '../model/alert.types';

@Component({
  selector: 'solaris-alert',
  standalone: true,
  imports: [SolarisIconComponent],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': 'liveRole()',
    '[attr.aria-live]': 'ariaLive()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-closable]': 'closable() || undefined',
    '[attr.data-has-title]': 'effectiveHasTitle() || undefined',
    '[attr.data-text-position]': 'textPosition()',
  },
})
export class SolarisAlertComponent {
  private readonly translateService = inject(SolarisTranslateService);
  protected readonly themeService = inject(SolarisThemeService);

  private readonly projectedTitle = contentChild(SolarisAlertTitleDirective);

  readonly textPosition = input<SolarisAlertTextPosition>('start');
  readonly appearance = input<SolarisAlertAppearance>('tonal');
  readonly variant = input<SolarisAlertVariant>('info');
  readonly radius = input<SolarisAlertRadius>('md');
  readonly size = input<SolarisAlertSize>('md');
  readonly live = input<SolarisAlertLive>('off');
  readonly density = input<SolarisAlertDensity | undefined>(undefined);
  readonly closable = input<boolean>(false);
  /**
   * Manual override for title presence. When `undefined` (default), presence
   * is auto-detected from a projected `[solaris-alert-title]`.
   */
  readonly hasTitle = input<boolean | undefined>(undefined);
  readonly showIcon = input<boolean>(true);
  readonly closeLabelKey = input<string>();
  readonly closeLabel = input<string>();
  readonly icon = input<string>();

  readonly dismissed = output<void>();

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly effectiveHasTitle = computed(() => {
    return this.hasTitle() ?? this.projectedTitle() != null;
  });

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
