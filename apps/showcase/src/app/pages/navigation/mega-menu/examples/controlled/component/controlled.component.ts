import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisMegaMenuAnchorDirective,
  SolarisMegaMenuComponent,
  SolarisMegaMenuPanelDirective,
  SolarisMegaMenuTriggerDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-controlled-mega-menu-example',
  imports: [
    SolarisButtonDirective,
    SolarisMegaMenuAnchorDirective,
    SolarisMegaMenuComponent,
    SolarisMegaMenuPanelDirective,
    SolarisMegaMenuTriggerDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './controlled.component.html',
  styleUrls: ['./controlled.component.scss'],
})
export class ControlledMegaMenuExample {
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
