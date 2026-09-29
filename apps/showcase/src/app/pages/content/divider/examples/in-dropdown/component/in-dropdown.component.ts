import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisDividerComponent,
  SolarisDropdownMenuComponent,
  SolarisDropdownMenuItemComponent,
  SolarisDropdownMenuTriggerDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-divider-in-dropdown-example',
  imports: [
    SolarisButtonDirective,
    SolarisDividerComponent,
    SolarisDropdownMenuComponent,
    SolarisDropdownMenuItemComponent,
    SolarisDropdownMenuTriggerDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './in-dropdown.component.html',
})
export class DividerInDropdownExample {}
