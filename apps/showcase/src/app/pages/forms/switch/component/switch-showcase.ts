import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  SolarisSwitchComponent,
  SolarisFormFieldComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisSwitchComponent,
    SolarisFormFieldComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './switch-showcase.html',
  styleUrls: ['./switch-showcase.scss'],
})
export class SwitchShowcasePage {
  protected readonly basicChecked = signal(false);
  protected readonly notificationsControl = new FormControl(
    false,
    Validators.requiredTrue,
  );
  protected readonly enableControl = new FormControl(false);
}
