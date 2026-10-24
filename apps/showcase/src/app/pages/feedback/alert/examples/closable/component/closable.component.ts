import { Component, signal } from '@angular/core';

import {
  SolarisAlertComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-closable-alert-example',
  imports: [SolarisAlertComponent, SolarisTranslatePipe],
  templateUrl: './closable.component.html',
})
export class ClosableAlertExample {
  protected readonly visible = signal(true);

  protected handleDismiss(): void {
    this.visible.set(false);
  }

  protected showAgain(): void {
    this.visible.set(true);
  }
}
