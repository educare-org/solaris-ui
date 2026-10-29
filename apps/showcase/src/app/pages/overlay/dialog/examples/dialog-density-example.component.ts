import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

import { SolarisTranslatePipe } from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisTranslatePipe],
  templateUrl: './dialog-density-example.component.html',
  styleUrls: ['./dialog-density-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogDensityExampleComponent {
  readonly sections = signal([0, 1, 2, 3]);
}
