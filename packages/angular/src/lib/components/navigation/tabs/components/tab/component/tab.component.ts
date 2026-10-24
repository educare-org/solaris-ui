import {
  input,
  inject,
  computed,
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  PLATFORM_ID,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

import { SolarisTranslateService } from '../../../../../../services/translation';
import { SolarisBadgeComponent } from '../../../../../data-display/badge';
import { SolarisThemeService } from '../../../../../../services/theme';
import { SolarisIconComponent } from '../../../../../icon';
import { SOLARIS_TABS } from '../../../token/tabs.tokens';
import { nextIdFor } from '../../../../../../core';

@Component({
  selector: 'solaris-tab',
  standalone: true,
  imports: [SolarisIconComponent, SolarisBadgeComponent],
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'tab',
    '[attr.id]': 'tabId()',
    '(click)': 'onClick()',
    '[attr.data-shape]': 'shape()',
    '(keydown)': 'onKeydown($event)',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[attr.data-density]': 'density()',
    '[attr.data-active]': 'isActive()',
    '[attr.aria-controls]': 'panelId()',
    '[attr.aria-selected]': 'isActive()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.tabindex]': 'isActive() ? "0" : "-1"',
    '[attr.data-disabled]': 'isComputedDisabled()',
    '[attr.aria-disabled]': 'isComputedDisabled() || undefined',
  },
})
export class SolarisTabComponent {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  protected readonly themeService = inject(SolarisThemeService);
  private readonly tabsControl = inject(SOLARIS_TABS, { optional: true });
  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  readonly badge = input<string | number | undefined>(undefined);
  readonly badgeLabelKey = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);
  readonly badgeLabel = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly labelKey = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly iconDecorative = input<boolean>(true);
  readonly value = input.required<string | number>();
  readonly disabled = input<boolean>(false);

  protected readonly instanceId = nextIdFor('solaris-tab');

  protected readonly tabId = computed(() => {
    if (this.tabsControl) {
      return this.tabsControl.generateTabId(this.value());
    }
    return `${this.instanceId}-tab`;
  });

  protected readonly panelId = computed(() => {
    if (this.tabsControl) {
      return this.tabsControl.generatePanelId(this.value());
    }
    return `${this.instanceId}-panel`;
  });

  protected readonly orientation = computed(() => {
    return this.tabsControl?.orientation() ?? 'horizontal';
  });

  protected readonly density = computed(() => {
    return this.tabsControl?.effectiveDensity() ?? this.themeService.density;
  });

  protected readonly size = computed(() => {
    return this.tabsControl?.size() ?? 'md';
  });

  protected readonly color = computed(() => {
    return this.tabsControl?.color() ?? 'neutral';
  });

  protected readonly shape = computed(() => {
    return this.tabsControl?.shape() ?? 'normal';
  });

  protected readonly appearance = computed(() => {
    return this.tabsControl?.appearance() ?? 'underline';
  });

  protected readonly isActive = computed(() => {
    if (!this.tabsControl) return false;
    return this.tabsControl.value() === this.value();
  });

  readonly isComputedDisabled = computed(() => {
    return this.disabled() || (this.tabsControl?.disabled() ?? false);
  });

  protected readonly computedBadge = computed(() => {
    const b = this.badge();
    if (b === undefined || b === null) return null;
    return b;
  });

  protected readonly index = computed(() => {
    if (!this.tabsControl) return -1;
    return this.tabsControl.tabs().indexOf(this);
  });

  readonly resolvedLabel = computed(() => {
    if (this.label()) return this.label();
    const labelKey = this.labelKey();
    if (labelKey && this.translateService) {
      return this.translateService.translate(labelKey);
    }
    return labelKey ?? undefined;
  });

  protected readonly resolvedBadgeLabel = computed(() => {
    if (this.badgeLabel()) return this.badgeLabel();
    const badgeLabelKey = this.badgeLabelKey();
    if (badgeLabelKey && this.translateService) {
      return this.translateService.translate(badgeLabelKey);
    }
    return badgeLabelKey ?? undefined;
  });

  protected readonly resolvedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const ariaLabelKey = this.ariaLabelKey();
    if (ariaLabelKey && this.translateService) {
      return this.translateService.translate(ariaLabelKey);
    }
    return undefined;
  });

  protected onClick(): void {
    if (this.isComputedDisabled()) return;
    this.tabsControl?.activateTab(this);
    this.tabsControl?.focusTab(this);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.isComputedDisabled()) return;

    const tabs = this.tabsControl?.tabs() ?? [];
    const currentIndex = this.index();

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (this.tabsControl?.activationMode() === 'manual') {
        this.tabsControl.activateTab(this);
      }

      return;
    }

    const nextIndex = this.getNextIndex(event.key, tabs, currentIndex);

    if (nextIndex === null || nextIndex === currentIndex) return;

    event.preventDefault();

    const nextTab = tabs[nextIndex];

    if (this.tabsControl?.activationMode() === 'automatic') {
      this.tabsControl.activateTab(nextTab);
    }

    this.tabsControl?.focusTab(nextTab);
  }

  private getNextIndex(
    key: string,
    tabs: ReadonlyArray<SolarisTabComponent>,
    currentIndex: number,
  ): number | null {
    switch (key) {
      case 'ArrowRight': {
        if (this.orientation() !== 'horizontal') return null;
        const direction: 1 | -1 = this.isRTL() ? -1 : 1;
        return this.findNextEnabled(tabs, currentIndex, direction);
      }

      case 'ArrowLeft': {
        if (this.orientation() !== 'horizontal') return null;
        const direction: 1 | -1 = this.isRTL() ? 1 : -1;
        return this.findNextEnabled(tabs, currentIndex, direction);
      }

      case 'ArrowDown':
        return this.orientation() === 'vertical'
          ? this.findNextEnabled(tabs, currentIndex, 1)
          : null;

      case 'ArrowUp':
        return this.orientation() === 'vertical'
          ? this.findNextEnabled(tabs, currentIndex, -1)
          : null;

      case 'Home':
        return this.findFirstEnabled(tabs);

      case 'End':
        return this.findLastEnabled(tabs);

      default:
        return null;
    }
  }

  private findNextEnabled(
    tabs: ReadonlyArray<SolarisTabComponent>,
    fromIndex: number,
    direction: 1 | -1,
  ): number | null {
    if (tabs.length === 0) return null;
    let i = fromIndex;
    for (let step = 0; step < tabs.length; step++) {
      i = (i + direction + tabs.length) % tabs.length;
      if (!tabs[i].isComputedDisabled()) return i;
    }
    return null;
  }

  private findFirstEnabled(
    tabs: ReadonlyArray<SolarisTabComponent>,
  ): number | null {
    for (let i = 0; i < tabs.length; i++) {
      if (!tabs[i].isComputedDisabled()) return i;
    }
    return null;
  }

  private findLastEnabled(
    tabs: ReadonlyArray<SolarisTabComponent>,
  ): number | null {
    for (let i = tabs.length - 1; i >= 0; i--) {
      if (!tabs[i].isComputedDisabled()) return i;
    }
    return null;
  }

  private isRTL(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const nativeElement = this.elementRef.nativeElement as HTMLElement | null;
    const closestDir = nativeElement?.closest?.('[dir]')?.getAttribute('dir');
    const dir =
      closestDir ??
      this.document.documentElement.getAttribute('dir') ??
      this.document.dir;
    return dir === 'rtl';
  }
}
