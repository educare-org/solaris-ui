import { Component } from '@angular/core';

import {
  SolarisDividerComponent,
  SolarisButtonDirective,
  SolarisDropdownMenuComponent,
  SolarisDropdownMenuTriggerDirective,
  SolarisDropdownMenuItemComponent,
  SolarisDropdownMenuGroupComponent,
  SolarisDropdownMenuLabelComponent,
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
    SolarisDropdownMenuGroupComponent,
    SolarisDropdownMenuLabelComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './dropdown-menu-showcase.html',
  styleUrls: ['./dropdown-menu-showcase.scss'],
})
export class DropdownMenuShowcasePage {
  protected sortBy = 'name';
  protected toolbarVisible = true;
  protected sidebarVisible = true;
  protected statusBarVisible = false;
}
