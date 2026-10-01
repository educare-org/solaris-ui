// SECURITY_EXCEPTION_FILE: document.body.style.overflow required for backdrop scroll-lock. SSR-safe via injected DOCUMENT token and isPlatformBrowser guard; previous value restored on toggle and destroy.
import {
  Component,
  inject,
  input,
  computed,
  booleanAttribute,
  effect,
  PLATFORM_ID,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';

import type {
  SolarisSpinnerSize,
  SolarisSpinnerDensity,
  SolarisSpinnerColor,
  SolarisSpinnerSpeed,
  SolarisSpinnerEasing,
  SolarisSpinnerVariant,
} from '../model/spinner.types';
import { RING_ARC_PATH, SOLARIS_STACKED_BARS } from '../model/spinner-geometry';
import type { SolarisStackedBar } from '../model/spinner-geometry';

@Component({
  selector: 'solaris-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-spinner',
    '[attr.role]': 'hostRole()',
    '[attr.aria-live]': 'hostAriaLive()',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-speed]': 'speed()',
    '[attr.data-color]': 'color()',
    '[attr.data-easing]': 'easing()',
    '[attr.data-variant]': 'variant()',
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[attr.data-backdrop]': 'backdrop() || undefined',
    '[attr.data-overlay]': 'overlay() || undefined',
    '[attr.aria-hidden]': 'ariaHidden() ? "true" : null',
    '[attr.aria-valuemin]': 'progressAria()?.valuemin ?? null',
    '[attr.aria-valuemax]': 'progressAria()?.valuemax ?? null',
    '[attr.aria-valuenow]': 'progressAria()?.valuenow ?? null',
    '[attr.aria-valuetext]': 'progressAria()?.valuetext ?? null',
  },
})
export class SolarisSpinnerComponent {
  readonly variant = input<SolarisSpinnerVariant>('ring');
  readonly size = input<SolarisSpinnerSize>('md');
  readonly density = input<SolarisSpinnerDensity | undefined>(undefined);
  readonly color = input<SolarisSpinnerColor>('primary');
  readonly speed = input<SolarisSpinnerSpeed>('normal');
  readonly easing = input<SolarisSpinnerEasing>('linear');
  readonly backdrop = input<boolean, boolean | ''>(false, {
    transform: booleanAttribute,
  });
  readonly overlay = input<boolean, boolean | ''>(false, {
    transform: booleanAttribute,
  });
  readonly lockScroll = input<boolean, boolean | ''>(true, {
    transform: booleanAttribute,
  });
  readonly ariaHidden = input<boolean, boolean | ''>(false, {
    transform: booleanAttribute,
  });
  readonly label = input<string>();
  readonly labelKey = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelKey = input<string>();
  readonly value = input<number>(0);
  readonly showPercent = input<boolean, boolean | ''>(false, {
    transform: booleanAttribute,
  });
  readonly description = input<string[]>([]);
  readonly descriptionKey = input<string[]>([]);

  private readonly translate = inject(SolarisTranslateService, {
    optional: true,
  });
  protected readonly themeService = inject(SolarisThemeService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly effectiveDensity = computed(
    () => this.density() ?? this.themeService.density,
  );

  protected readonly isProgress = computed(() => this.variant() === 'progress');

  protected readonly isStacked = computed(() => this.variant() === 'stacked');

  protected readonly stackedBars: readonly SolarisStackedBar[] =
    SOLARIS_STACKED_BARS;

  protected readonly ringArcPath = RING_ARC_PATH;

  protected readonly hostRole = computed<string>(() =>
    this.isProgress() ? 'progressbar' : 'status',
  );

  protected readonly hostAriaLive = computed<string | null>(() =>
    this.isProgress() ? null : 'polite',
  );

  protected readonly clampedValue = computed<number>(() => {
    const value = this.value();
    if (Number.isFinite(value)) {
      return Math.min(100, Math.max(0, Math.round(value)));
    }
    return 0;
  });

  protected readonly indicatorDashArray = computed<string>(() => {
    const value = this.clampedValue();
    return `${value} ${100 - value}`;
  });

  /**
   * Visible label. Unlike the accessible name, there is no default: the
   * spinner renders indicator-only unless `label`/`labelKey` is explicit.
   */
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

  protected readonly resolvedDescription = computed<string[]>(() => {
    const items = this.description();
    const keys = this.descriptionKey();
    const result: string[] = [];

    const count = Math.max(items.length, keys.length);
    for (let index = 0; index < count; index++) {
      const item = items[index];
      if (item !== undefined) {
        if (item !== '') {
          result.push(item);
        }
        continue;
      }

      const key = keys[index];
      if (key && this.translate) {
        result.push(this.translate.translate(key));
      }
    }

    return result;
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

  protected readonly progressAria = computed<{
    valuemin: number;
    valuemax: number;
    valuenow: number;
    valuetext: string;
  } | null>(() => {
    if (!this.isProgress()) {
      return null;
    }

    const percent = this.clampedValue();
    const label = this.resolvedLabel();
    const description = this.resolvedDescription();
    const parts: string[] = [];

    if (label) {
      parts.push(label);
    }
    parts.push(`${percent} percent`, ...description);

    return {
      valuemin: 0,
      valuemax: 100,
      valuenow: percent,
      valuetext: parts.join(', '),
    };
  });

  constructor() {
    // Backdrop scroll-lock: while a fixed full-screen backdrop is visible,
    // prevent the page behind it from scrolling. SSR-safe, restored on
    // destroy and when the backdrop input flips back to false.
    const canUseDom = isPlatformBrowser(this.platformId);
    let previousOverflow: string | null = null;
    effect(() => {
      const active = this.backdrop() && this.lockScroll();
      if (!canUseDom) {
        return;
      }
      const body = this.document.body;
      if (active) {
        if (previousOverflow === null) {
          previousOverflow = body.style.overflow;
        }
        body.style.overflow = 'hidden';
      } else if (previousOverflow !== null) {
        body.style.overflow = previousOverflow;
        previousOverflow = null;
      }
    });
    this.destroyRef.onDestroy(() => {
      if (canUseDom && previousOverflow !== null) {
        this.document.body.style.overflow = previousOverflow;
      }
    });
  }
}
