import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  input,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../services/translation';

import type {
  SolarisProgressColor,
  SolarisProgressSize,
} from '../model/progress.types';

@Component({
  selector: 'solaris-progress',
  standalone: true,
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-progress',
    role: 'progressbar',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[attr.data-indeterminate]': 'indeterminate() ? "" : null',
    '[attr.aria-valuemin]': 'indeterminate() ? null : 0',
    '[attr.aria-valuemax]': 'indeterminate() ? null : 100',
    '[attr.aria-valuenow]': 'indeterminate() ? null : clampedValue()',
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[attr.aria-valuetext]': 'resolvedValueText()',
  },
})
export class SolarisProgressComponent {
  readonly size = input<SolarisProgressSize>('md');
  readonly color = input<SolarisProgressColor>('primary');
  readonly value = input<number>(0);
  readonly indeterminate = input<boolean>(false);
  readonly label = input<string>();
  readonly labelKey = input<string>();
  readonly showPercent = input<boolean>(false);
  readonly ariaLabel = input<string>();
  readonly ariaLabelKey = input<string>();

  private readonly translate = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly clampedValue = computed<number>(() => {
    const value = this.value();
    if (Number.isFinite(value)) {
      return Math.min(100, Math.max(0, Math.round(value)));
    }
    return 0;
  });

  protected readonly percentText = computed<number>(() => {
    const percent = this.clampedValue();
    return this.indeterminate() ? 0 : percent;
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
    return null;
  });

  protected readonly indeterminateText = computed<string>(() => {
    if (this.translate) {
      return this.translate.translate('solaris.progress.indeterminate');
    }
    return 'Indeterminate progress';
  });

  protected readonly resolvedValueText = computed<string | null>(() => {
    const label = this.resolvedLabel();
    if (this.indeterminate()) {
      return label
        ? `${label}, ${this.indeterminateText()}`
        : this.indeterminateText();
    }
    const percent = `${this.clampedValue()} percent`;
    return label ? `${label}, ${percent}` : percent;
  });
}
