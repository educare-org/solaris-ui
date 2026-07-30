import {
  Component,
  input,
  inject,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../../../services/translation';
import type { SolarisStepperStatus } from '../../root/model/stepper.types';
import { SOLARIS_STEPPER } from '../../../token/stepper.tokens';

@Component({
  selector: 'solaris-step',
  standalone: true,
  imports: [],
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'listitem',
    class: 'solaris-step',
    '[attr.data-active]': 'isActive()',
    '[attr.data-status]': 'computedStatus()',
    '[attr.aria-current]': 'isActive() ? "step" : undefined',
    '[attr.aria-disabled]': 'computedStatus() === "disabled"',
  },
})
export class SolarisStepComponent {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  readonly stepper = inject(SOLARIS_STEPPER, { optional: true });

  readonly error = input<boolean>(false);
  readonly optional = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly completed = input<boolean>(false);
  readonly icon = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  readonly labelKey = input<string | undefined>(undefined);
  readonly status = input<SolarisStepperStatus>('pending');
  readonly description = input<string | undefined>(undefined);
  readonly descriptionKey = input<string | undefined>(undefined);

  readonly index = computed(() => {
    if (this.stepper) {
      return this.stepper.steps().indexOf(this);
    }
    return -1;
  });

  readonly isActive = computed(() => {
    if (this.stepper) {
      return this.stepper.activeIndex() === this.index();
    }
    return false;
  });

  readonly computedStatus = computed<SolarisStepperStatus>(() => {
    if (this.disabled()) return 'disabled';
    if (this.error()) return 'error';
    if (this.isActive()) return 'active';
    if (this.completed()) return 'completed';
    return this.status();
  });

  readonly isInteractive = computed(() => {
    if (this.computedStatus() === 'disabled') return false;
    if (!this.stepper) return false;
    return !(
      this.stepper.linear() &&
      this.computedStatus() !== 'completed' &&
      !this.isActive()
    );
  });

  readonly showContent = computed(() => {
    if (!this.stepper) return true;
    return this.isActive();
  });

  readonly resolvedLabel = computed(() => {
    if (this.label()) return this.label();
    const labelKey = this.labelKey();
    if (labelKey && this.translateService) {
      return this.translateService.translate(labelKey);
    }
    return labelKey ?? '';
  });

  readonly resolvedDescription = computed(() => {
    if (this.description()) return this.description();
    const descriptionKey = this.descriptionKey();
    if (descriptionKey && this.translateService) {
      return this.translateService.translate(descriptionKey);
    }
    return descriptionKey ?? '';
  });

  readonly resolvedOptionalLabel = computed(() => {
    if (!this.optional()) return undefined;
    if (this.translateService) {
      return this.translateService.translate('solaris.stepper.optional');
    }
    return 'Optional';
  });

  readonly showCheckIcon = computed(
    () => this.computedStatus() === 'completed' && !this.icon(),
  );
  readonly showErrorIcon = computed(
    () => this.computedStatus() === 'error' && !this.icon(),
  );
}
