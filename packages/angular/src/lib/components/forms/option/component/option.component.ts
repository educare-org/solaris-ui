import {
  Component,
  input,
  output,
  computed,
  signal,
  inject,
  ElementRef,
  contentChild,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SOLARIS_OPTION_PARENT } from '../../option/token/option.tokens';
import { resolveElementId } from '../../../../core';

import type {
  SolarisOptionSize,
  SolarisOptionDensity,
  SolarisOptionSelectionMode,
} from '../model/option.types';

import { SolarisIconComponent } from '../../../icon';

import {
  SolarisOptionLeadingDirective,
  SolarisOptionLabelDirective,
  SolarisOptionDescriptionDirective,
  SolarisOptionMetaDirective,
  SolarisOptionTrailingDirective,
} from '../directives/option-slots.directive';

@Component({
  selector: 'solaris-option',
  standalone: true,
  imports: [SolarisIconComponent],
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    '[attr.aria-selected]': 'ariaSelected()',
    '[attr.aria-disabled]': 'isEffectivelyDisabled() ? "true" : null',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-selected]': 'selected() ? "" : null',
    '[attr.data-active]': 'effectiveActive() ? "" : null',
    '[attr.data-highlighted]': 'highlighted() ? "" : null',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[attr.data-selection-mode]': 'effectiveSelectionMode()',
    '[attr.data-show-indicator]':
      'effectiveShowSelectionIndicator() ? "" : null',
    '[attr.id]': 'elementId()',
    '[style.display]': 'internalHidden() ? "none" : ""',
  },
})
export class SolarisOptionComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);

  protected readonly groupDisabled = signal(false);
  private readonly internalSelected = signal<boolean | undefined>(undefined);
  private readonly internalActive = signal<boolean | undefined>(undefined);
  protected readonly internalHidden = signal(false);
  private readonly internalSelectionMode = signal<
    SolarisOptionSelectionMode | undefined
  >(undefined);
  private readonly internalShowSelectionIndicator = signal<boolean | undefined>(
    undefined,
  );

  protected readonly leadingSlot = contentChild(SolarisOptionLeadingDirective);
  protected readonly labelSlot = contentChild(SolarisOptionLabelDirective);
  protected readonly descriptionSlot = contentChild(
    SolarisOptionDescriptionDirective,
  );
  protected readonly metaSlot = contentChild(SolarisOptionMetaDirective);
  protected readonly trailingSlot = contentChild(
    SolarisOptionTrailingDirective,
  );

  readonly value = input<unknown>();
  readonly optionLabel = input<string>(undefined, { alias: 'label' });
  readonly labelKey = input<string>();
  readonly description = input<string>();
  readonly descriptionKey = input<string>();
  readonly disabledInput = input<boolean, boolean>(false, {
    alias: 'disabled',
    transform: (v: boolean) => v ?? false,
  });
  readonly selectedInput = input<boolean, boolean>(false, {
    alias: 'selected',
    transform: (v: boolean) => v ?? false,
  });

  protected readonly selected = computed(
    () => this.internalSelected() ?? this.selectedInput(),
  );

  setSelected(isSelected: boolean): void {
    this.internalSelected.set(isSelected);
  }

  setActive(v: boolean): void {
    this.internalActive.set(v);
  }

  setHidden(v: boolean): void {
    this.internalHidden.set(v);
  }

  setSelectionMode(mode: SolarisOptionSelectionMode): void {
    this.internalSelectionMode.set(mode);
  }

  setShowSelectionIndicator(show: boolean): void {
    this.internalShowSelectionIndicator.set(show);
  }

  protected readonly effectiveSelectionMode = computed(() => {
    return this.internalSelectionMode() ?? this.selectionMode();
  });

  protected readonly effectiveShowSelectionIndicator = computed(() => {
    const internal = this.internalShowSelectionIndicator();
    return internal ?? this.showSelectionIndicator();
  });

  protected readonly effectiveActive = computed(
    () => this.internalActive() ?? this.active(),
  );

  readonly active = input<boolean, boolean>(false, {
    transform: (v: boolean) => v ?? false,
  });
  readonly highlighted = input<boolean, boolean>(false, {
    transform: (v: boolean) => v ?? false,
  });
  readonly selectionMode = input<SolarisOptionSelectionMode>('none');
  readonly showSelectionIndicator = input<boolean, boolean>(false, {
    transform: (v: boolean) => v ?? false,
  });
  readonly optionId = input<string>(undefined, { alias: 'id' });

  readonly optionInteraction = output<{
    option: SolarisOptionComponent;
    event: MouseEvent;
  }>();

  protected readonly elementId = computed(() => {
    return (
      this.optionId() || resolveElementId(this.elementRef, 'solaris-option')
    );
  });

  protected readonly themeService = inject(SolarisThemeService);
  private readonly parent = inject(SOLARIS_OPTION_PARENT, { optional: true });

  protected readonly size = computed<SolarisOptionSize>(() => {
    return this.parent?.size() ?? 'md';
  });

  protected readonly effectiveDensity = computed<SolarisOptionDensity>(() => {
    return this.parent?.effectiveDensity() ?? this.themeService.density;
  });

  readonly isEffectivelyDisabled = computed(() => {
    return this.disabledInput() || this.groupDisabled();
  });

  protected readonly ariaSelected = computed(() => {
    if (
      this.effectiveSelectionMode() === 'none' ||
      !this.effectiveShowSelectionIndicator()
    ) {
      return null;
    }
    return this.selected() ? 'true' : 'false';
  });

  readonly labelText = computed(() => {
    const key = this.labelKey();
    if (key) {
      const translated = this.translateService.translate(key);
      if (translated !== key) return translated;
      return this.optionLabel() ?? key;
    }
    return this.optionLabel();
  });

  readonly descriptionText = computed(() => {
    const key = this.descriptionKey();
    if (key) {
      const translated = this.translateService.translate(key);
      if (translated !== key) return translated;
      return this.description() ?? key;
    }
    return this.description();
  });

  protected readonly showSelectionVisual = computed(() => {
    return (
      this.effectiveShowSelectionIndicator() &&
      this.effectiveSelectionMode() !== 'none'
    );
  });

  protected readonly isMultiCheckSelection = computed(() => {
    return (
      this.effectiveSelectionMode() === 'multiple' && this.showSelectionVisual()
    );
  });

  setGroupDisabledState(isDisabled: boolean): void {
    this.groupDisabled.set(isDisabled);
  }

  @HostListener('click', ['$event'])
  protected onClick(event: MouseEvent): void {
    if (this.isEffectivelyDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.optionInteraction.emit({ option: this, event });
  }
}
