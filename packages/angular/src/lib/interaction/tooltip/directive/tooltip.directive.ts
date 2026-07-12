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
  AfterViewInit,
  booleanAttribute,
  numberAttribute,
  NgZone,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Overlay,
  OverlayRef,
  OverlayConfig,
  FlexibleConnectedPositionStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { SolarisTranslateService } from '../../../services/translation/service/solaris-translate.service';

import { SolarisTooltipPanelComponent } from '../component/tooltip-panel.component';
import {
  SOLARIS_TOOLTIP_PANEL_DATA,
  type SolarisTooltipPanelData,
} from '../token/tooltip.tokens';
import {
  getTooltipPositions,
  getTooltipArrowClass,
} from '../model/tooltip-position';

import type {
  SolarisTooltipPlacement,
  SolarisTooltipTrigger,
  SolarisTooltipAppearance,
  SolarisTooltipSize,
  SolarisTooltipRadius,
} from '../model/tooltip.types';

let nextPanelId = 0;

@Directive({
  selector: '[solaris-tooltip], [solarisTooltip], [solarisTooltipFor]',
  standalone: true,
  exportAs: 'solarisTooltip',
  host: {
    '[attr.aria-describedby]': 'isOpen() && !isClickTrigger() ? panelId : null',
  },
})
export class SolarisTooltipDirective implements AfterViewInit {
  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(SolarisTranslateService);
  private readonly ngZone = inject(NgZone);

  protected readonly panelId = `solaris-tooltip-panel-${++nextPanelId}`;
  protected readonly isOpen = signal(false);
  protected readonly isClickTrigger = computed(
    () => this.solarisTooltipTrigger() === 'click',
  );

  private overlayRef: OverlayRef | null = null;
  private outsideClickCleanup: (() => void) | null = null;
  private previousActiveElement: HTMLElement | null = null;
  private hoverTimeout: ReturnType<typeof setTimeout> | null = null;
  private isHovered = false;
  private isFocused = false;

  readonly solarisTooltip = input<string | undefined>(undefined, {
    alias: 'solarisTooltip',
  });

  readonly solarisTooltipKey = input<string | undefined>(undefined, {
    alias: 'solarisTooltipKey',
  });

  readonly solarisTooltipFor = input<TemplateRef<unknown> | undefined>(
    undefined,
    {
      alias: 'solarisTooltipFor',
    },
  );

  readonly solarisTooltipTitle = input<string | undefined>(undefined, {
    alias: 'solarisTooltipTitle',
  });

  readonly solarisTooltipTitleKey = input<string | undefined>(undefined, {
    alias: 'solarisTooltipTitleKey',
  });

  readonly solarisTooltipIcon = input<string | undefined>(undefined, {
    alias: 'solarisTooltipIcon',
  });

  readonly solarisTooltipIconDecorative = input<boolean, boolean>(true, {
    alias: 'solarisTooltipIconDecorative',
    transform: booleanAttribute,
  });

  readonly solarisTooltipTrigger = input<SolarisTooltipTrigger>('hover', {
    alias: 'solarisTooltipTrigger',
  });

  readonly solarisTooltipPlacement = input<SolarisTooltipPlacement>('top', {
    alias: 'solarisTooltipPlacement',
  });

  readonly solarisTooltipOffset = input<number, string | number>(8, {
    alias: 'solarisTooltipOffset',
    transform: numberAttribute,
  });

  readonly solarisTooltipDisabled = input<boolean, boolean>(false, {
    alias: 'solarisTooltipDisabled',
    transform: booleanAttribute,
  });

  readonly solarisTooltipCloseable = input<boolean, boolean>(false, {
    alias: 'solarisTooltipCloseable',
    transform: booleanAttribute,
  });

  readonly solarisTooltipCloseLabel = input<string | undefined>(undefined, {
    alias: 'solarisTooltipCloseLabel',
  });

  readonly solarisTooltipCloseLabelKey = input<string | undefined>(undefined, {
    alias: 'solarisTooltipCloseLabelKey',
  });

  readonly solarisTooltipShowDelay = input<number, string | number>(300, {
    alias: 'solarisTooltipShowDelay',
    transform: numberAttribute,
  });

  readonly solarisTooltipHideDelay = input<number, string | number>(100, {
    alias: 'solarisTooltipHideDelay',
    transform: numberAttribute,
  });

  readonly solarisTooltipAppearance = input<SolarisTooltipAppearance>(
    'outline',
    {
      alias: 'solarisTooltipAppearance',
    },
  );

  readonly solarisTooltipSize = input<SolarisTooltipSize>('sm', {
    alias: 'solarisTooltipSize',
  });

  readonly solarisTooltipRadius = input<SolarisTooltipRadius>('md', {
    alias: 'solarisTooltipRadius',
  });

  readonly solarisTooltipMaxWidth = input<string | number>('20rem', {
    alias: 'solarisTooltipMaxWidth',
  });

  readonly solarisTooltipArrow = input<boolean, boolean>(true, {
    alias: 'solarisTooltipArrow',
    transform: booleanAttribute,
  });

  readonly solarisTooltipOpen = input<boolean | undefined>(undefined, {
    alias: 'solarisTooltipOpen',
  });

  readonly solarisTooltipOpened = output<void>();
  readonly solarisTooltipClosed = output<void>();
  readonly solarisTooltipOpenChange = output<boolean>();

  constructor() {
    effect(() => {
      const shouldBeOpen = this.solarisTooltipOpen();
      if (shouldBeOpen === true && !this.isOpen()) {
        this.open();
      } else if (shouldBeOpen === false && this.isOpen()) {
        this.close();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.disposeOverlay();
      this.clearHoverTimeout();
    });
  }

  ngAfterViewInit(): void {
    if (
      !this.solarisTooltip() &&
      !this.solarisTooltipKey() &&
      !this.solarisTooltipFor()
    ) {
      console.warn(
        '[SolarisTooltip] Tooltip requires solaris-tooltip, solarisTooltip, solarisTooltipKey, or solarisTooltipFor.',
      );
    }
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.isHovered = true;
    if (
      this.solarisTooltipTrigger() === 'hover' &&
      !this.solarisTooltipDisabled()
    ) {
      this.scheduleOpen(Number(this.solarisTooltipShowDelay()));
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isHovered = false;
    if (this.solarisTooltipTrigger() === 'hover') {
      this.scheduleClose(Number(this.solarisTooltipHideDelay()));
    }
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.isFocused = true;
    if (
      this.solarisTooltipTrigger() === 'hover' &&
      !this.solarisTooltipDisabled()
    ) {
      this.scheduleOpen(Number(this.solarisTooltipShowDelay()));
    }
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this.isFocused = false;
    if (this.solarisTooltipTrigger() === 'hover') {
      this.scheduleClose(Number(this.solarisTooltipHideDelay()));
    }
  }

  @HostListener('click')
  onClick(): void {
    if (this.solarisTooltipDisabled()) {
      return;
    }

    if (this.solarisTooltipTrigger() === 'click') {
      this.toggle();
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    if (this.isOpen() && this.solarisTooltipTrigger() !== 'manual') {
      this.close();
    }
  }

  open(): void {
    if (this.isOpen() || this.solarisTooltipDisabled()) {
      return;
    }

    this.clearHoverTimeout();

    if (this.solarisTooltipTrigger() === 'click') {
      // SECURITY_EXCEPTION: this.document.activeElement required for restoreFocus. SSR-safe via injected DOCUMENT.
      this.previousActiveElement = this.document.activeElement as HTMLElement;
    }

    this.createOverlay();
    this.attachPanel();
    this.addOutsideClickHandler();
    this.isOpen.set(true);
    this.solarisTooltipOpened.emit();
    this.solarisTooltipOpenChange.emit(true);
  }

  close(): void {
    if (!this.isOpen()) {
      return;
    }

    this.clearHoverTimeout();
    this.detachPanel();
    this.restoreFocus();
    this.isOpen.set(false);
    this.solarisTooltipClosed.emit();
    this.solarisTooltipOpenChange.emit(false);
  }

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  reposition(): void {
    if (this.overlayRef) {
      this.overlayRef.updatePosition();
    }
  }

  private getResolvedBody(): string | undefined {
    const text = this.solarisTooltip();
    if (text) {
      return text;
    }

    const key = this.solarisTooltipKey();
    if (key) {
      return this.translate.translate(key);
    }

    return undefined;
  }

  private getResolvedTitle(): string | undefined {
    const title = this.solarisTooltipTitle();
    if (title) {
      return title;
    }

    const titleKey = this.solarisTooltipTitleKey();
    if (titleKey) {
      return this.translate.translate(titleKey);
    }

    return undefined;
  }

  private getResolvedCloseLabel(): string {
    const closeLabel = this.solarisTooltipCloseLabel();
    if (closeLabel) {
      return closeLabel;
    }

    const closeLabelKey = this.solarisTooltipCloseLabelKey();
    if (closeLabelKey) {
      return this.translate.translate(closeLabelKey);
    }

    return this.translate.translate('solaris.tooltip.close');
  }

  private scheduleOpen(delay: number): void {
    this.clearHoverTimeout();
    if (delay > 0) {
      this.hoverTimeout = setTimeout(() => {
        this.ngZone.run(() => {
          if ((this.isHovered || this.isFocused) && !this.isOpen()) {
            this.open();
          }
        });
      }, delay);
    } else {
      this.open();
    }
  }

  private scheduleClose(delay: number): void {
    this.clearHoverTimeout();

    if (this.solarisTooltipTrigger() !== 'hover') {
      return;
    }

    if (delay > 0) {
      this.hoverTimeout = setTimeout(() => {
        this.ngZone.run(() => {
          if (!this.isHovered && !this.isFocused && this.isOpen()) {
            this.close();
          }
        });
      }, delay);
    } else {
      if (!this.isHovered && !this.isFocused) {
        this.close();
      }
    }
  }

  private clearHoverTimeout(): void {
    if (this.hoverTimeout !== null) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
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
      panelClass: 'solaris-tooltip-panel-overlay',
    });

    this.overlayRef = this.overlay.create(config);
  }

  private createPositionStrategy(): FlexibleConnectedPositionStrategy {
    const placement = this.solarisTooltipPlacement();
    const offset = Number(this.solarisTooltipOffset());
    const positions = getTooltipPositions(placement, offset);

    return this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(positions)
      .withFlexibleDimensions(true)
      .withPush(true)
      .withGrowAfterOpen(true);
  }

  private attachPanel(): void {
    if (!this.overlayRef) {
      return;
    }

    const placement = this.solarisTooltipPlacement();
    const trigger = this.solarisTooltipTrigger();
    const effectiveCloseable =
      trigger === 'click' ? this.solarisTooltipCloseable() : false;
    const closeFn = () => this.close();

    const data: SolarisTooltipPanelData = {
      title: this.getResolvedTitle(),
      body: this.getResolvedBody(),
      icon: this.solarisTooltipIcon(),
      iconDecorative: this.solarisTooltipIconDecorative(),
      contentTemplate: this.solarisTooltipFor(),
      appearance: this.solarisTooltipAppearance(),
      size: this.solarisTooltipSize(),
      radius: this.solarisTooltipRadius(),
      maxWidth: this.solarisTooltipMaxWidth(),
      arrow: this.solarisTooltipArrow(),
      arrowClass: getTooltipArrowClass(placement),
      closeable: effectiveCloseable,
      closeLabel: this.getResolvedCloseLabel(),
      panelId: this.panelId,
      placement,
      trigger,
      close: closeFn,
    };

    const panelInjector = Injector.create({
      parent: this.injector,
      providers: [{ provide: SOLARIS_TOOLTIP_PANEL_DATA, useValue: data }],
    });

    const portal = new ComponentPortal(
      SolarisTooltipPanelComponent,
      this.viewContainerRef,
      panelInjector,
    );

    this.overlayRef.attach(portal);
  }

  private detachPanel(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.disposeOverlay();
    }
    this.removeOutsideClickHandler();
  }

  private disposeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.removeOutsideClickHandler();
  }

  private addOutsideClickHandler(): void {
    if (this.solarisTooltipTrigger() !== 'click') {
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
    if (!this.overlayRef) {
      return;
    }

    const overlayElement = this.overlayRef.overlayElement;
    // SECURITY_EXCEPTION: nativeElement needed for outside-click containment check. ElementRef SSR-safe.
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

  private restoreFocus(): void {
    if (
      this.solarisTooltipTrigger() === 'click' &&
      this.previousActiveElement &&
      // SECURITY_EXCEPTION: this.document.contains() to safely verify trigger still exists before focus.
      this.document.contains(this.previousActiveElement)
    ) {
      this.previousActiveElement.focus();
    }
    this.previousActiveElement = null;
  }
}
