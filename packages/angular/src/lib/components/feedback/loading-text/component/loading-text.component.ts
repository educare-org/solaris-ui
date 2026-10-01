import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  booleanAttribute,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../services/translation';

import type {
  SolarisLoadingTextColor,
  SolarisLoadingTextDensity,
  SolarisLoadingTextSize,
  SolarisLoadingTextSpeed,
} from '../model/loading.types';

@Component({
  selector: 'solaris-loading-text',
  standalone: true,
  templateUrl: './loading-text.component.html',
  styleUrls: ['./loading-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-loading-text',
    role: 'status',
    'aria-live': 'polite',
    '[attr.data-size]': 'size() || undefined',
    '[attr.data-density]': 'density() || undefined',
    '[attr.data-color]': 'color()',
    '[attr.data-speed]': 'speed()',
    '[attr.data-dots]': 'dots() || undefined',
    '[attr.aria-label]': 'resolvedAriaLabel()',
  },
})
export class SolarisLoadingTextComponent {
  readonly size = input<SolarisLoadingTextSize | undefined>(undefined);
  readonly density = input<SolarisLoadingTextDensity | undefined>(undefined);
  readonly color = input<SolarisLoadingTextColor>('primary');
  readonly speed = input<SolarisLoadingTextSpeed>('normal');
  readonly text = input<string>();
  readonly textKey = input<string>();
  readonly maxLines = input<number>(0);
  readonly dots = input<boolean, boolean | ''>(false, {
    transform: booleanAttribute,
  });
  readonly ariaLabel = input<string>();
  readonly ariaLabelKey = input<string>();

  private readonly translate = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly clampedMaxLines = computed<number>(() => {
    const maxLines = this.maxLines();
    if (Number.isFinite(maxLines)) {
      return Math.max(0, Math.floor(maxLines));
    }
    return 0;
  });

  protected readonly resolvedText = computed<string | null>(() => {
    const text = this.text();
    if (text !== undefined) {
      return text === '' ? null : text;
    }

    const key = this.textKey();
    if (key && this.translate) {
      return this.translate.translate(key);
    }

    if (this.translate) {
      return this.translate.translate('solaris.loadingText.loading');
    }

    return null;
  });

  protected readonly resolvedAriaLabel = computed<string | null>(() => {
    const aria = this.ariaLabel();
    if (aria) {
      return aria;
    }

    const key = this.ariaLabelKey();
    if (key && this.translate) {
      return this.translate.translate(key);
    }

    return this.resolvedText();
  });
}
