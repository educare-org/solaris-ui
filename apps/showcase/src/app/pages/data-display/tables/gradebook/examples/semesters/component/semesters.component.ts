import { Component, signal } from '@angular/core';

import {
  SolarisGradebookComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

import {
  GRADEBOOK_SHOWCASE_FULL_COLUMNS,
  GRADEBOOK_SHOWCASE_GROUPS,
  GRADEBOOK_SHOWCASE_IDENTITY,
  GRADEBOOK_SHOWCASE_ROWS,
} from '../../../model/gradebook-showcase.data';

type StickyMode = 'first' | 'both' | 'none';

@Component({
  standalone: true,
  selector: 'app-semesters-gradebook-example',
  imports: [
    SolarisGradebookComponent,
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './semesters.component.html',
  styleUrls: ['./semesters.component.scss'],
})
export class SemestersGradebookExample {
  protected readonly rows = GRADEBOOK_SHOWCASE_ROWS;
  protected readonly columns = GRADEBOOK_SHOWCASE_FULL_COLUMNS;
  protected readonly groups = GRADEBOOK_SHOWCASE_GROUPS;
  protected readonly identity = GRADEBOOK_SHOWCASE_IDENTITY;

  protected readonly stickyMode = signal<StickyMode>('both');

  protected stickyFirst(): boolean {
    return this.stickyMode() !== 'none';
  }

  protected stickyLast(): boolean {
    return this.stickyMode() === 'both';
  }
}
