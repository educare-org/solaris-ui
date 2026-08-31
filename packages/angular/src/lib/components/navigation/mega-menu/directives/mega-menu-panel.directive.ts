import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[solaris-mega-menu-panel]',
  standalone: true,
  exportAs: 'solarisMegaMenuPanel',
})
export class SolarisMegaMenuPanelDirective {
  readonly templateRef = inject(TemplateRef<unknown>);
}
