import { Component, signal } from '@angular/core';

import {
  SolarisAvatarComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-action-avatar-example',
  imports: [SolarisAvatarComponent, SolarisTranslatePipe],
  templateUrl: './action.component.html',
})
export class ActionAvatarExample {
  protected readonly highlighted = signal(false);

  protected toggle(): void {
    this.highlighted.update((value) => !value);
  }
}
