import { Component } from '@angular/core';
import {
  SolarisRadioComponent,
  SolarisRadioGroupComponent,
  SolarisFormFieldComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisRadioComponent,
    SolarisRadioGroupComponent,
    SolarisFormFieldComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './radio-showcase.html',
  styleUrls: ['./radio-showcase.scss'],
})
export class RadioShowcasePage {}
