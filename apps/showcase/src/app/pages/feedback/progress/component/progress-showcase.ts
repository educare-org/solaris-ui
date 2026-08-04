import { Component, DestroyRef, inject, signal } from '@angular/core';

import {
  SolarisProgressComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisProgressComponent, SolarisTranslatePipe],
  templateUrl: './progress-showcase.html',
  styleUrls: ['./progress-showcase.scss'],
})
export class ProgressShowcasePage {
  readonly animatedValue = signal(0);
  readonly isAnimating = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  playAnimation(): void {
    if (this.isAnimating()) {
      return;
    }
    this.animatedValue.set(0);
    this.isAnimating.set(true);
    const interval = setInterval(() => {
      const next = this.animatedValue() + 1;
      if (next >= 100) {
        this.animatedValue.set(100);
        this.isAnimating.set(false);
        clearInterval(interval);
        return;
      }
      this.animatedValue.set(next);
    }, 30);
    this.destroyRef.onDestroy(() => clearInterval(interval));
  }
}
