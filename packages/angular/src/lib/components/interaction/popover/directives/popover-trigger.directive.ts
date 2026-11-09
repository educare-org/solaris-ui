import {
  Directive,
  ElementRef,
  Injector,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  DestroyRef,
  HostListener,
  TemplateRef,
  type ComponentRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Overlay,
  OverlayRef,
  OverlayConfig,
  FlexibleConnectedPositionStrategy,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { SolarisPopoverDirective } from './popover.directive';
import { SolarisPopoverPanelComponent } from '../component/popover-panel.component';
import {
  SOLARIS_POPOVER_PANEL_DATA,
  type SolarisPopoverPanelData,
} from '../token/popover.tokens';
import {
  getPrimaryPosition,
  getFallbackPositions,
} from '../model/popover-position';
import {
  normalizePopoverDimension,
  resolvePopoverSize,
} from '../functions/popover-size';
import { scheduleMotionClose, cancelMotionClose } from '../../../../core';

import type {
  SolarisPopoverPlacement,
  SolarisPopoverAlign,
  SolarisPopoverAppearance,
  SolarisPopoverPadding,
  SolarisPopoverRadius,
  SolarisPopoverScrollStrategy,
  SolarisPopoverAutoFocus,
} from '../model/popover.types';

let nextPanelId = 0;

@Directive({
  selector: '[solaris-popover-trigger]',
  standalone: true,
  host: {
    '[attr.aria-expanded]': 'isOpen() ? "true" : "false"',
    '[attr.aria-controls]': 'isOpen() ? panelId : null',
    '[attr.aria-haspopup]': 'ariaHasPopupComputed()',
  },
})
export class SolarisPopoverTriggerDirective {
  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly panelId = `solaris-popover-panel-${++nextPanelId}`;
  protected readonly isOpen = signal(false);

  private overlayRef: OverlayRef | null = null;
  private positionStrategy: FlexibleConnectedPositionStrategy | null = null;
  private outsideClickCleanup: (() => void) | null = null;
  private previousActiveElement: HTMLElement | null = null;
  private panelContainerRef: HTMLElement | null = null;
  private panelDataRef: SolarisPopoverPanelData | null = null;
  private panelComponentRef: ComponentRef<SolarisPopoverPanelComponent> | null =
    null;
  private fitContentSizeTimeout: ReturnType<typeof setTimeout> | null = null;
  private closeTimeout: ReturnType<typeof setTimeout> | null = null;
  private triggerVisibilityObserver: IntersectionObserver | null = null;
  private originResizeObserver: ResizeObserver | null = null;
  private connectedSide: 'top' | 'bottom' = 'bottom';

  readonly solarisPopoverTriggerFor = input<
    SolarisPopoverDirective | undefined
  >(undefined, {
    alias: 'solarisPopoverTriggerFor',
  });

  readonly solarisPopoverOpen = input<boolean | undefined>(undefined, {
    alias: 'solarisPopoverOpen',
  });

  readonly solarisPopoverDisabled = input<boolean>(false, {
    alias: 'solarisPopoverDisabled',
  });

  readonly solarisPopoverPlacement = input<SolarisPopoverPlacement>('bottom', {
    alias: 'solarisPopoverPlacement',
  });

  readonly solarisPopoverAlign = input<SolarisPopoverAlign>('start', {
    alias: 'solarisPopoverAlign',
  });

  readonly solarisPopoverOffset = input<number>(8, {
    alias: 'solarisPopoverOffset',
  });

  readonly solarisPopoverMatchTriggerWidth = input<boolean>(false, {
    alias: 'solarisPopoverMatchTriggerWidth',
  });

  readonly solarisPopoverFitContent = input<boolean>(false, {
    alias: 'solarisPopoverFitContent',
  });

  readonly solarisPopoverMinWidth = input<string | number | undefined>(
    undefined,
    {
      alias: 'solarisPopoverMinWidth',
    },
  );

  readonly solarisPopoverMaxWidth = input<string | number | undefined>(
    undefined,
    {
      alias: 'solarisPopoverMaxWidth',
    },
  );

  readonly solarisPopoverMaxHeight = input<string | number | undefined>(
    undefined,
    {
      alias: 'solarisPopoverMaxHeight',
    },
  );

  readonly solarisPopoverCloseOnOutsideClick = input<boolean>(true, {
    alias: 'solarisPopoverCloseOnOutsideClick',
  });

  readonly solarisPopoverCloseOnEscape = input<boolean>(true, {
    alias: 'solarisPopoverCloseOnEscape',
  });

  readonly solarisPopoverRestoreFocus = input<boolean>(true, {
    alias: 'solarisPopoverRestoreFocus',
  });

  readonly solarisPopoverAutoFocus = input<SolarisPopoverAutoFocus>(false, {
    alias: 'solarisPopoverAutoFocus',
  });

  readonly solarisPopoverScrollStrategy = input<SolarisPopoverScrollStrategy>(
    'reposition',
    {
      alias: 'solarisPopoverScrollStrategy',
    },
  );

  readonly solarisPopoverPanelRole = input<string | undefined>(undefined, {
    alias: 'solarisPopoverPanelRole',
  });

  readonly solarisPopoverAriaHasPopup = input<string | boolean | undefined>(
    undefined,
    {
      alias: 'solarisPopoverAriaHasPopup',
    },
  );

  readonly solarisPopoverAppearance = input<SolarisPopoverAppearance>(
    'outline',
    {
      alias: 'solarisPopoverAppearance',
    },
  );

  readonly solarisPopoverPadding = input<SolarisPopoverPadding>('none', {
    alias: 'solarisPopoverPadding',
  });

  readonly solarisPopoverRadius = input<SolarisPopoverRadius>('md', {
    alias: 'solarisPopoverRadius',
  });

  readonly solarisPopoverTopConnected = input<boolean>(false, {
    alias: 'solarisPopoverTopConnected',
  });

  readonly solarisPopoverCloseOnTriggerOutOfView = input<boolean>(false, {
    alias: 'solarisPopoverCloseOnTriggerOutOfView',
  });

  readonly solarisPopoverBordered = input<boolean>(true, {
    alias: 'solarisPopoverBordered',
  });

  readonly solarisPopoverOpened = output<void>();
  readonly solarisPopoverClosed = output<void>();
  readonly solarisPopoverOpenChange = output<boolean>();

  protected readonly ariaHasPopupComputed = computed(() => {
    const value = this.solarisPopoverAriaHasPopup();
    if (value === undefined) return null;
    return String(value);
  });

  private readonly popoverTemplateRef = computed<
    TemplateRef<unknown> | undefined
  >(() => this.solarisPopoverTriggerFor()?.templateRef);

  constructor() {
    effect(() => {
      const shouldBeOpen = this.solarisPopoverOpen();
      if (shouldBeOpen === true && !this.isOpen()) {
        this.open();
      } else if (shouldBeOpen === false && this.isOpen()) {
        this.close();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.disposeOverlay();
    });
  }

  @HostListener('click')
  onClick(): void {
    if (!this.solarisPopoverDisabled()) {
      this.toggle();
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    if (this.solarisPopoverCloseOnEscape() && this.isOpen()) {
      this.close();
    }
  }

  open(): void {
    if (this.isOpen() || this.solarisPopoverDisabled()) {
      return;
    }

    this.cancelPendingClose();
    this.previousActiveElement = this.document.activeElement as HTMLElement;
    this.createOverlay();
    this.attachPanel();
    this.addOutsideClickHandler();
    this.startTriggerVisibilityObserver();
    this.startOriginResizeObserver();
    this.updateOverlaySize();
    this.isOpen.set(true);
    this.solarisPopoverOpened.emit();
    this.solarisPopoverOpenChange.emit(true);
  }

  close(options?: { restoreFocus?: boolean }): void {
    if (!this.isOpen()) {
      return;
    }

    this.markPanelClosing();
    this.restoreFocus(options?.restoreFocus ?? true);
    this.stopTriggerVisibilityObserver();
    this.stopOriginResizeObserver();
    this.isOpen.set(false);
    this.solarisPopoverClosed.emit();
    this.solarisPopoverOpenChange.emit(false);
    this.closeTimeout = scheduleMotionClose(() => {
      this.closeTimeout = null;
      this.detachPanel();
    });
  }

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  updatePosition(): void {
    if (this.overlayRef) {
      this.overlayRef.updatePosition();
    }
  }

  /** Origin (trigger) width in CSS pixels. */
  getOriginWidth(): number {
    return this.getPositionOrigin().getBoundingClientRect().width;
  }

  private createOverlay(): void {
    this.disposeOverlay();

    this.positionStrategy = this.createPositionStrategy();
    const scrollStrategy = this.createScrollStrategy();

    const config = new OverlayConfig({
      positionStrategy: this.positionStrategy,
      scrollStrategy,
      disposeOnNavigation: true,
      panelClass: 'solaris-popover-panel-overlay',
    });

    this.overlayRef = this.overlay.create(config);

    this.positionStrategy.positionChanges.subscribe((change) => {
      this.connectedSide =
        change.connectionPair.originY === 'bottom' ? 'bottom' : 'top';
      if (this.panelDataRef) {
        this.panelDataRef.connectedSide = this.connectedSide;
      }
      this.panelComponentRef?.changeDetectorRef.markForCheck();
      this.updateOverlaySize();
      if (this.panelContainerRef) {
        this.panelContainerRef.setAttribute(
          'data-connected-side',
          this.connectedSide,
        );
        if (this.solarisPopoverTopConnected()) {
          this.panelContainerRef.setAttribute('data-form-field', '');
        }
      }
      if (this.solarisPopoverTopConnected()) {
        this.elementRef.nativeElement.setAttribute(
          'data-connected-side',
          this.connectedSide,
        );
        const formFieldWrapper = this.elementRef.nativeElement.querySelector(
          ':scope > .solaris-form-field__control-wrapper',
        ) as HTMLElement | null;
        if (formFieldWrapper) {
          formFieldWrapper.setAttribute(
            'data-connected-side',
            this.connectedSide,
          );
        }
      }
    });
  }

  private getPositionOrigin(): HTMLElement {
    if (this.solarisPopoverTopConnected()) {
      const wrapper = this.elementRef.nativeElement.querySelector(
        ':scope > .solaris-form-field__control-wrapper',
      ) as HTMLElement | null;
      if (wrapper) {
        return wrapper;
      }
    }
    return this.elementRef.nativeElement;
  }

  private createPositionStrategy(): FlexibleConnectedPositionStrategy {
    const placement = this.solarisPopoverPlacement();
    const align = this.solarisPopoverAlign();
    const offset = this.solarisPopoverOffset();

    const primaryPosition = getPrimaryPosition(placement, align);
    const fallbackPositions = getFallbackPositions(placement, align);

    const getOffsetY = (pos: ConnectedPosition, offset: number): number => {
      if (pos.originY === 'bottom' && pos.overlayY === 'top') {
        return offset;
      }

      if (pos.originY === 'top' && pos.overlayY === 'bottom') {
        return -offset;
      }

      return 0;
    };

    const getOffsetX = (pos: ConnectedPosition, offset: number): number => {
      if (pos.originX === 'end' && pos.overlayX === 'start') {
        return offset;
      }

      if (pos.originX === 'start' && pos.overlayX === 'end') {
        return -offset;
      }

      return 0;
    };

    const allPositions = [primaryPosition, ...fallbackPositions].map((pos) => ({
      ...pos,
      offsetY: getOffsetY(pos, offset),
      offsetX: getOffsetX(pos, offset),
    }));

    return this.overlay
      .position()
      .flexibleConnectedTo(this.getPositionOrigin())
      .withPositions(allPositions)
      .withFlexibleDimensions(true)
      .withPush(true);
  }

  private createScrollStrategy() {
    const strategy = this.solarisPopoverScrollStrategy();
    switch (strategy) {
      case 'reposition':
        return this.overlay.scrollStrategies.reposition();
      case 'close':
        return this.overlay.scrollStrategies.close();
      case 'block':
        return this.overlay.scrollStrategies.block();
    }
  }

  private attachPanel(): void {
    if (!this.overlayRef) {
      return;
    }

    const templateRef = this.popoverTemplateRef();
    if (!templateRef) {
      return;
    }

    const topConnected = this.solarisPopoverTopConnected();
    const initialSide = topConnected ? 'bottom' : undefined;
    this.connectedSide = 'bottom';

    const data: SolarisPopoverPanelData = {
      contentTemplate: templateRef,
      appearance: this.solarisPopoverAppearance(),
      padding: this.solarisPopoverPadding(),
      radius: this.solarisPopoverRadius(),
      role: this.solarisPopoverPanelRole(),
      panelId: this.panelId,
      autoFocus: this.solarisPopoverAutoFocus(),
      connectedSide: initialSide,
      maxHeight: normalizePopoverDimension(this.solarisPopoverMaxHeight()),
      bordered: this.solarisPopoverBordered(),
    };

    const panelInjector = Injector.create({
      parent: this.injector,
      providers: [{ provide: SOLARIS_POPOVER_PANEL_DATA, useValue: data }],
    });

    const portal = new ComponentPortal(
      SolarisPopoverPanelComponent,
      this.viewContainerRef,
      panelInjector,
    );

    const componentRef = this.overlayRef.attach(portal);
    this.panelComponentRef = componentRef;
    this.panelDataRef = data;
    this.panelContainerRef = componentRef.location.nativeElement.querySelector(
      '.solaris-popover-panel__container',
    );

    if (this.panelContainerRef && this.solarisPopoverFitContent()) {
      this.panelContainerRef.style.maxWidth = '100%';
      this.fitContentSizeTimeout = setTimeout(() => {
        const panelContent = this.panelContainerRef?.firstElementChild;
        if (panelContent) {
          this.syncFitContentWidth(panelContent);
        }
        this.fitContentSizeTimeout = null;
      }, 0);
    }

    if (this.panelContainerRef && initialSide) {
      this.panelContainerRef.setAttribute('data-connected-side', initialSide);
      if (topConnected) {
        this.panelContainerRef.setAttribute('data-form-field', '');
        const formFieldWrapper = this.elementRef.nativeElement.querySelector(
          ':scope > .solaris-form-field__control-wrapper',
        ) as HTMLElement | null;
        if (formFieldWrapper) {
          formFieldWrapper.setAttribute('data-connected-side', initialSide);
        }
      }
    }
  }

  private detachPanel(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.disposeOverlay();
    } else {
      this.clearConnectedSideAttributes();
    }
    this.removeOutsideClickHandler();
    this.stopTriggerVisibilityObserver();
    this.stopOriginResizeObserver();
  }

  private markPanelClosing(): void {
    this.panelContainerRef?.setAttribute('data-closing', '');
    this.panelContainerRef?.setAttribute('aria-hidden', 'true');
  }

  private cancelPendingClose(): void {
    this.closeTimeout = cancelMotionClose(this.closeTimeout);
    this.panelContainerRef?.removeAttribute('data-closing');
    this.panelContainerRef?.removeAttribute('aria-hidden');
  }

  private disposeOverlay(): void {
    this.cancelPendingClose();
    if (this.fitContentSizeTimeout) {
      clearTimeout(this.fitContentSizeTimeout);
      this.fitContentSizeTimeout = null;
    }
    this.stopTriggerVisibilityObserver();
    this.stopOriginResizeObserver();
    this.panelContainerRef = null;
    this.panelDataRef = null;
    this.panelComponentRef = null;

    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.clearConnectedSideAttributes();
    this.removeOutsideClickHandler();
  }

  private clearConnectedSideAttributes(): void {
    const host = this.elementRef.nativeElement;
    if (!host) {
      return;
    }
    host.removeAttribute('data-connected-side');
    const formFieldWrapper = host.querySelector(
      ':scope > .solaris-form-field__control-wrapper',
    ) as HTMLElement | null;
    formFieldWrapper?.removeAttribute('data-connected-side');
  }

  private addOutsideClickHandler(): void {
    if (!this.solarisPopoverCloseOnOutsideClick()) {
      return;
    }

    this.removeOutsideClickHandler();

    this.outsideClickCleanup = this.rendererListen(
      this.document,
      'click',
      this.handleOutsideClick,
    );
  }

  private removeOutsideClickHandler(): void {
    if (this.outsideClickCleanup) {
      this.outsideClickCleanup();
      this.outsideClickCleanup = null;
    }
  }

  private readonly handleOutsideClick = (event: Event): void => {
    if (!this.solarisPopoverCloseOnOutsideClick() || !this.overlayRef) {
      return;
    }

    const overlayElement = this.overlayRef.overlayElement;
    const triggerElement = this.elementRef.nativeElement;
    const target = event.target as Node;

    if (
      target &&
      !overlayElement.contains(target) &&
      !triggerElement.contains(target)
    ) {
      this.close({ restoreFocus: false });
    }
  };

  private rendererListen(
    target: EventTarget,
    event: string,
    callback: (event: Event) => void,
  ): () => void {
    target.addEventListener(event, callback);
    return () => {
      target.removeEventListener(event, callback);
    };
  }

  updateOverlaySize(): void {
    if (!this.overlayRef) {
      return;
    }

    // SECURITY_EXCEPTION: read-only layout input with no Renderer2
    // alternative; guarded for SSR.
    const devicePixelRatio =
      typeof window !== 'undefined' && window.devicePixelRatio > 0
        ? window.devicePixelRatio
        : 1;
    const size = resolvePopoverSize({
      triggerWidth: this.getPositionOrigin().getBoundingClientRect().width,
      matchTriggerWidth: this.solarisPopoverMatchTriggerWidth(),
      minWidth: this.solarisPopoverMinWidth(),
      maxWidth: this.solarisPopoverMaxWidth(),
      maxHeight: this.solarisPopoverMaxHeight(),
      devicePixelRatio,
    });

    this.overlayRef.updateSize(size);
  }

  private startTriggerVisibilityObserver(): void {
    this.stopTriggerVisibilityObserver();
    if (!this.solarisPopoverCloseOnTriggerOutOfView()) {
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    // SECURITY_EXCEPTION: observing trigger visibility to auto-close without
    // stealing focus requires the native element; no Renderer2 alternative.
    // Read-only observation, SSR-guarded, cleaned up on close/dispose.
    const target = this.getPositionOrigin();
    if (!target) {
      return;
    }
    this.triggerVisibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && !entry.isIntersecting && this.isOpen()) {
          this.close({ restoreFocus: false });
        }
      },
      { threshold: 0 },
    );
    this.triggerVisibilityObserver.observe(target);
  }

  private stopTriggerVisibilityObserver(): void {
    if (this.triggerVisibilityObserver) {
      this.triggerVisibilityObserver.disconnect();
      this.triggerVisibilityObserver = null;
    }
  }

  /**
   * Keep the overlay glued to its origin while open: font swaps, container
   * reflows and content-driven growth can move or resize the trigger after
   * the initial positioning, and nothing else re-syncs it. Observing the
   * origin (never the pane) makes feedback loops impossible.
   */
  private startOriginResizeObserver(): void {
    this.stopOriginResizeObserver();
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    // SECURITY_EXCEPTION: tracking the origin box needs the native element;
    // no Renderer2 alternative. Read-only, SSR-guarded, cleaned up below.
    const target = this.getPositionOrigin();
    if (!target) {
      return;
    }
    this.originResizeObserver = new ResizeObserver(() => {
      if (!this.isOpen() || !this.overlayRef) {
        return;
      }
      this.updateOverlaySize();
      this.updatePosition();
    });
    this.originResizeObserver.observe(target);
  }

  private stopOriginResizeObserver(): void {
    if (this.originResizeObserver) {
      this.originResizeObserver.disconnect();
      this.originResizeObserver = null;
    }
  }

  private syncFitContentWidth(content: Element): void {
    const contentWidth = content.getBoundingClientRect().width;
    if (contentWidth && this.panelContainerRef) {
      this.panelContainerRef.style.width = `${Math.ceil(contentWidth)}px`;
      this.overlayRef?.updatePosition();
    }
  }

  private restoreFocus(restore = true): void {
    if (
      restore &&
      this.solarisPopoverRestoreFocus() &&
      this.previousActiveElement &&
      this.document.contains(this.previousActiveElement)
    ) {
      this.previousActiveElement.focus();
    }
    this.previousActiveElement = null;
  }
}
