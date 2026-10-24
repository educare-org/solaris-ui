import {
  Component,
  computed,
  inject,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { nextIdFor } from '../../../../core';
import { SolarisTranslateService } from '../../../../services/translation';

@Component({
  selector: 'solaris-dropdown-menu-label',
  standalone: true,
  templateUrl: './dropdown-menu-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[id]': 'labelId',
    class: 'solaris-dropdown-menu-label',
  },
})
export class SolarisDropdownMenuLabelComponent {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  readonly label = input<string>();
  readonly labelKey = input<string>();

  readonly labelId = nextIdFor('solaris-dropdown-menu-label');

  protected readonly resolvedLabel = computed(() => {
    const key = this.labelKey();
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) return translated;
    }
    return this.label();
  });
}
