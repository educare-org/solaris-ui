import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisButtonIconDirective,
  SolarisIconComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  type SolarisButtonAppearance,
  type SolarisButtonColor,
} from '@solaris-ui/angular';

interface ButtonSwatch<T extends string = string> {
  value: T;
  label: string;
}

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisButtonIconDirective,
    SolarisIconComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './button-showcase.html',
  styleUrls: ['./button-showcase.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonShowcasePage {
  protected loading = false;

  protected readonly colors: ButtonSwatch<SolarisButtonColor>[] = [
    { value: 'neutral', label: 'Neutral' },
    { value: 'primary', label: 'Primary' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'danger', label: 'Danger' },
    { value: 'info', label: 'Info' },
  ];

  protected readonly appearances: ButtonSwatch<SolarisButtonAppearance>[] = [
    { value: 'solid', label: 'Solid' },
    { value: 'outline', label: 'Outline' },
    { value: 'ghost', label: 'Ghost' },
    { value: 'tonal', label: 'Tonal' },
    { value: 'surface', label: 'Surface' },
  ];

  protected selectedColor = signal<string | number>('primary');

  protected toggleLoading(): void {
    this.loading = !this.loading;
  }
}
