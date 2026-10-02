import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisRadioGroupComponent,
  SolarisSelectionCardComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-cards-grid-selection-card-example',
  imports: [
    ReactiveFormsModule,
    SolarisRadioGroupComponent,
    SolarisSelectionCardComponent,
  ],
  templateUrl: './cards-grid.component.html',
})
export class CardsGridSelectionCardExample {
  protected readonly planControl = new FormControl('pro');
}
