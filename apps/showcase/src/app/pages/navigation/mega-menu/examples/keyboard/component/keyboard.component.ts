import { Component } from '@angular/core';

import {
  SolarisMegaMenuAnchorDirective,
  SolarisMegaMenuComponent,
  SolarisMegaMenuGroupDirective,
  SolarisMegaMenuPanelDirective,
  SolarisMegaMenuTriggerDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-keyboard-mega-menu-example',
  imports: [
    SolarisMegaMenuAnchorDirective,
    SolarisMegaMenuComponent,
    SolarisMegaMenuGroupDirective,
    SolarisMegaMenuPanelDirective,
    SolarisMegaMenuTriggerDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyboardMegaMenuExample {}
