// SECURITY_EXCEPTION_FILE: nativeElement required as ResizeObserver/MutationObserver target to detect content overflow for the automatic title tooltip. Standard DOM API with no Angular abstraction; SSR-safe via isPlatformBrowser guard and typeof checks.
// SECURITY_EXCEPTION_FILE: nativeElement.querySelector('.solaris-badge__content') with read-only scrollWidth/clientWidth/textContent required to measure truncation overflow for the accessible title. Text is only read (never written via innerHTML, no XSS risk); SSR-safe via isPlatformBrowser guard. Covered by badge.component.spec.ts truncation tests.
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  input,
  computed,
  inject,
  signal,
  ElementRef,
  NgZone,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

import { SolarisThemeService } from '../../../../services/theme';
import { SolarisTranslateService } from '../../../../services/translation';

import type {
  SolarisBadgeAppearance,
  SolarisBadgeColor,
  SolarisBadgeSize,
  SolarisBadgeRadius,
  SolarisBadgeVariant,
  SolarisBadgeDensity,
  SolarisBadgePlacement,
  SolarisBadgeOffset,
} from '../model/badge.types';

@Component({
  selector: 'solaris-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-color]': 'color()',
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-dot]': 'dot() || undefined',
    '[attr.data-pulse]': 'pulse() || undefined',
    '[attr.data-count]': 'hasCountInput() || undefined',
    '[attr.data-icon-only]': 'iconOnly() || undefined',
    '[attr.data-placement]': 'placement()',
    '[attr.data-truncate]': 'truncate() || undefined',
    '[attr.hidden]': 'isHidden() || undefined',
    '[attr.title]': 'resolvedTitle()',
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[style.--solaris-badge-offset-x]': 'offsetX()',
    '[style.--solaris-badge-offset-y]': 'offsetY()',
  },
})
export class SolarisBadgeComponent implements AfterViewInit, OnDestroy {
  readonly appearance = input<SolarisBadgeAppearance>('tonal');
  readonly variant = input<SolarisBadgeVariant>('standard');
  readonly color = input<SolarisBadgeColor>('neutral');
  readonly radius = input<SolarisBadgeRadius>('full');
  readonly density = input<SolarisBadgeDensity>();
  readonly size = input<SolarisBadgeSize>('md');

  readonly count = input<number | undefined>(undefined);
  readonly max = input<number>(99);
  readonly showZero = input<boolean>(false);
  readonly dot = input<boolean>(false);
  readonly pulse = input<boolean>(false);
  readonly iconOnly = input<boolean>(false);
  readonly placement = input<SolarisBadgePlacement>('inline');
  readonly offset = input<SolarisBadgeOffset | undefined>(undefined);
  readonly truncate = input<boolean>(true);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  protected readonly themeService = inject(SolarisThemeService);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly elementRef = inject(ElementRef);
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly hasCountInput = computed(() => {
    return this.count() !== undefined && this.count() !== null;
  });

  protected readonly displayCount = computed(() => {
    const count = this.count();
    if (count === undefined || count === null) return null;
    const max = this.max() <= 0 ? 99 : this.max();
    return count > max ? `${max}+` : `${count}`;
  });

  protected readonly isCountCapped = computed(() => {
    const count = this.count();
    if (count === undefined || count === null) return false;
    const max = this.max() <= 0 ? 99 : this.max();
    return count > max;
  });

  protected readonly isHidden = computed(() => {
    if (this.dot()) return false;
    const count = this.count();
    return count === 0 && !this.showZero();
  });

  protected readonly resolvedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const ariaLabelKey = this.ariaLabelKey();
    if (ariaLabelKey && this.translateService) {
      return this.translateService.translate(ariaLabelKey);
    }
    return ariaLabelKey ?? undefined;
  });

  protected readonly offsetX = computed(() => {
    return `${this.offset()?.[0] ?? 0}px`;
  });

  protected readonly offsetY = computed(() => {
    return `${this.offset()?.[1] ?? 0}px`;
  });

  private readonly overflowTitle = signal<string | undefined>(undefined);

  protected readonly resolvedTitle = computed(() => {
    if (this.dot()) return undefined;
    if (this.isCountCapped()) return `${this.count()}`;
    return this.overflowTitle();
  });

  private resizeObserver: ResizeObserver | null = null;
  private contentObserver: MutationObserver | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.measureOverflow();
    this.setupOverflowObservers();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.contentObserver?.disconnect();
    this.contentObserver = null;
  }

  private setupOverflowObservers(): void {
    const nativeEl = this.elementRef.nativeElement as HTMLElement;
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.ngZone.run(() => this.measureOverflow());
      });
      this.resizeObserver.observe(nativeEl);
    }
    if (typeof MutationObserver !== 'undefined') {
      this.contentObserver = new MutationObserver(() => {
        this.ngZone.run(() => this.measureOverflow());
      });
      this.contentObserver.observe(nativeEl, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['data-truncate'],
      });
    }
  }

  private measureOverflow(): void {
    if (!this.truncate() || this.dot() || this.hasCountInput()) {
      if (this.overflowTitle() !== undefined) this.overflowTitle.set(undefined);
      return;
    }
    const nativeEl = this.elementRef.nativeElement as HTMLElement;
    const content = nativeEl.querySelector(
      '.solaris-badge__content',
    ) as HTMLElement | null;
    if (!content) return;
    const isOverflowing = content.scrollWidth > content.clientWidth + 1;
    const next = isOverflowing
      ? content.textContent?.trim() || undefined
      : undefined;
    if (this.overflowTitle() !== next) this.overflowTitle.set(next);
  }
}
