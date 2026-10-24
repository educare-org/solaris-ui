import { Component, signal } from '@angular/core';

import {
  SolarisPaginationComponent,
  type SolarisPageChange,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-pagination-example',
  imports: [SolarisPaginationComponent],
  templateUrl: './basic.component.html',
})
export class BasicPaginationExample {
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly total = 95;

  protected onPageChange(event: SolarisPageChange): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
