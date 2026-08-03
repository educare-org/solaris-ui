import {
  Component,
  input,
  model,
  computed,
  contentChildren,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core';

import { nextIdFor } from '../../../../core/utils/id';

import { SolarisCollapsibleComponent } from '../../collapsible/component/collapsible.component';

import {
  SOLARIS_ACCORDION,
  type SolarisAccordionControl,
} from '../model/accordion.tokens';

import type {
  SolarisAccordionAppearance,
  SolarisAccordionType,
  SolarisAccordionSize,
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
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class SolarisAccordionComponent implements SolarisAccordionControl {
  readonly appearance = input<SolarisAccordionAppearance>('boxed');
  readonly type = input<SolarisAccordionType>('single');
  readonly size = input<SolarisAccordionSize>('md');
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
      return resolved.some((v) => v === value);
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
