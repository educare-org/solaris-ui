import {
  Component,
  input,
  computed,
  signal,
  effect,
  inject,
  ElementRef,
  ContentChildren,
  QueryList,
  type AfterContentInit,
  type OnDestroy,
} from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Subscription = any;

import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisOptionComponent } from '../../option';

import type {
  SolarisOptionGroupSize,
  SolarisOptionGroupDensity,
} from '../model/option-group.types';

let nextId = 0;

function generateId(): string {
  return `solaris-option-group-${++nextId}`;
}

@Component({
  selector: 'solaris-option-group',
  standalone: true,
  imports: [],
  templateUrl: './option-group.component.html',
  styleUrls: ['./option-group.component.scss'],
  host: {
    role: 'group',
    '[attr.id]': 'elementId()',
    '[attr.data-size]': 'size()',
    '[attr.aria-label]': 'effectiveAriaLabel() ?? null',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
  },
})
export class SolarisOptionGroupComponent
  implements AfterContentInit, OnDestroy
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService);

  @ContentChildren(SolarisOptionComponent, { descendants: true })
  protected options!: QueryList<SolarisOptionComponent>;

  readonly label = input<string>();
  readonly labelKey = input<string>();
  readonly disabledInput = input<boolean, boolean>(false, {
    alias: 'disabled',
    transform: (v: boolean) => v ?? false,
  });
  readonly size = input<SolarisOptionGroupSize>('md');
  readonly density = input<SolarisOptionGroupDensity>();
  readonly groupId = input<string>(undefined, { alias: 'id' });

  protected readonly contentInitialized = signal(false);

  protected readonly elementId = computed(() => {
    return (
      this.groupId() ||
      // SECURITY_EXCEPTION: nativeElement.getAttribute('id') is the standard DOM API to check existing ID before generating one. Same approach used by Angular CDK form controls and Solaris Checkbox.
      this.elementRef.nativeElement.getAttribute('id') ||
      generateId()
    );
  });

  protected readonly labelId = computed(() => `${this.elementId()}-label`);

  protected readonly effectiveDensity = computed<SolarisOptionGroupDensity>(
    () => {
      return this.density() ?? 'comfortable';
    },
  );

  protected readonly isEffectivelyDisabled = computed(() => {
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

  private optionQuerySubscription: Subscription | null = null;

  ngAfterContentInit(): void {
    this.contentInitialized.set(true);
    this.propagateDisabledToOptions();

    this.optionQuerySubscription = this.options.changes.subscribe(() => {
      this.propagateDisabledToOptions();
    });
  }

  ngOnDestroy(): void {
    if (this.optionQuerySubscription) {
      this.optionQuerySubscription.unsubscribe();
    }
  }

  private propagateDisabledToOptions(): void {
    if (!this.options) return;
    const isDisabled = this.isEffectivelyDisabled();
    this.options.forEach((option) => {
      option.setGroupDisabledState(isDisabled);
    });
  }

  private readonly _disabledEffect = effect(() => {
    if (!this.contentInitialized()) return;
    this.isEffectivelyDisabled();
    this.propagateDisabledToOptions();
  });
}
