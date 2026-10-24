import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisSwitchComponent,
  SolarisSwitchGroupComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-switch-group-example',
  imports: [
    ReactiveFormsModule,
    SolarisSwitchComponent,
    SolarisSwitchGroupComponent,
  ],
  templateUrl: './basic.component.html',
})
export class BasicSwitchGroupExample {
  protected readonly channelsControl = new FormControl<Record<string, boolean>>(
    { email: true, sms: false, push: true },
  );
}
