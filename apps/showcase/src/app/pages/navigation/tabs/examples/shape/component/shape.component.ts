import { Component, signal } from '@angular/core';
import {
  SolarisTabsComponent,
  SolarisTabComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-shape-tabs-example',
  imports: [SolarisTabsComponent, SolarisTabComponent, SolarisTranslatePipe],
  templateUrl: './shape.component.html',
})
export class ShapeTabsExample {
  readonly normalTab = signal<string | number>('drafts');
  readonly wideTab = signal<string | number>('drafts');
}
