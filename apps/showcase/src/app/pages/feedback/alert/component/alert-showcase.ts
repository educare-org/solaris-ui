import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  SolarisAlertComponent,
  SolarisAlertActionsComponent,
  SolarisAlertTitleDirective,
  SolarisAlertDescriptionDirective,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  type SolarisAlertVariant,
  type SolarisAlertAppearance,
} from '@solaris-ui/angular';

interface AlertSwatch<T extends string = string> {
  value: T;
  label: string;
}

@Component({
  standalone: true,
  imports: [
    SolarisAlertComponent,
    SolarisAlertActionsComponent,
    SolarisAlertTitleDirective,
    SolarisAlertDescriptionDirective,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './alert-showcase.html',
  styleUrls: ['./alert-showcase.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertShowcasePage {
  protected readonly variants: AlertSwatch<SolarisAlertVariant>[] = [
    { value: 'neutral', label: 'Neutral' },
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'danger', label: 'Danger' },
    { value: 'custom', label: 'Custom' },
  ];

  protected readonly appearances: AlertSwatch<SolarisAlertAppearance>[] = [
    { value: 'tonal', label: 'Tonal' },
    { value: 'outline', label: 'Outline' },
    { value: 'surface', label: 'Surface' },
    { value: 'solid', label: 'Solid' },
  ];

  protected selectedVariant = signal<string | number>('info');

  protected showClosableAlert = true;
  protected showClosableAlert2 = true;

  protected handleDismiss(): void {
    this.showClosableAlert = false;
  }

  protected handleDismiss2(): void {
    this.showClosableAlert2 = false;
  }

  protected showAgain(): void {
    this.showClosableAlert2 = true;
  }
}
