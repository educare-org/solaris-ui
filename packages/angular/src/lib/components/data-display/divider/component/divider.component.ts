import {
  Component,
  input,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';

import type {
  SolarisDividerOrientation,
  SolarisDividerAppearance,
  SolarisDividerVariant,
  SolarisDividerSpacing,
  SolarisDividerInset,
  SolarisDividerLength,
  SolarisDividerTextPosition,
} from '../model/divider.types';

import { SolarisTranslateService } from '../../../../services/translation';

@Component({
  selector: 'solaris-divider',
  standalone: true,
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-inset]': 'inset()',
    '[attr.role]': 'computedRole()',
    '[attr.data-spacing]': 'spacing()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-text-position]': 'computedTextPosition()',
    '[attr.aria-hidden]': 'effectiveDecorative() ? "true" : null',
    '[attr.aria-orientation]': 'computedAriaOrientation()',
    '[attr.aria-label]': 'resolvedAriaLabel() || undefined',
    '[attr.aria-labelledby]': 'ariaLabelledby() || undefined',
    '[style.--solaris-divider-width]': 'computedWidth()',
    '[style.--solaris-divider-height]': 'computedHeight()',
  },
})
export class SolarisDividerComponent {
  private readonly translateService = inject(SolarisTranslateService);

  readonly orientation = input<SolarisDividerOrientation>('horizontal');
  readonly appearance = input<SolarisDividerAppearance>('subtle');
  readonly variant = input<SolarisDividerVariant>('solid');
  readonly spacing = input<SolarisDividerSpacing>('md');
  readonly inset = input<SolarisDividerInset>('none');
  readonly decorative = input<boolean>(true);
  readonly width = input<SolarisDividerLength | undefined>(undefined);
  readonly height = input<SolarisDividerLength | undefined>(undefined);
  readonly label = input<string>();
  readonly labelKey = input<string>();
  readonly textPosition = input<SolarisDividerTextPosition>('center');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);
  readonly ariaLabelledby = input<string | undefined>(undefined);

  protected readonly labelText = computed<string | null>(() => {
    if (this.orientation() === 'vertical') return null;

    const direct = this.label();
    if (direct) return direct;

    const key = this.labelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      if (translated !== key) return translated;
    }

    return null;
  });

  protected readonly effectiveDecorative = computed(() => {
    return this.decorative() && !this.labelText();
  });

  protected readonly computedRole = computed<string | null>(() => {
    return this.effectiveDecorative() ? null : 'separator';
  });

  protected readonly computedAriaOrientation = computed<string | null>(() => {
    if (this.effectiveDecorative()) return null;
    if (this.orientation() === 'vertical') return 'vertical';
    return null;
  });

  protected readonly computedTextPosition = computed<string | null>(() => {
    if (!this.labelText()) return null;
    return this.textPosition();
  });

  protected readonly computedWidth = computed<string | null>(() => {
    const w = this.width();
    return w || null;
  });

  protected readonly computedHeight = computed<string | null>(() => {
    const h = this.height();
    return h || null;
  });

  protected readonly resolvedAriaLabel = computed<string | undefined>(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const ariaLabelKey = this.ariaLabelKey();
    if (ariaLabelKey) {
      const translated = this.translateService.translate(ariaLabelKey);
      if (translated !== ariaLabelKey) return translated;
    }
    return undefined;
  });
}
