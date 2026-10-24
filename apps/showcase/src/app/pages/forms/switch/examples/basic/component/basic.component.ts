import { Component, signal } from '@angular/core';

import { SolarisSwitchComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-switch-example',
  imports: [SolarisSwitchComponent],
  templateUrl: './basic.component.html',
})
export class BasicSwitchExample {
  readonly notifications = signal(false);
}
