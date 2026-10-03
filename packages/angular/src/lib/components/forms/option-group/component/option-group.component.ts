import {
  Component,
  input,
  computed,
  signal,
  effect,
  inject,
  forwardRef,
  ElementRef,
  contentChildren,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisOptionComponent } from '../../option';
import { SOLARIS_OPTION_PARENT } from '../../option/token/option.tokens';
import { resolveElementId } from '../../../../core';

import type {
  SolarisOptionGroupSize,
  SolarisOptionGroupDensity,
} from '../model/option-group.types';

@Component({
  selector: 'solaris-option-group',
  standalone: true,
  imports: [],
  templateUrl: './option-group.component.html',
  styleUrls: ['./option-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SOLARIS_OPTION_PARENT,
      useExisting: forwardRef(() => SolarisOptionGroupComponent),
    },
  ],
  host: {
    role: 'group',
    '[attr.id]': 'elementId()',
    '[attr.data-size]': 'size()',
    '[attr.aria-label]': 'effectiveAriaLabel() ?? null',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[style.display]': 'internalHidden() ? "none" : ""',
  },
})
export class SolarisOptionGroupComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);

  readonly options = contentChildren(SolarisOptionComponent, {
    descendants: true,
  });

  readonly label = input<string>();
  readonly labelKey = input<string>();
  readonly disabledInput = input<boolean, boolean>(false, {
    alias: 'disabled',
    transform: (v: boolean) => v ?? false,
  });
  readonly sizeInput = input<SolarisOptionGroupSize | undefined>(undefined, {
    alias: 'size',
  });
  readonly densityInput = input<SolarisOptionGroupDensity | undefined>(
    undefined,
    { alias: 'density' },
  );
  readonly groupId = input<string>(undefined, { alias: 'id' });

  protected readonly internalHidden = signal(false);

  protected readonly elementId = computed(() => {
    return (
      this.groupId() ||
      resolveElementId(this.elementRef, 'solaris-option-group')
    );
  });

  protected readonly labelId = computed(() => `${this.elementId()}-label`);

  protected readonly themeService = inject(SolarisThemeService);
  private readonly outerParent = inject(SOLARIS_OPTION_PARENT, {
    optional: true,
    skipSelf: true,
  });

  readonly size = computed<SolarisOptionGroupSize>(() => {
    return this.sizeInput() ?? this.outerParent?.size() ?? 'md';
  });

  readonly effectiveDensity = computed<SolarisOptionGroupDensity>(() => {
    return (
      this.densityInput() ??
      this.outerParent?.effectiveDensity() ??
      this.themeService.density
    );
  });

  readonly isEffectivelyDisabled = computed(() => {
    return this.disabledInput();
  });

  protected readonly labelText = computed(() => {
    const key = this.labelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      if (translated !== key) return translated;
      return this.label() ?? key;
    }
    return this.label();
  });

  protected readonly effectiveAriaLabel = computed(() => {
    return this.labelText() ?? null;
  });

  protected readonly ariaLabelledBy = computed(() => {
    if (this.labelText()) {
      return this.labelId();
    }
    return null;
  });

  private readonly _optionsEffect = effect(() => {
    this.options();
    this.isEffectivelyDisabled();
    this.propagateDisabledToOptions();
  });

  setHidden(v: boolean): void {
    this.internalHidden.set(v);
  }

  private propagateDisabledToOptions(): void {
    const opts = this.options();
    const isDisabled = this.isEffectivelyDisabled();
    opts.forEach((option) => {
      option.setGroupDisabledState(isDisabled);
    });
  }
}
