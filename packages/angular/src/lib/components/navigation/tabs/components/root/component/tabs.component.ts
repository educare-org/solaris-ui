// SECURITY_EXCEPTION_FILE: nativeElement required to query tab elements for programmatic focus. Read-only, SSR-safe.
// SECURITY_EXCEPTION_FILE: nativeElement required to query tablist for indicator measurement. Read-only, SSR-safe.
import {
  Component,
  input,
  output,
  model,
  contentChildren,
  computed,
  signal,
  inject,
  ChangeDetectionStrategy,
  effect,
  ElementRef,
  NgZone,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../../../services/translation';
import { SolarisThemeService } from '../../../../../../services/theme';
import { SolarisTabComponent } from '../../tab/component/tab.component';
import { SolarisTabPanelComponent } from '../../tab-panel/component/tab-panel.component';
import {
  SOLARIS_TABS,
  type SolarisTabsControl,
} from '../../../token/tabs.tokens';

import type {
  SolarisTabsOrientation,
  SolarisTabsAppearance,
  SolarisTabsSize,
  SolarisTabsDensity,
  SolarisTabsActivationMode,
  SolarisTabsContentTransition,
  SolarisTabsChangeEvent,
  SolarisTabClickEvent,
} from '../model/tabs.types';
import { nextIdFor } from '../../../../../../core/utils/id';

@Component({
  selector: 'solaris-tabs',
  standalone: true,
  imports: [],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-tabs',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-full-width]': 'fullWidth()',
    '[attr.data-scrollable]': 'scrollable()',
    '[attr.data-show-indicator]': 'showIndicator()',
    '[attr.data-content-transition]': 'contentTransition()',
  },
  providers: [
    {
      provide: SOLARIS_TABS,
      useExisting: SolarisTabsComponent,
    },
  ],
})
export class SolarisTabsComponent implements SolarisTabsControl {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  protected readonly themeService = inject(SolarisThemeService);
  private readonly elementRef = inject(ElementRef);
  private readonly ngZone = inject(NgZone);

  readonly tabs = contentChildren(SolarisTabComponent);
  readonly panels = contentChildren(SolarisTabPanelComponent);

  readonly value = model<string | number | undefined>(undefined);
  readonly defaultValue = input<string | number | undefined>(undefined);
  readonly orientation = input<SolarisTabsOrientation>('horizontal');
  readonly appearance = input<SolarisTabsAppearance>('underline');
  readonly size = input<SolarisTabsSize>('md');
  readonly density = input<SolarisTabsDensity>();
  readonly activationMode = input<SolarisTabsActivationMode>('automatic');
  readonly contentTransition = input<SolarisTabsContentTransition>('fade');
  readonly fullWidth = input<boolean>(false);
  readonly fitContent = input<boolean>(true);
  readonly scrollable = input<boolean>(true);
  readonly showIndicator = input<boolean>(true);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly valueChange = output<string | number | undefined>();
  readonly tabChange = output<SolarisTabsChangeEvent>();
  readonly tabClick = output<SolarisTabClickEvent>();

  protected readonly previousValue = signal<string | number | undefined>(
    undefined,
  );
  protected readonly slideDirection = signal<'left' | 'right'>('right');

  readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly instanceId = nextIdFor('solaris-tabs');

  protected readonly indicatorReady = signal(false);
  protected readonly indicatorTransformX = signal('translateX(0)');
  protected readonly indicatorTransformY = signal('translateY(0)');
  protected readonly indicatorSize = signal('0');

  protected readonly resolvedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const ariaLabelKey = this.ariaLabelKey();
    if (ariaLabelKey && this.translateService) {
      return this.translateService.translate(ariaLabelKey);
    }
    return ariaLabelKey ?? 'Tabs';
  });

  constructor() {
    effect(() => {
      const defaultValue = this.defaultValue();
      const currentValue = this.value();
      if (currentValue === undefined && defaultValue !== undefined) {
        this.value.set(defaultValue);
      }
    });

    effect(() => {
      const current = this.value();
      const previous = this.previousValue();
      if (current !== previous && previous !== undefined) {
        this.valueChange.emit(current);
        this.tabChange.emit({
          value: current,
          previousValue: previous,
        });
        this.updateSlideDirection(current, previous);
      }
      this.previousValue.set(current);
    });

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.measureIndicator());
    });

    effect(() => {
      this.value();
      this.appearance();
      this.orientation();
      this.tabs();
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => this.measureIndicator());
      });
    });
  }

  activateTab(tab: SolarisTabComponent): void {
    if (tab.isComputedDisabled()) return;
    if (this.disabled()) return;
    this.value.set(tab.value());
    const label = tab.resolvedLabel();
    this.tabClick.emit({
      value: tab.value(),
      label,
    });
  }

  focusTab(tab: SolarisTabComponent): void {
    const nativeElement = this.elementRef.nativeElement as HTMLElement;
    const tabElements = nativeElement.querySelectorAll(
      'solaris-tab',
    ) as NodeListOf<HTMLElement>;
    const tabArray = this.tabs();
    const index = tabArray.indexOf(tab);
    if (index >= 0 && tabElements[index]) {
      tabElements[index].focus();
    }
  }

  generateTabId(value: string | number): string {
    return `${this.instanceId}-tab-${value}`;
  }

  generatePanelId(value: string | number): string {
    return `${this.instanceId}-panel-${value}`;
  }

  private measureIndicator(): void {
    const nativeEl = this.elementRef.nativeElement as HTMLElement;
    const tablist = nativeEl.querySelector(
      '.solaris-tabs__tablist',
    ) as HTMLElement | null;
    if (!tablist) return;

    const activeTab = tablist.querySelector(
      'solaris-tab[data-active="true"]',
    ) as HTMLElement | null;
    if (!activeTab) return;

    const isVertical = this.orientation() === 'vertical';

    if (isVertical) {
      this.indicatorTransformY.set(`translateY(${activeTab.offsetTop}px)`);
      this.indicatorSize.set(`${activeTab.offsetHeight}px`);
    } else {
      this.indicatorTransformX.set(`translateX(${activeTab.offsetLeft}px)`);
      this.indicatorSize.set(`${activeTab.offsetWidth}px`);
    }

    if (!this.indicatorReady()) {
      setTimeout(() => this.indicatorReady.set(true));
    }
  }

  private updateSlideDirection(
    current: string | number | undefined,
    previous: string | number | undefined,
  ): void {
    const tabs = this.tabs();
    const currentIndex = tabs.findIndex((t) => t.value() === current);
    const previousIndex = tabs.findIndex((t) => t.value() === previous);
    if (currentIndex >= 0 && previousIndex >= 0) {
      this.slideDirection.set(currentIndex > previousIndex ? 'right' : 'left');
    }
  }
}
