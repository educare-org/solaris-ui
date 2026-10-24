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

import { SolarisStepperActionsComponent } from '../../actions/component/stepper-actions.component';
import { SolarisTranslateService } from '../../../../../../services/translation';
import { SolarisThemeService } from '../../../../../../services/theme';
import type { SolarisStepperControl } from '../../../token/stepper.tokens';
import { SolarisStepComponent } from '../../step/component/step.component';
import { SOLARIS_STEPPER } from '../../../token/stepper.tokens';
import { SolarisIconComponent } from '../../../../../icon';

import type {
  SolarisStepperOrientation,
  SolarisStepperAppearance,
  SolarisStepperSize,
  SolarisStepperDensity,
  SolarisStepperContentTransition,
  SolarisStepperChangeEvent,
  SolarisStepperBlockedEvent,
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
    '[attr.data-density]': 'effectiveDensity()',
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
  protected readonly themeService = inject(SolarisThemeService);

  readonly steps = contentChildren(SolarisStepComponent);
  readonly actions = contentChild(SolarisStepperActionsComponent);

  readonly activeIndex = model<number>(0);
  readonly orientation = input<SolarisStepperOrientation>('horizontal');
  readonly appearance = input<SolarisStepperAppearance>('default');
  readonly linear = input<boolean>(false);
  readonly size = input<SolarisStepperSize>('md');
  readonly density = input<SolarisStepperDensity>();
  readonly showConnectors = input<boolean>(true);
  readonly showStepStatus = input<boolean>(true);
  readonly showStepNumbers = input<boolean>(true);
  readonly contentTransition = input<SolarisStepperContentTransition>('fade');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly stepChange = output<SolarisStepperChangeEvent>();
  readonly stepClick = output<{ index: number; label: string | undefined }>();
  readonly stepBlocked = output<SolarisStepperBlockedEvent>();

  readonly effectiveDensity = computed(() => {
    return this.density() ?? this.themeService.density;
  });

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

    const from = this.activeIndex();
    if (index !== from) {
      const canEnterFn = step.canEnter();
      if (canEnterFn && !canEnterFn()) {
        this.stepBlocked.emit({ index, from, reason: 'enter' });
        return;
      }
      const current = this.steps()[from];
      const canExitFn = current?.canExit();
      if (canExitFn && !canExitFn()) {
        this.stepBlocked.emit({ index, from, reason: 'exit' });
        return;
      }
    }

    const status = step.computedStatus();
    if (
      this.linear() &&
      status !== 'completed' &&
      status !== 'warning' &&
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
