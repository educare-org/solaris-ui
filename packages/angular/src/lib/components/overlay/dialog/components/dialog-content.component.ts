import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'solaris-dialog-content',
  standalone: true,
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-dialog-content',
  },
})
export class SolarisDialogContentComponent {}
