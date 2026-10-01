import { Component } from '@angular/core';

import { SolarisSwitchComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-with-text-switch-example',
  imports: [SolarisSwitchComponent],
  templateUrl: './with-text.component.html',
})
export class WithTextSwitchExample {}
