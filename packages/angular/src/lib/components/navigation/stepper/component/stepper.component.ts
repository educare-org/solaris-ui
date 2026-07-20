import {
  Component,
  input,
  output,
  model,
  contentChildren,
  contentChild,
  computed,
  signal,
  inject,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';

import { SolarisStepperActionsComponent } from '../actions/stepper-actions.component';
import { SolarisTranslateService } from '../../../../services/translation';
import type { SolarisStepperControl } from '../token/stepper.tokens';
import { SolarisStepComponent } from '../step/step.component';
import { SOLARIS_STEPPER } from '../token/stepper.tokens';
import { SolarisIconComponent } from '../../../icon';

import type {
  SolarisStepperOrientation,
  SolarisStepperAppearance,
  SolarisStepperSize,
  SolarisStepperDensity,
  SolarisStepperContentTransition,
  SolarisStepperChangeEvent,
} from '../model/stepper.types';

@Component({
  selector: 'solaris-stepper',
  standalone: true,
  imports: [SolarisIconComponent],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-stepper',
    '[attr.data-size]': 'size()',
    '[attr.role]': '"navigation"',
    '[attr.data-density]': 'density()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.aria-label]': 'resolvedAriaLabel()',
  },
  providers: [
    {
      provide: SOLARIS_STEPPER,
      useExisting: SolarisStepperComponent,
    },
  ],
})
export class SolarisStepperComponent implements SolarisStepperControl {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  readonly steps = contentChildren(SolarisStepComponent);
  readonly actions = contentChild(SolarisStepperActionsComponent);

  readonly activeIndex = model<number>(0);
  readonly orientation = input<SolarisStepperOrientation>('horizontal');
  readonly appearance = input<SolarisStepperAppearance>('default');
  readonly linear = input<boolean>(false);
  readonly size = input<SolarisStepperSize>('md');
  readonly density = input<SolarisStepperDensity>('comfortable');
  readonly showConnectors = input<boolean>(true);
  readonly showStepStatus = input<boolean>(true);
  readonly showStepNumbers = input<boolean>(true);
  readonly contentTransition = input<SolarisStepperContentTransition>('fade');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly activeIndexChange = output<number>();
  readonly stepChange = output<SolarisStepperChangeEvent>();
  readonly stepClick = output<{ index: number; label: string | undefined }>();

  protected readonly stepTransitionDirection = signal<'next' | 'previous'>(
    'next',
  );
  readonly previousIndex = signal<number>(0);

  readonly resolvedAriaLabel = computed(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    const ariaLabelKey = this.ariaLabelKey();
    if (ariaLabelKey && this.translateService) {
      return this.translateService.translate(ariaLabelKey);
    }
    return ariaLabelKey ?? 'Progress';
  });

  constructor() {
    effect(() => {
      const current = this.activeIndex();
      const prev = this.previousIndex();
      if (current !== prev) {
        this.activeIndexChange.emit(current);
        this.stepChange.emit({
          activeIndex: current,
          previousIndex: prev,
        });
        this.stepTransitionDirection.set(current > prev ? 'next' : 'previous');
        this.previousIndex.set(current);
      }
    });
  }

  goToStep(index: number): void {
    const step = this.steps()[index];
    if (!step) return;
    if (step.computedStatus() === 'disabled') return;
    if (
      this.linear() &&
      step.computedStatus() !== 'completed' &&
      index !== this.activeIndex()
    )
      return;

    this.activeIndex.set(index);

    this.stepClick.emit({
      index,
      label: step.resolvedLabel(),
    });
  }

  isStepClickable(step: SolarisStepComponent): boolean {
    return step.computedStatus() !== 'disabled';
  }
}
