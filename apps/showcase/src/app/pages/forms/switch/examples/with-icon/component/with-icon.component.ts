import { Component, signal } from '@angular/core';

import { SolarisSwitchComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-with-icon-switch-example',
  imports: [SolarisSwitchComponent],
  templateUrl: './with-icon.component.html',
})
export class WithIconSwitchExample {
  readonly enabled = signal(true);
}
