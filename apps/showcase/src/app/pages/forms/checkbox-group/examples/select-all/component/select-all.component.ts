import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisCheckboxComponent,
  SolarisCheckboxGroupComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-select-all-checkbox-group-example',
  imports: [
    ReactiveFormsModule,
    SolarisCheckboxComponent,
    SolarisCheckboxGroupComponent,
  ],
  templateUrl: './select-all.component.html',
})
export class SelectAllCheckboxGroupExample {
  protected readonly permissionsControl = new FormControl(['read']);
}
