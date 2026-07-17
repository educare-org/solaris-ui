import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { SolarisSegmentedControlComponent, SolarisSegmentedItemComponent, SolarisTranslatePipe } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-segmented-reactive-forms-example',
  imports: [ReactiveFormsModule, SolarisSegmentedControlComponent, SolarisSegmentedItemComponent, SolarisTranslatePipe],
  templateUrl: './reactive-forms.component.html',
})
export class SegmentedReactiveFormsExample {
  readonly themeControl = new FormControl('light');
}
