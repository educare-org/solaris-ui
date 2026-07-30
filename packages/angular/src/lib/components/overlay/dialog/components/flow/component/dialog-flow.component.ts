import {
  Component,
  input,
  model,
  ContentChildren,
  QueryList,
  AfterContentInit,
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
export class SolarisDialogFlowComponent implements AfterContentInit {
  readonly activeIndex = model<number>(0);
  readonly transition = input<'slide' | 'fade' | 'none'>('slide');

  @ContentChildren(SolarisDialogStepComponent)
  steps?: QueryList<SolarisDialogStepComponent>;

  protected readonly stepTemplates = signal<
    {
      template: import('@angular/core').TemplateRef<unknown>;
      index: number;
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
  }

  ngAfterContentInit(): void {
    if (this.steps) {
      this.stepTemplates.set(
        this.steps.toArray().map((s, i) => ({
          template: s.templateRef,
          index: i,
        })),
      );

      this.steps.changes.subscribe(() => {
        this.stepTemplates.set(
          (this.steps?.toArray() ?? []).map((s, i) => ({
            template: s.templateRef,
            index: i,
          })),
        );
      });
    }
  }
}
