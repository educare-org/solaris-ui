import { Component, signal } from '@angular/core';

import {
  SolarisIconButtonDirective,
  SolarisIconComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-async-icon-button-example',
  imports: [
    SolarisIconButtonDirective,
    SolarisIconComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './async.component.html',
})
export class AsyncIconButtonExample {
  protected readonly status = signal<'idle' | 'success' | 'failure'>('idle');

  protected refresh = () =>
    new Promise<unknown>((resolve) => {
      setTimeout(() => resolve('refreshed'), 1200);
    });

  protected onSuccess(): void {
    this.status.set('success');
  }

  protected onFailure(): void {
    this.status.set('failure');
  }
}
