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
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Overlay,
  OverlayRef,
  OverlayConfig,
  FlexibleConnectedPositionStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { SolarisPopoverPanelComponent } from '../../popover';
import {
  SOLARIS_POPOVER_PANEL_DATA,
  type SolarisPopoverPanelData,
} from '../../popover/token/popover.tokens';
import {
  getPrimaryPosition,
  getFallbackPositions,
} from '../../popover/model/popover-position';

import { SolarisDropdownMenuComponent } from '../component/dropdown-menu.component';

import type {
  SolarisDropdownMenuPlacement,
  SolarisDropdownMenuAlign,
  SolarisDropdownMenuAppearance,
  SolarisDropdownMenuRadius,
  SolarisDropdownMenuScrollStrategy,
} from '../model/dropdown-menu.types';

let nextTriggerId = 0;

@Directive({
  selector: '[solaris-dropdown-menu-trigger]',
  standalone: true,
  host: {
    '[id]': 'triggerId',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-controls]': 'menuId()',
    '[attr.aria-expanded]': 'isOpen() ? "true" : "false"',
  },
})
export class SolarisDropdownMenuTriggerDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly overlay = inject(Overlay);

  readonly triggerId = `solaris-dropdown-menu-trigger-${++nextTriggerId}`;

  private overlayRef: OverlayRef | null = null;
  private outsideClickCleanup: (() => void) | null = null;
  private keydownCleanup: (() => void) | null = null;
  private previousActiveElement: HTMLElement | null = null;
  private attachedMenu: SolarisDropdownMenuComponent | null = null;
  private positionStrategy: FlexibleConnectedPositionStrategy | null = null;

  protected readonly isOpen = signal(false);

  readonly solarisDropdownMenuTriggerFor = input<
    SolarisDropdownMenuComponent | undefined
  >(undefined, {
    alias: 'solarisDropdownMenuTriggerFor',
  });

  readonly solarisDropdownMenuOpen = input<boolean | undefined>(undefined, {
    alias: 'solarisDropdownMenuOpen',
  });

  readonly solarisDropdownMenuDisabled = input<boolean>(false, {
    alias: 'solarisDropdownMenuDisabled',
  });

  readonly solarisDropdownMenuPlacement = input<SolarisDropdownMenuPlacement>(
    'bottom',
    {
      alias: 'solarisDropdownMenuPlacement',
    },
  );

  readonly solarisDropdownMenuAlign = input<SolarisDropdownMenuAlign>('start', {
    alias: 'solarisDropdownMenuAlign',
  });

  readonly solarisDropdownMenuOffset = input<number>(8, {
    alias: 'solarisDropdownMenuOffset',
  });

  readonly solarisDropdownMenuAppearance = input<SolarisDropdownMenuAppearance>(
    'surface',
    {
      alias: 'solarisDropdownMenuAppearance',
    },
  );

  readonly solarisDropdownMenuRadius = input<SolarisDropdownMenuRadius>('md', {
    alias: 'solarisDropdownMenuRadius',
  });

  readonly solarisDropdownMenuCloseOnSelect = input<boolean>(true, {
    alias: 'solarisDropdownMenuCloseOnSelect',
  });

  readonly solarisDropdownMenuCloseOnEscape = input<boolean>(true, {
    alias: 'solarisDropdownMenuCloseOnEscape',
  });

  readonly solarisDropdownMenuCloseOnOutsideClick = input<boolean>(true, {
    alias: 'solarisDropdownMenuCloseOnOutsideClick',
  });

  readonly solarisDropdownMenuMatchTriggerWidth = input<boolean>(false, {
    alias: 'solarisDropdownMenuMatchTriggerWidth',
  });

  readonly solarisDropdownMenuMinWidth = input<string | number | undefined>(
    undefined,
    { alias: 'solarisDropdownMenuMinWidth' },
  );

  readonly solarisDropdownMenuMaxWidth = input<string | number | undefined>(
    undefined,
    { alias: 'solarisDropdownMenuMaxWidth' },
  );

  readonly solarisDropdownMenuRestoreFocus = input<boolean>(true, {
    alias: 'solarisDropdownMenuRestoreFocus',
  });

  readonly solarisDropdownMenuScrollStrategy =
    input<SolarisDropdownMenuScrollStrategy>('reposition', {
      alias: 'solarisDropdownMenuScrollStrategy',
    });

  readonly menuOpened = output<void>();
  readonly menuClosed = output<void>();
  readonly openChange = output<boolean>();

  protected readonly menuId = computed<string | null>(() => {
    return this.solarisDropdownMenuTriggerFor()?.panelId ?? null;
  });

  constructor() {
    effect(() => {
      const shouldBeOpen = this.solarisDropdownMenuOpen();
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
    if (!this.solarisDropdownMenuDisabled()) {
      this.toggle();
    }
  }

  open(): void {
    if (this.isOpen() || this.solarisDropdownMenuDisabled()) {
      return;
    }

    this.previousActiveElement = this.document.activeElement as HTMLElement;
    this.createOverlay();
    this.attachMenu();
    this.addOutsideClickHandler();
    this.updateOverlaySize();
    this.isOpen.set(true);
    this.menuOpened.emit();
    this.openChange.emit(true);
  }

  close(): void {
    if (!this.isOpen()) {
      return;
    }

    this.detachMenu();
    this.restoreFocus();
    this.isOpen.set(false);
    this.menuClosed.emit();
    this.openChange.emit(false);
  }

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
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
      panelClass: 'solaris-dropdown-menu-overlay',
    });

    this.overlayRef = this.overlay.create(config);
  }

  private createPositionStrategy(): FlexibleConnectedPositionStrategy {
    const placement = this.solarisDropdownMenuPlacement();
    const align = this.solarisDropdownMenuAlign();
    const offset = this.solarisDropdownMenuOffset();

    const primaryPosition = getPrimaryPosition(placement, align);
    const fallbackPositions = getFallbackPositions(placement, align);

    const allPositions = [primaryPosition, ...fallbackPositions].map(
      (pos) => ({
        ...pos,
        offsetY:
          pos.originY === 'bottom' && pos.overlayY === 'top'
            ? offset
            : pos.originY === 'top' && pos.overlayY === 'bottom'
              ? -offset
              : 0,
        offsetX:
          pos.originX === 'end' && pos.overlayX === 'start'
            ? offset
            : pos.originX === 'start' && pos.overlayX === 'end'
              ? -offset
              : 0,
      }),
    );

    return this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(allPositions)
      .withFlexibleDimensions(true)
      .withPush(true);
  }

  private createScrollStrategy() {
    const strategy = this.solarisDropdownMenuScrollStrategy();
    switch (strategy) {
      case 'reposition':
        return this.overlay.scrollStrategies.reposition();
      case 'close':
        return this.overlay.scrollStrategies.close();
      case 'block':
        return this.overlay.scrollStrategies.block();
    }
  }

  private attachMenu(): void {
    if (!this.overlayRef) {
      return;
    }

    const menu = this.solarisDropdownMenuTriggerFor();
    if (!menu) {
      return;
    }

    const data: SolarisPopoverPanelData = {
      contentTemplate: menu.contentTemplate(),
      appearance: this.solarisDropdownMenuAppearance(),
      padding: 'none',
      radius: this.solarisDropdownMenuRadius(),
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

    this.attachedMenu = menu;

    this.addKeydownHandler();

    setTimeout(() => {
      menu.focusFirstItem();
    });
  }

  private detachMenu(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.disposeOverlay();
    }
    this.removeOutsideClickHandler();
    this.removeKeydownHandler();
    this.attachedMenu = null;
  }

  private disposeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.removeOutsideClickHandler();
    this.removeKeydownHandler();
  }

  private addOutsideClickHandler(): void {
    if (!this.solarisDropdownMenuCloseOnOutsideClick()) {
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
    if (!this.solarisDropdownMenuCloseOnOutsideClick() || !this.overlayRef) {
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
    if (this.isOpen() && this.attachedMenu) {
      this.onKeydown(event as KeyboardEvent);
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
    } = {};

    const triggerWidth = this.elementRef.nativeElement.offsetWidth;
    const matchWidth = this.solarisDropdownMenuMatchTriggerWidth();
    const minWidth = this.solarisDropdownMenuMinWidth();
    const maxWidth = this.solarisDropdownMenuMaxWidth();

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

    this.overlayRef.updateSize(size);
  }

  private restoreFocus(): void {
    if (
      this.solarisDropdownMenuRestoreFocus() &&
      this.previousActiveElement &&
      this.document.contains(this.previousActiveElement)
    ) {
      this.previousActiveElement.focus();
    }
    this.previousActiveElement = null;
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen() || !this.attachedMenu) {
      return;
    }

    const menu = this.attachedMenu;

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
        break;
      case 'Escape':
        event.preventDefault();
        if (this.solarisDropdownMenuCloseOnEscape()) {
          this.close();
        }
        break;
      case 'Tab':
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
}
