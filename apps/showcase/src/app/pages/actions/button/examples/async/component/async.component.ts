import { Component, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-async-button-example',
  imports: [SolarisButtonDirective, SolarisTranslatePipe],
  templateUrl: './async.component.html',
})
export class AsyncButtonExample {
  protected readonly status = signal<'idle' | 'success' | 'failure'>('idle');

  protected save = () =>
    new Promise<unknown>((resolve) => {
      setTimeout(() => resolve('saved'), 1200);
    });

  protected onSuccess(): void {
    this.status.set('success');
  }

  protected onFailure(): void {
    this.status.set('failure');
  }
}
