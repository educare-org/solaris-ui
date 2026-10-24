import { Component } from '@angular/core';

import { SolarisGradebookComponent } from '@solaris-ui/angular';

import {
  GRADEBOOK_SHOWCASE_BASIC_COLUMNS,
  GRADEBOOK_SHOWCASE_IDENTITY,
  GRADEBOOK_SHOWCASE_ROWS,
} from '../../../model/gradebook-showcase.data';

@Component({
  standalone: true,
  selector: 'app-basic-gradebook-example',
  imports: [SolarisGradebookComponent],
  templateUrl: './basic.component.html',
})
export class BasicGradebookExample {
  protected readonly rows = GRADEBOOK_SHOWCASE_ROWS;
  protected readonly columns = GRADEBOOK_SHOWCASE_BASIC_COLUMNS;
  protected readonly identity = GRADEBOOK_SHOWCASE_IDENTITY;
}
