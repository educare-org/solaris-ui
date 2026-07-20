import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import {
  SolarisSwitchGroupComponent,
  SolarisSwitchComponent,
  SolarisFormFieldComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    SolarisSwitchGroupComponent,
    SolarisSwitchComponent,
    SolarisFormFieldComponent,
  ],
  templateUrl: './switch-group-showcase.html',
  styleUrls: ['./switch-group-showcase.scss'],
})
export class SwitchGroupShowcasePage {
  protected readonly basicControl = new FormControl<Record<string, boolean>>({
    email: true,
    sms: false,
    push: true,
  });

  protected readonly standaloneLabelControl = new FormControl<
    Record<string, boolean>
  >({ email: true, sms: false, push: true });

  protected readonly formFieldControl = new FormControl<
    Record<string, boolean>
  >({ twoFactor: false, marketing: true });

  protected readonly verticalListControl = new FormControl<
    Record<string, boolean>
  >({ email: true, sms: true, push: false });

  protected readonly horizontalListControl = new FormControl<
    Record<string, boolean>
  >({ email: true, sms: true, push: false });

  protected readonly grid2Control = new FormControl<Record<string, boolean>>({
    email: true,
    sms: false,
    push: true,
    newsletter: false,
  });

  protected readonly gridAutoControl = new FormControl<Record<string, boolean>>(
    { email: true, sms: false, push: true, newsletter: false },
  );

  protected readonly disabledGroupControl = new FormControl<
    Record<string, boolean>
  >({ email: true, sms: true, push: false });

  protected readonly disabledChildControl = new FormControl<
    Record<string, boolean>
  >({ email: true, sms: false, push: false });

  protected readonly readonlyGroupControl = new FormControl<
    Record<string, boolean>
  >({ email: true, sms: true, push: false });

  protected readonly readonlyChildControl = new FormControl<
    Record<string, boolean>
  >({ email: true, sms: false, push: false });

  protected readonly validationMinControl = new FormControl<
    Record<string, boolean>
  >({ email: true, sms: false, push: false });

  protected readonly validationMaxControl = new FormControl<
    Record<string, boolean>
  >({ email: true, sms: true, push: true });

  protected readonly validationRequiredControl = new FormControl<
    Record<string, boolean>
  >({ email: false, sms: false, push: false });

  protected readonly cvaControl = new FormControl<Record<string, boolean>>({
    email: true,
    sms: false,
    push: true,
  });

  protected readonly sizeSmControl = new FormControl<Record<string, boolean>>({
    email: true,
    sms: false,
  });

  protected readonly sizeMdControl = new FormControl<Record<string, boolean>>({
    email: true,
    sms: false,
  });

  protected readonly sizeLgControl = new FormControl<Record<string, boolean>>({
    email: true,
    sms: false,
  });
}
