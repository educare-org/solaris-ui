import { Component } from '@angular/core';

import {
  SolarisAlertComponent,
  SolarisAlertActionsComponent,
  SolarisAlertTitleDirective,
  SolarisAlertDescriptionDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-anatomy-alert-example',
  imports: [
    SolarisAlertComponent,
    SolarisAlertActionsComponent,
    SolarisAlertTitleDirective,
    SolarisAlertDescriptionDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './anatomy.component.html',
})
export class AnatomyAlertExample {}
