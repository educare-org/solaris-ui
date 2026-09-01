import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
} from '@angular/core';

import { SOLARIS_MEGA_MENU } from '../model/mega-menu.tokens';

// SECURITY_EXCEPTION_FILE: Native host access sets the semantic button type. Renderer2 creates the decorative chevron for both SSR and browser rendering; directive specs cover trigger semantics and interaction.

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
  private readonly renderer = inject(Renderer2);
  private isPointerInteraction = false;

  constructor() {
    if (this.elementRef.nativeElement.getAttribute('type') === null) {
      this.elementRef.nativeElement.setAttribute('type', 'button');
    }

    this.ensureChevron();
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
  }

  @HostListener('keydown.escape', ['$event'])
  onEscape(event: Event): void {
    event.preventDefault();
    this.megaMenu.close(true);
  }

  private ensureChevron(): void {
    const host = this.elementRef.nativeElement;

    if (host.querySelector('.solaris-mega-menu-trigger__chevron')) {
      return;
    }

    const chevron = this.renderer.createElement('span');
    this.renderer.addClass(chevron, 'solaris-mega-menu-trigger__chevron');
    this.renderer.setAttribute(chevron, 'aria-hidden', 'true');
    this.renderer.appendChild(host, chevron);
  }
}
