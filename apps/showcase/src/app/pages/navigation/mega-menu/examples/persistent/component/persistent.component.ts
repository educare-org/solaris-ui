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
  selector: 'app-persistent-mega-menu-example',
  imports: [
    SolarisMegaMenuAnchorDirective,
    SolarisMegaMenuComponent,
    SolarisMegaMenuPanelDirective,
    SolarisMegaMenuTriggerDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './persistent.component.html',
  styleUrls: ['./persistent.component.scss'],
})
export class PersistentMegaMenuExample {}
