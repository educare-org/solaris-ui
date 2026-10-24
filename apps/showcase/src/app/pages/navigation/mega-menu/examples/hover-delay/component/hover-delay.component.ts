import { Component } from '@angular/core';

import {
  SolarisMegaMenuAnchorDirective,
  SolarisMegaMenuComponent,
  SolarisMegaMenuPanelDirective,
  SolarisMegaMenuTriggerDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-hover-delay-mega-menu-example',
  imports: [
    SolarisMegaMenuAnchorDirective,
    SolarisMegaMenuComponent,
    SolarisMegaMenuPanelDirective,
    SolarisMegaMenuTriggerDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './hover-delay.component.html',
  styleUrls: ['./hover-delay.component.scss'],
})
export class HoverDelayMegaMenuExample {}
