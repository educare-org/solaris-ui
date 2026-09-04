import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  SolarisRadioGroupComponent,
  SolarisSelectionCardComponent,
  SolarisSelectionCardContentDirective,
  SolarisSelectionCardDescriptionDirective,
  SolarisSelectionCardFooterDirective,
  SolarisSelectionCardHeaderDirective,
  SolarisSelectionCardMediaDirective,
  SolarisSelectionCardTitleDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisRadioGroupComponent,
    SolarisSelectionCardComponent,
    SolarisSelectionCardContentDirective,
    SolarisSelectionCardDescriptionDirective,
    SolarisSelectionCardFooterDirective,
    SolarisSelectionCardHeaderDirective,
    SolarisSelectionCardMediaDirective,
    SolarisSelectionCardTitleDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './selection-card-showcase.html',
  styleUrls: ['./selection-card-showcase.scss'],
})
export class SelectionCardShowcasePage {
  protected readonly planControl = new FormControl('pro');
  protected readonly deliveryControl = new FormControl('express');
  protected readonly standaloneControl = new FormControl(true);
  protected readonly readonlyControl = new FormControl('basic');
}
