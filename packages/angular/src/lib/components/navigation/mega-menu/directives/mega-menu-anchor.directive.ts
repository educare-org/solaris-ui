import { Directive, ElementRef, inject } from '@angular/core';

import {
  SOLARIS_MEGA_MENU_ANCHOR,
  type SolarisMegaMenuAnchorControl,
} from '../model/mega-menu.tokens';

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
