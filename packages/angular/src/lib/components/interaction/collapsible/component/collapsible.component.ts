import {
  Component,
  ElementRef,
  inject,
  input,
  model,
  computed,
  booleanAttribute,
  ChangeDetectionStrategy,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import type {
  SolarisCollapsibleSize,
  SolarisCollapsibleDensity,
  SolarisCollapsibleAppearance,
  SolarisCollapsibleValue,
  SolarisCollapsibleIconOption,
  SolarisCollapsibleAddResult,
} from '../model/collapsible.types';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisThemeService } from '../../../../services/theme';
import { SolarisIconComponent } from '../../../icon';
import { resolveElementId } from '../../../../core';
import { SOLARIS_ACCORDION } from '../../accordion/model/accordion.tokens';
import { SolarisDialogService } from '../../../overlay/dialog';
import { SolarisCollapsibleAddDialogComponent } from '../dialog/component/collapsible-add-dialog.component';

@Component({
  selector: 'solaris-collapsible',
  standalone: true,
  imports: [SolarisIconComponent, NgTemplateOutlet],
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-collapsible',
    '[attr.data-size]': 'effectiveSize()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-appearance]': 'effectiveAppearance()',
    '[attr.data-open]': 'isOpen() ? "" : null',
    '[attr.data-disabled]': 'isEffectivelyDisabled() ? "" : null',
    '[attr.data-add]': 'showAddAction() ? "" : null',
  },
})
export class SolarisCollapsibleComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  protected readonly themeService = inject(SolarisThemeService);
  private readonly accordionControl = inject(SOLARIS_ACCORDION, {
    optional: true,
  });
  private readonly dialogService = inject(SolarisDialogService, {
    optional: true,
  });

  readonly open = model<boolean>(false);
  readonly value = input<SolarisCollapsibleValue>();
  readonly label = input<string>();
  readonly labelKey = input<string>();
  readonly ariaLabel = input<string>();
  readonly ariaLabelKey = input<string>();
  readonly disabled = input<boolean, boolean>(false, {
    transform: booleanAttribute,
  });
  readonly size = input<SolarisCollapsibleSize>('md');
  readonly density = input<SolarisCollapsibleDensity | undefined>(undefined);
  readonly appearance = input<SolarisCollapsibleAppearance>('boxed');
  readonly icon = input<string>();
  readonly leadingIcon = input<string | undefined>(undefined);
  readonly leadingIconDecorative = input<boolean, boolean>(true, {
    transform: booleanAttribute,
  });
  readonly showAddAction = input<boolean, boolean>(false, {
    transform: booleanAttribute,
  });
  readonly addActionLabel = input<string>();
  readonly addActionLabelKey = input<string>();
  readonly addActionIcon = input<string>('plus');
  readonly iconOptions = input<readonly SolarisCollapsibleIconOption[]>([]);
  readonly addActionDialogTitle = input<string>();
  readonly addActionDialogTitleKey = input<string>();

  readonly addSubmitted = output<SolarisCollapsibleAddResult>();

  protected readonly baseId = computed(() => {
    return resolveElementId(this.elementRef, 'solaris-collapsible');
  });

  protected readonly isOpen = computed(() => {
    if (this.accordionControl) {
      return this.accordionControl.isOpen(this.value());
    }
    return this.open();
  });

  protected readonly isEffectivelyDisabled = computed(() => {
    return this.disabled() || (this.accordionControl?.disabled() ?? false);
  });

  protected readonly canToggleClosed = computed(() => {
    if (this.isEffectivelyDisabled()) {
      return false;
    }
    return this.accordionControl?.allowToggle() ?? true;
  });

  protected readonly effectiveAppearance = computed(() => {
    return this.accordionControl?.appearance() ?? this.appearance();
  });

  protected readonly effectiveSize = computed<SolarisCollapsibleSize>(() => {
    return this.accordionControl?.size() ?? this.size();
  });

  protected readonly effectiveDensity = computed<SolarisCollapsibleDensity>(
    () => {
      return (
        this.accordionControl?.effectiveDensity() ??
        this.density() ??
        this.themeService.density
      );
    },
  );

  protected readonly headingLevel = computed(() => {
    return this.accordionControl?.headingLevel() ?? 0;
  });

  protected readonly triggerId = computed(() => {
    if (this.accordionControl) {
      return this.accordionControl.generateTriggerId(this.value());
    }
    return `${this.baseId()}-trigger`;
  });

  protected readonly panelId = computed(() => {
    if (this.accordionControl) {
      return this.accordionControl.generatePanelId(this.value());
    }
    return `${this.baseId()}-panel`;
  });

  protected readonly effectiveIcon = computed(() => {
    return this.icon() ?? this.accordionControl?.expandIcon() ?? 'chevron-down';
  });

  protected readonly labelText = computed(() => {
    const key = this.labelKey();
    if (key && this.translateService) {
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
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      return translated !== key ? translated : undefined;
    }
    return this.ariaLabel();
  });

  protected readonly addActionText = computed(() => {
    const key = this.addActionLabelKey();
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
    }
    if (this.addActionLabel()) {
      return this.addActionLabel();
    }
    if (this.translateService) {
      const fallback = this.translateService.translate(
        'solaris.collapsible.addAction',
      );
      if (fallback !== 'solaris.collapsible.addAction') {
        return fallback;
      }
    }
    return 'Add item';
  });

  protected toggle(): void {
    if (this.isEffectivelyDisabled()) {
      return;
    }
    if (this.accordionControl) {
      this.accordionControl.toggle(this.value());
      return;
    }
    this.open.set(!this.open());
  }

  protected openAddDialog(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.isEffectivelyDisabled() || !this.dialogService) {
      return;
    }
    const ref = this.dialogService.openComponent<
      SolarisCollapsibleAddDialogComponent,
      SolarisCollapsibleAddResult | undefined,
      {
        iconOptions: readonly SolarisCollapsibleIconOption[];
        title?: string;
        titleKey?: string;
      }
    >(SolarisCollapsibleAddDialogComponent, {
      width: '480px',
      data: {
        iconOptions: this.iconOptions(),
        title: this.addActionDialogTitle(),
        titleKey: this.addActionDialogTitleKey(),
      },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.addSubmitted.emit(result);
      }
    });
  }
}
