import {
  Component,
  ElementRef,
  inject,
  input,
  model,
  computed,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../services/translation';
import type { SolarisCollapsibleSize } from '../model/collapsible.types';
import { SolarisIconComponent } from '../../../icon';
import { resolveElementId } from '../../../../core/utils/id';

@Component({
  selector: 'solaris-collapsible',
  standalone: true,
  imports: [SolarisIconComponent],
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-collapsible',
    '[attr.data-size]': 'size()',
    '[attr.data-open]': 'open() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class SolarisCollapsibleComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);

  readonly open = model<boolean>(false);
  readonly label = input<string>();
  readonly labelKey = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelKey = input<string>();
  readonly disabled = input<boolean, boolean>(false, {
    transform: booleanAttribute,
  });
  readonly size = input<SolarisCollapsibleSize>('md');

  protected readonly baseId = computed(() => {
    return resolveElementId(this.elementRef, 'solaris-collapsible');
  });

  protected readonly triggerId = computed(() => `${this.baseId()}-trigger`);
  protected readonly panelId = computed(() => `${this.baseId()}-panel`);

  protected readonly labelText = computed(() => {
    const key = this.labelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.label();
  });

  protected readonly effectiveAriaLabel = computed(() => {
    if (this.labelText()) {
      return null;
    }
    const key = this.ariaLabelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.ariaLabel();
  });

  protected toggle(): void {
    if (this.disabled()) {
      return;
    }
    this.open.set(!this.open());
  }
}
