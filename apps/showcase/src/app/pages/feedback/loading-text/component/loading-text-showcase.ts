import { Component } from '@angular/core';

import {
  SolarisLoadingTextComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisLoadingTextComponent, SolarisTranslatePipe],
  templateUrl: './loading-text-showcase.html',
  styleUrls: ['./loading-text-showcase.scss'],
})
export class LoadingTextShowcasePage {}
