import { DOCUMENT, NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  computed,
  contentChild,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  Overlay,
  OverlayConfig,
  OverlayRef,
  type FlexibleConnectedPositionStrategy,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import { nextIdFor } from '../../../../core';
import {
  scheduleMotionClose,
  cancelMotionClose,
} from '../../../../core/utils/motion-close';
import { SolarisMegaMenuPanelDirective } from '../directives/mega-menu-panel.directive';
import { getMegaMenuPanelWidth } from '../model/mega-menu-geometry';
import {
  SOLARIS_MEGA_MENU,
  SOLARIS_MEGA_MENU_ANCHOR,
  SOLARIS_MEGA_MENU_GROUP,
  type SolarisMegaMenuAnchorControl,
  type SolarisMegaMenuControl,
  type SolarisMegaMenuGroupControl,
} from '../model/mega-menu.tokens';
import type {
  SolarisMegaMenuPanelWidth,
  SolarisMegaMenuAppearance,
} from '../model/mega-menu.types';

const MEGA_MENU_ANCHOR_ERROR =
  'SolarisMegaMenuComponent requires an ancestor with the [solaris-mega-menu-anchor] directive. The anchor defines the menu panel position and width, and the interactive area excluded from the backdrop. Add solaris-mega-menu-anchor to the navigation container that wraps this mega menu.';

@Component({
  selector: 'solaris-mega-menu',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet],
  templateUrl: './mega-menu.component.html',
  styleUrls: ['./mega-menu.component.scss'],
  providers: [
    {
      provide: SOLARIS_MEGA_MENU,
      useExisting: forwardRef(() => SolarisMegaMenuComponent),
    },
  ],
  host: {
    class: 'solaris-mega-menu',
    '[attr.data-open]': 'isOpen() ? "" : null',
  },
})
export class SolarisMegaMenuComponent implements SolarisMegaMenuControl {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly group = inject<SolarisMegaMenuGroupControl>(
    SOLARIS_MEGA_MENU_GROUP,
    { optional: true },
  );
  private readonly anchorControl = inject<SolarisMegaMenuAnchorControl>(
    SOLARIS_MEGA_MENU_ANCHOR,
    { optional: true },
  );

  @ViewChild('overlayPanel', { static: true })
  private readonly overlayPanel!: TemplateRef<unknown>;

  protected readonly panel = contentChild(SolarisMegaMenuPanelDirective);

  readonly openState = model(false, { alias: 'open' });
  readonly panelWidth = input<SolarisMegaMenuPanelWidth>('viewport');
  readonly appearance = input<SolarisMegaMenuAppearance>('underline');
  readonly backdrop = input(false);
  readonly persistentOnClick = input(false);
  readonly hoverOpenDelay = input(120);
  readonly hoverCloseDelay = input(160);

  readonly opened = output<void>();
  readonly closed = output<void>();

  readonly panelId = nextIdFor('solaris-mega-menu-panel');
  readonly isOpen = computed(() => this.openState());

  private readonly isPinned = signal(false);
  private overlayRef: OverlayRef | null = null;
  private scheduledOpen: ReturnType<typeof setTimeout> | null = null;
  private scheduledClose: ReturnType<typeof setTimeout> | null = null;
  private closeTimeout: ReturnType<typeof setTimeout> | null = null;
  private outsideClickCleanup: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private viewportResizeCleanup: (() => void) | null = null;
  private backdropClickCleanup: (() => void) | null = null;
  private backdropRegions: HTMLElement[] = [];
  private anchorUnderline: HTMLElement | null = null;

  constructor() {
    if (!this.anchorControl) {
      throw new Error(MEGA_MENU_ANCHOR_ERROR);
    }

    effect(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      if (this.openState()) {
        this.attachPanel();
      } else {
        this.detachPanel();
      }
    });

    effect(() => {
      this.appearance();

      if (this.isOpen()) {
        this.syncAnchorUnderline();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.clearTimers();
      this.removeOutsideClickHandler();
      this.stopGeometryObserver();
      this.clearBackdrop();
      this.clearAnchorUnderline();
      this.overlayRef?.dispose();
    });
  }

  open(): void {
    if (this.isOpen()) {
      return;
    }

    this.clearTimers();
    this.group?.open(this);
    this.openState.set(true);
  }

  close(restoreFocus = false): void {
    if (!this.isOpen()) {
      return;
    }

    this.clearTimers();
    this.isPinned.set(false);
    this.openState.set(false);
    this.group?.close(this);

    if (restoreFocus) {
      this.hostElement.nativeElement
        .querySelector<HTMLButtonElement>('[solaris-mega-menu-trigger]')
        ?.focus();
    }
  }

  toggleFromClick(): void {
    if (this.persistentOnClick()) {
      if (this.isOpen() && this.isPinned()) {
        this.close();
        return;
      }

      this.open();
      this.isPinned.set(true);
      return;
    }

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  scheduleOpen(): void {
    this.clearCloseTimer();
    if (this.isOpen() || this.scheduledOpen) {
      return;
    }

    this.scheduledOpen = setTimeout(() => {
      this.scheduledOpen = null;
      this.open();
    }, this.hoverOpenDelay());
  }

  scheduleClose(): void {
    this.clearOpenTimer();
    if (!this.isOpen() || this.isPinned() || this.scheduledClose) {
      return;
    }

    this.scheduledClose = setTimeout(() => {
      this.scheduledClose = null;
      this.close();
    }, this.hoverCloseDelay());
  }

  cancelScheduledClose(): void {
    this.clearCloseTimer();
  }

  focusFirstPanelItem(): void {
    queueMicrotask(() => {
      this.overlayRef?.overlayElement
        .querySelector<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        ?.focus();
    });
  }

  protected onPanelPointerEnter(): void {
    this.cancelScheduledClose();
    // Revive a panel caught mid-exit: reopening cancels the delayed detach.
    if (!this.isOpen() && this.overlayRef?.hasAttached()) {
      this.openState.set(true);
    }
  }

  protected onPanelPointerLeave(): void {
    this.scheduleClose();
  }

  protected onPanelFocusOut(): void {
    queueMicrotask(() => {
      const activeElement =
        this.hostElement.nativeElement.ownerDocument.activeElement;
      const trigger = this.hostElement.nativeElement.querySelector(
        '[solaris-mega-menu-trigger]',
      );
      const panel = this.overlayRef?.overlayElement;

      if (
        !trigger?.contains(activeElement) &&
        !panel?.contains(activeElement)
      ) {
        this.close();
      }
    });
  }

  protected onPanelEscape(event: Event): void {
    event.preventDefault();
    this.close(true);
  }

  private attachPanel(): void {
    this.cancelMotionClose();
    const panel = this.panel();
    if (!panel || this.overlayRef?.hasAttached()) {
      return;
    }

    this.overlayRef ??= this.createOverlay();
    this.overlayRef.attach(
      new TemplatePortal(this.overlayPanel, this.viewContainerRef),
    );
    this.updatePanelGeometry();
    this.startGeometryObserver();
    this.setupBackdrop();
    if (!this.backdrop()) {
      this.addOutsideClickHandler();
    }
    this.opened.emit();
  }

  private detachPanel(): void {
    if (!this.overlayRef?.hasAttached()) {
      return;
    }
    if (this.closeTimeout !== null) {
      return;
    }

    // State stays synchronous (openState is already false); only the overlay
    // detach is delayed so the [data-closing] exit animation can play.
    this.markPanelClosing();
    this.closeTimeout = scheduleMotionClose(() => {
      this.closeTimeout = null;
      this.finishDetach();
    });
  }

  private finishDetach(): void {
    if (!this.overlayRef?.hasAttached()) {
      return;
    }

    this.clearBackdrop();
    const backdrop = this.overlayRef.backdropElement;
    this.overlayRef.detachBackdrop();
    backdrop?.remove();
    this.overlayRef.detach();
    this.overlayRef.dispose();
    this.overlayRef = null;
    this.removeOutsideClickHandler();
    this.stopGeometryObserver();
    this.clearAnchorUnderline();
    this.closed.emit();
  }

  private markPanelClosing(): void {
    const panel = this.overlayRef?.overlayElement.querySelector(
      '.solaris-mega-menu__panel',
    );
    panel?.setAttribute('data-closing', '');
    panel?.setAttribute('aria-hidden', 'true');
  }

  private cancelMotionClose(): void {
    this.closeTimeout = cancelMotionClose(this.closeTimeout);
    const panel = this.overlayRef?.overlayElement.querySelector(
      '.solaris-mega-menu__panel',
    );
    panel?.removeAttribute('data-closing');
    panel?.removeAttribute('aria-hidden');
  }

  private createOverlay(): OverlayRef {
    const positionStrategy = this.createPositionStrategy();
    const config = new OverlayConfig({
      backdropClass: 'solaris-mega-menu-backdrop',
      hasBackdrop: this.backdrop(),
      positionStrategy,
      scrollStrategy: this.backdrop()
        ? this.overlay.scrollStrategies.block()
        : this.overlay.scrollStrategies.reposition(),
    });
    const overlayRef = this.overlay.create(config);

    positionStrategy.positionChanges.subscribe(({ connectionPair }) => {
      const panel = overlayRef.overlayElement.querySelector<HTMLElement>(
        '.solaris-mega-menu__panel',
      );

      if (connectionPair.originY === 'top') {
        panel?.style.setProperty('--solaris-mega-menu-shadow', 'none');
      } else {
        panel?.style.removeProperty('--solaris-mega-menu-shadow');
      }
    });

    overlayRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        this.close(true);
      }
    });

    return overlayRef;
  }

  private addOutsideClickHandler(): void {
    this.removeOutsideClickHandler();

    const onPointerDown = (event: PointerEvent): void => {
      const target = event.target as Node | null;
      const trigger = this.hostElement.nativeElement.querySelector(
        '[solaris-mega-menu-trigger]',
      );

      if (
        !target ||
        trigger?.contains(target) ||
        this.overlayRef?.overlayElement.contains(target)
      ) {
        return;
      }

      this.close();
    };

    this.document.addEventListener('pointerdown', onPointerDown, true);
    this.outsideClickCleanup = () => {
      this.document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }

  private removeOutsideClickHandler(): void {
    this.outsideClickCleanup?.();
    this.outsideClickCleanup = null;
  }

  private createPositionStrategy(): FlexibleConnectedPositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(this.anchor.element)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ])
      .withFlexibleDimensions(false)
      .withPush(true);
  }

  private get anchor(): SolarisMegaMenuAnchorControl {
    if (!this.anchorControl) {
      throw new Error(MEGA_MENU_ANCHOR_ERROR);
    }

    return this.anchorControl;
  }

  private updatePanelGeometry(): void {
    if (!this.overlayRef) {
      return;
    }

    this.overlayRef.updateSize({
      width: getMegaMenuPanelWidth(
        this.panelWidth(),
        this.anchor.element,
        this.getTrigger(),
        this.hostElement.nativeElement.ownerDocument.defaultView?.innerWidth ??
          0,
      ),
    });
    this.overlayRef.updatePosition();
    this.updateBackdropGeometry();
    this.syncAnchorUnderline();
  }

  private syncAnchorUnderline(): void {
    const anchor = this.anchor.element;

    if (!this.isOpen() || this.appearance() !== 'underline') {
      this.clearAnchorUnderline();
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    const triggerRect = this.getTrigger().getBoundingClientRect();
    this.anchorUnderline ??= this.createAnchorUnderline(anchor);
    this.anchorUnderline.style.left = `${triggerRect.left - anchorRect.left}px`;
    this.anchorUnderline.style.width = `${triggerRect.width}px`;
  }

  private clearAnchorUnderline(): void {
    this.anchorUnderline?.remove();
    this.anchorUnderline = null;
  }

  private createAnchorUnderline(anchor: HTMLElement): HTMLElement {
    const underline = this.document.createElement('span');
    underline.className = 'solaris-mega-menu-anchor__underline';
    anchor.appendChild(underline);

    return underline;
  }

  private setupBackdrop(): void {
    const backdrop = this.overlayRef?.backdropElement;
    if (!backdrop) {
      return;
    }

    this.backdropRegions = ['top', 'left', 'right', 'bottom'].map(
      (position) => {
        const region = this.document.createElement('span');
        region.className = `solaris-mega-menu-backdrop__region solaris-mega-menu-backdrop__region--${position}`;
        backdrop.appendChild(region);
        return region;
      },
    );

    const subscription = this.overlayRef?.backdropClick().subscribe(() => {
      this.close();
    });
    this.backdropClickCleanup = () => subscription?.unsubscribe();
    this.updateBackdropGeometry();
  }

  private clearBackdrop(): void {
    this.backdropClickCleanup?.();
    this.backdropClickCleanup = null;
    this.backdropRegions.forEach((region) => region.remove());
    this.backdropRegions = [];
  }

  private updateBackdropGeometry(): void {
    const backdrop = this.overlayRef?.backdropElement;
    if (!backdrop || this.backdropRegions.length !== 4) {
      return;
    }

    const backdropRect = backdrop.getBoundingClientRect();
    const viewport = this.document.defaultView;
    const width = backdropRect.width || viewport?.innerWidth || 0;
    const height = backdropRect.height || viewport?.innerHeight || 0;
    const anchorRect = this.anchor.element.getBoundingClientRect();
    const inset = 1;
    const top = Math.max(
      0,
      Math.floor(anchorRect.top - backdropRect.top) - inset,
    );
    const right = Math.min(
      width,
      Math.ceil(anchorRect.right - backdropRect.left) + inset,
    );
    const bottom = Math.min(
      height,
      Math.ceil(anchorRect.bottom - backdropRect.top) + inset,
    );
    const left = Math.max(
      0,
      Math.floor(anchorRect.left - backdropRect.left) - inset,
    );
    const [topRegion, leftRegion, rightRegion, bottomRegion] =
      this.backdropRegions;

    topRegion.style.height = `${top}px`;
    leftRegion.style.top = `${top}px`;
    leftRegion.style.height = `${bottom - top}px`;
    leftRegion.style.width = `${left}px`;
    rightRegion.style.top = `${top}px`;
    rightRegion.style.height = `${bottom - top}px`;
    rightRegion.style.width = `${width - right}px`;
    bottomRegion.style.top = `${bottom}px`;
  }

  private startGeometryObserver(): void {
    const anchor = this.anchor.element;
    const trigger = this.getTrigger();
    const updateGeometry = () => this.updatePanelGeometry();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver?.disconnect();
      this.resizeObserver = new ResizeObserver(updateGeometry);
      this.resizeObserver.observe(anchor);
      this.resizeObserver.observe(trigger);
    }

    const viewport = this.hostElement.nativeElement.ownerDocument.defaultView;
    viewport?.addEventListener('resize', updateGeometry);
    this.viewportResizeCleanup = () => {
      viewport?.removeEventListener('resize', updateGeometry);
    };
  }

  private stopGeometryObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.viewportResizeCleanup?.();
    this.viewportResizeCleanup = null;
  }

  private getTrigger(): HTMLElement {
    return (
      this.hostElement.nativeElement.querySelector<HTMLElement>(
        '[solaris-mega-menu-trigger]',
      ) ?? this.hostElement.nativeElement
    );
  }

  private clearTimers(): void {
    this.clearOpenTimer();
    this.clearCloseTimer();
    this.cancelMotionClose();
  }

  private clearOpenTimer(): void {
    if (this.scheduledOpen) {
      clearTimeout(this.scheduledOpen);
      this.scheduledOpen = null;
    }
  }

  private clearCloseTimer(): void {
    if (this.scheduledClose) {
      clearTimeout(this.scheduledClose);
      this.scheduledClose = null;
    }
  }
}
