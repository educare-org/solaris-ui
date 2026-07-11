import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  SolarisTextareaDirective,
  SolarisFormFieldComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [FormsModule, SolarisTextareaDirective, SolarisFormFieldComponent],
  templateUrl: './textarea-showcase.html',
  styleUrls: ['./textarea-showcase.scss'],
})
export class TextareaShowcasePage {}
