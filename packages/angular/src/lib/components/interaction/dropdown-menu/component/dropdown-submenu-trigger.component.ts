import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  computed,
  forwardRef,
  booleanAttribute,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisIconComponent } from '../../../icon';

import type { SolarisDropdownMenuItemColor } from '../model/dropdown-menu.types';
import { SOLARIS_DROPDOWN_NAVIGABLE_ITEM } from '../model/dropdown-menu-navigation';
import { SolarisDropdownSubmenuComponent } from './dropdown-submenu.component';
import { SolarisTranslateService } from '../../../../services/translation';

@Component({
  selector: 'solaris-dropdown-submenu-trigger',
  standalone: true,
  imports: [SolarisIconComponent],
  providers: [
    {
      provide: SOLARIS_DROPDOWN_NAVIGABLE_ITEM,
      useExisting: forwardRef(() => SolarisDropdownSubmenuTriggerComponent),
    },
  ],
  templateUrl: './dropdown-submenu-trigger.component.html',
  styleUrls: ['./dropdown-submenu-trigger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': '"menuitem"',
    '[attr.data-color]': 'color()',
    '[attr.aria-haspopup]': '"menu"',
    class: 'solaris-dropdown-submenu-trigger',
    '[attr.aria-controls]': 'submenuPanelId()',
    '[attr.tabindex]': 'disabled() ? "-1" : "0"',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.aria-expanded]': 'isSubmenuOpen() ? "true" : "false"',
  },
})
export class SolarisDropdownSubmenuTriggerComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly submenu = inject(SolarisDropdownSubmenuComponent, {
    optional: true,
  });
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  readonly icon = input<string | undefined>(undefined);
  readonly iconDecorative = input<boolean, boolean>(true, {
    transform: booleanAttribute,
  });
  readonly label = input<string | undefined>(undefined);
  readonly labelKey = input<string | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly color = input<SolarisDropdownMenuItemColor>('neutral');

  protected readonly isSubmenuOpen = computed(() => {
    return this.submenu?.isOpen() ?? false;
  });

  protected readonly submenuPanelId = computed(() => {
    return this.submenu?.nestedMenuPanelId() ?? null;
  });

  protected readonly hasLeadingContent = computed(() => !!this.icon());

  protected readonly resolvedLabel = computed(() => {
    const key = this.labelKey();
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) return translated;
    }
    return this.label();
  });

  @HostListener('click')
  handleClick(): void {
    if (this.disabled()) return;
    this.submenu?.toggle();
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.disabled()) return;
    this.submenu?.onTriggerHover();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.disabled()) return;
    this.submenu?.onTriggerLeave();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      this.submenu?.toggle();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
      this.submenu?.open();
    }
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}
