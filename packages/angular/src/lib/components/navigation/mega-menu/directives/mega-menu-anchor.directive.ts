import { Directive, ElementRef, inject } from '@angular/core';

import {
  SOLARIS_MEGA_MENU_ANCHOR,
  type SolarisMegaMenuAnchorControl,
} from '../model/mega-menu.tokens';

// SECURITY_EXCEPTION_FILE: The CDK connected overlay requires the anchor HTMLElement as its positioning origin. Exposing the injected host avoids document lookup; mega-menu component specs cover anchored positioning.

@Directive({
  selector: '[solaris-mega-menu-anchor]',
  standalone: true,
  providers: [
    {
      provide: SOLARIS_MEGA_MENU_ANCHOR,
      useExisting: SolarisMegaMenuAnchorDirective,
    },
  ],
})
export class SolarisMegaMenuAnchorDirective
  implements SolarisMegaMenuAnchorControl
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
