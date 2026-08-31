import { isPlatformBrowser } from '@angular/common';
import {
  ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  HostListener,
  PLATFORM_ID,
  createComponent,
  inject,
} from '@angular/core';

import { SolarisIconComponent } from '../../../icon';
import { SOLARIS_MEGA_MENU } from '../model/mega-menu.tokens';

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
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private chevronRef: ComponentRef<SolarisIconComponent> | null = null;

  constructor() {
    if (this.elementRef.nativeElement.getAttribute('type') === null) {
      this.elementRef.nativeElement.setAttribute('type', 'button');
    }

    this.attachChevron();
    this.destroyRef.onDestroy(() => this.chevronRef?.destroy());
  }

  @HostListener('click')
  onClick(): void {
    this.megaMenu.toggleFromClick();
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

  private attachChevron(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const chevronRef = createComponent(SolarisIconComponent, {
      environmentInjector: this.environmentInjector,
    });
    chevronRef.setInput('name', 'chevron-down');
    chevronRef.setInput('decorative', true);
    chevronRef.changeDetectorRef.detectChanges();

    const chevronElement = chevronRef.location.nativeElement as HTMLElement;
    chevronElement.classList.add('solaris-mega-menu-trigger__chevron');
    this.elementRef.nativeElement.appendChild(chevronElement);
    this.chevronRef = chevronRef;
  }
}
