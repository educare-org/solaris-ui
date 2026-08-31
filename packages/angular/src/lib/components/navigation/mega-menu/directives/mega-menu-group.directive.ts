import { Directive } from '@angular/core';

import {
  SOLARIS_MEGA_MENU_GROUP,
  type SolarisMegaMenuControl,
  type SolarisMegaMenuGroupControl,
} from '../model/mega-menu.tokens';

@Directive({
  selector: '[solaris-mega-menu-group]',
  standalone: true,
  providers: [
    {
      provide: SOLARIS_MEGA_MENU_GROUP,
      useExisting: SolarisMegaMenuGroupDirective,
    },
  ],
})
export class SolarisMegaMenuGroupDirective
  implements SolarisMegaMenuGroupControl
{
  private activeMenu: SolarisMegaMenuControl | null = null;

  open(menu: SolarisMegaMenuControl): void {
    if (this.activeMenu && this.activeMenu !== menu) {
      this.activeMenu.close(false);
    }
    this.activeMenu = menu;
  }

  close(menu: SolarisMegaMenuControl): void {
    if (this.activeMenu === menu) {
      this.activeMenu = null;
    }
  }
}
