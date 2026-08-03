// SECURITY_EXCEPTION_FILE: nativeElement required to store submenu reference. SSR-safe via ElementRef.
// SECURITY_EXCEPTION_FILE: nativeElement.addEventListener required for custom events. SSR-safe.
// SECURITY_EXCEPTION_FILE: nativeElement required for hover detection via ElementRef. Read-only, SSR-safe.
// SECURITY_EXCEPTION_FILE: nativeElement.dispatchEvent required for custom event. SSR-safe.
// SECURITY_EXCEPTION_FILE: nativeElement.parentElement required to traverse DOM. Read-only, SSR-safe.
// SECURITY_EXCEPTION_FILE: nativeElement identity comparison. Read-only, SSR-safe.
// SECURITY_EXCEPTION_FILE: nativeElement needed for outside-click containment check. ElementRef SSR-safe.
import {
  Component,
  ElementRef,
  Injector,
  ViewContainerRef,
  contentChild,
  computed,
  input,
  signal,
  inject,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Overlay,
  OverlayRef,
  OverlayConfig,
  FlexibleConnectedPositionStrategy,
  type ConnectedPosition,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { SolarisPopoverPanelComponent } from '../../popover';
import {
  SOLARIS_POPOVER_PANEL_DATA,
  type SolarisPopoverPanelData,
} from '../../popover/token/popover.tokens';

import { SolarisDropdownMenuComponent } from './dropdown-menu.component';
import { SolarisDropdownSubmenuTriggerComponent } from './dropdown-submenu-trigger.component';

import type {
  SolarisDropdownSubmenuOpenMode,
  SolarisDropdownSubmenuPlacement,
} from '../model/dropdown-submenu.types';

@Component({
  selector: 'solaris-dropdown-submenu',
  standalone: true,
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-dropdown-submenu',
  },
})
export class SolarisDropdownSubmenuComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly overlay = inject(Overlay);

  readonly openMode = input<SolarisDropdownSubmenuOpenMode>('hover-click');
  readonly placement = input<SolarisDropdownSubmenuPlacement>('right-start');
  readonly matchTriggerWidth = input<boolean>(false);
  readonly minWidth = input<string | null>(null);
  readonly maxWidth = input<string | null>(null);
  readonly openDelay = input<number>(120);
  readonly closeDelay = input<number>(160);
  readonly disabled = input<boolean>(false);

  readonly nestedMenu = contentChild(SolarisDropdownMenuComponent);
  readonly triggerChild = contentChild(SolarisDropdownSubmenuTriggerComponent);

  readonly nestedMenuPanelId = computed<string | null>(() => {
    return this.nestedMenu()?.panelId ?? null;
  });

  readonly isOpen = signal(false);

  private overlayRef: OverlayRef | null = null;
  private outsideClickCleanup: (() => void) | null = null;
  private keydownCleanup: (() => void) | null = null;
  private itemClickCleanup: (() => void) | null = null;
  private panelMouseEnterCleanup: (() => void) | null = null;
  private panelMouseLeaveCleanup: (() => void) | null = null;
  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private focusTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    (this.elementRef.nativeElement as unknown as Record<string, unknown>)[
      '__solarisSubmenu'
    ] = this;
    this.elementRef.nativeElement.addEventListener(
      'solaris-submenu-child-opened',
      () => this.clearCloseTimer(),
    );
    this.elementRef.nativeElement.addEventListener(
      'solaris-submenu-child-closed',
      () => {
        if (
          this.isOpen() &&
          !this.isPointerInside() &&
          !this.hasOpenChildSubmenu()
        ) {
          this.close();
        }
      },
    );
    this.destroyRef.onDestroy(() => {
      if (this.overlayRef) {
        this.overlayRef = null;
      }
      this.clearTimers();
    });
  }

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.isOpen() || this.disabled()) {
      return;
    }
    this.closeSiblingSubmenus();
    this.clearTimers();
    this.createOverlay();
    this.attachMenu();
    this.addOutsideClickHandler();
    this.addKeydownHandler();
    this.addItemClickHandler();
    this.addPanelMouseHandlers();
    this.isOpen.set(true);
    this.notifyParentKeepAlive();
  }

  close(): void {
    if (!this.isOpen()) {
      return;
    }
    this.detachMenu();
    this.isOpen.set(false);
    this.triggerChild()?.focus();
    this.notifyParentChildClosed();
  }

  onTriggerHover(): void {
    if (!this.openMode().includes('hover')) {
      return;
    }
    this.clearCloseTimer();
    if (!this.isOpen()) {
      this.openTimer = setTimeout(() => {
        this.open();
      }, this.openDelay());
    }
  }

  onTriggerLeave(): void {
    if (!this.openMode().includes('hover')) {
      return;
    }
    if (this.hasOpenChildSubmenu()) {
      return;
    }
    this.clearOpenTimer();
    this.closeTimer = setTimeout(() => {
      if (!this.isPointerInside()) {
        this.close();
      }
    }, this.closeDelay());
  }

  private addPanelMouseHandlers(): void {
    this.removePanelMouseHandlers();
    if (!this.overlayRef) return;

    this.panelMouseEnterCleanup = this.rendererListen(
      this.overlayRef.overlayElement,
      'mouseenter',
      () => this.clearCloseTimer(),
    );

    this.panelMouseLeaveCleanup = this.rendererListen(
      this.overlayRef.overlayElement,
      'mouseleave',
      () => {
        if (!this.openMode().includes('hover')) return;
        if (this.hasOpenChildSubmenu()) return;
        this.closeTimer = setTimeout(() => {
          this.close();
        }, this.closeDelay());
      },
    );
  }

  private removePanelMouseHandlers(): void {
    if (this.panelMouseEnterCleanup) {
      this.panelMouseEnterCleanup();
      this.panelMouseEnterCleanup = null;
    }
    if (this.panelMouseLeaveCleanup) {
      this.panelMouseLeaveCleanup();
      this.panelMouseLeaveCleanup = null;
    }
  }

  private isPointerInside(): boolean {
    const triggerEl = this.elementRef.nativeElement;
    const overlayEl = this.overlayRef?.overlayElement;
    if (overlayEl) {
      return triggerEl.matches(':hover') || overlayEl.matches(':hover');
    }
    return triggerEl.matches(':hover');
  }

  private notifyParentKeepAlive(): void {
    this.elementRef.nativeElement.dispatchEvent(
      new CustomEvent('solaris-submenu-child-opened', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private notifyParentChildClosed(): void {
    this.elementRef.nativeElement.dispatchEvent(
      new CustomEvent('solaris-submenu-child-closed', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private hasOpenChildSubmenu(): boolean {
    if (!this.overlayRef) return false;
    const overlayEl = this.overlayRef.overlayElement;
    const childSubmenus = overlayEl.querySelectorAll<HTMLElement>(
      'solaris-dropdown-submenu',
    );
    for (let i = 0; i < childSubmenus.length; i++) {
      const child = childSubmenus[i] as unknown as Record<string, unknown>;
      const submenu = child['__solarisSubmenu'] as
        | SolarisDropdownSubmenuComponent
        | undefined;
      if (submenu?.isOpen()) return true;
    }
    return false;
  }

  private closeSiblingSubmenus(): void {
    const parent = this.elementRef.nativeElement.parentElement;
    if (!parent) return;
    const siblings = parent.querySelectorAll<HTMLElement>(
      ':scope > solaris-dropdown-submenu',
    );
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i];
      if (sibling !== this.elementRef.nativeElement) {
        const submenu = (sibling as unknown as Record<string, unknown>)[
          '__solarisSubmenu'
        ] as SolarisDropdownSubmenuComponent | undefined;
        submenu?.close();
      }
    }
  }

  private createOverlay(): void {
    this.disposeOverlay();

    const positionStrategy = this.createPositionStrategy();
    const scrollStrategy = this.overlay.scrollStrategies.reposition();

    const config = new OverlayConfig({
      positionStrategy,
      scrollStrategy,
      disposeOnNavigation: true,
      panelClass: 'solaris-dropdown-menu-overlay',
    });

    this.overlayRef = this.overlay.create(config);
  }

  private createPositionStrategy(): FlexibleConnectedPositionStrategy {
    const positions = this.getPositions();

    return this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(positions)
      .withFlexibleDimensions(true)
      .withPush(true);
  }

  private getPositions(): ConnectedPosition[] {
    const placement = this.placement();
    const offset = 16;

    let primary: ConnectedPosition;
    let fallbacks: ConnectedPosition[];

    switch (placement) {
      case 'right-start':
        primary = {
          originX: 'end',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: offset,
        };
        fallbacks = [
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
            offsetX: -offset,
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetX: offset,
          },
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetX: -offset,
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            offsetX: offset,
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
            offsetX: -offset,
          },
        ];
        break;
      case 'right':
        primary = {
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: offset,
        };
        fallbacks = [
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
            offsetX: -offset,
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
            offsetX: offset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
            offsetX: -offset,
          },
        ];
        break;
      case 'right-end':
        primary = {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetX: offset,
        };
        fallbacks = [
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetX: -offset,
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
            offsetX: offset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
            offsetX: -offset,
          },
        ];
        break;
      case 'left-start':
        primary = {
          originX: 'start',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'top',
          offsetX: -offset,
        };
        fallbacks = [
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
            offsetX: offset,
          },
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetX: -offset,
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetX: offset,
          },
        ];
        break;
      case 'left':
        primary = {
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: -offset,
        };
        fallbacks = [
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            offsetX: offset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
            offsetX: -offset,
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
            offsetX: offset,
          },
        ];
        break;
      case 'left-end':
        primary = {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetX: -offset,
        };
        fallbacks = [
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetX: offset,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
            offsetX: -offset,
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
            offsetX: offset,
          },
        ];
        break;
    }

    return [primary, ...fallbacks];
  }

  private attachMenu(): void {
    if (!this.overlayRef) return;

    const menu = this.nestedMenu();
    if (!menu) return;

    const data: SolarisPopoverPanelData = {
      contentTemplate: menu.contentTemplate(),
      appearance: 'surface',
      padding: 'none',
      radius: 'md',
      role: undefined,
      panelId: menu.panelId,
      autoFocus: false,
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

    this.overlayRef.attach(portal);

    this.updateOverlaySize();

    if (this.focusTimeout !== null) {
      clearTimeout(this.focusTimeout);
    }
    this.focusTimeout = setTimeout(() => {
      menu.focusFirstItem();
      this.focusTimeout = null;
    });
  }

  private detachMenu(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.disposeOverlay();
    }
    this.removeOutsideClickHandler();
    this.removeKeydownHandler();
  }

  private disposeOverlay(): void {
    if (this.overlayRef) {
      try {
        this.overlayRef.dispose();
      } catch {
        // Injector may already be destroyed during test teardown
      }
      this.overlayRef = null;
    }
    this.removeOutsideClickHandler();
    this.removeKeydownHandler();
    this.removeItemClickHandler();
    this.removePanelMouseHandlers();
  }

  private addOutsideClickHandler(): void {
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
    if (!this.overlayRef) return;

    const overlayElement = this.overlayRef.overlayElement;
    const triggerElement = this.elementRef.nativeElement;
    const target = event.target as Node;

    if (!target) return;
    if (overlayElement.contains(target) || triggerElement.contains(target))
      return;
    if (this.hasOpenChildSubmenu()) return;

    this.close();
  };

  private addItemClickHandler(): void {
    this.removeItemClickHandler();
    if (!this.overlayRef) return;

    this.itemClickCleanup = this.rendererListen(
      this.overlayRef.overlayElement,
      'click',
      this.handleItemClick,
    );
  }

  private removeItemClickHandler(): void {
    if (this.itemClickCleanup) {
      this.itemClickCleanup();
      this.itemClickCleanup = null;
    }
  }

  private readonly handleItemClick = (event: Event): void => {
    if (!this.overlayRef) return;
    const target = event.target as HTMLElement;
    if (target.closest('solaris-dropdown-menu-item')) {
      this.close();
    }
  };

  private addKeydownHandler(): void {
    this.removeKeydownHandler();
    if (!this.overlayRef) return;

    this.keydownCleanup = this.rendererListen(
      this.overlayRef.overlayElement,
      'keydown',
      this.handleOverlayKeydown,
    );
  }

  private removeKeydownHandler(): void {
    if (this.keydownCleanup) {
      this.keydownCleanup();
      this.keydownCleanup = null;
    }
  }

  private readonly handleOverlayKeydown = (event: Event): void => {
    if (this.isOpen() && this.nestedMenu()) {
      this.handleKeydown(event as KeyboardEvent);
    }
  };

  handleKeydown(event: KeyboardEvent): void {
    const menu = this.nestedMenu();
    if (!menu) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        menu.focusNextItem();
        break;
      case 'ArrowUp':
        event.preventDefault();
        menu.focusPreviousItem();
        break;
      case 'Home':
        event.preventDefault();
        menu.focusFirstItem();
        break;
      case 'End':
        event.preventDefault();
        menu.focusLastItem();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        menu.activateFocusedItem();
        this.close();
        break;
      case 'ArrowLeft':
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      default:
        if (
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey
        ) {
          menu.focusItemByLabel(event.key);
        }
        break;
    }
  }

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
    if (!this.overlayRef) return;

    const size: {
      width?: number | string;
      minWidth?: number | string;
      maxWidth?: number | string;
    } = {};

    const minW = this.minWidth();
    const maxW = this.maxWidth();

    if (minW !== null) {
      size.minWidth = minW;
    }

    if (maxW !== null) {
      size.maxWidth = maxW;
    }

    this.overlayRef.updateSize(size);
  }

  private clearTimers(): void {
    this.clearOpenTimer();
    this.clearCloseTimer();
    if (this.focusTimeout !== null) {
      clearTimeout(this.focusTimeout);
      this.focusTimeout = null;
    }
  }

  private clearOpenTimer(): void {
    if (this.openTimer) {
      clearTimeout(this.openTimer);
      this.openTimer = null;
    }
  }

  private clearCloseTimer(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }
}
