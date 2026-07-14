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
} from '@angular/core';

import { SolarisTranslateService } from '../../../../services/translation';

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

let nextId = 0;

function generateId(): string {
  return `solaris-option-${++nextId}`;
}

@Component({
  selector: 'solaris-option',
  standalone: true,
  imports: [SolarisIconComponent],
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  host: {
    role: 'option',
    '[attr.aria-selected]': 'ariaSelected()',
    '[attr.aria-disabled]': 'isEffectivelyDisabled() ? "true" : null',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-selected]': 'selected() ? "" : null',
    '[attr.data-active]': 'active() ? "" : null',
    '[attr.data-highlighted]': 'highlighted() ? "" : null',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[attr.data-selection-mode]': 'selectionMode()',
    '[attr.data-show-indicator]': 'showSelectionIndicator() ? "" : null',
    '[attr.id]': 'elementId()',
  },
})
export class SolarisOptionComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);

  protected readonly groupDisabled = signal(false);
  private readonly internalSelected = signal<boolean | undefined>(undefined);

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
  readonly size = input<SolarisOptionSize>('md');
  readonly density = input<SolarisOptionDensity>();
  readonly optionId = input<string>(undefined, { alias: 'id' });

  readonly optionInteraction = output<{
    option: SolarisOptionComponent;
    event: MouseEvent;
  }>();

  protected readonly elementId = computed(() => {
    return (
      this.optionId() ||
      // SECURITY_EXCEPTION: nativeElement.getAttribute('id') is the standard DOM API to check existing ID before generating one. Same approach used by Angular CDK form controls and Solaris Checkbox.
      this.elementRef.nativeElement.getAttribute('id') ||
      generateId()
    );
  });

  protected readonly effectiveDensity = computed<SolarisOptionDensity>(() => {
    return this.density() ?? 'comfortable';
  });

  readonly isEffectivelyDisabled = computed(() => {
    return this.disabledInput() || this.groupDisabled();
  });

  protected readonly ariaSelected = computed(() => {
    if (this.selectionMode() === 'none' || !this.showSelectionIndicator()) {
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
    return this.showSelectionIndicator() && this.selectionMode() !== 'none';
  });

  protected readonly isCheckSelection = computed(() => {
    return this.selectionMode() === 'single' && this.showSelectionVisual();
  });

  protected readonly isMultiCheckSelection = computed(() => {
    return this.selectionMode() === 'multiple' && this.showSelectionVisual();
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
