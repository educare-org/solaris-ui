import {
  Component,
  inject,
  input,
  model,
  computed,
  contentChildren,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisCollapsibleComponent } from '../../collapsible';
import { nextIdFor } from '../../../../core';
import { SolarisThemeService } from '../../../../services/theme';

import {
  SOLARIS_ACCORDION,
  type SolarisAccordionControl,
} from '../model/accordion.tokens';

import type {
  SolarisAccordionAppearance,
  SolarisAccordionType,
  SolarisAccordionSize,
  SolarisAccordionDensity,
  SolarisAccordionValue,
  SolarisAccordionModel,
} from '../model/accordion.types';

@Component({
  selector: 'solaris-accordion',
  standalone: true,
  imports: [],
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SOLARIS_ACCORDION,
      useExisting: SolarisAccordionComponent,
    },
  ],
  host: {
    class: 'solaris-accordion',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-type]': 'type()',
    '[attr.data-size]': 'size()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class SolarisAccordionComponent implements SolarisAccordionControl {
  protected readonly themeService = inject(SolarisThemeService);

  readonly appearance = input<SolarisAccordionAppearance>('boxed');
  readonly type = input<SolarisAccordionType>('single');
  readonly size = input<SolarisAccordionSize>('md');
  readonly density = input<SolarisAccordionDensity | undefined>(undefined);
  readonly disabled = input<boolean, boolean>(false, {
    transform: booleanAttribute,
  });
  readonly allowToggle = input<boolean, boolean>(true, {
    transform: booleanAttribute,
  });
  readonly headingLevel = input<number>(3);
  readonly expandIcon = input<string>('chevron-down');

  readonly value = model<SolarisAccordionModel>();

  protected readonly items = contentChildren(SolarisCollapsibleComponent);

  private readonly instanceId = nextIdFor('solaris-accordion');

  readonly effectiveDensity = computed<SolarisAccordionDensity>(() => {
    return this.density() ?? this.themeService.density;
  });

  protected readonly resolvedValue = computed<
    SolarisAccordionModel | undefined
  >(() => {
    const value = this.value();
    if (value === undefined) {
      return this.type() === 'multiple' ? [] : undefined;
    }
    if (this.type() === 'multiple') {
      return Array.isArray(value) ? value : [value];
    }
    return Array.isArray(value) ? value[0] : value;
  });

  isOpen(value: SolarisAccordionValue | undefined): boolean {
    const resolved = this.resolvedValue();
    if (Array.isArray(resolved)) {
      return value !== undefined && resolved.includes(value);
    }
    return resolved === value;
  }

  toggle(value: SolarisAccordionValue | undefined): void {
    if (this.disabled()) {
      return;
    }
    const resolved = this.resolvedValue();

    if (this.type() === 'multiple') {
      const list = Array.isArray(resolved) ? [...resolved] : [];
      const index = list.indexOf(value as SolarisAccordionValue);
      if (index >= 0) {
        list.splice(index, 1);
      } else if (value !== undefined) {
        list.push(value);
      }
      this.value.set(list);
      return;
    }

    if (resolved === value) {
      if (this.allowToggle()) {
        this.value.set(undefined);
      }
      return;
    }
    this.value.set(value);
  }

  generatePanelId(value: SolarisAccordionValue | undefined): string {
    return `${this.instanceId}-panel-${String(value)}`;
  }

  generateTriggerId(value: SolarisAccordionValue | undefined): string {
    return `${this.instanceId}-trigger-${String(value)}`;
  }
}
