import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisSwitchComponent,
  SolarisSwitchGroupComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-validation-switch-group-example',
  imports: [
    ReactiveFormsModule,
    SolarisSwitchComponent,
    SolarisSwitchGroupComponent,
  ],
  templateUrl: './validation.component.html',
})
export class ValidationSwitchGroupExample {
  protected readonly channelsControl = new FormControl<Record<string, boolean>>(
    { email: true, sms: false, push: false },
  );
}
