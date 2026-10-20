// SECURITY_EXCEPTION_FILE: this.document.activeElement required for restoreFocus. SSR-safe via injected DOCUMENT.
// SECURITY_EXCEPTION_FILE: nativeElement.setAttribute required to sync data-connected-side. Read-only DOM access.
// SECURITY_EXCEPTION_FILE: querySelector required to find descendant form-field control wrapper. SSR-safe via injected ElementRef.
// SECURITY_EXCEPTION_FILE: nativeElement.querySelector required to find panel container in attached overlay. CDK overlay provides no typed API for this.
// SECURITY_EXCEPTION_FILE: nativeElement needed for outside-click containment check. ElementRef SSR-safe.
// SECURITY_EXCEPTION_FILE: nativeElement.offsetWidth required for matchTriggerWidth. Read-only measurement.
// SECURITY_EXCEPTION_FILE: getBoundingClientRect and style required to size fit-content panels after projection.
// SECURITY_EXCEPTION_FILE: this.document.contains() to safely verify trigger still exists before focus.
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
  scheduleMotionClose,
  cancelMotionClose,
} from '../../../../core/utils/motion-close';

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
    this.updateOverlaySize();
    this.isOpen.set(true);
    this.solarisPopoverOpened.emit();
    this.solarisPopoverOpenChange.emit(true);
  }

  close(): void {
    if (!this.isOpen()) {
      return;
    }

    // State and outputs stay synchronous; only the overlay detach is delayed
    // so the [data-closing] exit animation can play (motion-standard).
    this.markPanelClosing();
    this.restoreFocus();
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
      maxHeight: normalizeCssDimension(this.solarisPopoverMaxHeight()),
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
      this.close();
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

  private updateOverlaySize(): void {
    if (!this.overlayRef) {
      return;
    }

    const size: {
      width?: number | string;
      minWidth?: number | string;
      maxWidth?: number | string;
      maxHeight?: number | string;
    } = {};

    const triggerWidth = this.getPositionOrigin().offsetWidth;
    const matchWidth = this.solarisPopoverMatchTriggerWidth();
    const minWidth = this.solarisPopoverMinWidth();
    const maxWidth = this.solarisPopoverMaxWidth();
    const maxHeight = this.solarisPopoverMaxHeight();

    if (matchWidth) {
      size.width = triggerWidth;
      size.minWidth = triggerWidth;
    }

    if (minWidth !== undefined) {
      size.minWidth = typeof minWidth === 'number' ? `${minWidth}px` : minWidth;
    }

    if (maxWidth !== undefined) {
      size.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
    }

    if (maxHeight !== undefined) {
      size.maxHeight =
        typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
    }

    this.overlayRef.updateSize(size);
  }

  private syncFitContentWidth(content: Element): void {
    const contentWidth = content.getBoundingClientRect().width;
    if (contentWidth && this.panelContainerRef) {
      this.panelContainerRef.style.width = `${Math.ceil(contentWidth)}px`;
      this.overlayRef?.updatePosition();
    }
  }

  private restoreFocus(): void {
    if (
      this.solarisPopoverRestoreFocus() &&
      this.previousActiveElement &&
      this.document.contains(this.previousActiveElement)
    ) {
      this.previousActiveElement.focus();
    }
    this.previousActiveElement = null;
  }
}

function normalizeCssDimension(
  value: string | number | undefined,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === 'number' ? `${value}px` : value;
}
