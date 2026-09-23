import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import {
  SOLARIS_DIALOG_DATA,
  SolarisTranslatePipe,
  SolarisIconComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisIconComponent, SolarisTranslatePipe],
  templateUrl: './component-dialog-chrome-example.component.html',
  styleUrls: ['./component-dialog-chrome-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentDialogChromeExampleComponent {
  readonly data: { message: string } = inject(SOLARIS_DIALOG_DATA) as {
    message: string;
  };
}
