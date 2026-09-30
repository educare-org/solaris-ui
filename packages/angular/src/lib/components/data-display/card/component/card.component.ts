import {
  Component,
  booleanAttribute,
  contentChild,
  input,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisThemeService } from '../../../../services/theme';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisCardActionsDirective } from '../directives/card-actions.directive';
import { SolarisCardContentDirective } from '../directives/card-content.directive';
import { SolarisCardFooterDirective } from '../directives/card-footer.directive';
import { SolarisCardHeaderDirective } from '../directives/card-header.directive';
import { SolarisCardMediaDirective } from '../directives/card-media.directive';

import type {
  SolarisCardAppearance,
  SolarisCardMediaPosition,
  SolarisCardRadius,
  SolarisCardPadding,
  SolarisCardDensity,
  SolarisCardGlassTexture,
} from '../model/card.types';

@Component({
  selector: 'solaris-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-padding]': 'padding()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-media-position]': 'mediaPosition()',
    '[attr.data-clickable]': 'isClickable() ? "" : null',
    '[attr.data-disabled]': 'isClickable() && disabled() ? "" : null',
    '[attr.aria-disabled]': 'isClickable() && disabled() ? "true" : null',
    '[attr.data-single-section]': 'sectionCount() === 1 ? "" : null',
    '[attr.data-glass-texture]':
      'appearance() === "glass" && glassTexture() !== "none" ? glassTexture() : null',
  },
})
export class SolarisCardComponent {
  readonly appearance = input<SolarisCardAppearance>('surface');
  readonly radius = input<SolarisCardRadius>('lg');
  readonly padding = input<SolarisCardPadding>('none');
  readonly density = input<SolarisCardDensity>();
  readonly glassTexture = input<SolarisCardGlassTexture>('none');
  readonly mediaPosition = input<SolarisCardMediaPosition>('top');
  readonly href = input<string | undefined>(undefined);
  readonly target = input<string | undefined>(undefined);
  readonly rel = input<string | undefined>(undefined);
  readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  protected readonly themeService = inject(SolarisThemeService);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  private readonly header = contentChild(SolarisCardHeaderDirective);
  private readonly content = contentChild(SolarisCardContentDirective);
  private readonly media = contentChild(SolarisCardMediaDirective);
  private readonly footer = contentChild(SolarisCardFooterDirective);
  private readonly actions = contentChild(SolarisCardActionsDirective);

  protected readonly sectionCount = computed(
    () =>
      [
        this.header(),
        this.content(),
        this.media(),
        this.footer(),
        this.actions(),
      ].filter((section) => section !== undefined).length,
  );

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly isClickable = computed(() => {
    const href = this.href();
    return href !== undefined && href !== '';
  });

  protected readonly effectiveRel = computed(() => {
    if (this.rel()) return this.rel();
    if (this.target() === '_blank') return 'noopener';
    return undefined;
  });

  protected readonly resolvedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const ariaLabelKey = this.ariaLabelKey();
    if (ariaLabelKey && this.translateService) {
      return this.translateService.translate(ariaLabelKey);
    }
    return ariaLabelKey ?? undefined;
  });
}
