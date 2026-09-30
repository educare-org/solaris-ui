import {
  Component,
  inject,
  input,
  computed,
  output,
  signal,
  OnInit,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisAlertComponent } from '../../alert/component/alert.component';
import type {
  SolarisAlertRadius,
  SolarisAlertTextPosition,
} from '../../alert/model/alert.types';

import {
  isSolarisAnnouncementDismissed,
  persistSolarisAnnouncementDismissed,
} from '../model/announcement-storage';

import type {
  SolarisAnnouncementAlign,
  SolarisAnnouncementSize,
  SolarisAnnouncementDensity,
  SolarisAnnouncementVariant,
  SolarisAnnouncementAppearance,
  SolarisAnnouncementLive,
} from '../model/announcement.types';

const ALIGN_TO_TEXT_POSITION: Record<
  SolarisAnnouncementAlign,
  SolarisAlertTextPosition
> = {
  left: 'start',
  center: 'center',
  right: 'end',
};

@Component({
  selector: 'solaris-announcement',
  standalone: true,
  imports: [SolarisAlertComponent],
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': 'liveRole()',
    '[attr.aria-live]': 'ariaLive()',
    '[attr.data-align]': 'align()',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-sticky]': 'sticky() || undefined',
    '[attr.data-closable]': 'closable() || undefined',
  },
})
export class SolarisAnnouncementComponent implements OnInit {
  private readonly translateService = inject(SolarisTranslateService);
  protected readonly themeService = inject(SolarisThemeService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly align = input<SolarisAnnouncementAlign>('center');
  readonly size = input<SolarisAnnouncementSize>('md');
  readonly density = input<SolarisAnnouncementDensity | undefined>(undefined);
  readonly variant = input<SolarisAnnouncementVariant>('neutral');
  readonly appearance = input<SolarisAnnouncementAppearance>('solid');
  readonly radius = input<SolarisAlertRadius>('none');
  readonly live = input<SolarisAnnouncementLive>('polite');
  readonly sticky = input<boolean>(true);
  readonly closable = input<boolean>(true);
  readonly showIcon = input<boolean>(false);
  readonly icon = input<string>();
  readonly dismissKey = input<string>();
  readonly closeLabelKey = input<string>();
  readonly closeLabel = input<string>();

  readonly dismissed = output<void>();

  protected readonly suppressed = signal(false);

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly textPosition = computed<SolarisAlertTextPosition>(() => {
    return ALIGN_TO_TEXT_POSITION[this.align()];
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

  private readonly defaultCloseKey = 'solaris.announcement.close';
  private readonly defaultCloseLabel = 'Dismiss announcement';

  protected readonly closeButtonLabel = computed<string>(() => {
    const explicit = this.closeLabel();
    if (explicit) {
      return explicit;
    }

    const key = this.closeLabelKey() ?? this.defaultCloseKey;
    const translated = this.translateService.translate(key);

    return translated !== key ? translated : this.defaultCloseLabel;
  });

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const key = this.dismissKey();
    if (key && isSolarisAnnouncementDismissed(key)) {
      this.suppressed.set(true);
    }
  }

  protected handleDismiss(): void {
    const key = this.dismissKey();
    if (key && isPlatformBrowser(this.platformId)) {
      persistSolarisAnnouncementDismissed(key);
    }
    this.dismissed.emit();
  }
}
