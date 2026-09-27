// SECURITY_EXCEPTION_FILE: nativeElement required to query tab elements for programmatic focus. Read-only, SSR-safe.
// SECURITY_EXCEPTION_FILE: nativeElement required to query tablist for indicator measurement. Read-only, SSR-safe.
// SECURITY_EXCEPTION_FILE: nativeElement required for ResizeObserver target. Standard DOM API, SSR-safe with typeof guard.
// SECURITY_EXCEPTION_FILE: nativeElement required for MutationObserver target. Standard DOM API, SSR-safe with typeof guard.
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
  Injector,
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { SolarisTabPanelComponent } from '../../tab-panel/component/tab-panel.component';
import { SolarisTranslateService } from '../../../../../../services/translation';
import { SolarisThemeService } from '../../../../../../services/theme';
import { SolarisTabComponent } from '../../tab/component/tab.component';
import {
  SOLARIS_TABS,
  type SolarisTabsControl,
} from '../../../token/tabs.tokens';

import {
  SolarisTabsOrientation,
  SolarisTabsAppearance,
  SolarisTabsSize,
  SolarisTabsColor,
  SolarisTabsDensity,
  SolarisTabsShape,
  SolarisTabsActivationMode,
  SolarisTabsContentTransition,
  SolarisTabsChangeEvent,
  SolarisTabClickEvent,
  SolarisTabsValue,
} from '../model/tabs.types';
import { nextIdFor } from '../../../../../../core';

@Component({
  selector: 'solaris-tabs',
  standalone: true,
  imports: [],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-tabs',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-disabled]': 'disabled() || undefined',
    '[attr.aria-disabled]': 'disabled() || undefined',
    '[attr.data-fit-content]': 'fitContent() || undefined',
    '[attr.data-full-width]': 'fullWidth() || undefined',
    '[attr.data-scrollable]': 'scrollable() || undefined',
    '[attr.data-show-indicator]': 'showIndicator() || undefined',
    '[attr.data-content-transition]': 'contentTransition()',
  },
  providers: [
    {
      provide: SOLARIS_TABS,
      useExisting: SolarisTabsComponent,
    },
  ],
})
export class SolarisTabsComponent
  implements SolarisTabsControl, AfterViewInit, OnDestroy
{
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  protected readonly themeService = inject(SolarisThemeService);
  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(Injector);
  private readonly ngZone = inject(NgZone);

  readonly tabs = contentChildren(SolarisTabComponent);
  readonly panels = contentChildren(SolarisTabPanelComponent);

  readonly contentTransition = input<SolarisTabsContentTransition>('fade');
  readonly activationMode = input<SolarisTabsActivationMode>('automatic');
  readonly orientation = input<SolarisTabsOrientation>('horizontal');
  readonly appearance = input<SolarisTabsAppearance>('underline');
  readonly size = input<SolarisTabsSize>('md');
  readonly color = input<SolarisTabsColor>('primary');
  readonly ariaLabelKey = input<string | undefined>(undefined);
  readonly defaultValue = input<SolarisTabsValue>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly shape = input<SolarisTabsShape>('normal');
  readonly density = input<SolarisTabsDensity>();
  readonly showIndicator = input<boolean>(true);
  readonly fullWidth = input<boolean>(false);
  readonly fitContent = input<boolean>(true);
  readonly scrollable = input<boolean>(true);
  readonly disabled = input<boolean>(false);

  readonly tabChange = output<SolarisTabsChangeEvent>();
  readonly tabClick = output<SolarisTabClickEvent>();
  readonly valueChange = output<SolarisTabsValue>();

  readonly value = model<SolarisTabsValue>(undefined);
  protected readonly instanceId = nextIdFor('solaris-tabs');

  protected readonly previousValue = signal<SolarisTabsValue>(undefined);
  protected readonly slideDirection = signal<'left' | 'right'>('right');
  protected readonly indicatorTransformX = signal('translateX(0)');
  protected readonly indicatorTransformY = signal('translateY(0)');
  protected readonly indicatorReady = signal(false);
  protected readonly indicatorSize = signal('0');

  private resizeObserver: ResizeObserver | null = null;
  private contentObserver: MutationObserver | null = null;

  readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly resolvedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const ariaLabelKey = this.ariaLabelKey();
    if (ariaLabelKey && this.translateService) {
      return this.translateService.translate(ariaLabelKey);
    }
    return ariaLabelKey ?? undefined;
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
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.setupIndicatorMeasurement();

    effect(
      () => {
        this.value();
        this.appearance();
        this.orientation();
        this.size();
        this.color();
        this.effectiveDensity();
        this.tabs();
        this.ngZone.runOutsideAngular(() => {
          requestAnimationFrame(() => this.measureIndicator());
        });
      },
      { injector: this.injector },
    );
  }

  ngOnDestroy(): void {
    this.disconnectObservers();
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
    if (!this.showIndicator()) return;
    if (this.appearance() !== 'underline') return;

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

    const listRect = tablist.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const borderLeft = tablist.clientLeft;
    const borderTop = tablist.clientTop;

    if (isVertical) {
      const offsetY =
        tabRect.top - listRect.top - borderTop + tablist.scrollTop;
      this.indicatorTransformY.set(`translateY(${offsetY}px)`);
      this.indicatorSize.set(`${tabRect.height}px`);
    } else {
      const offsetX =
        tabRect.left - listRect.left - borderLeft + tablist.scrollLeft;
      this.indicatorTransformX.set(`translateX(${offsetX}px)`);
      this.indicatorSize.set(`${tabRect.width}px`);
    }

    if (!this.indicatorReady()) {
      requestAnimationFrame(() => this.indicatorReady.set(true));
    }
  }

  private setupIndicatorMeasurement(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.ngZone.runOutsideAngular(() => {
          requestAnimationFrame(() => this.measureIndicator());
        });
      });
      const nativeEl = this.elementRef.nativeElement as HTMLElement;
      this.resizeObserver.observe(nativeEl);
    }

    if (typeof MutationObserver !== 'undefined') {
      const nativeEl = this.elementRef.nativeElement as HTMLElement;
      this.contentObserver = new MutationObserver(() => {
        this.ngZone.runOutsideAngular(() => {
          requestAnimationFrame(() => this.measureIndicator());
        });
      });
      this.contentObserver.observe(nativeEl, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['data-active', 'class', 'style'],
      });
    }

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => this.measureIndicator());
    });
  }

  private disconnectObservers(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.contentObserver?.disconnect();
    this.contentObserver = null;
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
