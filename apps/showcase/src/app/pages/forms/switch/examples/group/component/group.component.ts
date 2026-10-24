import { Component } from '@angular/core';

import {
  SolarisSwitchComponent,
  SolarisSwitchGroupComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-group-switch-example',
  imports: [SolarisSwitchComponent, SolarisSwitchGroupComponent],
  templateUrl: './group.component.html',
})
export class GroupSwitchExample {}
