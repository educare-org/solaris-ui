import { Component, signal } from '@angular/core';

import {
  SolarisPaginationComponent,
  type SolarisPageChange,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-unknown-total-pagination-example',
  imports: [SolarisPaginationComponent],
  templateUrl: './unknown-total.component.html',
})
export class UnknownTotalPaginationExample {
  protected readonly pageIndex = signal(2);
  protected readonly pageSize = signal(10);

  protected onPageChange(event: SolarisPageChange): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
