import { Directive, ElementRef, HostListener, inject } from '@angular/core';

import { SOLARIS_MEGA_MENU } from '../model/mega-menu.tokens';

// SECURITY_EXCEPTION_FILE: Native host access sets the semantic button type; directive specs cover trigger semantics and interaction.

@Directive({
  selector: 'button[solaris-mega-menu-trigger]',
  standalone: true,
  host: {
    '[attr.aria-controls]': 'megaMenu.panelId',
    '[attr.aria-expanded]': 'megaMenu.isOpen() ? "true" : "false"',
    '[attr.aria-haspopup]': '"true"',
    '[attr.data-open]': 'megaMenu.isOpen() ? "" : null',
    '[attr.data-appearance]': 'megaMenu.appearance()',
    class: 'solaris-mega-menu-trigger',
  },
})
export class SolarisMegaMenuTriggerDirective {
  protected readonly megaMenu = inject(SOLARIS_MEGA_MENU);
  private readonly elementRef =
    inject<ElementRef<HTMLButtonElement>>(ElementRef);
  private isPointerInteraction = false;

  constructor() {
    if (this.elementRef.nativeElement.getAttribute('type') === null) {
      this.elementRef.nativeElement.setAttribute('type', 'button');
    }
  }

  @HostListener('click')
  onClick(): void {
    this.megaMenu.toggleFromClick();
    this.isPointerInteraction = false;
  }

  @HostListener('pointerdown')
  onPointerDown(): void {
    this.isPointerInteraction = true;
  }

  @HostListener('pointercancel')
  onPointerCancel(): void {
    this.isPointerInteraction = false;
  }

  @HostListener('pointerenter')
  onPointerEnter(): void {
    this.megaMenu.scheduleOpen();
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    this.megaMenu.scheduleClose();
  }

  @HostListener('focusin')
  onFocusIn(): void {
    if (this.isPointerInteraction) {
      return;
    }

    this.megaMenu.open();
  }

  @HostListener('keydown.arrowdown', ['$event'])
  onArrowDown(event: Event): void {
    event.preventDefault();
    this.megaMenu.open();
    this.megaMenu.focusFirstPanelItem();
  }

  @HostListener('keydown.arrowright', ['$event'])
  onArrowRight(event: Event): void {
    event.preventDefault();
    this.focusSiblingTrigger(1);
  }

  @HostListener('keydown.arrowleft', ['$event'])
  onArrowLeft(event: Event): void {
    event.preventDefault();
    this.focusSiblingTrigger(-1);
  }

  @HostListener('keydown.home', ['$event'])
  onHome(event: Event): void {
    event.preventDefault();
    this.focusSiblingTrigger('first');
  }

  @HostListener('keydown.end', ['$event'])
  onEnd(event: Event): void {
    event.preventDefault();
    this.focusSiblingTrigger('last');
  }

  private focusSiblingTrigger(target: 1 | -1 | 'first' | 'last'): void {
    const nativeElement = this.elementRef.nativeElement;
    const root =
      nativeElement.closest('[solaris-mega-menu-group], nav') ??
      nativeElement.ownerDocument;
    const triggers = Array.from(
      root.querySelectorAll<HTMLButtonElement>(
        'button[solaris-mega-menu-trigger]:not([disabled])',
      ),
    );
    const index = triggers.indexOf(nativeElement);

    if (triggers.length === 0) {
      return;
    }

    if (target === 'first') {
      triggers[0]?.focus();
      return;
    }

    if (target === 'last') {
      triggers[triggers.length - 1]?.focus();
      return;
    }

    const direction = this.isRtl() ? -target : target;
    const fallbackIndex = index >= 0 ? index : direction > 0 ? -1 : 0;
    triggers[
      (fallbackIndex + direction + triggers.length) % triggers.length
    ]?.focus();
  }

  private isRtl(): boolean {
    const nativeElement = this.elementRef.nativeElement;
    return (
      nativeElement.closest('[dir]')?.getAttribute('dir')?.toLowerCase() ===
        'rtl' || nativeElement.ownerDocument.dir.toLowerCase() === 'rtl'
    );
  }

  @HostListener('keydown.escape', ['$event'])
  onEscape(event: Event): void {
    event.preventDefault();
    this.megaMenu.close(true);
  }
}
