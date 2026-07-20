import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  SolarisTextareaDirective,
  SolarisFormFieldComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    SolarisTextareaDirective,
    SolarisFormFieldComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './textarea-showcase.html',
  styleUrls: ['./textarea-showcase.scss'],
})
export class TextareaShowcasePage {}
