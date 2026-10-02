import { Component, signal } from '@angular/core';

import { SolarisCheckboxComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-indeterminate-checkbox-example',
  imports: [SolarisCheckboxComponent],
  templateUrl: './indeterminate.component.html',
})
export class IndeterminateCheckboxExample {
  protected readonly allSelected = signal(false);
  protected readonly someSelected = signal(true);

  protected toggleAllSelected(): void {
    this.allSelected.set(!this.allSelected());
    this.someSelected.set(false);
  }
}
