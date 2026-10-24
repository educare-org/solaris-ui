import { Component } from '@angular/core';

import {
  SolarisAvatarComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-avatar-example',
  imports: [SolarisAvatarComponent, SolarisTranslatePipe],
  templateUrl: './basic.component.html',
})
export class BasicAvatarExample {}
