import {
  Component,
  input,
  model,
  contentChildren,
  effect,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { SolarisDialogStepComponent } from '../../step/component/dialog-step.component';

@Component({
  selector: 'solaris-dialog-flow',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './dialog-flow.component.html',
  styleUrls: ['./dialog-flow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-dialog-flow',
    '[attr.data-transition]': 'transition()',
    '[attr.data-direction]': 'animationDirection()',
  },
})
export class SolarisDialogFlowComponent {
  readonly activeIndex = model<number>(0);
  readonly transition = input<'slide' | 'fade' | 'none'>('slide');

  readonly steps = contentChildren(SolarisDialogStepComponent);

  /**
   * Whether the flow has more than one step.
   */
  readonly hasMultipleSteps = (): boolean => this.steps().length > 1;

  /**
   * Advance to the next enabled step. Disabled steps are skipped.
   * No-op on the last step.
   */
  next(): void {
    this.goTo(
      this.findNextEnabled(this.activeIndex(), 1) ?? this.activeIndex(),
    );
  }

  /**
   * Return to the previous enabled step. Disabled steps are skipped.
   * No-op on the first step.
   */
  previous(): void {
    this.goTo(
      this.findNextEnabled(this.activeIndex(), -1) ?? this.activeIndex(),
    );
  }

  /**
   * Go to an explicit step. Out-of-range and disabled targets are ignored,
   * so callers can bind this directly to form validity without guards.
   */
  goTo(index: number): void {
    const steps = this.steps();
    if (index < 0 || index >= steps.length) {
      return;
    }
    if (steps[index].disabled()) {
      return;
    }
    this.activeIndex.set(index);
  }

  private findNextEnabled(from: number, direction: 1 | -1): number | null {
    const steps = this.steps();
    let index = from + direction;
    while (index >= 0 && index < steps.length) {
      if (!steps[index].disabled()) {
        return index;
      }
      index += direction;
    }
    return null;
  }

  protected readonly stepTemplates = signal<
    {
      template: import('@angular/core').TemplateRef<unknown>;
      index: number;
      disabled: boolean;
    }[]
  >([]);

  protected readonly animationDirection = signal<'forward' | 'backward' | null>(
    null,
  );

  private previousIndex = 0;
  private hasNavigated = false;

  constructor() {
    effect(() => {
      const current = this.activeIndex();
      if (this.hasNavigated) {
        if (current > this.previousIndex) {
          this.animationDirection.set('forward');
        } else if (current < this.previousIndex) {
          this.animationDirection.set('backward');
        }
      }
      this.previousIndex = current;
      this.hasNavigated = true;
    });

    effect(() => {
      const stepTemplates = this.steps().map((s, i) => ({
        template: s.templateRef(),
        index: i,
        disabled: s.disabled(),
      }));
      this.stepTemplates.set(stepTemplates);
    });
  }
}
