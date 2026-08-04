import {
  Component,
  inject,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../services/translation';

import type {
  SolarisSpinnerSize,
  SolarisSpinnerColor,
  SolarisSpinnerSpeed,
  SolarisSpinnerEasing,
} from '../model/spinner.types';

@Component({
  selector: 'solaris-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-spinner',
    role: 'status',
    'aria-live': 'polite',
    '[attr.data-size]': 'size()',
    '[attr.data-speed]': 'speed()',
    '[attr.data-color]': 'color()',
    '[attr.data-easing]': 'easing()',
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[attr.data-backdrop]': 'backdrop() ? "" : null',
    '[attr.aria-hidden]': 'ariaHidden() ? "true" : null',
  },
})
export class SolarisSpinnerComponent {
  readonly size = input<SolarisSpinnerSize>('md');
  readonly color = input<SolarisSpinnerColor>('primary');
  readonly speed = input<SolarisSpinnerSpeed>('normal');
  readonly easing = input<SolarisSpinnerEasing>('linear');
  readonly backdrop = input<boolean>(false);
  readonly ariaHidden = input<boolean>(false);
  readonly label = input<string>();
  readonly labelKey = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelKey = input<string>();

  private readonly translate = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly resolvedLabel = computed<string | null>(() => {
    const label = this.label();
    if (label !== undefined) {
      return label === '' ? null : label;
    }

    const key = this.labelKey();
    if (key && this.translate) {
      return this.translate.translate(key);
    }

    if (this.translate) {
      return this.translate.translate('solaris.spinner.loading');
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

    const label = this.resolvedLabel();
    if (label) {
      return label;
    }

    if (this.translate) {
      return this.translate.translate('solaris.spinner.loading');
    }

    return null;
  });
}
