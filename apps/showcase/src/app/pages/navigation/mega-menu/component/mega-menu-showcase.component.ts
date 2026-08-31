import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisMegaMenuAnchorDirective,
  SolarisMegaMenuComponent,
  SolarisMegaMenuGroupDirective,
  SolarisMegaMenuPanelDirective,
  SolarisMegaMenuTriggerDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisMegaMenuAnchorDirective,
    SolarisMegaMenuComponent,
    SolarisMegaMenuGroupDirective,
    SolarisMegaMenuPanelDirective,
    SolarisMegaMenuTriggerDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './mega-menu-showcase.component.html',
  styleUrls: ['./mega-menu-showcase.component.scss'],
})
export class MegaMenuShowcasePage {
  protected controlledOpen = false;
  protected lastEventKey = 'mega-menu.event-idle';

  protected toggleControlledMenu(): void {
    this.controlledOpen = !this.controlledOpen;
  }

  protected onMenuOpened(): void {
    this.lastEventKey = 'mega-menu.event-opened';
  }

  protected onMenuClosed(): void {
    this.lastEventKey = 'mega-menu.event-closed';
  }
}
