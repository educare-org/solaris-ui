import { Component } from '@angular/core';

import {
  SolarisDividerComponent,
  SolarisButtonDirective,
  SolarisDropdownMenuComponent,
  SolarisDropdownMenuTriggerDirective,
  SolarisDropdownMenuItemComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisDividerComponent,
    SolarisButtonDirective,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuTriggerDirective,
    SolarisDropdownMenuItemComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './divider-showcase.html',
  styleUrls: ['./divider-showcase.scss'],
})
export class DividerShowcasePage {}
