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
  selector: 'app-basic-mega-menu-example',
  imports: [
    SolarisMegaMenuAnchorDirective,
    SolarisMegaMenuComponent,
    SolarisMegaMenuGroupDirective,
    SolarisMegaMenuPanelDirective,
    SolarisMegaMenuTriggerDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
})
export class BasicMegaMenuExample {}
