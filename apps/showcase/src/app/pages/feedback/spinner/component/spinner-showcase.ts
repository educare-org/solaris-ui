import { Component, DestroyRef, inject, signal } from '@angular/core';

import {
  SolarisSpinnerComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisSpinnerComponent, SolarisTranslatePipe],
  templateUrl: './spinner-showcase.html',
  styleUrls: ['./spinner-showcase.scss'],
})
export class SpinnerShowcasePage {
  readonly showBackdrop = signal(false);
  readonly progressValue = signal(0);
  readonly isAnimating = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  playAnimation(): void {
    if (this.isAnimating()) {
      return;
    }
    this.progressValue.set(0);
    this.isAnimating.set(true);
    const interval = setInterval(() => {
      const next = this.progressValue() + 1;
      if (next >= 100) {
        this.progressValue.set(100);
        this.isAnimating.set(false);
        clearInterval(interval);
        return;
      }
      this.progressValue.set(next);
    }, 30);
    this.destroyRef.onDestroy(() => clearInterval(interval));
  }
}
